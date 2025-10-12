// Script để xóa index cũ và tạo index mới
// Chạy trong MongoDB shell hoặc MongoDB Compass

// 1. Kết nối database ABC_SHOP
use ABC_SHOP

// 2. Kiểm tra indexes hiện tại
db.cartitems.getIndexes()

// 3. Xóa index cũ (conflict)
db.cartitems.dropIndex("user_id_1_product_id_1_variant_id_1")

// 4. Tạo index mới (đúng logic)
db.cartitems.createIndex({ 
  user_id: 1, 
  product_id: 1, 
  selectedSize: 1, 
  selectedColor: 1 
})

db.cartitems.createIndex({ 
  session_id: 1, 
  product_id: 1, 
  selectedSize: 1, 
  selectedColor: 1 
})

// 5. Kiểm tra lại indexes
db.cartitems.getIndexes()

// 6. Xóa tất cả cart items cũ để fresh start
db.cartitems.deleteMany({})

console.log("✅ Fixed indexes!")