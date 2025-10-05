import React, { useEffect } from 'react';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import FeaturedCategories from './components/FeaturedCategories';
import ProductCarousel from './components/ProductCarousel';
import PromotionalBanners from './components/PromotionalBanners';
import SocialProof from './components/SocialProof';
import Footer from './components/Footer';

const Homepage = () => {
  // Mock data for featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Áo Khoác Dạ Nữ Cao Cấp",
      category: "Áo Khoác",
      price: 1290000,
      originalPrice: 1590000,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviews: 124,
      isNew: true,
      discount: 19,
      colors: ["#000000", "#8B4513", "#708090"]
    },
    {
      id: 2,
      name: "Váy Maxi Hoa Nhí Vintage",
      category: "Váy Đầm",
      price: 890000,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviews: 89,
      isNew: false,
      discount: null,
      colors: ["#FF69B4", "#87CEEB", "#98FB98"]
    },
    {
      id: 3,
      name: "Áo Sơ Mi Trắng Classic",
      category: "Áo Sơ Mi",
      price: 450000,
      originalPrice: 590000,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviews: 156,
      isNew: false,
      discount: 24,
      colors: ["#FFFFFF", "#E6E6FA", "#F0F8FF"]
    },
    {
      id: 4,
      name: "Quần Jeans Skinny Cao Cấp",
      category: "Quần Jeans",
      price: 690000,
      originalPrice: 890000,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      reviews: 203,
      isNew: true,
      discount: 22,
      colors: ["#000080", "#4169E1", "#708090"]
    },
    {
      id: 5,
      name: "Đầm Dạ Tiệc Sang Trọng",
      category: "Váy Đầm",
      price: 1590000,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1566479179817-c0b2b2c7e5b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviews: 67,
      isNew: true,
      discount: null,
      colors: ["#000000", "#8B0000", "#4B0082"]
    },
    {
      id: 6,
      name: "Áo Thun Cotton Premium",
      category: "Áo Thun",
      price: 290000,
      originalPrice: 390000,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.5,
      reviews: 312,
      isNew: false,
      discount: 26,
      colors: ["#FFFFFF", "#000000", "#FF6347", "#32CD32"]
    }
  ];

  const newArrivals = [
    {
      id: 7,
      name: "Blazer Nữ Công Sở Hiện Đại",
      category: "Áo Khoác",
      price: 990000,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviews: 45,
      isNew: true,
      discount: null,
      colors: ["#000000", "#708090", "#2F4F4F"]
    },
    {
      id: 8,
      name: "Chân Váy Xòe Midi",
      category: "Chân Váy",
      price: 520000,
      originalPrice: 690000,
      image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviews: 78,
      isNew: true,
      discount: 25,
      colors: ["#FF69B4", "#87CEEB", "#DDA0DD"]
    },
    {
      id: 9,
      name: "Áo Len Cổ Tròn Mềm Mại",
      category: "Áo Len",
      price: 650000,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      reviews: 92,
      isNew: true,
      discount: null,
      colors: ["#F5DEB3", "#DEB887", "#D2691E"]
    },
    {
      id: 10,
      name: "Quần Tây Nữ Ống Suông",
      category: "Quần Tây",
      price: 780000,
      originalPrice: 980000,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviews: 134,
      isNew: true,
      discount: 20,
      colors: ["#000000", "#708090", "#2F4F4F"]
    },
    {
      id: 11,
      name: "Túi Xách Tay Cao Cấp",
      category: "Phụ Kiện",
      price: 1290000,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviews: 56,
      isNew: true,
      discount: null,
      colors: ["#8B4513", "#000000", "#A0522D"]
    },
    {
      id: 12,
      name: "Giày Cao Gót Thanh Lịch",
      category: "Giày Dép",
      price: 890000,
      originalPrice: 1190000,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviews: 89,
      isNew: true,
      discount: 25,
      colors: ["#000000", "#8B0000", "#4B0082"]
    }
  ];

  const bestSellers = [
    {
      id: 13,
      name: "Đầm Công Sở Thanh Lịch",
      category: "Váy Đầm",
      price: 750000,
      originalPrice: 950000,
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.9,
      reviews: 287,
      isNew: false,
      discount: 21,
      colors: ["#000000", "#000080", "#2F4F4F"]
    },
    {
      id: 14,
      name: "Áo Khoác Cardigan Mỏng",
      category: "Áo Khoác",
      price: 590000,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviews: 198,
      isNew: false,
      discount: null,
      colors: ["#F5DEB3", "#DEB887", "#D2691E", "#8B4513"]
    },
    {
      id: 15,
      name: "Quần Short Jean Nữ",
      category: "Quần Short",
      price: 390000,
      originalPrice: 490000,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.6,
      reviews: 245,
      isNew: false,
      discount: 20,
      colors: ["#000080", "#4169E1", "#708090"]
    },
    {
      id: 16,
      name: "Áo Kiểu Nữ Tay Dài",
      category: "Áo Kiểu",
      price: 420000,
      originalPrice: 560000,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.7,
      reviews: 167,
      isNew: false,
      discount: 25,
      colors: ["#FFFFFF", "#FFB6C1", "#E6E6FA"]
    },
    {
      id: 17,
      name: "Váy Ngắn Xòe Trẻ Trung",
      category: "Váy Đầm",
      price: 480000,
      originalPrice: null,
      image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.8,
      reviews: 156,
      isNew: false,
      discount: null,
      colors: ["#FF69B4", "#87CEEB", "#98FB98", "#DDA0DD"]
    },
    {
      id: 18,
      name: "Sandal Nữ Cao Gót",
      category: "Giày Dép",
      price: 650000,
      originalPrice: 850000,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.5,
      reviews: 123,
      isNew: false,
      discount: 24,
      colors: ["#000000", "#8B4513", "#A0522D"]
    }
  ];

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Categories */}
        <FeaturedCategories />

        {/* Featured Products Carousel */}
        <ProductCarousel
          title="Sản Phẩm Nổi Bật"
          subtitle="Những món đồ được yêu thích nhất tại ABC Fashion Store"
          products={featuredProducts}
          sectionId="featured"
        />

        {/* Promotional Banners */}
        <PromotionalBanners />

        {/* New Arrivals Carousel */}
        <ProductCarousel
          title="Hàng Mới Về"
          subtitle="Cập nhật xu hướng thời trang mới nhất 2024"
          products={newArrivals}
          sectionId="new-arrivals"
        />

        {/* Best Sellers Carousel */}
        <ProductCarousel
          title="Bán Chạy Nhất"
          subtitle="Những sản phẩm được khách hàng tin tưởng và lựa chọn nhiều nhất"
          products={bestSellers}
          sectionId="best-sellers"
        />

        {/* Social Proof Section */}
        <SocialProof />
      </main>

      <Footer />
    </div>
  );
};

export default Homepage;