import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import API from '../../../lib/api';
import { useToast } from '../../../components/ui/ToastProvider';

const WishlistSection = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const toast = useToast();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await API.get('/api/wishlist');
        const items = (res?.data?.items || []).map(i => ({
          id: i.productId,
          name: i.snapshot?.name || `Sản phẩm ${i.productId}`,
          image: i.snapshot?.image,
          price: i.snapshot?.price || 0,
          addedDate: i.addedAt
        }));
        if (mounted) setWishlistItems(items);
      } catch (e) {
        // ignore, keep empty
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleRemoveItem = (itemId) => {
    (async () => {
      try {
        await API.post('/api/wishlist/remove', { productId: itemId });
        setWishlistItems(prev => prev?.filter(item => item?.id !== itemId));
        setSelectedItems(prev => prev?.filter(id => id !== itemId));
      } catch (e) {
        // fallback local removal
        setWishlistItems(prev => prev?.filter(item => item?.id !== itemId));
        setSelectedItems(prev => prev?.filter(id => id !== itemId));
      }
    })();
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev?.includes(itemId) 
        ? prev?.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems?.length === wishlistItems?.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems?.map(item => item?.id));
    }
  };

  const handleRemoveSelected = () => {
    (async () => {
      try {
        await Promise.all(selectedItems.map(id => API.post('/api/wishlist/remove', { productId: id })));
        setWishlistItems(prev => prev?.filter(item => !selectedItems?.includes(item?.id)));
        setSelectedItems([]);
        toast.push({ title: 'Đã xóa', message: 'Đã xóa sản phẩm khỏi yêu thích', type: 'success' });
      } catch (e) {
        // fallback local
        setWishlistItems(prev => prev?.filter(item => !selectedItems?.includes(item?.id)));
        setSelectedItems([]);
        toast.push({ title: 'Lỗi', message: 'Không thể xóa một vài mục', type: 'error' });
      }
    })();
  };

  const handleAddToCart = (item) => {
    // Mock add to cart functionality
    console.log('Added to cart:', item);
    toast.push({
      title: 'Thành công!',
      message: `Đã thêm "${item.name}" vào giỏ hàng`,
      type: 'success'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <h2 className="text-xl font-semibold text-foreground">Danh sách yêu thích</h2>
          <span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-sm font-medium">
            {wishlistItems?.length} sản phẩm
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex border border-border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3"
            >
              <Icon name="Grid3X3" size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3"
            >
              <Icon name="List" size={16} />
            </Button>
          </div>
          
          {/* Bulk Actions */}
          {wishlistItems?.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                {selectedItems?.length === wishlistItems?.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </Button>
              
              {selectedItems?.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  iconName="Trash2"
                  iconPosition="left"
                  onClick={handleRemoveSelected}
                >
                  Xóa ({selectedItems?.length})
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {wishlistItems?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Heart" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Danh sách yêu thích trống</h3>
          <p className="text-muted-foreground mb-4">Hãy thêm những sản phẩm bạn yêu thích để dễ dàng theo dõi</p>
          <Button variant="default" iconName="ShoppingBag" iconPosition="left">
            Khám phá sản phẩm
          </Button>
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" :"space-y-4"
        }>
          {wishlistItems?.map((item) => (
            <div
              key={item?.id}
              className={`border border-border rounded-lg overflow-hidden hover:shadow-elegant transition-smooth ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Product Image */}
              <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : 'aspect-square'}`}>
                <div className="w-full h-full overflow-hidden">
                  <Image
                    src={item?.image}
                    alt={item?.name}
                    className="w-full h-full object-cover hover:scale-105 transition-smooth"
                  />
                </div>
                
                {/* Discount Badge */}
                {item?.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-error text-error-foreground px-2 py-1 rounded-full text-xs font-medium">
                    -{item?.discount}%
                  </div>
                )}
                
                {/* Stock Status */}
                {!item?.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-error text-error-foreground px-3 py-1 rounded-full text-sm font-medium">
                      Hết hàng
                    </span>
                  </div>
                )}
                
                {/* Selection Checkbox */}
                <div className="absolute top-2 right-2">
                  <input
                    type="checkbox"
                    checked={selectedItems?.includes(item?.id)}
                    onChange={() => handleSelectItem(item?.id)}
                    className="w-4 h-4 text-accent focus:ring-accent rounded"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className={viewMode === 'list' ? 'flex justify-between items-start' : ''}>
                  <div className={viewMode === 'list' ? 'flex-1 pr-4' : ''}>
                    <h3 className="font-medium text-foreground mb-2 line-clamp-2">{item?.name}</h3>
                    
                    {/* Price */}
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-accent">{formatPrice(item?.price)}</span>
                      {item?.originalPrice > item?.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(item?.originalPrice)}
                        </span>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="text-xs text-muted-foreground mb-3 space-y-1">
                      <p>Kích thước: {item?.sizes?.join(', ')}</p>
                      <p>Màu sắc: {item?.colors?.join(', ')}</p>
                      <p>Thêm vào: {formatDate(item?.addedDate)}</p>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className={`flex ${viewMode === 'list' ? 'flex-col space-y-2' : 'space-x-2'}`}>
                    <Button
                      variant={item?.inStock ? "default" : "outline"}
                      size="sm"
                      iconName="ShoppingCart"
                      iconPosition="left"
                      onClick={() => handleAddToCart(item)}
                      disabled={!item?.inStock}
                      className={viewMode === 'grid' ? 'flex-1' : ''}
                    >
                      {item?.inStock ? 'Thêm vào giỏ' : 'Hết hàng'}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(item?.id)}
                      className="text-error hover:text-error hover:bg-error/10"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistSection;