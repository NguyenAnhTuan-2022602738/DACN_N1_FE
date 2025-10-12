# 🛒 LOGIC GIỎ HÀNG - MERGE SẢN PHẨM

## 📋 Nguyên tắc Merge:

Sản phẩm được coi là **GIỐNG NHAU** và merge (tăng số lượng) khi:
- ✅ Cùng `productId`
- ✅ Cùng `selectedSize` (hoặc cả 2 đều null)
- ✅ Cùng `selectedColor` (hoặc cả 2 đều null)

Sản phẩm được coi là **KHÁC NHAU** và tạo item mới khi:
- ❌ Khác `productId`
- ❌ Khác `selectedSize` (ví dụ: "M" vs "L")
- ❌ Khác `selectedColor` (ví dụ: "Đỏ" vs "Xanh")
- ❌ Một cái có size/color, cái kia null

## 🔑 Key Generation Logic:

```javascript
function _makeKey(item) {
  const pid = item.productId || '';
  const size = item.selectedSize || '';
  const color = item.selectedColor || '';
  return `${pid}::${size}::${color}`;
}
```

**Ví dụ keys:**
- `"product123::M::Đỏ"` - Áo size M màu Đỏ
- `"product123::L::Đỏ"` - Áo size L màu Đỏ (KHÁC item trên)
- `"product123::M::Xanh"` - Áo size M màu Xanh (KHÁC 2 items trên)
- `"product123::"` - Áo không có size/color

## 📊 Ví dụ thực tế:

### Case 1: Merge thành công ✅
```
Giỏ hàng hiện tại:
- Áo thun (productId: 123, size: M, color: Đỏ) x2

Thêm:
- Áo thun (productId: 123, size: M, color: Đỏ) x1

Kết quả:
- Áo thun (productId: 123, size: M, color: Đỏ) x3 ← MERGED
```

### Case 2: Tạo item mới - Khác size ❌
```
Giỏ hàng hiện tại:
- Áo thun (productId: 123, size: M, color: Đỏ) x2

Thêm:
- Áo thun (productId: 123, size: L, color: Đỏ) x1

Kết quả:
- Áo thun (productId: 123, size: M, color: Đỏ) x2
- Áo thun (productId: 123, size: L, color: Đỏ) x1 ← NEW
```

### Case 3: Tạo item mới - Khác màu ❌
```
Giỏ hàng hiện tại:
- Áo thun (productId: 123, size: M, color: Đỏ) x2

Thêm:
- Áo thun (productId: 123, size: M, color: Xanh) x1

Kết quả:
- Áo thun (productId: 123, size: M, color: Đỏ) x2
- Áo thun (productId: 123, size: M, color: Xanh) x1 ← NEW
```

### Case 4: Sản phẩm không có size/color ✅
```
Giỏ hàng hiện tại:
- Điện thoại (productId: 456, size: null, color: null) x1

Thêm:
- Điện thoại (productId: 456, size: null, color: null) x1

Kết quả:
- Điện thoại (productId: 456, size: null, color: null) x2 ← MERGED
```

### Case 5: Mixed - Có và không có size/color ❌
```
Giỏ hàng hiện tại:
- Áo thun (productId: 123, size: null, color: null) x1

Thêm:
- Áo thun (productId: 123, size: M, color: Đỏ) x1

Kết quả:
- Áo thun (productId: 123, size: null, color: null) x1
- Áo thun (productId: 123, size: M, color: Đỏ) x1 ← NEW
```

## 🔄 Flow thêm sản phẩm:

```
1. User click "Thêm giỏ hàng"
   ↓
2. Frontend gọi cart.addItem() với:
   - productId
   - selectedSize (từ dropdown hoặc null)
   - selectedColor (từ dropdown hoặc null)
   - quantity
   ↓
3. cart.addItem() tạo key = "productId::size::color"
   ↓
4. Backend nhận request /api/cart/add
   ↓
5. Backend tìm item với FILTER:
   - product_id = productId
   - selectedSize = size (hoặc null)
   - selectedColor = color (hoặc null)
   ↓
6. Nếu TÌM THẤY → Tăng quantity
   Nếu KHÔNG → Tạo item mới
   ↓
7. Trả về cart đã update
   ↓
8. Frontend hiển thị trong giỏ hàng
```

## ⚙️ Implementation Details:

