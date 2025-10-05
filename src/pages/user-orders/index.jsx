
import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import { Link } from 'react-router-dom';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const o = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(o);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 max-w-4xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Lịch sử đơn hàng</h2>
        {orders.length === 0 ? (
          <div className="bg-card p-6 rounded border border-border">Bạn chưa có đơn hàng nào.</div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-card p-4 rounded border border-border flex justify-between items-center">
                <div>
                  <div className="font-medium">{o.id}</div>
                  <div className="text-sm text-muted-foreground">{o.name} • {new Date(o.date).toLocaleString()}</div>
                </div>
                <Link to={`/order-confirmation/${o.id}`} className="text-accent">Xem</Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserOrders;
