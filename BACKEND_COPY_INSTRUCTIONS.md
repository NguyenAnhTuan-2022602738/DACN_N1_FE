# 🔧 BACKEND FILES TO COPY

## File 1: models/CartItem.js
Copy nội dung từ: `BACKEND_FIX_CartItemModel_V2.js`

## File 2: controllers/cartController.js  
Copy nội dung từ: `BACKEND_FIX_cartController.js`

## ✅ Những gì đã fix:

### 1. Model (CartItem.js):
- ✅ Thêm `selectedSize` và `selectedColor` fields
- ✅ Xóa index cũ `{ user_id: 1, product_id: 1, variant_id: 1 }` (gây conflict)
- ✅ Thêm index mới `{ user_id: 1, product_id: 1, selectedSize: 1, selectedColor: 1 }`

### 2. Controller (cartController.js):
- ✅ Filter merge theo `productId + selectedSize + selectedColor`
- ✅ Handle duplicate key error (E11000) từ index cũ
- ✅ Fallback logic: tìm item cũ và update với size/color mới
- ✅ Xóa debug logs sau khi test

### 3. Behavior sau khi fix:
- ✅ **Cùng sản phẩm + cùng size/color** → Merge quantity
- ✅ **Cùng sản phẩm + khác size** → Tạo item riêng biệt  
- ✅ **Cùng sản phẩm + khác color** → Tạo item riêng biệt
- ✅ **Đổi size/color trong cart** → Remove + Add (auto-merge nếu trùng)

## 🚀 Sau khi copy files:
1. Restart backend server
2. Test thêm sản phẩm với size khác nhau
3. Kiểm tra cart có items riêng biệt

---
**HOÀN THÀNH:** Logic cart merge đúng theo yêu cầu! 🎉