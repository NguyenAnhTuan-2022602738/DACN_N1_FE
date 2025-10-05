import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();

  const primaryNavItems = [
    { name: 'Trang chủ', path: '/homepage', icon: 'Home' },
    { name: 'Sản phẩm', path: '/product-catalog', icon: 'ShoppingBag' },
    { name: 'Giỏ hàng', path: '/shopping-cart', icon: 'ShoppingCart' },
    { name: 'Thanh toán', path: '/checkout', icon: 'CreditCard' },
    { name: 'Tài khoản', path: '/user-dashboard', icon: 'User' },
  ];

  const secondaryNavItems = [
    { name: 'Quản trị', path: '/admin-panel', icon: 'Settings' },
  ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMoreMenu = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/homepage" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Icon name="Sparkles" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="font-accent font-semibold text-lg text-primary leading-none">
                ABC Fashion
              </span>
              <span className="text-xs text-muted-foreground leading-none">
                Store
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {primaryNavItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth hover:bg-muted ${
                  isActivePath(item?.path)
                    ? 'bg-accent/10 text-accent' :'text-foreground hover:text-accent'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.name}</span>
              </Link>
            ))}

            {/* More Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMoreMenu}
                className="flex items-center space-x-1"
              >
                <Icon name="MoreHorizontal" size={16} />
                <span>Thêm</span>
              </Button>

              {isMoreMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-elegant py-1 animate-fade-in">
                  {secondaryNavItems?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      onClick={() => setIsMoreMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted transition-smooth ${
                        isActivePath(item?.path)
                          ? 'text-accent bg-accent/10' :'text-foreground'
                      }`}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Search and Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-64 pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
              />
              <Icon
                name="Search"
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
            </div>

            <Button variant="ghost" size="sm" className="relative">
              <Icon name="Heart" size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Button>

            <Button variant="ghost" size="sm" className="relative">
              <Icon name="ShoppingCart" size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            {(() => {
              try {
                const user = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || 'null');
                if (!user) {
                  return (
                    <>
                      <Link to="/login" className="text-sm text-foreground hover:text-accent">Đăng nhập</Link>
                      <Link to="/register" className="text-sm text-accent">Đăng ký</Link>
                    </>
                  );
                }

                return (
                  <div className="flex items-center space-x-3">
                    <Link to="/user-dashboard" className="text-sm text-foreground hover:text-accent">{user.email}</Link>
                    <button
                      onClick={async () => {
                        try {
                          // attempt server logout to clear cookie
                          await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
                        } catch (e) {
                          // ignore
                        }
                        // preserve rememberedEmail if present, remove auth tokens
                        const remembered = localStorage.getItem('rememberedEmail');
                        try { localStorage.removeItem('user'); localStorage.removeItem('token'); } catch (e) {}
                        if (remembered) try { localStorage.setItem('rememberedEmail', remembered); } catch (e) {}
                        window.location.reload();
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Đăng xuất
                    </button>
                  </div>
                );
              } catch (e) {
                return null;
              }
            })()}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="md:hidden"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border animate-slide-up">
            <div className="px-4 py-3 space-y-1">
              {/* Mobile Search */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <Icon
                  name="Search"
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
              </div>

              {/* Mobile Navigation */}
              {primaryNavItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-smooth ${
                    isActivePath(item?.path)
                      ? 'bg-accent/10 text-accent' :'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.name}</span>
                </Link>
              ))}

              {/* Mobile Secondary Navigation */}
              <div className="border-t border-border pt-3 mt-3">
                {secondaryNavItems?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-smooth ${
                      isActivePath(item?.path)
                        ? 'bg-accent/10 text-accent' :'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item?.icon} size={18} />
                    <span>{item?.name}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center justify-center space-x-4 pt-3 border-t border-border mt-3">
                <Button variant="ghost" size="sm" className="relative">
                  <Icon name="Heart" size={20} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                    2
                  </span>
                </Button>

                <Button variant="ghost" size="sm" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
      {/* Overlay for more menu */}
      {isMoreMenuOpen && (
        <div
          className="fixed inset-0 z-40 hidden md:block"
          onClick={() => setIsMoreMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;