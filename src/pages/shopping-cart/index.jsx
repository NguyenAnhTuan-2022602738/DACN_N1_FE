import React, { useMemo, useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux'
import cart from '../../lib/cart'
import API, { API_ENABLED } from '../../lib/api';
import baseProducts from '../../data/products';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CartItem from './components/CartItem';
import OrderSummary from './components/OrderSummary';
import SavedForLater from './components/SavedForLater';
import CheckoutModal from './components/CheckoutModal';
import EmptyCart from './components/EmptyCart';
import { useToast } from '../../components/ui/ToastProvider';
import ConfirmModal from '../../components/ui/ConfirmModal';

const ShoppingCart = () => {
  const dispatch = useDispatch()
  const savedItems = useSelector(state => state.cart.savedItems)
  const [cartItems, setCartItems] = useState([])
  const [couponCode, setCouponCode] = useState('')
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Calculate order summary
  const orderSummary = React.useMemo(() => {
    const subtotal = (cartItems || [])?.reduce((sum, item) => sum + (Number(item?.price || 0) * Number(item?.quantity || item?.qty || 1)), 0) || 0;
    const shipping = subtotal >= 500000 ? 0 : 30000;
    const tax = Math.round(subtotal * 0.1);
    const discount = couponCode === 'WELCOME10' ? Math.round(subtotal * 0.1) : 0;
    const total = subtotal + shipping + tax - discount;

    return { subtotal, shipping, tax, discount, total };
  }, [cartItems, couponCode]);

  // Cart actions using helper
  const refreshCart = async () => {
    try {
      const c = await cart.fetchCart();
      const items = c?.items || [];
      const enriched = await enrichItems(items);
      setCartItems(enriched);
    } catch (e) {
      setCartItems([]);
    }
  }

  // enrich items by fetching product details from server when possible
  const enrichItems = async (items) => {
    if (!items || items.length === 0) return [];
    const promises = items.map(async (it) => {
      try {
        const pid = it.productId || it.id || it._id;
        if (!pid) return it;
        
        // If API is disabled (dev without backend), skip network calls and use local fallback
        if (!API_ENABLED) {
          const fallback = baseProducts.find(bp => String(bp.id) === String(pid));
          if (!fallback) return it;
          const fallbackSizes = fallback.availableSizes || fallback.sizes || [];
          const fallbackColors = (fallback.availableColors || fallback.colors || []).map(c => typeof c === 'string' ? c : (c?.name || c?.value)).filter(Boolean);
          return {
            id: fallback.id,
            productId: fallback.id,
            name: fallback.name || it.name,
            image: (fallback.images && fallback.images[0]) || it.image || (it.snapshot && it.snapshot.image) || null,
            price: it.price || it.salePrice || fallback.price || 0,
            originalPrice: fallback.originalPrice || it.originalPrice,
            quantity: it.quantity || it.qty || 1,
            selectedSize: it.selectedSize || it.size || (it.snapshot && it.snapshot.size) || null,
            selectedColor: it.selectedColor || it.color || (it.snapshot && it.snapshot.color) || null,
            inStock: typeof fallback.stock !== 'undefined' ? (fallback.stock > 0) : (it.inStock ?? true),
            brand: fallback.brand || it.brand,
            snapshot: it.snapshot || null,
            availableSizes: fallbackSizes,
            availableColors: fallbackColors,
            ...it
          };
        }

        const res = await API.get(`/api/products/${pid}`);
        const p = res?.data?.product || res?.data || null;
        if (!p) {
          // fallback to local mock
          const fallback = baseProducts.find(bp => String(bp.id) === String(pid));
          if (!fallback) return it;
          const fallbackSizes = fallback.availableSizes || fallback.sizes || [];
          const fallbackColors = (fallback.availableColors || fallback.colors || []).map(c => typeof c === 'string' ? c : (c?.name || c?.value)).filter(Boolean);
          return {
            id: fallback.id,
            productId: fallback.id,
            name: fallback.name || it.name,
            image: (fallback.images && fallback.images[0]) || it.image || (it.snapshot && it.snapshot.image) || null,
            price: it.price || it.salePrice || fallback.price || 0,
            originalPrice: fallback.originalPrice || it.originalPrice,
            quantity: it.quantity || it.qty || 1,
            selectedSize: it.selectedSize || it.size || (it.snapshot && it.snapshot.size) || null,
            selectedColor: it.selectedColor || it.color || (it.snapshot && it.snapshot.color) || null,
            inStock: typeof fallback.stock !== 'undefined' ? (fallback.stock > 0) : (it.inStock ?? true),
            brand: fallback.brand || it.brand,
            snapshot: it.snapshot || null,
            availableSizes: fallbackSizes,
            availableColors: fallbackColors,
            ...it
          };
        }
        // Derive sizes/colors from API product variants when available
        const apiSizes = [];
        const apiColors = [];
        if (Array.isArray(p?.variants)) {
          p.variants.forEach(v => {
            if ((v.name || v.type) === 'Size' && v.value) apiSizes.push(v.value);
            if ((v.name || v.type) === 'Color' && v.value) apiColors.push(v.value);
          });
        }
        return {
          // merge: product authoritative fields, keep user's snapshot selections
          id: p._id || p.id || pid,
          productId: p._id || p.id || pid,
          name: p.name || it.name,
          image: (p.images && p.images[0]) || it.image || (it.snapshot && it.snapshot.image) || null,
          price: it.price || it.salePrice || p.salePrice || p.price || p.originalPrice || 0,
          originalPrice: p.originalPrice || it.originalPrice,
          quantity: it.quantity || it.qty || 1,
          selectedSize: it.selectedSize || it.size || (it.snapshot && it.snapshot.size) || null,
          selectedColor: it.selectedColor || it.color || (it.snapshot && it.snapshot.color) || null,
          inStock: typeof p.stock !== 'undefined' ? (p.stock > 0) : (it.inStock ?? true),
          brand: p.brand || it.brand,
          snapshot: it.snapshot || null,
          // Add available sizes and colors for dropdown (prefer variants)
          availableSizes: apiSizes.length > 0 ? apiSizes : (p.sizes || []),
          availableColors: apiColors.length > 0 ? apiColors : (Array.isArray(p.colors) ? p.colors : []),
          // preserve any other properties
          ...it
        };
      } catch (e) {
        // fallback to baseProducts
        const pid = it.productId || it.id || it._id;
        const fallback = baseProducts.find(bp => String(bp.id) === String(pid));
        if (!fallback) return it;
        const fallbackSizes = fallback.availableSizes || fallback.sizes || [];
        const fallbackColors = (fallback.availableColors || fallback.colors || []).map(c => typeof c === 'string' ? c : (c?.name || c?.value)).filter(Boolean);
        return {
          id: fallback.id,
          productId: fallback.id,
          name: fallback.name || it.name,
          image: (fallback.images && fallback.images[0]) || it.image || (it.snapshot && it.snapshot.image) || null,
          price: it.price || it.salePrice || fallback.price || 0,
          originalPrice: fallback.originalPrice || it.originalPrice,
          quantity: it.quantity || it.qty || 1,
          selectedSize: it.selectedSize || it.size || (it.snapshot && it.snapshot.size) || null,
          selectedColor: it.selectedColor || it.color || (it.snapshot && it.snapshot.color) || null,
          inStock: typeof fallback.stock !== 'undefined' ? (fallback.stock > 0) : (it.inStock ?? true),
          brand: fallback.brand || it.brand,
          snapshot: it.snapshot || null,
          availableSizes: fallbackSizes,
          availableColors: fallbackColors,
          ...it
        };
      }
    });
    return Promise.all(promises);
  };

  useEffect(() => {
    refreshCart();
    const onCartUpdated = (e) => {
      if (e?.detail) {
        // enrich then set
        (async () => {
          const enriched = await enrichItems(e.detail.items || []);
          setCartItems(enriched);
        })();
      } else refreshCart();
    };
    window.addEventListener('cart:updated', onCartUpdated);
    window.addEventListener('storage', onCartUpdated);
    return () => {
      window.removeEventListener('cart:updated', onCartUpdated);
      window.removeEventListener('storage', onCartUpdated);
    };
  }, []);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    const it = cartItems.find(i => (i.id || i.productId || i._id) === itemId);
    if (!it) return;
    const updated = { ...it, quantity: newQuantity };
    await cart.updateItem(updated);
    await refreshCart();
  };

  const handleUpdateSizeColor = async (itemId, newSize, newColor) => {
    const it = cartItems.find(i => (i.id || i.productId || i._id) === itemId);
    if (!it) return;
    
    // Remove old item
    await cart.removeItem(it);
    
    // Add as new item with new size/color (will merge if exists)
    await cart.addItem({
      id: it.productId || it.id,
      productId: it.productId || it.id,
      name: it.name,
      price: it.price,
      image: it.image,
      selectedSize: newSize,
      selectedColor: newColor,
      quantity: it.quantity
    });
    
    await refreshCart();
  };

  const handleRemoveItem = async (itemId) => {
    const it = cartItems.find(i => (i.id || i.productId || i._id) === itemId);
    if (!it) return;
    await cart.removeItem(it);
    await refreshCart();
  };

  const handleSaveForLater = (itemId) => dispatch(saveForLater(itemId))
  const handleMoveToWishlist = (itemId) => {
    // wishlist logic placeholder
    dispatch(removeItem(itemId))
  }
  const handleMoveToCart = (itemId) => dispatch(moveToCart(itemId))
  const handleRemoveSavedItem = (itemId) => dispatch(removeSavedItem(itemId))

  const handleMoveToWishlistFromSaved = (itemId) => {
    console.log('Moved to wishlist from saved:', itemId);
    handleRemoveSavedItem(itemId);
  };

  const handleApplyCoupon = (code) => {
    setCouponCode(code);
    // Mock coupon validation
    if (code === 'WELCOME10') {
      // Show success message
      console.log('Coupon applied successfully');
    } else {
      // Show error message
      console.log('Invalid coupon code');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const handlePlaceOrder = async (orderData) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    console.log('Order placed:', orderData)
    await cart.clearCart()
    setIsLoading(false)
  toast.push({ title: 'Đặt hàng thành công', message: 'Cảm ơn bạn đã mua sắm tại ABC Fashion Store.', type: 'success' })
  }

  const handleClearCart = () => {
    setShowClearConfirm(true);
  }

  const confirmClearCart = async () => {
    await cart.clearCart();
    refreshCart();
    toast.push({ title: 'Đã xóa', message: 'Giỏ hàng đã được làm mới.', type: 'info' });
  }

  const toast = useToast();

  return (
    <>
      <Helmet>
        <title>Giỏ hàng - ABC Fashion Store</title>
        <meta name="description" content="Xem và quản lý giỏ hàng của bạn tại ABC Fashion Store. Thanh toán an toàn với nhiều phương thức thanh toán." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Giỏ hàng của bạn
                </h1>
                <p className="text-muted-foreground">
                  {cartItems?.length > 0 
                    ? `${cartItems?.length} sản phẩm trong giỏ hàng`
                    : 'Chưa có sản phẩm nào trong giỏ hàng'
                  }
                </p>
              </div>
              
              {cartItems?.length > 0 && (
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearCart}
                    className="text-error hover:text-error"
                  >
                    <Icon name="Trash2" size={16} />
                    <span className="ml-2">Xóa tất cả</span>
                  </Button>
                </div>
              )}
            </div>

            {cartItems?.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems?.map((item) => (
                    <CartItem
                      key={item?.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onUpdateSizeColor={handleUpdateSizeColor}
                      onRemove={handleRemoveItem}
                      onSaveForLater={handleSaveForLater}
                      onMoveToWishlist={handleMoveToWishlist}
                    />
                  ))}

                  {/* Continue Shopping */}
                  <div className="flex items-center justify-between pt-6 border-t border-border">
                    <Button
                      variant="outline"
                      onClick={() => window.history?.back()}
                    >
                      <Icon name="ArrowLeft" size={16} />
                      <span className="ml-2">Tiếp tục mua sắm</span>
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon name="Shield" size={16} />
                      <span>Thanh toán an toàn & bảo mật</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <OrderSummary
                    subtotal={orderSummary?.subtotal}
                    shipping={orderSummary?.shipping}
                    tax={orderSummary?.tax}
                    discount={orderSummary?.discount}
                    total={orderSummary?.total}
                    couponCode={couponCode}
                    setCouponCode={setCouponCode}
                    onApplyCoupon={handleApplyCoupon}
                    onProceedToCheckout={handleProceedToCheckout}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Saved for Later */}
            {savedItems?.length > 0 && (
              <div className="mt-12">
                <SavedForLater
                  items={savedItems}
                  onMoveToCart={handleMoveToCart}
                  onRemove={handleRemoveSavedItem}
                  onMoveToWishlist={handleMoveToWishlistFromSaved}
                />
              </div>
            )}

            {/* Benefits Section */}
            {cartItems?.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div className="flex flex-col items-center p-4">
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mb-3">
                      <Icon name="Truck" size={24} className="text-success" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Miễn phí vận chuyển</h3>
                    <p className="text-sm text-muted-foreground">Cho đơn hàng từ 500.000 VND</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                      <Icon name="RotateCcw" size={24} className="text-accent" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Đổi trả miễn phí</h3>
                    <p className="text-sm text-muted-foreground">Trong vòng 30 ngày</p>
                  </div>
                  
                  <div className="flex flex-col items-center p-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3">
                      <Icon name="Shield" size={24} className="text-blue-500" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">Thanh toán an toàn</h3>
                    <p className="text-sm text-muted-foreground">Bảo mật SSL 256-bit</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          cartItems={cartItems}
          orderSummary={orderSummary}
          onPlaceOrder={handlePlaceOrder}
        />

        {/* Confirm Clear Cart Modal */}
        <ConfirmModal
          isOpen={showClearConfirm}
          onClose={() => setShowClearConfirm(false)}
          onConfirm={confirmClearCart}
          title="Xóa tất cả sản phẩm?"
          message="Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng? Hành động này không thể hoàn tác."
          confirmText="Xóa tất cả"
          cancelText="Hủy bỏ"
          type="danger"
        />
      </div>
    </>
  );
};

export default ShoppingCart;