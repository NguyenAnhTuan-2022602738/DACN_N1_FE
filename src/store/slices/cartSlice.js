import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cartItems: [
    {
      id: 1,
      name: "Áo thun cotton premium nam",
      price: 299000,
      originalPrice: 399000,
      quantity: 2,
      color: "Đen",
      size: "L",
      brand: "ABC Fashion",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
      inStock: true
    },
    {
      id: 2,
      name: "Quần jeans slim fit nữ",
      price: 599000,
      originalPrice: null,
      quantity: 1,
      color: "Xanh đậm",
      size: "M",
      brand: "ABC Fashion",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop",
      inStock: true
    }
  ],
  savedItems: [
    {
      id: 4,
      name: "Áo khoác denim vintage",
      price: 799000,
      originalPrice: 999000,
      color: "Xanh nhạt",
      size: "M",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
      inStock: true
    }
  ]
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload
      const existing = state.cartItems.find(i => i.id === item.id && i.size === item.size && i.color?.name === item.color?.name)
      if (existing) {
        existing.quantity = (existing.quantity || 0) + (item.quantity || 1)
      } else {
        state.cartItems.push({ ...item, quantity: item.quantity || 1 })
      }
    },
    removeItem: (state, action) => {
      const id = action.payload
      state.cartItems = state.cartItems.filter(i => i.id !== id)
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.cartItems.find(i => i.id === id)
      if (item) item.quantity = quantity
    },
    clearCart: (state) => {
      state.cartItems = []
    },
    saveForLater: (state, action) => {
      const id = action.payload
      const item = state.cartItems.find(i => i.id === id)
      if (item) {
        state.savedItems.push({ ...item, quantity: 1 })
        state.cartItems = state.cartItems.filter(i => i.id !== id)
      }
    },
    moveToCart: (state, action) => {
      const id = action.payload
      const item = state.savedItems.find(i => i.id === id)
      if (item) {
        state.cartItems.push({ ...item, quantity: 1 })
        state.savedItems = state.savedItems.filter(i => i.id !== id)
      }
    },
    removeSavedItem: (state, action) => {
      const id = action.payload
      state.savedItems = state.savedItems.filter(i => i.id !== id)
    }
  }
})

export const { addItem, removeItem, updateQuantity, clearCart, saveForLater, moveToCart, removeSavedItem } = cartSlice.actions
export default cartSlice.reducer
