import React, { useState } from 'react';
import cart from '../../../lib/cart';
import { useToast } from '../../../components/ui/ToastProvider';
import Icon from '../../../components/AppIcon';

const ProductInfo = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const toast = useToast();

  const sizes = product?.sizes || [];
  const colors = product?.colors || [];

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    const hasSizes = sizes.length > 0;
    const hasColors = colors.length > 0;

    if (hasSizes && !selectedSize) {
      toast.push({
        title: 'Vui lòng chọn kích thước',
        message: 'Bạn cần chọn kích thước trước khi thêm vào giỏ hàng',
        type: 'warning'
      });
      return;
    }

    if (hasColors && !selectedColor) {
      toast.push({
        title: 'Vui lòng chọn màu sắc',
        message: 'Bạn cần chọn màu sắc trước khi thêm vào giỏ hàng',
        type: 'warning'
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      const imageUrl = product.images && product.images.length > 0 
        ? (product.images[0].image_url || product.images[0]) 
        : null;

      await cart.addItem({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: imageUrl,
        selectedSize: selectedSize || null,
        selectedColor: selectedColor || null,
        quantity
      });

      toast.push({
        title: 'Thêm vào giỏ hàng thành công!',
        message: `${product.name} đã được thêm vào giỏ hàng`,
        type: 'success'
      });
      
      setSelectedSize('');
      setSelectedColor('');
      setQuantity(1);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.push({
        title: 'Có lỗi xảy ra',
        message: 'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!',
        type: 'error'
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="space-y-8">
      {/* Product Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {product?.name}
            </h1>
            {product?.sku && (
              <p className="text-sm text-gray-500 mt-2">SKU: {product.sku}</p>
            )}
          </div>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Icon name="Heart" size={24} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
        
        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-red-600">
            {formatPrice(product?.price)}
          </span>
          {product?.original_price && product.original_price > product.price && (
            <>
              <span className="text-xl text-gray-400 line-through">
                {formatPrice(product.original_price)}
              </span>
              <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
                -{Math.round((1 - product.price / product.original_price) * 100)}%
              </span>
            </>
          )}
        </div>

        {/* Rating & Stock */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Icon name="Star" size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="font-medium">4.8</span>
            <span className="text-gray-500">(128 đánh giá)</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-1 text-green-600">
            <Icon name="Check" size={16} />
            <span>Còn hàng</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Product Options */}
      <div className="space-y-6">
        {/* Size Selection */}
        {sizes.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Kích thước</h3>
              {selectedSize && (
                <span className="text-sm text-gray-600">Đã chọn: <span className="font-medium">{selectedSize}</span></span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeChange(size)}
                  className={`min-w-[60px] px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all ${
                    selectedSize === size
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm scale-105'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {colors.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Màu sắc</h3>
              {selectedColor && (
                <span className="text-sm text-gray-600">Đã chọn: <span className="font-medium">{selectedColor}</span></span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => handleColorChange(color.name)}
                  className={`min-w-[80px] px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all ${
                    selectedColor === color.name
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm scale-105'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selection */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Số lượng</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="Minus" size={18} />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  if (val >= 1 && val <= 99) setQuantity(val);
                }}
                className="w-16 h-12 text-center text-lg font-semibold border-x-2 border-gray-200 focus:outline-none"
                min="1"
                max="99"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 99}
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon name="Plus" size={18} />
              </button>
            </div>
            <span className="text-sm text-gray-500">Tối đa 99 sản phẩm</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAddingToCart ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang thêm...</span>
            </>
          ) : (
            <>
              <Icon name="ShoppingCart" size={20} />
              <span>Thêm vào giỏ hàng</span>
            </>
          )}
        </button>
        
        <button className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2">
          <Icon name="CreditCard" size={20} />
          <span>Mua ngay</span>
        </button>
      </div>

      {/* Product Features */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Icon name="Truck" size={20} className="text-blue-600" />
          <span className="text-gray-700">Miễn phí vận chuyển cho đơn hàng trên 500.000đ</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Icon name="RotateCcw" size={20} className="text-blue-600" />
          <span className="text-gray-700">Đổi trả miễn phí trong 7 ngày</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Icon name="Shield" size={20} className="text-blue-600" />
          <span className="text-gray-700">Bảo hành chính hãng 12 tháng</span>
        </div>
      </div>

      {/* Product Description */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Mô tả sản phẩm</h3>
        <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
          {product?.description}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
