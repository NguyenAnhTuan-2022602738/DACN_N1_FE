import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductCard = ({ product, onWishlistToggle, onQuickView, onAddToCart }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleWishlistClick = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    onWishlistToggle(product?.id);
  };

  const handleQuickView = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    onQuickView(product);
  };

  const handleAddToCart = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    onAddToCart(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  const calculateDiscount = () => {
    if (product?.originalPrice && product?.price < product?.originalPrice) {
      return Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100);
    }
    return 0;
  };

  const discount = calculateDiscount();

  return (
    <div 
      className="group relative bg-card rounded-lg overflow-hidden shadow-elegant hover:shadow-product transition-smooth"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link to={`/product-detail?id=${product?.id}`} className="block relative">
        <div className="aspect-[3/4] overflow-hidden bg-muted">
          <Image
            src={product?.images?.[currentImageIndex]}
            alt={product?.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
          
          {/* Image Navigation Dots */}
          {product?.images?.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {product?.images?.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e?.preventDefault();
                    e?.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-smooth ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product?.isNew && (
              <span className="px-2 py-1 bg-success text-success-foreground text-xs font-medium rounded">
                Mới
              </span>
            )}
            {discount > 0 && (
              <span className="px-2 py-1 bg-error text-error-foreground text-xs font-medium rounded">
                -{discount}%
              </span>
            )}
            {product?.isBestseller && (
              <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded">
                Bán chạy
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className={`absolute top-2 right-2 flex flex-col space-y-2 transition-smooth ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
          }`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWishlistClick}
              className={`w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm ${
                product?.isWishlisted ? 'text-error' : 'text-foreground'
              }`}
            >
              <Icon 
                name={product?.isWishlisted ? "Heart" : "Heart"} 
                size={16}
                className={product?.isWishlisted ? 'fill-current' : ''}
              />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuickView}
              className="w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm text-foreground"
            >
              <Icon name="Eye" size={16} />
            </Button>
          </div>

          {/* Quick Add to Cart */}
          <div className={`absolute bottom-2 left-2 right-2 transition-smooth ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <Button
              variant="default"
              size="sm"
              onClick={handleAddToCart}
              className="w-full"
              iconName="ShoppingCart"
              iconPosition="left"
            >
              Thêm vào giỏ
            </Button>
          </div>
        </div>
      </Link>
      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product-detail?id=${product?.id}`}>
          {/* Brand */}
          <p className="text-sm text-muted-foreground mb-1">{product?.brand}</p>
          
          {/* Product Name */}
          <h3 className="font-medium text-foreground mb-2 line-clamp-2 group-hover:text-accent transition-smooth">
            {product?.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)]?.map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={12}
                  className={`${
                    i < Math.floor(product?.rating)
                      ? 'text-accent fill-current' :'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product?.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-foreground">
              {formatPrice(product?.price)}
            </span>
            {product?.originalPrice && product?.originalPrice > product?.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product?.originalPrice)}
              </span>
            )}
          </div>

          {/* Available Sizes */}
          {product?.availableSizes && product?.availableSizes?.length > 0 && (
            <div className="flex items-center space-x-1 mt-2">
              <span className="text-xs text-muted-foreground">Sizes:</span>
              <div className="flex space-x-1">
                {product?.availableSizes?.slice(0, 4)?.map(size => (
                  <span key={size} className="text-xs px-1 py-0.5 bg-muted rounded">
                    {size}
                  </span>
                ))}
                {product?.availableSizes?.length > 4 && (
                  <span className="text-xs text-muted-foreground">
                    +{product?.availableSizes?.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Available Colors */}
          {product?.availableColors && product?.availableColors?.length > 0 && (
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-muted-foreground">Màu:</span>
              <div className="flex space-x-1">
                {product?.availableColors?.slice(0, 4)?.map(color => (
                  <div
                    key={color?.value}
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: color?.color }}
                    title={color?.name}
                  />
                ))}
                {product?.availableColors?.length > 4 && (
                  <span className="text-xs text-muted-foreground">
                    +{product?.availableColors?.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;