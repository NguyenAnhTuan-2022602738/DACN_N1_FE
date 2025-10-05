import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CartItem = ({ item, onUpdateQuantity, onRemove, onSaveForLater, onMoveToWishlist }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    onUpdateQuantity(item?.id, newQuantity);
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
        <Link to={`/product-detail?id=${item?.id}`}>
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
              to={`/product-detail?id=${item?.id}`}
              className="font-medium text-foreground hover:text-accent transition-colors line-clamp-2"
            >
              {item?.name}
            </Link>
            <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
              <span>Màu: {item?.color}</span>
              <span>•</span>
              <span>Size: {item?.size}</span>
              {item?.brand && (
                <>
                  <span>•</span>
                  <span>Thương hiệu: {item?.brand}</span>
                </>
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
              <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
                {item?.quantity}
              </span>
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