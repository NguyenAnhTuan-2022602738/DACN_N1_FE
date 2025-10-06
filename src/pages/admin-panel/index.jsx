import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import StatsCard from './components/StatsCard';
import QuickActions from './components/QuickActions';
import RecentOrders from './components/RecentOrders';
import ActivityFeed from './components/ActivityFeed';
import SalesChart from './components/SalesChart';
import TopProduct from './components/TopProduct';
import UserManagement from './components/UserManagement';
import ProductsList from '../admin/ProductsList';
import ProductForm from '../admin/ProductForm';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser] = useState({
    name: "Nguyễn Văn Admin",
    role: "admin",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  });
  const navigate = useNavigate();

  const tabs = [
    { id: 'dashboard', label: 'Tổng quan', icon: 'BarChart3' },
    { id: 'orders', label: 'Đơn hàng', icon: 'Package' },
    { id: 'products', label: 'Sản phẩm', icon: 'ShoppingBag' },
    { id: 'users', label: 'Người dùng', icon: 'Users' },
    { id: 'analytics', label: 'Phân tích', icon: 'TrendingUp' },
    { id: 'settings', label: 'Cài đặt', icon: 'Settings' }
  ];

  const statsData = [
    {
      title: "Tổng doanh thu",
      value: "156.8M VND",
      change: "+12.5%",
      changeType: "increase",
      icon: "DollarSign",
      color: "success"
    },
    {
      title: "Đơn hàng mới",
      value: "2,847",
      change: "+8.2%",
      changeType: "increase",
      icon: "ShoppingCart",
      color: "primary"
    },
    {
      title: "Khách hàng",
      value: "12,459",
      change: "+15.3%",
      changeType: "increase",
      icon: "Users",
      color: "accent"
    },
    {
      title: "Tồn kho",
      value: "8,234",
      change: "-2.1%",
      changeType: "decrease",
      icon: "Package",
      color: "warning"
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsData?.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>
            {/* Quick Actions & Activity Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <QuickActions />
              </div>
              <div>
                <ActivityFeed />
              </div>
            </div>
            {/* Sales Chart */}
            <SalesChart />
            {/* Recent Orders & Top Products */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <RecentOrders />
              </div>
              <div>
                <TopProduct />
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            <RecentOrders />
          </div>
        );

      case 'products':
        return (
          <div className="space-y-6">
            <ProductsList />
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <UserManagement />
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            <SalesChart />
          </div>
        );

      case 'settings':
        return (
          <div className="bg-card border border-border rounded-lg p-8 shadow-elegant text-center">
            <Icon name="Settings" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Cài đặt hệ thống</h3>
            <p className="text-muted-foreground">Tính năng cài đặt đang được phát triển</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Bảng điều khiển quản trị</h1>
                <p className="text-muted-foreground mt-1">
                  Chào mừng trở lại, {currentUser?.name}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" iconName="Download" iconPosition="left">
                  Xuất báo cáo
                </Button>
                <Button variant="default" iconName="Plus" iconPosition="left" onClick={() => navigate('/admin/products/new')}>
                  Thêm mới
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8 overflow-x-auto">
                {tabs?.map((tab) => (
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-smooth ${
                      activeTab === tab?.id
                        ? 'border-accent text-accent' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon name={tab?.icon} size={16} />
                    <span>{tab?.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {renderTabContent()}
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Icon name="Sparkles" size={20} color="white" />
              </div>
              <div>
                <div className="font-accent font-semibold text-lg text-primary">ABC Fashion</div>
                <div className="text-xs text-muted-foreground">Admin Panel</div>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-muted-foreground">
                © {new Date()?.getFullYear()} ABC Fashion Store. Tất cả quyền được bảo lưu.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminPanel;