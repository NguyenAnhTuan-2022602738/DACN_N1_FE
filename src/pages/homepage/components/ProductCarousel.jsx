import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductCarousel = ({ title, subtitle, products, sectionId }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef(null);
  const itemsPerView = 4;

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, products?.length - itemsPerView);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, products?.length, itemsPerView]);

  const nextSlide = () => {
    const maxIndex = Math.max(0, products?.length - itemsPerView);
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxIndex = Math.max(0, products?.length - itemsPerView);
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {subtitle}
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={prevSlide}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className="w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-200"
            >
              <Icon name="ChevronLeft" size={20} />
            </button>
            <button
              onClick={nextSlide}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className="w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-200"
            >
              <Icon name="ChevronRight" size={20} />
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`
            }}
          >
            {products?.map((product) => (
              <div
                key={product?.id}
                className="w-1/4 flex-shrink-0 px-3"
              >
                <div className="bg-card rounded-2xl shadow-elegant hover:shadow-product transition-all duration-300 transform hover:-translate-y-1 group">
                  {/* Product Image */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
                    <Image
                      src={product?.image}
                      alt={product?.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product?.isNew && (
                        <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-medium">
                          Mới
                        </span>
                      )}
                      {product?.discount && (
                        <span className="bg-error text-error-foreground px-2 py-1 rounded-full text-xs font-medium">
                          -{product?.discount}%
                        </span>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button className="w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                        <Icon name="Heart" size={16} />
                      </button>
                      <button className="w-8 h-8 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors">
                        <Icon name="Eye" size={16} />
                      </button>
                    </div>

                    {/* Quick Add to Cart */}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <Button size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        <Icon name="ShoppingCart" size={16} className="mr-2" />
                        Thêm vào giỏ
                      </Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        {product?.category}
                      </span>
                    </div>
                    
                    <Link to="/product-detail" className="block">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 hover:text-accent transition-colors">
                        {product?.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)]?.map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={14}
                            className={i < Math.floor(product?.rating) ? 'text-accent fill-current' : 'text-muted-foreground'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product?.reviews})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-foreground">
                          {formatPrice(product?.price)}
                        </span>
                        {product?.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product?.originalPrice)}
                          </span>
                        )}
                      </div>
                      
                      {product?.colors && (
                        <div className="flex items-center gap-1">
                          {product?.colors?.slice(0, 3)?.map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border border-border"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                          {product?.colors?.length > 3 && (
                            <span className="text-xs text-muted-foreground ml-1">
                              +{product?.colors?.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-6">
          <button
            onClick={prevSlide}
            className="w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-200"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 bg-background border border-border rounded-full flex items-center justify-center hover:bg-accent hover:text-accent-foreground hover:border-accent transition-all duration-200"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link to="/product-catalog">
            <Button variant="outline" size="lg">
              Xem Tất Cả Sản Phẩm
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCarousel;