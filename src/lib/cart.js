// API-first cart helper with localStorage fallback and event dispatch
import API, { API_ENABLED } from './api';

const STORAGE_KEY = 'cart_v1';
const SESSION_KEY = 'cart_session_v1';

function _readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch (e) {
    return { items: [] };
  }
}

function _writeLocal(cart) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    // also write a timestamp so storage events fire even when payload unchanged
    localStorage.setItem(`${STORAGE_KEY}_ts`, Date.now().toString());
  } catch (e) {
    // ignore
  }
}

function _readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch (e) {
    return { items: [] };
  }
}

function _writeSession(cart) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(cart));
    sessionStorage.setItem(`${SESSION_KEY}_ts`, Date.now().toString());
  } catch (e) {
    // ignore
  }
}

function _makeKey(item) {
  // canonical key for item equality: productId + size + color
  const pid = item.id || item.productId || item._id || '';
  const size = item.selectedSize || item.size || '';
  // Normalize color value - handle both string and object formats
  let color = '';
  if (item.selectedColor) {
    if (typeof item.selectedColor === 'string') {
      color = item.selectedColor;
    } else if (item.selectedColor.name) {
      color = item.selectedColor.name;
    } else if (item.selectedColor.value) {
      color = item.selectedColor.value;
    }
  }
  const key = `${pid}::${size}::${color}`;
  // console.log('[_makeKey]', { pid, size, color, key });
  return key;
}

function _dispatch(cart) {
  try {
    // Ensure cart has count and total for Header
    const items = cart.items || [];
    const count = cart.count || items.length;
    const total = cart.total || items.reduce((s, it) => s + (Number(it.price || 0) * (Number(it.quantity || 1))), 0);
    const enriched = { ...cart, count, total };
    window.dispatchEvent(new CustomEvent('cart:updated', { detail: enriched }));
  } catch (e) {
    // ignore
  }
}

async function fetchCart() {
  // If user is logged-in, return server cart; otherwise return session cart
  const isLoggedIn = (() => {
    try {
      const u = localStorage.getItem('user');
      const t = localStorage.getItem('token');
      return !!(u || t);
    } catch (e) { return false; }
  })();

  if (isLoggedIn) {
    if (!API_ENABLED) return _readLocal();
    try {
      const res = await API.get('/api/cart');
      const cart = res?.data?.cart || { items: [] };
      _writeLocal(cart);
      _dispatch(cart);
      return cart;
    } catch (e) {
      // if server fails, fallback to local cached copy
      return _readLocal();
    }
  }

  // guest: session-scoped cart
  const s = _readSession();
  _dispatch(s);
  return s;
}

async function addItem(item) {
  // normalize item shape
  let normalizedColor = null;
  if (item.selectedColor) {
    if (typeof item.selectedColor === 'string') {
      normalizedColor = item.selectedColor;
    } else if (item.selectedColor.name) {
      normalizedColor = item.selectedColor.name;
    } else if (item.selectedColor.value) {
      normalizedColor = item.selectedColor.value;
    }
  } else if (item.color) {
    if (typeof item.color === 'string') {
      normalizedColor = item.color;
    } else if (item.color.name) {
      normalizedColor = item.color.name;
    } else if (item.color.value) {
      normalizedColor = item.color.value;
    }
  }

  const normalized = {
    id: item.id || item.productId || item._id,
    productId: item.id || item.productId || item._id,
    name: item.name || item.title || '',
    price: item.salePrice || item.price || item.originalPrice || 0,
    quantity: item.quantity || item.qty || 1,
    selectedSize: item.selectedSize || item.size || null,
    selectedColor: normalizedColor,
    snapshot: item.snapshot || null,
    image: item.image || (item.images && item.images[0]) || null
  };

  const isLoggedIn = (() => {
    try {
      const u = localStorage.getItem('user');
      const t = localStorage.getItem('token');
      return !!(u || t);
    } catch (e) { return false; }
  })();

  if (isLoggedIn) {
    if (!API_ENABLED) return _readLocal();
    try {
      const res = await API.post('/api/cart/add', { item: normalized });
      const cart = res?.data?.cart || await fetchCart();
      _writeLocal(cart);
      _dispatch(cart);
      return cart;
    } catch (e) {
      // server failed, fallback to cached local
      const cart = _readLocal();
      const key = _makeKey(normalized);
      const existing = cart.items.find(i => _makeKey(i) === key);
      
      if (existing) {
        existing.quantity = (existing.quantity || 0) + normalized.quantity;
      } else {
        cart.items.push({ ...normalized });
      }
      _writeLocal(cart);
      _dispatch(cart);
      return cart;
    }
  }

  // guest: sessionStorage merge
  const cart = _readSession();
  const key = _makeKey(normalized);
  const existing = cart.items.find(i => _makeKey(i) === key);
  
  if (existing) {
    existing.quantity = (existing.quantity || 0) + normalized.quantity;
  } else {
    cart.items.push({ ...normalized });
  }
  _writeSession(cart);
  _dispatch(cart);
  return cart;
}

