import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: "Về ABC Fashion",
      links: [
        { name: "Giới thiệu", href: "#" },
        { name: "Tuyển dụng", href: "#" },
        { name: "Tin tức", href: "#" },
        { name: "Liên hệ", href: "#" }
      ]
    },
    {
      title: "Hỗ trợ khách hàng",
      links: [
        { name: "Hướng dẫn mua hàng", href: "#" },
        { name: "Chính sách đổi trả", href: "#" },
        { name: "Chính sách bảo mật", href: "#" },
        { name: "Điều khoản sử dụng", href: "#" }
      ]
    },
    {
      title: "Danh mục sản phẩm",
      links: [
        { name: "Thời trang nữ", href: "/product-catalog" },
        { name: "Thời trang nam", href: "/product-catalog" },
        { name: "Phụ kiện", href: "/product-catalog" },
        { name: "Giày dép", href: "/product-catalog" }
      ]
    },
    {
      title: "Kết nối với chúng tôi",
      links: [
        { name: "Facebook", href: "#", icon: "Facebook" },
        { name: "Instagram", href: "#", icon: "Instagram" },
        { name: "YouTube", href: "#", icon: "Youtube" },
        { name: "TikTok", href: "#", icon: "Music" }
      ]
    }
  ];

  const paymentMethods = [
    { name: "Visa", icon: "CreditCard" },
    { name: "Mastercard", icon: "CreditCard" },
    { name: "Momo", icon: "Smartphone" },
    { name: "ZaloPay", icon: "Smartphone" },
    { name: "VNPay", icon: "Smartphone" },
    { name: "COD", icon: "Banknote" }
  ];

  const certifications = [
    { name: "Đã thông báo Bộ Công Thương", icon: "Shield" },
    { name: "Chứng nhận SSL", icon: "Lock" },
    { name: "Chứng nhận ISO", icon: "Award" }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link to="/homepage" className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-warning rounded-lg flex items-center justify-center">
                <Icon name="Sparkles" size={24} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="font-accent font-bold text-xl text-primary-foreground leading-none">
                  ABC Fashion
                </span>
                <span className="text-sm text-primary-foreground/80 leading-none">
                  Store
                </span>
              </div>
            </Link>
            
            <p className="text-primary-foreground/80 mb-6 leading-relaxed">
              Điểm đến thời trang hàng đầu Việt Nam với hơn 50,000 khách hàng tin tưởng. 
              Chúng tôi mang đến những sản phẩm chất lượng cao với giá cả hợp lý.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Icon name="MapPin" size={16} className="text-accent" />
                <span className="text-sm">123 Nguyễn Huệ, Q1, TP.HCM</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Phone" size={16} className="text-accent" />
                <span className="text-sm">1900 1234</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Mail" size={16} className="text-accent" />
                <span className="text-sm">support@abcfashion.vn</span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="Clock" size={16} className="text-accent" />
                <span className="text-sm">8:00 - 22:00 (Thứ 2 - CN)</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections?.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg mb-4 text-primary-foreground">
                {section?.title}
              </h3>
              <ul className="space-y-3">
                {section?.links?.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {section?.title === "Kết nối với chúng tôi" ? (
                      <a
                        href={link?.href}
                        className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-colors duration-200"
                      >
                        {link?.icon && <Icon name={link?.icon} size={16} />}
                        {link?.name}
                      </a>
                    ) : link?.href?.startsWith('/') ? (
                      <Link
                        to={link?.href}
                        className="text-primary-foreground/80 hover:text-accent transition-colors duration-200 block"
                      >
                        {link?.name}
                      </Link>
                    ) : (
                      <a
                        href={link?.href}
                        className="text-primary-foreground/80 hover:text-accent transition-colors duration-200 block"
                      >
                        {link?.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="max-w-md">
            <h3 className="font-semibold text-lg mb-4 text-primary-foreground">
              Đăng ký nhận tin khuyến mãi
            </h3>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-2 rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder-primary-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Footer */}
      <div className="border-t border-primary-foreground/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Payment Methods */}
          <div className="mb-6">
            <h4 className="font-medium mb-3 text-primary-foreground">Phương thức thanh toán</h4>
            <div className="flex flex-wrap items-center gap-4">
              {paymentMethods?.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-primary-foreground/10 px-3 py-2 rounded-lg"
                >
                  <Icon name={method?.icon} size={16} className="text-accent" />
                  <span className="text-sm text-primary-foreground/80">{method?.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-6">
            <h4 className="font-medium mb-3 text-primary-foreground">Chứng nhận</h4>
            <div className="flex flex-wrap items-center gap-4">
              {certifications?.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-primary-foreground/10 px-3 py-2 rounded-lg"
                >
                  <Icon name={cert?.icon} size={16} className="text-success" />
                  <span className="text-sm text-primary-foreground/80">{cert?.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-primary-foreground/20">
            <div className="text-sm text-primary-foreground/80 mb-4 md:mb-0">
              © {currentYear} ABC Fashion Store. Tất cả quyền được bảo lưu.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-primary-foreground/80">
              <a href="#" className="hover:text-accent transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                Sitemap
              </a>
            </div>
          </div>

          {/* Business Registration */}
          <div className="mt-4 pt-4 border-t border-primary-foreground/20 text-xs text-primary-foreground/60 text-center">
            <p>
              Công ty TNHH ABC Fashion Store - GPKD số 0123456789 do Sở KH&ĐT TP.HCM cấp ngày 01/01/2020
            </p>
            <p className="mt-1">
              Địa chỉ: 123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM - Điện thoại: 1900 1234
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;