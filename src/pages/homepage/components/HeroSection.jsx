import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      title: "Bộ Sưu Tập Thu Đông 2024",
      subtitle: "Khám phá phong cách thời trang mới nhất",
      description: "Từ áo khoác ấm áp đến váy dạ tiệc sang trọng, tìm kiếm trang phục hoàn hảo cho mùa thu đông này.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Khám Phá Ngay",
      discount: "Giảm 30%"
    },
    {
      id: 2,
      title: "Thời Trang Công Sở Hiện Đại",
      subtitle: "Tự tin trong mọi cuộc họp",
      description: "Bộ sưu tập áo sơ mi, blazer và quần tây chuyên nghiệp dành cho phụ nữ hiện đại.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80",
      cta: "Mua Sắm Ngay",
      discount: "Miễn Phí Ship"
    },
    {
      id: 3,
      title: "Phong Cách Casual Trendy",
      subtitle: "Thoải mái mà vẫn thời trang",
      description: "Áo thun, quần jeans và sneakers cho những ngày cuối tuần thoải mái.",
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      cta: "Xem Thêm",
      discount: "Mua 2 Tặng 1"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides?.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [heroSlides?.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides?.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides?.length) % heroSlides?.length);
  };

  return (
    <section className="relative h-[600px] lg:h-[700px] overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
      {/* Hero Slides */}
      <div className="relative h-full">
        {heroSlides?.map((slide, index) => (
          <div
            key={slide?.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/30 z-10" />
            <Image
              src={slide?.image}
              alt={slide?.title}
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-4">
                    <Icon name="Sparkles" size={16} className="mr-2" />
                    {slide?.discount}
                  </div>
                  
                  <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    {slide?.title}
                  </h1>
                  
                  <p className="text-xl lg:text-2xl text-white/90 mb-2 font-medium">
                    {slide?.subtitle}
                  </p>
                  
                  <p className="text-lg text-white/80 mb-8 leading-relaxed">
                    {slide?.description}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/product-catalog">
                      <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        {slide?.cta}
                        <Icon name="ArrowRight" size={20} className="ml-2" />
                      </Button>
                    </Link>
                    
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                      Xem Video
                      <Icon name="Play" size={20} className="ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200"
      >
        <Icon name="ChevronLeft" size={24} color="white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200"
      >
        <Icon name="ChevronRight" size={24} color="white" />
      </button>
      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {heroSlides?.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
      {/* Trust Signals */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Shield" size={16} />
              <span>Thanh toán bảo mật</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Truck" size={16} />
              <span>Giao hàng miễn phí</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="RotateCcw" size={16} />
              <span>Đổi trả 30 ngày</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Headphones" size={16} />
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;