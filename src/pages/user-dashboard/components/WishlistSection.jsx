import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const WishlistSection = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Áo khoác denim vintage",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop",
      price: 1250000,
      originalPrice: 1500000,
      discount: 17,
      inStock: true,
      sizes: ["S", "M", "L"],
      colors: ["Xanh denim", "Đen"],
      addedDate: "2024-09-20"
    },
    {
      id: 2,
      name: "Váy maxi hoa cúc",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop",
      price: 890000,
      originalPrice: 890000,
      discount: 0,
      inStock: true,
      sizes: ["XS", "S", "M"],
      colors: ["Hoa cúc trắng", "Hoa cúc vàng"],
      addedDate: "2024-09-18"
    },
    {
      id: 3,
      name: "Giày cao gót da thật",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&h=300&fit=crop",
      price: 2100000,
      originalPrice: 2100000,
      discount: 0,
      inStock: false,
      sizes: ["36", "37", "38", "39"],
      colors: ["Đen", "Nâu", "Nude"],
      addedDate: "2024-09-15"
    },
    {
      id: 4,
      name: "Túi xách tay cao cấp",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop",
      price: 3200000,
      originalPrice: 4000000,
      discount: 20,
      inStock: true,
      sizes: ["One Size"],
      colors: ["Đen", "Nâu", "Xám"],
      addedDate: "2024-09-12"
    }
  ]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid or list

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

  const handleRemoveItem = (itemId) => {
    setWishlistItems(prev => prev?.filter(item => item?.id !== itemId));
    setSelectedItems(prev => prev?.filter(id => id !== itemId));
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
    setWishlistItems(prev => prev?.filter(item => !selectedItems?.includes(item?.id)));
    setSelectedItems([]);
  };

  const handleAddToCart = (item) => {
    // Mock add to cart functionality
    console.log('Added to cart:', item);
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