async function removeItem(item) {
  const isLoggedIn = (() => {
    try {
      const u = localStorage.getItem('user');
      const t = localStorage.getItem('token');
      return !!(u || t);
    } catch (e) { return false; }
  })();

  if (isLoggedIn) {
    if (!API_ENABLED) return _readLocal();
    try {
      const res = await API.post('/api/cart/remove', { item });
      const cart = res?.data?.cart || await fetchCart();
      _writeLocal(cart);
      _dispatch(cart);
      return cart;
    } catch (e) {
      const cart = _readLocal();
      const key = _makeKey(item);
      cart.items = cart.items.filter(i => _makeKey(i) !== key);
      _writeLocal(cart);
      _dispatch(cart);
      return cart;
    }
  }

  // guest: session storage
  const cart = _readSession();
  const key = _makeKey(item);
  cart.items = cart.items.filter(i => _makeKey(i) !== key);
  _writeSession(cart);
  _dispatch(cart);
  return cart;
}

async function updateItem(item) {
  const isLoggedIn = (() => {
    try {
      const u = localStorage.getItem('user');
      const t = localStorage.getItem('token');
      return !!(u || t);
    } catch (e) { return false; }
  })();

  if (isLoggedIn) {
    if (!API_ENABLED) return _readLocal();
    try {
      const res = await API.post('/api/cart/update', { item });
      const cart = res?.data?.cart || await fetchCart();
      _writeLocal(cart);
      _dispatch(cart);
      return cart;
    } catch (e) {
      const cart = _readLocal();
      const key = _makeKey(item);
      const existing = cart.items.find(i => _makeKey(i) === key);
      if (existing) {
        Object.assign(existing, item);
      }
      _writeLocal(cart);
      _dispatch(cart);
      return cart;
    }
  }

  // guest: session
  const cart = _readSession();
  const key = _makeKey(item);
  const existing = cart.items.find(i => _makeKey(i) === key);
  if (existing) Object.assign(existing, item);
  _writeSession(cart);
  _dispatch(cart);
  return cart;
}

async function clearCart() {
  const isLoggedIn = (() => {
    try {
      const u = localStorage.getItem('user');
      const t = localStorage.getItem('token');
      return !!(u || t);
    } catch (e) { return false; }
  })();

  if (isLoggedIn) {
    if (!API_ENABLED) return _readLocal();
    try {
      const res = await API.post('/api/cart/clear');
      const cart = res?.data?.cart || { items: [] };
      _writeLocal(cart);
      _dispatch(cart);
      return cart;
    } catch (e) {
      const cart = { items: [] };
      _writeLocal(cart);
      _dispatch(cart);
      return cart;
    }
  }

  // guest: clear session
  const cart = { items: [] };
  _writeSession(cart);
  _dispatch(cart);
  return cart;
}

export default {
  fetchCart,
  addItem,
  removeItem,
  updateItem,
  clearCart,
  _readLocal
};
