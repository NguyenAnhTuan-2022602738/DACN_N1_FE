# 🔧 HƯỚNG DẪN SỬA BACKEND - THÊM SIZE/COLOR VÀO GIỎ HÀNG

## 📋 Tổng quan vấn đề:
- Frontend đang gửi `selectedSize` và `selectedColor` nhưng backend không lưu
- Backend cần lưu 2 fields này vào database
- Logic merge phải check cả productId + size + color (không chỉ productId)

---

## ⚡ BƯỚC 1: Cập nhật Cart Item Model

**File cần sửa:** `server/models/CartItem.js` hoặc `backend/models/CartItem.js`

### Thêm 2 fields vào schema:

```javascript
const cartItemSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  session_id: { type: String },
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Variant' },
  quantity: { type: Number, default: 1 },
  
  // ✅✅✅ THÊM 2 DÒNG NÀY ✅✅✅
  selectedSize: { type: String, default: null },
  selectedColor: { type: String, default: null },
  // ✅✅✅ KẾT THÚC ✅✅✅
  
  created_at: { type: Date, default: Date.now }
});
```

### Thêm index (optional - để query nhanh hơn):

```javascript
cartItemSchema.index({ user_id: 1, product_id: 1, selectedSize: 1, selectedColor: 1 });
cartItemSchema.index({ session_id: 1, product_id: 1, selectedSize: 1, selectedColor: 1 });
```

---

## ⚡ BƯỚC 2: Cập nhật Cart Controller

**File cần sửa:** `server/controllers/cartController.js`

### 2.1. Sửa hàm `getCart()` - Trả về size/color:

Tìm phần map items, thêm 2 dòng:

```javascript
const outItems = items.map(it => {
  const prod = productsById[String(it.product_id)];
  if (!prod) return null;
  return {
    id: String(it._id),
    productId: String(it.product_id),
    // ... các field khác ...
    quantity: it.quantity,
    
    // ✅✅✅ THÊM 4 DÒNG NÀY ✅✅✅
    selectedSize: it.selectedSize || null,
    selectedColor: it.selectedColor || null,
    size: it.selectedSize || null,         // Alias cho frontend
    color: it.selectedColor || null,       // Alias cho frontend
    // ✅✅✅ KẾT THÚC ✅✅✅
    
    inStock: (typeof prod.stock_quantity !== 'undefined') ? (prod.stock_quantity > 0) : true,
    product: prod
  };
}).filter(Boolean);
```

### 2.2. Sửa hàm `addItem()` - Lưu và merge đúng:

**A. Thêm size/color vào filter để tìm item hiện có:**

```javascript
async function addItem(req, res) {
  try {
    const { item } = req.body;
    console.log('[DEBUG] Received item:', item); // ✅ THÊM LOG
    
    // ... code kiểm tra product ...
    
    const filter = {};
    if (req.user) filter.user_id = req.user._id;
    else {
      const sid = getSessionId(req);
      if (!sid) return res.status(400).json({ message: 'Session missing' });
      filter.session_id = sid;
    }

    filter.product_id = item.productId;
    if (item.variantId) filter.variant_id = item.variantId;
    
    // ✅✅✅ THÊM PHẦN NÀY ✅✅✅
    // Chỉ merge nếu CÙNG size và color
    filter.selectedSize = item.selectedSize || null;
    filter.selectedColor = item.selectedColor || null;
    // ✅✅✅ KẾT THÚC ✅✅✅

    console.log('[DEBUG] Filter:', filter); // ✅ THÊM LOG

    let existing = await CartItem.findOne(filter);
    if (existing) {
      // Merge: tăng quantity
      existing.quantity = (existing.quantity || 0) + (parseInt(item.quantity || 1, 10) || 1);
      await existing.save();
      console.log('[DEBUG] MERGED! New quantity:', existing.quantity);
    } else {
      // Create new
      const toCreate = {
        product_id: item.productId,
        variant_id: item.variantId || null,
        quantity: parseInt(item.quantity || 1, 10) || 1,
        
        // ✅✅✅ THÊM 2 DÒNG NÀY ✅✅✅
        selectedSize: item.selectedSize || null,
        selectedColor: item.selectedColor || null
        // ✅✅✅ KẾT THÚC ✅✅✅
      };
      
      if (req.user) toCreate.user_id = req.user._id; 
      else toCreate.session_id = getSessionId(req);
      
      existing = await CartItem.create(toCreate);
      console.log('[DEBUG] CREATED with size/color:', {
        size: existing.selectedSize,
        color: existing.selectedColor
      });
    }

    return getCart(req, res);
  } catch (err) {
    console.error('addItem error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
```

### 2.3. Sửa hàm `updateItem()` - Cho phép update size/color:

