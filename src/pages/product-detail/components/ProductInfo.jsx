import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductInfo = ({ product, onAddToCart, onAddToWishlist }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]);
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product?.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Vui lòng chọn kích thước');
      return;
    }
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity
    });
  };

  return (
    <div className="space-y-6">
      {/* Product Title and Rating */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold text-foreground mb-2">
          {product?.name}
        </h1>
        <div className="flex items-center space-x-4 mb-2">
          <div className="flex items-center space-x-1">
            {[...Array(5)]?.map((_, i) => (
              <Icon
                key={i}
                name="Star"
                size={16}
                className={i < Math.floor(product?.rating) ? 'text-accent fill-accent' : 'text-gray-300'}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-1">
              ({product?.rating}) • {product?.reviewCount} đánh giá
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">SKU: {product?.sku}</p>
      </div>
      {/* Price */}
      <div className="space-y-1">
        <div className="flex items-center space-x-3">
          <span className="text-2xl font-semibold text-foreground">
            {formatPrice(product?.salePrice)}
          </span>
          {product?.originalPrice > product?.salePrice && (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product?.originalPrice)}
            </span>
          )}
          {product?.originalPrice > product?.salePrice && (
            <span className="bg-error text-error-foreground px-2 py-1 rounded text-sm font-medium">
              -{Math.round(((product?.originalPrice - product?.salePrice) / product?.originalPrice) * 100)}%
            </span>
          )}
        </div>
        <p className="text-sm text-success">Miễn phí vận chuyển cho đơn hàng trên 500.000 VND</p>
      </div>
      {/* Color Selection */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">
          Màu sắc: <span className="font-normal">{selectedColor?.name}</span>
        </h3>
        <div className="flex space-x-2">
          {product?.colors?.map((color) => (
            <button
              key={color?.code}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full border-2 transition-smooth ${
                selectedColor?.code === color?.code
                  ? 'border-accent scale-110' :'border-border hover:border-accent'
              }`}
              style={{ backgroundColor: color?.code }}
              title={color?.name}
            />
          ))}
        </div>
      </div>
      {/* Size Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">Kích thước</h3>
          <button className="text-sm text-accent hover:underline">
            Hướng dẫn chọn size
          </button>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {product?.sizes?.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              disabled={!product?.sizeAvailability?.[size]}
              className={`py-2 px-3 border rounded-lg text-sm font-medium transition-smooth ${
                selectedSize === size
                  ? 'border-accent bg-accent text-accent-foreground'
                  : product?.sizeAvailability?.[size]
                  ? 'border-border hover:border-accent' :'border-border bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
      {/* Quantity */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">Số lượng</h3>
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-border rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={quantity <= 1}
              className="p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              <Icon name="Minus" size={16} />
            </button>
            <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={quantity >= product?.stock}
              className="p-2 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-smooth"
            >
              <Icon name="Plus" size={16} />
            </button>
          </div>
          <span className="text-sm text-muted-foreground">
            {product?.stock} sản phẩm có sẵn
          </span>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToCart}
          className="w-full"
          size="lg"
          iconName="ShoppingCart"
          iconPosition="left"
        >
          Thêm vào giỏ hàng
        </Button>
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onAddToWishlist}
            iconName="Heart"
            iconPosition="left"
          >
            Yêu thích
          </Button>
          <Button
            variant="outline"
            iconName="Share2"
            iconPosition="left"
          >
            Chia sẻ
          </Button>
        </div>
      </div>
      {/* Product Features */}
      <div className="border-t border-border pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center space-x-3">
            <Icon name="Truck" size={20} className="text-accent" />
            <div>
              <p className="text-sm font-medium">Giao hàng nhanh</p>
              <p className="text-xs text-muted-foreground">2-3 ngày làm việc</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="RotateCcw" size={20} className="text-accent" />
            <div>
              <p className="text-sm font-medium">Đổi trả dễ dàng</p>
              <p className="text-xs text-muted-foreground">30 ngày đổi trả</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="Shield" size={20} className="text-accent" />
            <div>
              <p className="text-sm font-medium">Bảo hành chất lượng</p>
              <p className="text-xs text-muted-foreground">6 tháng bảo hành</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Icon name="CreditCard" size={20} className="text-accent" />
            <div>
              <p className="text-sm font-medium">Thanh toán an toàn</p>
              <p className="text-xs text-muted-foreground">Nhiều phương thức</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;