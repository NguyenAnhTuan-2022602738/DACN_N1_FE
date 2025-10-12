const mongoose = require('mongoose');

// Kết nối database (thay đổi connection string cho phù hợp)
const MONGODB_URI = 'mongodb://localhost:27017/ABC_SHOP';

async function fixIndexes() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const collection = db.collection('cartitems');
    
    // Xem indexes hiện tại
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(i => i.name));
    
    // Xóa index cũ (conflict)
    try {
      await collection.dropIndex("user_id_1_product_id_1_variant_id_1");
      console.log('✅ Dropped old conflicting index');
    } catch (e) {
      console.log('ℹ️  Old index already removed or does not exist');
    }
    
    // Xóa tất cả cart items cũ
    const deleteResult = await collection.deleteMany({});
    console.log(`✅ Deleted ${deleteResult.deletedCount} old cart items`);
    
    // Tạo index mới (sẽ tự động tạo khi restart server)
    await collection.createIndex({ 
      user_id: 1, 
      product_id: 1, 
      selectedSize: 1, 
      selectedColor: 1 
    });
    
    await collection.createIndex({ 
      session_id: 1, 
      product_id: 1, 
      selectedSize: 1, 
      selectedColor: 1 
    });
    
    console.log('✅ Created new indexes with size/color');
    
    // Xem indexes sau khi fix
    const newIndexes = await collection.indexes();
    console.log('New indexes:', newIndexes.map(i => i.name));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
}

fixIndexes();