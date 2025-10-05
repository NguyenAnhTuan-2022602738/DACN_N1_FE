import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SearchBar from './components/SearchBar';
import CategoryNavigation from './components/CategoryNavigation';
import FilterSidebar from './components/FilterSidebar';
import SortDropdown from './components/SortDropdown';
import ProductGrid from './components/ProductGrid';
import QuickViewModal from './components/QuickViewModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ProductCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams?.get('category') || 'all');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: [],
    price: [],
    size: [],
    color: [],
    brand: [],
    material: []
  });

  // Mock product data
  const mockProducts = [
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
    },
    {
      id: 6,
      name: "Túi xách da nữ",
      brand: "Local Brand",
      price: 950000,
      originalPrice: null,
      rating: 4.1,
      reviewCount: 45,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"
      ],
      availableSizes: ["One Size"],
      availableColors: [
        { name: "Nâu", value: "brown", color: "#92400E" },
        { name: "Đen", value: "black", color: "#000000" }
      ],
      category: "accessories",
      material: "Leather",
      isNew: true,
      isBestseller: false,
      isWishlisted: false,
      description: "Túi xách da thật cao cấp, thiết kế sang trọng, phù hợp cho công sở và dạo phố."
    }
  ];

  // Initialize products
  useEffect(() => {
    const initializeProducts = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        const expandedProducts = [];
        for (let i = 0; i < 5; i++) {
          expandedProducts?.push(...mockProducts?.map(product => ({
            ...product,
            id: product?.id + (i * mockProducts?.length)
          })));
        }
        setProducts(expandedProducts);
        setLoading(false);
      }, 1000);
    };

    initializeProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered?.filter(product =>
        product?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        product?.brand?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        product?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply category filter
    if (activeCategory !== 'all') {
      filtered = filtered?.filter(product => {
        if (activeCategory === 'men') return product?.category?.startsWith('men');
        if (activeCategory === 'women') return product?.category?.startsWith('women');
        if (activeCategory === 'kids') return product?.category?.startsWith('kids');
        if (activeCategory === 'accessories') return product?.category === 'accessories';
        return product?.category === activeCategory;
      });
    }

    // Apply filters
    Object.entries(filters)?.forEach(([filterType, values]) => {
      if (values?.length > 0) {
        filtered = filtered?.filter(product => {
          switch (filterType) {
            case 'category':
              return values?.includes(product?.category);
            case 'price':
              return values?.some(range => {
                const [min, max] = range?.split('-')?.map(Number);
                return product?.price >= min && product?.price <= max;
              });
            case 'size':
              return product?.availableSizes?.some(size => values?.includes(size));
            case 'color':
              return product?.availableColors?.some(color => values?.includes(color?.value));
            case 'brand':
              return values?.includes(product?.brand);
            case 'material':
              return values?.includes(product?.material);
            default:
              return true;
          }
        });
      }
    });

    // Apply sorting
    filtered?.sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return a?.price - b?.price;
        case 'price-high-low':
          return b?.price - a?.price;
        case 'newest':
          return b?.id - a?.id;
        case 'rating':
          return b?.rating - a?.rating;
        case 'popularity':
          return b?.reviewCount - a?.reviewCount;
        case 'discount':
          const aDiscount = a?.originalPrice ? ((a?.originalPrice - a?.price) / a?.originalPrice) : 0;
          const bDiscount = b?.originalPrice ? ((b?.originalPrice - b?.price) / b?.originalPrice) : 0;
          return bDiscount - aDiscount;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, activeCategory, filters, sortBy]);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    setSearchParams(prev => {
      if (query) {
        prev?.set('q', query);
      } else {
        prev?.delete('q');
      }
      return prev;
    });
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setSearchParams(prev => {
      if (category !== 'all') {
        prev?.set('category', category);
      } else {
        prev?.delete('category');
      }
      return prev;
    });
  };

  // Handle filter change
  const handleFilterChange = (filterType, value, checked) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked
        ? [...prev?.[filterType], value]
        : prev?.[filterType]?.filter(item => item !== value)
    }));
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      category: [],
      price: [],
      size: [],
      color: [],
      brand: [],
      material: []
    });
    setActiveCategory('all');
    setSearchQuery('');
    setSearchParams({});
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (productId) => {
    setProducts(prev =>
      prev?.map(product =>
        product?.id === productId
          ? { ...product, isWishlisted: !product?.isWishlisted }
          : product
      )
    );
  };

  // Handle quick view
  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
    // Implement cart logic here
  };

  // Handle load more
  const handleLoadMore = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        // In real app, load more products from API
        resolve();
      }, 1000);
    });
  };

  const displayedProducts = filteredProducts?.slice(0, currentPage * 12);
  const hasMoreProducts = filteredProducts?.length > displayedProducts?.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        {/* Search Section */}
        <div className="bg-muted/30 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Khám phá thời trang
              </h1>
              <p className="text-muted-foreground">
                Tìm kiếm và khám phá hàng nghìn sản phẩm thời trang chất lượng cao
              </p>
            </div>
            
            <SearchBar
              onSearch={handleSearch}
              onVoiceSearch={() => {}} // Add missing required prop
              suggestions={['áo sơ mi', 'váy midi', 'quần jeans', 'giày sneaker']}
              isLoading={loading}
            />
          </div>
        </div>

        {/* Category Navigation */}
        <CategoryNavigation
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Filter Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isOpen={false}
                onClose={() => {}}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden"
                  >
                    <Icon name="Filter" size={16} className="mr-2" />
                    Bộ lọc
                  </Button>

                  <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                    <Icon name="Package" size={16} />
                    <span>{filteredProducts?.length} sản phẩm</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center space-x-1 bg-muted rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="w-8 h-8"
                    >
                      <Icon name="Grid3X3" size={16} />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="w-8 h-8"
                    >
                      <Icon name="List" size={16} />
                    </Button>
                  </div>

                  {/* Sort Dropdown */}
                  <SortDropdown
                    currentSort={sortBy}
                    onSortChange={setSortBy}
                  />
                </div>
              </div>

              {/* Product Grid */}
              <ProductGrid
                products={displayedProducts}
                loading={loading}
                hasMore={hasMoreProducts}
                onLoadMore={handleLoadMore}
                onWishlistToggle={handleWishlistToggle}
                onQuickView={handleQuickView}
                onAddToCart={handleAddToCart}
                viewMode={viewMode}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onWishlistToggle={handleWishlistToggle}
      />
    </div>
  );
};

export default ProductCatalog;