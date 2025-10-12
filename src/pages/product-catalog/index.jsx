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
import baseProducts from '../../data/products';
import cart from '../../lib/cart';
import API from '../../lib/api';
import { useToast } from '../../components/ui/ToastProvider';
import { useWishlist } from '../../contexts/WishlistContext';

const ProductCatalog = () => {
  const toast = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
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
  const [itemsPerPage, setItemsPerPage] = useState(12); // default for grid
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

  const mockProducts = baseProducts;

  // Initialize products: try backend first, fallback to mock
  useEffect(() => {
    let mounted = true;
    const initializeProducts = async () => {
      setLoading(true);
      try {
  const res = await API.get('/api/products?status=active&limit=200');
        const items = res?.data?.products || res?.data || [];
        // Map server product shape to frontend-friendly product object
        const mapped = (items || []).map((p, idx) => {
          // derive sizes/colors from variants when available
          const sizes = [];
          const colors = [];
          if (Array.isArray(p?.variants)) {
            p.variants.forEach(v => {
              if ((v.name || v.type) === 'Size' && v.value) sizes.push(v.value);
              if ((v.name || v.type) === 'Color' && v.value) colors.push({ name: v.value, value: v.value, color: v.color || undefined });
            });
          }
          return {
            id: p._id || p.id || String(idx),
            name: p.name,
            description: p.description || p.short_description || '',
            images: (p.images && p.images.length) ? p.images.map(i => i.image_url || i.url || i) : [],
            price: p.price || p.salePrice || p.original_price || 0,
            originalPrice: p.original_price || p.originalPrice || null,
            brand: p.brand || p.vendor || null,
            category: p.category_id || (p.categories && p.categories[0]) || 'uncategorized',
            stock: p.stock_quantity || p.stock || 0,
            rating: p.rating || p.review_count || 0,
            tags: p.tags || [],
            availableSizes: sizes,
            availableColors: colors
          };
        });
        if (!mounted) return;
        setProducts(mapped);
        setLoading(false);
      } catch (err) {
        // fallback to local mock (preserve previous behavior)
        const expandedProducts = [];
        for (let i = 0; i < 5; i++) {
          expandedProducts.push(...mockProducts.map(product => ({
            ...product,
            id: product.id + (i * mockProducts.length)
          })));
        }
        if (!mounted) return;
        setProducts(expandedProducts);
        setLoading(false);
      }
    };

    initializeProducts();
    return () => { mounted = false; };
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
    setCurrentPage(1); // reset to first page when filter/sort changes
  }, [products, searchQuery, activeCategory, filters, sortBy]);

  // Reset itemsPerPage when viewMode changes
  useEffect(() => {
    if (viewMode === 'grid' && ![8,12,16,20].includes(itemsPerPage)) setItemsPerPage(12);
    if (viewMode === 'list' && ![6,9,12,15,18].includes(itemsPerPage)) setItemsPerPage(9);
    setCurrentPage(1);
  }, [viewMode]);

  const pageOptionsGrid = [8, 12, 16, 20];
  const pageOptionsList = [6, 9, 12, 15, 18];
  const pageOptions = viewMode === 'grid' ? pageOptionsGrid : pageOptionsList;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);
  const hasMoreProducts = currentPage < totalPages;

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
  const handleWishlistToggle = async (productId) => {
    const product = products.find(p => p?.id === productId || p?._id === productId);
    if (!product) {
      console.error('[Wishlist] Product not found:', productId);
      return;
    }

    // Use _id if available, otherwise use id
    const finalProductId = product?._id || product?.id;

    try {
      // Use wishlist context to toggle
      const wasAdded = await toggleWishlist(finalProductId, {
        name: product?.name,
        brand: product?.brand,
        image: product?.images?.[0] || product?.image,
        price: product?.price || product?.salePrice,
        originalPrice: product?.originalPrice,
        category: product?.category
      });

      // Show toast
      if (wasAdded) {
        toast.push({
          title: 'Đã thêm vào yêu thích!',
          message: `"${product?.name}" đã được thêm vào danh sách yêu thích`,
          type: 'success'
        });
      } else {
        toast.push({
          title: 'Đã xóa',
          message: 'Đã xóa sản phẩm khỏi danh sách yêu thích',
          type: 'info'
        });
      }
    } catch (e) {
      console.error('[Wishlist Error]', e.response?.data || e.message);
      toast.push({
        title: 'Lỗi!',
        message: e.response?.data?.message || 'Không thể cập nhật danh sách yêu thích',
        type: 'error'
      });
    }
  };

  // Handle quick view
  const handleQuickView = (product) => {
    setQuickViewProduct(product);
  };

  // Handle add to cart
  const handleAddToCart = async (product) => {
    try {
      // Prefer selected variants passed in (e.g., from Quick View). Otherwise auto-pick first.
      const defaultSize = product?.selectedSize ?? (product?.availableSizes?.[0]
        || product?.sizes?.[0]
        || null);
      // Colors can be objects or strings; normalize to string name/value
      const selectedColorInput = product?.selectedColor;
      const firstColorObj = Array.isArray(product?.availableColors) ? product?.availableColors?.[0] : null;
      const autoColor = firstColorObj?.name || firstColorObj?.value || (Array.isArray(product?.colors) ? product?.colors?.[0] : null) || null;
      const defaultColor = typeof selectedColorInput === 'string'
        ? selectedColorInput
        : (selectedColorInput?.name || selectedColorInput?.value || autoColor);
      const qty = product?.quantity || 1;

      await cart.addItem({
        productId: product.id,
        name: product.name,
        price: product.price || product.salePrice,
        quantity: qty,
        image: product.images && product.images[0],
        selectedSize: defaultSize,
        selectedColor: defaultColor
      });
      toast.push({
        title: 'Thành công!',
        message: `Đã thêm "${product.name}" vào giỏ hàng`,
        type: 'success'
      });
    } catch (e) {
      console.error('Failed to add to cart', e);
      toast.push({
        title: 'Lỗi!',
        message: 'Không thể thêm sản phẩm vào giỏ hàng',
        type: 'error'
      });
    }
  };

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
                      onClick={() => { setViewMode('grid'); setItemsPerPage(12); setCurrentPage(1); }}
                      className="w-8 h-8"
                    >
                      <Icon name="Grid3X3" size={16} />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => { setViewMode('list'); setItemsPerPage(9); setCurrentPage(1); }}
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

                  {/* Items per page dropdown */}
                  <select
                    className="border rounded px-2 py-1 text-sm bg-background text-foreground"
                    value={itemsPerPage}
                    onChange={e => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  >
                    {pageOptions.map(opt => (
                      <option key={opt} value={opt}>{opt} / trang</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Grid */}
              <ProductGrid
                products={displayedProducts}
                loading={loading}
                onWishlistToggle={handleWishlistToggle}
                onQuickView={handleQuickView}
                onAddToCart={handleAddToCart}
                viewMode={viewMode}
              />

              {/* Pagination & End Message */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <Icon name="ChevronLeft" size={16} />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      className={`px-3 py-1 rounded ${page === currentPage ? 'bg-accent text-white' : 'bg-muted text-foreground'}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <Icon name="ChevronRight" size={16} />
                  </Button>
                </div>
              )}
              {currentPage === totalPages && displayedProducts.length > 0 && (
                <div className="text-center text-muted-foreground mt-4 mb-8 text-sm">
                  Đã xem hết danh sách sản phẩm
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Filter Sidebar */}
        <div className="lg:hidden">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>
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