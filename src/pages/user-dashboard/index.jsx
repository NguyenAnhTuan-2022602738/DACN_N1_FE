import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProfileSection from './components/ProfileSection';
import OrderHistory from './components/OrderHistory';
import WishlistSection from './components/WishlistSection';
import AddressBook from './components/AddressBook';
import AccountSettings from './components/AccountSettings';
import LoyaltyProgram from './components/LoyaltyProgram';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: 'User' },
    { id: 'orders', label: 'Đơn hàng của tôi', icon: 'Package' },
    { id: 'wishlist', label: 'Danh sách yêu thích', icon: 'Heart' },
    { id: 'addresses', label: 'Sổ địa chỉ', icon: 'MapPin' },
    { id: 'loyalty', label: 'Điểm thưởng', icon: 'Star' },
    { id: 'settings', label: 'Cài đặt tài khoản', icon: 'Settings' }
  ];

  const userStats = {
    totalOrders: 12,
    pendingOrders: 2,
    wishlistItems: 8,
    loyaltyPoints: 2450
  };

  const [currentUser, setCurrentUser] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
    } catch (e) { return null; }
  });

  React.useEffect(() => {
    // if we don't have a user in storage, try to fetch /me
    if (!currentUser) {
      (async () => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/auth/me`, { credentials: 'include' });
          const data = await res.json();
          if (data?.user) setCurrentUser(data.user);
        } catch (e) {}
      })();
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'orders':
        return <OrderHistory />;
      case 'wishlist':
        return <WishlistSection />;
      case 'addresses':
        return <AddressBook />;
      case 'loyalty':
        return <LoyaltyProgram />;
      case 'settings':
        return <AccountSettings />;
      default:
        return <ProfileSection />;
    }
  };

  const getActiveMenuItem = () => {
    return menuItems?.find(item => item?.id === activeTab);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-6 text-white mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl lg:text-3xl font-bold mb-2">Chào mừng trở lại!</h1>
                <p className="text-lg opacity-90">{currentUser?.name || currentUser?.email || 'Bạn'}</p>
                <p className="text-sm opacity-75">{currentUser?.createdAt ? `Thành viên từ ${new Date(currentUser.createdAt).toLocaleString('vi-VN', { month: 'long', year: 'numeric' })}` : ''}</p>
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{userStats?.totalOrders}</p>
                  <p className="text-xs opacity-75">Tổng đơn hàng</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{userStats?.pendingOrders}</p>
                  <p className="text-xs opacity-75">Đang xử lý</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{userStats?.wishlistItems}</p>
                  <p className="text-xs opacity-75">Yêu thích</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{userStats?.loyaltyPoints?.toLocaleString()}</p>
                  <p className="text-xs opacity-75">Điểm thưởng</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              {/* Mobile Menu Button */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="w-full justify-between"
                >
                  <span className="flex items-center space-x-2">
                    <Icon name={getActiveMenuItem()?.icon} size={16} />
                    <span>{getActiveMenuItem()?.label}</span>
                  </span>
                  <Icon name={isSidebarOpen ? "ChevronUp" : "ChevronDown"} size={16} />
                </Button>
              </div>

              {/* Sidebar Menu */}
              <div className={`bg-card rounded-lg border border-border overflow-hidden ${
                isSidebarOpen ? 'block' : 'hidden lg:block'
              }`}>
                <div className="p-4 border-b border-border">
                  <h2 className="font-semibold text-foreground">Tài khoản của tôi</h2>
                </div>
                
                <nav className="p-2">
                  {menuItems?.map((item) => (
                    <Button
                      key={item?.id}
                      variant={activeTab === item?.id ? 'default' : 'ghost'}
                      onClick={() => {
                        setActiveTab(item?.id);
                        setIsSidebarOpen(false);
                      }}
                      className="w-full justify-start mb-1"
                    >
                      <Icon name={item?.icon} size={16} className="mr-3" />
                      {item?.label}
                    </Button>
                  ))}
                </nav>
                
                {/* Quick Actions */}
                <div className="p-4 border-t border-border">
                  <h3 className="text-sm font-medium text-foreground mb-3">Hành động nhanh</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Icon name="MessageCircle" size={14} className="mr-2" />
                      Hỗ trợ khách hàng
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Icon name="RotateCcw" size={14} className="mr-2" />
                      Đổi trả hàng
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Icon name="Gift" size={14} className="mr-2" />
                      Mã giảm giá
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default UserDashboard;