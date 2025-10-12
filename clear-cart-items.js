// Quick fix script - Xóa tất cả cart items để test
// Chạy trong MongoDB shell

use ABC_SHOP

// Xóa hết cart items cũ
db.cartitems.deleteMany({})

// Check kết quả
db.cartitems.count()

console.log("✅ Deleted all cart items for fresh start!")