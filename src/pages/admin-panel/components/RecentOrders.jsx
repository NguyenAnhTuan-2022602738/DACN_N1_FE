import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentOrders = () => {
  const orders = [
    {
      id: "ORD-2024-001",
      customer: "Nguyễn Văn An",
      email: "an.nguyen@email.com",
      total: "2.450.000",
      status: "pending",
      date: "24/09/2024 14:30",
      items: 3
    },
    {
      id: "ORD-2024-002",
      customer: "Trần Thị Bình",
      email: "binh.tran@email.com",
      total: "1.890.000",
      status: "processing",
      date: "24/09/2024 13:15",
      items: 2
    },
    {
      id: "ORD-2024-003",
      customer: "Lê Minh Cường",
      email: "cuong.le@email.com",
      total: "3.200.000",
      status: "shipped",
      date: "24/09/2024 11:45",
      items: 5
    },
    {
      id: "ORD-2024-004",
      customer: "Phạm Thị Dung",
      email: "dung.pham@email.com",
      total: "1.650.000",
      status: "delivered",
      date: "24/09/2024 10:20",
      items: 2
    },
    {
      id: "ORD-2024-005",
      customer: "Hoàng Văn Em",
      email: "em.hoang@email.com",
      total: "2.100.000",
      status: "cancelled",
      date: "24/09/2024 09:30",
      items: 3
    }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      pending: { label: "Chờ xử lý", color: "bg-warning/10 text-warning", icon: "Clock" },
      processing: { label: "Đang xử lý", color: "bg-primary/10 text-primary", icon: "Package" },
      shipped: { label: "Đã gửi", color: "bg-accent/10 text-accent", icon: "Truck" },
      delivered: { label: "Đã giao", color: "bg-success/10 text-success", icon: "CheckCircle" },
      cancelled: { label: "Đã hủy", color: "bg-error/10 text-error", icon: "XCircle" }
    };
    return configs?.[status] || configs?.pending;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elegant">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Đơn hàng gần đây</h3>
          <Button variant="outline" size="sm" iconName="ExternalLink" iconPosition="right">
            Xem tất cả
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Đơn hàng</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Khách hàng</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tổng tiền</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Trạng thái</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Ngày đặt</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => {
              const statusConfig = getStatusConfig(order?.status);
              return (
                <tr key={order?.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground">{order?.id}</div>
                      <div className="text-sm text-muted-foreground">{order?.items} sản phẩm</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-foreground">{order?.customer}</div>
                      <div className="text-sm text-muted-foreground">{order?.email}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-foreground">{order?.total} VND</div>
                  </td>
                  <td className="p-4">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig?.color}`}>
                      <Icon name={statusConfig?.icon} size={12} className="mr-1" />
                      {statusConfig?.label}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-muted-foreground">{order?.date}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" iconName="Eye">
                        Xem
                      </Button>
                      <Button variant="ghost" size="sm" iconName="Edit">
                        Sửa
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;