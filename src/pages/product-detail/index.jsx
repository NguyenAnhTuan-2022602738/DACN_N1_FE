import React, { useState, useEffect } from 'react';
import cart from '../../lib/cart'
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProductImageGallery from './components/ProductImageGallery';
import ProductInfo from './components/ProductInfo';
import ProductTabs from './components/ProductTabs';
import ReviewsSection from './components/ReviewsSection';
import RelatedProducts from './components/RelatedProducts';
import StylingTips from './components/StylingTips';
import RecentlyViewed from './components/RecentlyViewed';
import Icon from '../../components/AppIcon';
import API from '../../lib/api';
import { useToast } from '../../components/ui/ToastProvider';

const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams?.get('id') || '1';
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);

  // keep a small mock product as fallback for UI pieces that expect the old shape
  const mockProduct = {
    id: productId,
    name: "Áo Sơ Mi Nữ Tay Dài Phong Cách Hàn Quốc",
    sku: "ASM-001-WH-M",
    description: `Áo sơ mi nữ tay dài thiết kế theo phong cách Hàn Quốc hiện đại, mang đến vẻ đẹp thanh lịch và trẻ trung cho phái đẹp. Sản phẩm được may từ chất liệu cotton cao cấp, mềm mại và thoáng khí, phù hợp cho cả môi trường công sở lẫn dạo phố.\n\nThiết kế tinh tế với đường cắt may chuẩn form, tôn dáng người mặc. Màu trắng tinh khôi dễ dàng phối với nhiều trang phục khác nhau, tạo nên những set đồ đa dạng và phong cách.`,
    originalPrice: 450000,
    salePrice: 350000,
    rating: 4.5,
    reviewCount: 128,
    stock: 25,
    colors: [
      { name: 'Trắng', code: '#FFFFFF' },
      { name: 'Xanh nhạt', code: '#E6F3FF' },
      { name: 'Hồng pastel', code: '#FFE6F0' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    sizeAvailability: {
      'S': true,
      'M': true,
      'L': true,
      'XL': false
    },
    features: [
      "Chất liệu cotton 100% cao cấp, thấm hút mồ hôi tốt",
      "Thiết kế tay dài thanh lịch, phù hợp nhiều dịp",
      "Form áo chuẩn, tôn dáng người mặc",
      "Dễ dàng phối đồ với quần âu, chân váy hoặc jeans",
      "Màu sắc trung tính, không bị phai sau nhiều lần giặt"
    ],
    specifications: {
      "Chất liệu": "Cotton 100%",
      "Xuất xứ": "Việt Nam",
      "Kiểu dáng": "Regular fit",
      "Độ dài tay": "Tay dài",
      "Cổ áo": "Cổ sơ mi cổ điển",
      "Khuyến mãi": "Giảm 22% - Miễn phí vận chuyển"
    },
    careInstructions: [
      "Giặt máy ở nhiệt độ không quá 30°C",
      "Không sử dụng chất tẩy trắng",
      "Phơi nơi thoáng mát, tránh ánh nắng trực tiếp",
      "Ủi ở nhiệt độ trung bình",
      "Có thể giặt khô nếu cần thiết"
    ]
  };

  const mockImages = [
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1582142306909-195724d33c8f?w=600&h=600&fit=crop"
  ];

  const mockReviews = [
    {
      id: 1,
      userName: "Nguyễn Thị Mai",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      rating: 5,
      date: "2024-09-20",
      comment: "Áo rất đẹp và chất lượng tốt! Vải mềm mại, mặc rất thoải mái. Màu trắng rất dễ phối đồ. Tôi sẽ mua thêm màu khác.",
      verified: true,
      helpful: 12,
      size: "M",
      color: "Trắng",
      images: [
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=200&fit=crop"
      ]
    },
    {
      id: 2,
      userName: "Trần Văn Hùng",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      rating: 4,
      date: "2024-09-18",
      comment: "Mua tặng vợ, cô ấy rất thích. Chất lượng tốt, giá cả hợp lý. Giao hàng nhanh.",
      verified: true,
      helpful: 8,
      size: "L",
      color: "Xanh nhạt"
    },
    {
      id: 3,
      userName: "Lê Thị Hoa",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
      rating: 5,
      date: "2024-09-15",
      comment: "Áo đẹp lắm, form chuẩn, mặc vào rất sang trọng. Phù hợp để đi làm và đi chơi. Highly recommended!",
      verified: true,
      helpful: 15,
      size: "S",
      color: "Hồng pastel"
    }
  ];

  const mockRelatedProducts = [
    {
      id: 2,
      name: "Chân Váy Xòe Midi Thanh Lịch",
      image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?w=300&h=300&fit=crop",
      originalPrice: 320000,
      salePrice: 280000,
      rating: 4.3,
      reviewCount: 89,
      stock: 15
    },
    {
      id: 3,
      name: "Quần Âu Nữ Ống Suông",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=300&fit=crop",
      originalPrice: 380000,
      salePrice: 320000,
      rating: 4.6,
      reviewCount: 156,
      stock: 8
    },
    {
      id: 4,
      name: "Blazer Nữ Phong Cách Công Sở",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop",
      originalPrice: 650000,
      salePrice: 520000,
      rating: 4.8,
      reviewCount: 203,
      stock: 12
    },
    {
      id: 5,
      name: "Giày Cao Gót Mũi Nhọn",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop",
      originalPrice: 420000,
      salePrice: 350000,
      rating: 4.4,
      reviewCount: 67,
      stock: 20
    }
  ];

  const mockStylingTips = [
    {
      icon: "Briefcase",
      title: "Phong cách công sở chuyên nghiệp",
      description: "Kết hợp áo sơ mi với quần âu hoặc chân váy bút chì để tạo nên vẻ ngoài chuyên nghiệp và thanh lịch cho môi trường công sở.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=200&fit=crop",
          alt: "Office look 1",
          caption: "Với quần âu đen"
        },
        {
          src: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&h=200&fit=crop",
          alt: "Office look 2",
          caption: "Với chân váy bút chì"
        }
      ],
      recommendedProducts: [
        {
          name: "Quần âu đen",
          image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=100&h=100&fit=crop",
          price: 320000
        },
        {
          name: "Chân váy bút chì",
          image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?w=100&h=100&fit=crop",
          price: 280000
        }
      ],
      tags: ["công sở", "chuyên nghiệp", "thanh lịch"]
    },
    {
      icon: "Coffee",
      title: "Phong cách casual dạo phố",
      description: "Phối cùng jeans và sneakers để tạo nên look năng động, trẻ trung phù hợp cho những buổi dạo phố, gặp gỡ bạn bè.",
      images: [
        {
          src: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop",
          alt: "Casual look 1",
          caption: "Với jeans xanh"
        }
      ],
      recommendedProducts: [
        {
          name: "Quần jeans skinny",
          image: "https://images.unsplash.com/photo-1582142306909-195724d33c8f?w=100&h=100&fit=crop",
          price: 250000
        }
      ],
      tags: ["casual", "dạo phố", "trẻ trung"]
    }
  ];

  const mockRecentlyViewed = [
    {
      id: 6,
      name: "Đầm Maxi Hoa Nhí Vintage",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop",
      originalPrice: 480000,
      salePrice: 380000,
      rating: 4.7,
      reviewCount: 94
    },
    {
      id: 7,
      name: "Áo Thun Basic Cotton",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop",
      originalPrice: 180000,
      salePrice: 150000,
      rating: 4.2,
      reviewCount: 156
    }
  ];

  // map server product to UI-friendly shape
  const mapServerProductToUI = (p) => {
    if (!p) return null;
    
    // Extract sizes and colors from variants
    const sizes = [];
    const colors = [];
    const sizeAvailability = {};
    
    if (p.variants && Array.isArray(p.variants)) {
      p.variants.forEach(variant => {
        if (variant.name === 'Size') {
          sizes.push(variant.value);
          sizeAvailability[variant.value] = variant.stock_quantity > 0;
        } else if (variant.name === 'Color') {
          colors.push({ name: variant.value, code: '#dddddd' }); // You can enhance this with actual color codes
        }
      });
    }
    
    // Fallback to old format if variants not present
    const fallbackColors = (p.colors || []).map(c => ({ name: c, code: '#dddddd' }));
    const fallbackSizes = p.sizes || [];
    fallbackSizes.forEach(s => { sizeAvailability[s] = true; });
    
    return {
      ...p,
      id: p._id || p.id || p.sku,
      salePrice: p.price,
      originalPrice: p.original_price || p.price,
      images: (p.images || []).map(img => img.image_url || img),
      colors: colors.length > 0 ? colors : fallbackColors,
      sizes: sizes.length > 0 ? sizes : fallbackSizes,
      sizeAvailability: Object.keys(sizeAvailability).length > 0 ? sizeAvailability : { 'S': true, 'M': true, 'L': true }
    };
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const res = await API.get(`/api/products/${productId}`);
        const p = res?.data?.product;
        if (p && mounted) setProduct(mapServerProductToUI(p));
      } catch (e) {
        // ignore, keep null
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [productId]);

  const toast = useToast();

  const handleAddToCart = async (productData) => {
    try {
      await cart.addItem(productData);
      toast.push({ title: 'Thành công', message: 'Đã thêm sản phẩm vào giỏ hàng!', type: 'success' })
    } catch (e) {
      toast.push({ title: 'Lỗi', message: 'Không thể thêm sản phẩm vào giỏ hàng', type: 'error' })
    }
  }

  const handleAddToWishlist = () => {
    (async () => {
      try {
        await API.post('/api/wishlist/add', { product_id: mockProduct.id, snapshot: { name: mockProduct.name, image: mockProduct?.image, price: mockProduct.salePrice } });
        toast.push({ title: 'Đã thêm', message: 'Đã thêm sản phẩm vào danh sách yêu thích!', type: 'success' });
      } catch (e) {
        const msg = e?.response?.data?.message || 'Không thể thêm vào danh sách yêu thích';
        toast.push({ title: 'Lỗi', message: msg, type: 'error' });
      }
    })();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-6 bg-muted rounded w-1/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
            <a href="/homepage" className="hover:text-foreground transition-smooth">Trang chủ</a>
            <Icon name="ChevronRight" size={16} />
            <a href="/product-catalog" className="hover:text-foreground transition-smooth">Sản phẩm</a>
            <Icon name="ChevronRight" size={16} />
            <span className="text-foreground">Áo sơ mi nữ</span>
          </nav>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <ProductImageGallery 
              images={(product?.images && product.images.length) ? product.images : mockImages} 
              productName={(product || mockProduct)?.name} 
            />
            <ProductInfo 
              product={product || mockProduct}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
            />
          </div>

          {/* Product Details Tabs */}
          <div className="mb-12">
            <ProductTabs product={product || mockProduct} />
          </div>

          {/* Reviews Section */}
          <div className="mb-12">
            <ReviewsSection 
              reviews={mockReviews}
              averageRating={(product || mockProduct)?.rating}
              totalReviews={(product || mockProduct)?.reviewCount}
            />
          </div>

          {/* Styling Tips */}
          <div className="mb-12">
            <StylingTips 
              product={product || mockProduct}
              stylingTips={mockStylingTips}
            />
          </div>

          {/* Related Products and Recently Viewed */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            <div className="xl:col-span-3">
              <RelatedProducts products={mockRelatedProducts} />
            </div>
            <div className="xl:col-span-1">
              <RecentlyViewed products={mockRecentlyViewed} />
            </div>
          </div>
        </div>
      </div>
      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-4 right-4 lg:hidden">
        <button
          onClick={() => handleAddToCart({
            ...(product || mockProduct),
            selectedSize: 'M',
            selectedColor: (product || mockProduct)?.colors?.[0],
            quantity: 1
          })}
          className="w-14 h-14 bg-accent text-accent-foreground rounded-full shadow-elegant flex items-center justify-center transition-smooth hover:scale-105"
        >
          <Icon name="ShoppingCart" size={24} />
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;