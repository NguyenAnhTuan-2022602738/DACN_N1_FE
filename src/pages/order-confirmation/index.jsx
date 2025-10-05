
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/ui/Header';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const found = orders.find(o => o.id === orderId);
    setOrder(found);
  }, [orderId]);

  if (!order) return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 max-w-3xl mx-auto px-4">
        <p>Đơn hàng không tìm thấy.</p>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Xác nhận đơn hàng</h2>
        <div className="bg-card p-6 rounded border border-border">
          <p><strong>Mã đơn:</strong> {order.id}</p>
          <p><strong>Tên:</strong> {order.name}</p>
          <p><strong>Địa chỉ:</strong> {order.address}</p>
          <p><strong>SĐT:</strong> {order.phone}</p>
          <p className="text-sm text-muted-foreground mt-2">Ngày: {new Date(order.date).toLocaleString()}</p>
        </div>

        <div className="mt-6">
          <Link to="/user-orders" className="text-accent">Xem lịch sử đơn hàng</Link>
        </div>
      </main>
    </div>
  );
};

export default OrderConfirmation;