```javascript
async function updateItem(req, res) {
  try {
    const { item } = req.body;
    if (!item || !item.id) return res.status(400).json({ message: 'Invalid item' });

    const filter = { _id: item.id };
    if (req.user) filter.user_id = req.user._id; 
    else filter.session_id = getSessionId(req);

    const existing = await CartItem.findOne(filter);
    if (!existing) return res.status(404).json({ message: 'Cart item not found' });
    
    if (typeof item.quantity !== 'undefined') {
      existing.quantity = parseInt(item.quantity, 10) || 0;
    }
    
    // ✅✅✅ THÊM PHẦN NÀY ✅✅✅
    if (typeof item.selectedSize !== 'undefined') {
      existing.selectedSize = item.selectedSize;
    }
    if (typeof item.selectedColor !== 'undefined') {
      existing.selectedColor = item.selectedColor;
    }
    // ✅✅✅ KẾT THÚC ✅✅✅
    
    await existing.save();
    return getCart(req, res);
  } catch (err) {
    console.error('updateItem error', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
```

---

## ⚡ BƯỚC 3: Test

### 3.1. Restart backend server:
```bash
# Stop server (Ctrl+C)
# Start lại
npm run dev
# hoặc
node server.js
```

### 3.2. Xóa giỏ hàng cũ (quan trọng!):

**Option A - Qua MongoDB:**
```javascript
// Trong mongo shell hoặc MongoDB Compass
db.cartitems.deleteMany({})
```

**Option B - Qua API:**
- Call endpoint `/api/cart/clear`

### 3.3. Test thêm sản phẩm:

1. Vào trang product detail
2. Chọn Size: M, Color: Đỏ
3. Thêm vào giỏ hàng
4. Kiểm tra console backend:

```
[DEBUG] Received item: { 
  productId: '...', 
  selectedSize: 'M', 
  selectedColor: 'Đỏ',
  quantity: 1
}
[DEBUG] Filter: {
  user_id: '...',
  product_id: '...',
  selectedSize: 'M',
  selectedColor: 'Đỏ'
}
[DEBUG] CREATED with size/color: { size: 'M', color: 'Đỏ' }
```

5. Vào giỏ hàng → DEBUG BOX phải hiển thị:
```
selectedSize: "M"
selectedColor: "Đỏ"
```

### 3.4. Test merge logic:

1. Thêm cùng sản phẩm, cùng size M, cùng màu Đỏ → **quantity tăng lên 2**
2. Thêm cùng sản phẩm, nhưng size L → **tạo item mới riêng**
3. Thêm cùng sản phẩm size M, nhưng màu Xanh → **tạo item mới riêng**

Console backend phải log:
```
[DEBUG] MERGED! New quantity: 2
```

---

## 📝 Checklist hoàn thành:

- [ ] Model: Thêm `selectedSize` và `selectedColor` vào CartItem schema
- [ ] Model: Thêm index (optional)
- [ ] Controller `getCart()`: Trả về selectedSize và selectedColor
- [ ] Controller `addItem()`: Filter bao gồm size/color để merge đúng
- [ ] Controller `addItem()`: Lưu selectedSize và selectedColor khi create
- [ ] Controller `updateItem()`: Cho phép update size/color
- [ ] Restart backend server
- [ ] Xóa giỏ hàng cũ trong database
- [ ] Test thêm sản phẩm với size/color
- [ ] Test merge logic (cùng size/color → merge, khác → tạo mới)
- [ ] Frontend hiển thị đúng size/color trong giỏ hàng

---

## ❗ Lưu ý quan trọng:

1. **Phải xóa giỏ hàng cũ** sau khi update schema, vì items cũ không có fields mới
2. **Filter phải bao gồm size/color** để merge đúng, không chỉ productId
3. **Null handling**: Dùng `|| null` để đảm bảo MongoDB match chính xác
4. Nếu dùng TypeScript, cần update interface/type definitions

---

## 🐛 Troubleshooting:

**Vấn đề:** Vẫn hiển thị `selectedSize: null`

**Giải pháp:**
1. Check console backend xem có log "CREATED with size/color" không
2. Check database trực tiếp: `db.cartitems.find().pretty()`
3. Đảm bảo đã restart backend sau khi sửa model
4. Đảm bảo đã xóa cart items cũ

**Vấn đề:** Merge không đúng (tạo nhiều items cho cùng sản phẩm)

**Giải pháp:**
1. Check filter có bao gồm selectedSize và selectedColor chưa
2. Check console log "Filter:" để xem query
3. Đảm bảo null values được handle đúng (dùng `|| null`)

---

## ✅ Files đã tạo sẵn:

1. `BACKEND_FIX_cartController.js` - Controller đã fix đầy đủ
2. `BACKEND_FIX_CartItemModel.js` - Model đã có selectedSize/selectedColor

Copy nội dung từ 2 files này sang backend project của bạn!