### Frontend (cart.js):

```javascript
async function addItem(item) {
  const normalized = {
    productId: item.productId,
    selectedSize: item.selectedSize || null,
    selectedColor: item.selectedColor || null,
    quantity: item.quantity || 1
  };
  
  // Send to backend
  await API.post('/api/cart/add', { item: normalized });
}
```

### Backend (cartController.js):

```javascript
async function addItem(req, res) {
  const { item } = req.body;
  
  const filter = {
    user_id: req.user._id,
    product_id: item.productId,
    selectedSize: item.selectedSize || null,
    selectedColor: item.selectedColor || null
  };
  
  let existing = await CartItem.findOne(filter);
  
  if (existing) {
    // MERGE
    existing.quantity += item.quantity;
    await existing.save();
  } else {
    // NEW
    await CartItem.create({
      user_id: req.user._id,
      product_id: item.productId,
      selectedSize: item.selectedSize || null,
      selectedColor: item.selectedColor || null,
      quantity: item.quantity
    });
  }
}
```

## 🎨 UI trong giỏ hàng:

### Hiển thị size/color:

**Nếu có availableSizes/availableColors → Dropdown:**
```jsx
<select value={item.selectedSize} onChange={handleSizeChange}>
  {item.availableSizes.map(size => (
    <option value={size}>{size}</option>
  ))}
</select>
```

**Nếu không có arrays → Text:**
```jsx
<span>Size: {item.selectedSize}</span>
```

### Thay đổi size/color:

Khi user đổi size/color trong dropdown:
1. Remove item cũ khỏi giỏ
2. Add lại với size/color mới
3. Nếu trùng với item khác → Tự động merge

```javascript
async function handleUpdateSizeColor(itemId, newSize, newColor) {
  const item = cartItems.find(i => i.id === itemId);
  
  // Remove old
  await cart.removeItem(item);
  
  // Add with new size/color (will merge if match existing)
  await cart.addItem({
    productId: item.productId,
    selectedSize: newSize,
    selectedColor: newColor,
    quantity: item.quantity
  });
  
  await refreshCart();
}
```

## ✅ Checklist hoàn thành:

- [x] Backend model có selectedSize và selectedColor
- [x] Backend controller filter theo size/color khi merge
- [x] Frontend normalize size/color trước khi gửi
- [x] Frontend _makeKey() tạo key với productId::size::color
- [x] UI hiển thị size/color đã chọn
- [x] UI cho phép thay đổi size/color (nếu có options)
- [x] Xóa tất cả debug logs và debug boxes
- [x] Logic merge hoạt động đúng

## 🧪 Test Cases:

### Test 1: Cùng sản phẩm, cùng size/color
- Thêm: Áo (M, Đỏ) x1
- Thêm: Áo (M, Đỏ) x1
- Expected: 1 item với quantity = 2 ✅

### Test 2: Cùng sản phẩm, khác size
- Thêm: Áo (M, Đỏ) x1
- Thêm: Áo (L, Đỏ) x1
- Expected: 2 items riêng biệt ✅

### Test 3: Cùng sản phẩm, khác màu
- Thêm: Áo (M, Đỏ) x1
- Thêm: Áo (M, Xanh) x1
- Expected: 2 items riêng biệt ✅

### Test 4: Đổi size trong giỏ
- Có: Áo (M, Đỏ) x2
- Đổi M → L
- Expected: Áo (L, Đỏ) x2 ✅

### Test 5: Đổi size merge với item khác
- Có: Áo (M, Đỏ) x2 và Áo (L, Đỏ) x1
- Đổi item M → L
- Expected: Áo (L, Đỏ) x3 (merged) ✅

## 🔐 Security Notes:

- Backend PHẢI validate productId exists
- Backend PHẢI check user_id/session_id
- Không tin tưởng price từ frontend (lấy từ product DB)
- Validate quantity > 0
- Sanitize size/color strings để tránh injection

## 🚀 Performance Notes:

- Index MongoDB: `{ user_id: 1, product_id: 1, selectedSize: 1, selectedColor: 1 }`
- Batch fetch products khi getCart() để giảm queries
- Cache product info trong localStorage để UI nhanh hơn
- Debounce quantity input để giảm API calls

---

**Hoàn thành:** ✅ Logic merge đúng, UI clean, không còn debug code
