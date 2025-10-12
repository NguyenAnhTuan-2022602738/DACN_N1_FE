import React, { useEffect, useState } from 'react';
import API from '../../lib/api';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useToast } from '../../components/ui/ToastProvider';
import { Link } from 'react-router-dom';
import ConfirmModal from '../../components/ui/ConfirmModal';
import { Package, Search, Grid3x3, List } from 'lucide-react';

const ProductsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const toast = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await API.get('/api/products');
        if (mounted) setItems(res?.data?.products || []);
      } catch (e) {
        toast.push({ title: 'Lỗi', message: 'Không tải được danh sách sản phẩm', type: 'error' });
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/api/products/${deleteId}`);
      setItems(prev => prev.filter(p => p._id !== deleteId));
      toast.push({ title: 'Đã xóa', message: 'Sản phẩm đã được xóa', type: 'success' });
    } catch (e) {
      toast.push({ title: 'Lỗi', message: 'Không thể xóa sản phẩm', type: 'error' });
    } finally {
      setDeleteId(null);
    }
  };

  // Get primary image
  const getPrimaryImage = (product) => {
    if (!product.images || product.images.length === 0) return null;
    const primary = product.images.find(img => img.is_primary);
    return primary ? primary.image_url : product.images[0]?.image_url;
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(price || 0);
  };

  // Filter products
  const filteredProducts = items.filter(p =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Package className="text-primary" />
            Quản lý sản phẩm
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Tổng cộng {items.length} sản phẩm
          </p>
        </div>
        <Link to="/admin-panel/products/new">
          <Button>+ Thêm sản phẩm</Button>
        </Link>
      </div>

      {/* Search Bar & View Toggle */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 border rounded-lg transition-colors ${
              viewMode === 'grid' 
                ? 'bg-primary text-white border-primary' 
                : 'hover:bg-muted'
            }`}
            title="Xem dạng lưới"
          >
            <Grid3x3 size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 border rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-primary text-white border-primary' 
                : 'hover:bg-muted'
            }`}
            title="Xem dạng danh sách"
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-muted-foreground">Đang tải...</p>
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchTerm ? 'Không tìm thấy sản phẩm' : 'Chưa có sản phẩm nào'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? 'Thử tìm kiếm với từ khóa khác' 
                  : 'Bắt đầu bằng cách thêm sản phẩm đầu tiên'}
              </p>
            </div>
          )}

          {/* Products Grid View */}
          {filteredProducts.length > 0 && viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(p => {
                const primaryImage = getPrimaryImage(p);
                const hasDiscount = p.original_price && p.original_price > p.price;
                const discountPercent = hasDiscount 
                  ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
                  : 0;

                return (
                  <div key={p._id} className="bg-background border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Product Image */}
                    <div className="relative h-48 bg-muted">
                      {primaryImage ? (
                        <img
                          src={primaryImage}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={48} className="text-muted-foreground" />
                        </div>
                      )}
                      
                      {/* Discount Badge */}
                      {hasDiscount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{discountPercent}%
                        </div>
                      )}

                      {/* Featured Badge */}
                      {p.is_featured && (
                        <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                          ⭐ Nổi bật
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      {/* Name */}
                      <h3 className="font-semibold text-sm mb-1 line-clamp-2 h-10">
                        {p.name}
                      </h3>

                      {/* SKU */}
                      <p className="text-xs text-muted-foreground mb-2">
                        SKU: {p.sku}
                      </p>

                      {/* Price */}
                      <div className="mb-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-primary">
                            {formatPrice(p.price)}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(p.original_price)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stock & Sales */}
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div className="bg-muted px-2 py-1 rounded">
                          <span className="text-muted-foreground">Tồn kho:</span>
                          <span className={`ml-1 font-semibold ${
                            p.stock_quantity <= 0 ? 'text-red-600' :
                            p.stock_quantity <= (p.min_stock_level || 5) ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {p.stock_quantity || 0}
                          </span>
                        </div>
                        <div className="bg-muted px-2 py-1 rounded">
                          <span className="text-muted-foreground">Đã bán:</span>
                          <span className="ml-1 font-semibold text-blue-600">
                            {p.sold_count || 0}
                          </span>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="mb-3">
                        <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                          p.status === 'active' ? 'bg-green-100 text-green-700' :
                          p.status === 'out_of_stock' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {p.status === 'active' ? '✓ Hoạt động' :
                           p.status === 'out_of_stock' ? '✗ Hết hàng' :
                           '○ Không hoạt động'}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Link to={`/admin-panel/products/${p._id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            Sửa
                          </Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDelete(p._id)}
                          className="flex-1"
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Products List View */}
          {filteredProducts.length > 0 && viewMode === 'list' && (
            <div className="space-y-3">
              {filteredProducts.map(p => {
                const primaryImage = getPrimaryImage(p);
                const hasDiscount = p.original_price && p.original_price > p.price;
                const discountPercent = hasDiscount 
                  ? Math.round(((p.original_price - p.price) / p.original_price) * 100)
                  : 0;

                return (
                  <div key={p._id} className="bg-background border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                        {primaryImage ? (
                          <img
                            src={primaryImage}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={32} className="text-muted-foreground" />
                          </div>
                        )}
                        {hasDiscount && (
                          <div className="absolute top-1 right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                            -{discountPercent}%
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                          {/* Left: Product Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-1">
                              <h3 className="font-semibold text-base line-clamp-1">
                                {p.name}
                              </h3>
                              {p.is_featured && (
                                <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap">
                                  ⭐ Nổi bật
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">
                              SKU: {p.sku}
                            </p>

                            {/* Price */}
                            <div className="flex items-baseline gap-2 mb-2">
                              <span className="text-xl font-bold text-primary">
                                {formatPrice(p.price)}
                              </span>
                              {hasDiscount && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPrice(p.original_price)}
                                </span>
                              )}
                            </div>

                            {/* Stats Row */}
                            <div className="flex flex-wrap gap-3 text-sm">
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">Tồn kho:</span>
                                <span className={`font-semibold ${
                                  p.stock_quantity <= 0 ? 'text-red-600' :
                                  p.stock_quantity <= (p.min_stock_level || 5) ? 'text-yellow-600' :
                                  'text-green-600'
                                }`}>
                                  {p.stock_quantity || 0}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground">Đã bán:</span>
                                <span className="font-semibold text-blue-600">
                                  {p.sold_count || 0}
                                </span>
                              </div>
                              <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                                p.status === 'active' ? 'bg-green-100 text-green-700' :
                                p.status === 'out_of_stock' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {p.status === 'active' ? '✓ Hoạt động' :
                                 p.status === 'out_of_stock' ? '✗ Hết hàng' :
                                 '○ Không hoạt động'}
                              </span>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex md:flex-col gap-2 md:min-w-[100px]">
                            <Link to={`/admin-panel/products/${p._id}`} className="flex-1 md:flex-none">
                              <Button variant="outline" size="sm" className="w-full">
                                Sửa
                              </Button>
                            </Link>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDelete(p._id)}
                              className="flex-1 md:flex-none"
                            >
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Xóa sản phẩm?"
        message="Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
};

export default ProductsList;
