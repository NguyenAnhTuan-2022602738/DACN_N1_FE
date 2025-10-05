import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      type: "order",
      title: "Đơn hàng mới",
      description: "Nguyễn Văn An đã đặt đơn hàng ORD-2024-001",
      time: "2 phút trước",
      icon: "ShoppingBag",
      color: "text-success"
    },
    {
      id: 2,
      type: "product",
      title: "Sản phẩm được cập nhật",
      description: "Áo thun nam basic đã được cập nhật giá",
      time: "15 phút trước",
      icon: "Package",
      color: "text-primary"
    },
    {
      id: 3,
      type: "user",
      title: "Khách hàng mới",
      description: "Trần Thị Bình đã đăng ký tài khoản",
      time: "30 phút trước",
      icon: "UserPlus",
      color: "text-accent"
    },
    {
      id: 4,
      type: "inventory",
      title: "Cảnh báo tồn kho",
      description: "Quần jeans nữ skinny sắp hết hàng",
      time: "1 giờ trước",
      icon: "AlertTriangle",
      color: "text-warning"
    },
    {
      id: 5,
      type: "review",
      title: "Đánh giá mới",
      description: "Lê Minh Cường đã đánh giá 5 sao cho sản phẩm",
      time: "2 giờ trước",
      icon: "Star",
      color: "text-accent"
    },
    {
      id: 6,
      type: "promotion",
      title: "Khuyến mãi kết thúc",
      description: "Chương trình giảm giá mùa hè đã kết thúc",
      time: "3 giờ trước",
      icon: "Tag",
      color: "text-error"
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-elegant">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Hoạt động gần đây</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div key={activity?.id} className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${activity?.color}`}>
                <Icon name={activity?.icon} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{activity?.title}</p>
                  <span className="text-xs text-muted-foreground">{activity?.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{activity?.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <button className="w-full text-sm text-accent hover:text-accent/80 font-medium transition-smooth">
            Xem tất cả hoạt động
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;