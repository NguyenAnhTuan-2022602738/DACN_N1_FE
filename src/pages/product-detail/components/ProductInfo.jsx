import React, { useState, useEffect } from 'react';
import cart from '../../../lib/cart';
import API from '../../../lib/api';
import { useToast } from '../../../components/ui/ToastProvider';
import { useWishlist } from '../../../contexts/WishlistContext';
import Icon from '../../../components/AppIcon';

const ProductInfo = ({ product, onAddToWishlist }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const toast = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Check if product is in wishlist
  const isWishlisted = isInWishlist(product?._id || product?.id);

  const sizes = product?.sizes || [];
  const colors = product?.colors || [];

  // Auto-select first size and color when product loads
  useEffect(() => {
    if (sizes.length > 0 && !selectedSize) {
      setSelectedSize(sizes[0]);
    }
    if (colors.length > 0 && !selectedColor) {
      // normalize to color name string if item is an object
      const firstColor = colors[0];
      setSelectedColor(typeof firstColor === 'string' ? firstColor : (firstColor?.name || firstColor?.value || ''));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

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
        // ensure we pass color as a string (name/value) for key matching
        selectedColor: (typeof selectedColor === 'string' ? selectedColor : (selectedColor?.name || selectedColor?.value)) || null,
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

  const handleWishlistToggle = async () => {
    const finalProductId = product?._id || product?.id;

    try {
      // Use wishlist context - pass complete snapshot with size, color, stock
      const wasAdded = await toggleWishlist(finalProductId, {
        name: product?.name,
        brand: product?.brand,
        image: product?.images?.[0]?.image_url || product?.images?.[0] || product?.image,
        price: product?.price,
        originalPrice: product?.originalPrice,
        category: product?.category,
        // Add selected size and color
        size: selectedSize || null,
        color: selectedColor || null,
        // Add stock info
        stock_quantity: product?.stock_quantity || 0,
        status: product?.status || 'active'
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
      
      // DO NOT call parent callback to avoid duplicate toast
      // if (onAddToWishlist) {
      //   onAddToWishlist();
      // }
    } catch (error) {
      console.error('[ProductInfo Wishlist Error]', error.response?.data || error.message);
      toast.push({
        title: 'Lỗi!',
        message: error.response?.data?.message || 'Không thể cập nhật danh sách yêu thích',
        type: 'error'
      });
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
          <button 
            onClick={handleWishlistToggle}
            className={`p-3 rounded-full transition-all duration-200 ${
              isWishlisted 
                ? 'bg-red-50 hover:bg-red-100' 
                : 'hover:bg-gray-100'
            }`}
          >
            <Icon 
              name="Heart" 
              size={24} 
              className={`transition-colors ${
                isWishlisted 
                  ? 'text-red-500 fill-current' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            />
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
                  key={(typeof color === 'string' ? color : color.name)}
                  onClick={() => handleColorChange(typeof color === 'string' ? color : color.name)}
                  className={`min-w-[80px] px-4 py-3 border-2 rounded-lg text-sm font-medium transition-all ${
                    selectedColor === (typeof color === 'string' ? color : color.name)
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm scale-105'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {typeof color === 'string' ? color : color.name}
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
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0) {
                    setQuantity(val);
                  } else if (e.target.value === '') {
                    // Cho phép xóa để nhập lại
                    setQuantity('');
                  }
                }}
                onBlur={(e) => {
                  // Khi blur, nếu rỗng hoặc không hợp lệ thì đặt về 1
                  if (e.target.value === '' || parseInt(e.target.value) < 1) {
                    setQuantity(1);
                  }
                }}
                className="w-20 h-12 text-center text-lg font-semibold border-x-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                placeholder="1"
              />
              <button
                onClick={() => handleQuantityChange(1)}
                className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Icon name="Plus" size={18} />
              </button>
            </div>
            <span className="text-sm text-gray-500">Nhập số lượng mong muốn</span>
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
