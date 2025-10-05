import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const OrderHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const orders = [
    {
      id: "DH001234",
      date: "2024-09-20",
      status: "delivered",
      total: 2850000,
      items: [
        {
          id: 1,
          name: "Áo sơ mi trắng công sở",
          image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=80&h=80&fit=crop",
          size: "M",
          color: "Trắng",
          quantity: 1,
          price: 850000
        },
        {
          id: 2,
          name: "Quần âu đen thanh lịch",
          image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=80&h=80&fit=crop",
          size: "L",
          color: "Đen",
          quantity: 1,
          price: 1200000
        }
      ],
      trackingNumber: "VN123456789"
    },
    {
      id: "DH001235",
      date: "2024-09-18",
      status: "shipping",
      total: 1650000,
      items: [
        {
          id: 3,
          name: "Váy midi hoa nhí",
          image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=80&h=80&fit=crop",
          size: "S",
          color: "Hoa nhí",
          quantity: 1,
          price: 950000
        }
      ],
      trackingNumber: "VN123456790"
    },
    {
      id: "DH001236",
      date: "2024-09-15",
      status: "processing",
      total: 3200000,
      items: [
        {
          id: 4,
          name: "Blazer nữ cao cấp",
          image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=80&h=80&fit=crop",
          size: "M",
          color: "Xám",
          quantity: 1,
          price: 1800000
        }
      ],
      trackingNumber: "VN123456791"
    }
  ];

  const statusConfig = {
    processing: { label: 'Đang xử lý', color: 'bg-warning/10 text-warning', icon: 'Clock' },
    shipping: { label: 'Đang giao', color: 'bg-accent/10 text-accent', icon: 'Truck' },
    delivered: { label: 'Đã giao', color: 'bg-success/10 text-success', icon: 'CheckCircle' },
    cancelled: { label: 'Đã hủy', color: 'bg-error/10 text-error', icon: 'XCircle' }
  };

  const filterOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  const filteredOrders = selectedFilter === 'all' 
    ? orders 
    : orders?.filter(order => order?.status === selectedFilter);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    })?.format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 sm:mb-0">Lịch sử đơn hàng</h2>
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterOptions?.map((option) => (
            <Button
              key={option?.value}
              variant={selectedFilter === option?.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(option?.value)}
            >
              {option?.label}
            </Button>
          ))}
        </div>
      </div>
      {filteredOrders?.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Không có đơn hàng nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders?.map((order) => (
            <div key={order?.id} className="border border-border rounded-lg p-4 hover:shadow-elegant transition-smooth">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                  <div>
                    <h3 className="font-medium text-foreground">Đơn hàng #{order?.id}</h3>
                    <p className="text-sm text-muted-foreground">Ngày đặt: {formatDate(order?.date)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig?.[order?.status]?.color}`}>
                    <Icon name={statusConfig?.[order?.status]?.icon} size={12} className="mr-1" />
                    {statusConfig?.[order?.status]?.label}
                  </span>
                  <span className="font-semibold text-foreground">{formatPrice(order?.total)}</span>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order?.items?.map((item) => (
                  <div key={item?.id} className="flex items-center space-x-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0">
                      <Image
                        src={item?.image}
                        alt={item?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{item?.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Size: {item?.size} • Màu: {item?.color} • SL: {item?.quantity}
                      </p>
                      <p className="text-sm font-medium text-accent">{formatPrice(item?.price)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Eye"
                  iconPosition="left"
                  className="flex-1 sm:flex-none"
                >
                  Xem chi tiết
                </Button>
                
                {order?.status === 'delivered' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="RotateCcw"
                      iconPosition="left"
                      className="flex-1 sm:flex-none"
                    >
                      Mua lại
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Star"
                      iconPosition="left"
                      className="flex-1 sm:flex-none"
                    >
                      Đánh giá
                    </Button>
                  </>
                )}
                
                {(order?.status === 'shipping' || order?.status === 'processing') && (
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="MapPin"
                    iconPosition="left"
                    className="flex-1 sm:flex-none"
                  >
                    Theo dõi
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;