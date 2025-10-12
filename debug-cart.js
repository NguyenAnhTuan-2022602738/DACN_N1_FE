// Debug cart add item request
import API from './src/lib/api.js';

async function testAddItem() {
  console.log('=== TESTING CART ADD ITEM ===');
  
  const testItem = {
    id: 'test123',
    productId: 'test123', 
    name: 'Test Product',
    price: 100000,
    selectedSize: 'M',
    selectedColor: 'Red',
    quantity: 1
  };
  
  console.log('Sending item:', testItem);
  
  try {
    const response = await API.post('/api/cart/add', { item: testItem });
    console.log('✅ Success response:', response.data);
    
    // Also test fetching cart
    const cartResponse = await API.get('/api/cart');
    console.log('✅ Cart after add:', cartResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('❌ Status:', error.response?.status);
  }
}

// Run test if this file is executed directly
if (typeof window === 'undefined') {
  testAddItem();
}