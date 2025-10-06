// Shared mock product data used by catalog and cart fallback
const baseProducts = [
  {
    id: 1,
    name: "Áo sơ mi nam Oxford trắng",
    brand: "Zara",
    price: 890000,
    originalPrice: 1200000,
    rating: 4.5,
    reviewCount: 128,
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400"
    ],
    availableSizes: ["S", "M", "L", "XL"],
    availableColors: [
      { name: "Trắng", value: "white", color: "#FFFFFF" },
      { name: "Xanh navy", value: "navy", color: "#1E3A8A" }
    ],
    category: "men-shirts",
    material: "Cotton",
    isNew: true,
    isBestseller: false,
    isWishlisted: false,
    description: "Áo sơ mi nam chất liệu cotton cao cấp, thiết kế Oxford cổ điển, phù hợp cho công sở và dạo phố."
  },
  {
    id: 2,
    name: "Váy midi hoa nhí nữ",
    brand: "H&M",
    price: 650000,
    originalPrice: null,
    rating: 4.2,
    reviewCount: 89,
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400"
    ],
    availableSizes: ["XS", "S", "M", "L"],
    availableColors: [
      { name: "Hồng", value: "pink", color: "#EC4899" },
      { name: "Xanh", value: "blue", color: "#3B82F6" }
    ],
    category: "women-dresses",
    material: "Polyester",
    isNew: false,
    isBestseller: true,
    isWishlisted: true,
    description: "Váy midi nữ tính với họa tiết hoa nhí dễ thương, chất liệu mềm mại, thoải mái."
  },
  {
    id: 3,
    name: "Quần jeans skinny nam",
    brand: "Uniqlo",
    price: 1200000,
    originalPrice: 1500000,
    rating: 4.7,
    reviewCount: 256,
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"
    ],
    availableSizes: ["28", "30", "32", "34", "36"],
    availableColors: [
      { name: "Xanh đậm", value: "dark-blue", color: "#1E3A8A" },
      { name: "Đen", value: "black", color: "#000000" }
    ],
    category: "men-jeans",
    material: "Denim",
    isNew: false,
    isBestseller: true,
    isWishlisted: false,
    description: "Quần jeans nam form skinny, chất liệu denim cao cấp, co giãn tốt, tôn dáng."
  },
  {
    id: 4,
    name: "Áo khoác bomber nữ",
    brand: "Nike",
    price: 2100000,
    originalPrice: null,
    rating: 4.3,
    reviewCount: 67,
    images: [
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400"
    ],
    availableSizes: ["S", "M", "L"],
    availableColors: [
      { name: "Đen", value: "black", color: "#000000" },
      { name: "Xám", value: "gray", color: "#6B7280" }
    ],
    category: "women-jackets",
    material: "Polyester",
    isNew: true,
    isBestseller: false,
    isWishlisted: false,
    description: "Áo khoác bomber phong cách thể thao, chất liệu nhẹ, phù hợp cho mùa thu đông."
  },
  {
    id: 5,
    name: "Giày sneaker trắng unisex",
    brand: "Adidas",
    price: 1800000,
    originalPrice: 2200000,
    rating: 4.6,
    reviewCount: 342,
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"
    ],
    availableSizes: ["36", "37", "38", "39", "40", "41", "42"],
    availableColors: [
      { name: "Trắng", value: "white", color: "#FFFFFF" },
      { name: "Đen", value: "black", color: "#000000" }
    ],
    category: "shoes",
    material: "Synthetic",
    isNew: false,
    isBestseller: true,
    isWishlisted: true,
    description: "Giày sneaker cổ điển, thiết kế tối giản, phù hợp cho mọi hoạt động hàng ngày."
  }
];

export default baseProducts;
