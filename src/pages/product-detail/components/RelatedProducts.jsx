import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RelatedProducts = ({ products, title = "Sản phẩm liên quan" }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <Link
          to="/product-catalog"
          className="text-accent hover:underline text-sm font-medium"
        >
          Xem tất cả
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products?.map((product) => (
          <div key={product?.id} className="group">
            <div className="relative bg-muted rounded-lg overflow-hidden aspect-square mb-3">
              <Link to={`/product-detail?id=${product?.id}`}>
                <Image
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                />
              </Link>
              
              {/* Quick Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth">
                <div className="flex flex-col space-y-1">
                  <button className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-elegant transition-smooth">
                    <Icon name="Heart" size={14} />
                  </button>
                  <button className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-elegant transition-smooth">
                    <Icon name="Eye" size={14} />
                  </button>
                </div>
              </div>

              {/* Sale Badge */}
              {product?.originalPrice > product?.salePrice && (
                <div className="absolute top-2 left-2">
                  <span className="bg-error text-error-foreground px-2 py-1 rounded text-xs font-medium">
                    -{Math.round(((product?.originalPrice - product?.salePrice) / product?.originalPrice) * 100)}%
                  </span>
                </div>
              )}

              {/* Stock Status */}
              {product?.stock === 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-white text-foreground px-3 py-1 rounded text-sm font-medium">
                    Hết hàng
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Link
                to={`/product-detail?id=${product?.id}`}
                className="block"
              >
                <h3 className="text-sm font-medium text-foreground line-clamp-2 hover:text-accent transition-smooth">
                  {product?.name}
                </h3>
              </Link>

              <div className="flex items-center space-x-1">
                {[...Array(5)]?.map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={12}
                    className={i < Math.floor(product?.rating) ? 'text-accent fill-accent' : 'text-gray-300'}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  ({product?.reviewCount})
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-foreground">
                    {formatPrice(product?.salePrice)}
                  </span>
                  {product?.originalPrice > product?.salePrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(product?.originalPrice)}
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Add to Cart */}
              <Button
                size="sm"
                variant="outline"
                className="w-full opacity-0 group-hover:opacity-100 transition-smooth"
                iconName="ShoppingCart"
                iconPosition="left"
                disabled={product?.stock === 0}
              >
                {product?.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;