import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CartItem = ({ item, onUpdateQuantity, onUpdateSizeColor, onRemove, onSaveForLater, onMoveToWishlist }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    onUpdateQuantity(item?.id, newQuantity);
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0) {
      onUpdateQuantity(item?.id, val);
    }
  };

  const handleInputBlur = (e) => {
    // Khi blur, nếu rỗng hoặc không hợp lệ thì đặt về 1
    if (e.target.value === '' || parseInt(e.target.value) < 1) {
      onUpdateQuantity(item?.id, 1);
    }
  };

  const handleSizeChange = (e) => {
    const newSize = e.target.value;
    onUpdateSizeColor(item?.id, newSize, item?.selectedColor || item?.color);
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    onUpdateSizeColor(item?.id, item?.selectedSize || item?.size, newColor);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card border border-border rounded-lg">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <Link to={`/product-detail?id=${item?.productId || item?.id}`}>
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted">
            <Image
              src={item?.image}
              alt={item?.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      </div>
      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div className="flex-1">
            <Link 
              to={`/product-detail?id=${item?.productId || item?.id}`}
              className="font-medium text-foreground hover:text-accent transition-colors line-clamp-2"
            >
              {item?.name}
            </Link>
            
            {/* Size and Color Selectors */}
            <div className="flex flex-wrap gap-3 mt-2">
              {/* Color - Always show if exists */}
              {(item?.selectedColor || item?.color) && (
                <div className="flex items-center gap-2">
                  {item?.availableColors && item?.availableColors?.length > 0 ? (
                    <>
                      <label className="text-sm text-muted-foreground">Màu:</label>
                      <select
                        value={item?.selectedColor || item?.color || ''}
                        onChange={handleColorChange}
                        className="px-2 py-1 text-sm border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        {item?.availableColors?.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Màu: {item?.selectedColor || item?.color}
                    </span>
                  )}
                </div>
              )}
              
              {/* Size - Always show if exists */}
              {(item?.selectedSize || item?.size) && (
                <div className="flex items-center gap-2">
                  {item?.availableSizes && item?.availableSizes?.length > 0 ? (
                    <>
                      <label className="text-sm text-muted-foreground">Size:</label>
                      <select
                        value={item?.selectedSize || item?.size || ''}
                        onChange={handleSizeChange}
                        className="px-2 py-1 text-sm border border-border rounded bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        {item?.availableSizes?.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Size: {item?.selectedSize || item?.size}
                    </span>
                  )}
                </div>
              )}
              
              {/* Brand */}
              {item?.brand && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>•</span>
                  <span>Thương hiệu: {item?.brand}</span>
                </div>
              )}
            </div>
            
            {item?.inStock ? (
              <span className="inline-flex items-center gap-1 text-sm text-success mt-1">
                <Icon name="Check" size={14} />
                Còn hàng
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm text-error mt-1">
                <Icon name="AlertCircle" size={14} />
                Hết hàng
              </span>
            )}
          </div>

          {/* Price */}
          <div className="text-right">
            <div className="font-semibold text-lg text-foreground">
              {formatPrice(item?.price)}
            </div>
            {item?.originalPrice && item?.originalPrice > item?.price && (
              <div className="text-sm text-muted-foreground line-through">
                {formatPrice(item?.originalPrice)}
              </div>
            )}
          </div>
        </div>

        {/* Quantity and Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Số lượng:</span>
            <div className="flex items-center border border-border rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(item?.quantity - 1)}
                disabled={item?.quantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Icon name="Minus" size={14} />
              </Button>
              <input
                type="number"
                value={item?.quantity}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className="w-16 px-2 py-1 text-sm font-medium text-center bg-transparent border-0 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded"
                min="1"
                placeholder="1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(item?.quantity + 1)}
                disabled={!item?.inStock}
                className="h-8 w-8 p-0"
              >
                <Icon name="Plus" size={14} />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onMoveToWishlist(item?.id)}
              className="text-muted-foreground hover:text-accent"
            >
              <Icon name="Heart" size={16} />
              <span className="hidden sm:inline ml-1">Yêu thích</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSaveForLater(item?.id)}
              className="text-muted-foreground hover:text-accent"
            >
              <Icon name="Bookmark" size={16} />
              <span className="hidden sm:inline ml-1">Lưu sau</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(item?.id)}
              className="text-muted-foreground hover:text-error"
            >
              <Icon name="Trash2" size={16} />
              <span className="hidden sm:inline ml-1">Xóa</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;