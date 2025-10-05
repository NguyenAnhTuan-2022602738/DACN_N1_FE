
import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import { useNavigate } from 'react-router-dom';

const Checkout = ({}) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const order = {
      id: 'ORD-' + Date.now(),
      name,
      address,
      phone,
      date: new Date().toISOString(),
    };
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    navigate(`/order-confirmation/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Thanh toán</h2>
        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Họ và tên" className="w-full p-3 border rounded" required />
          <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Địa chỉ giao hàng" className="w-full p-3 border rounded" required />
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Số điện thoại" className="w-full p-3 border rounded" required />
          <div className="flex justify-end">
            <button className="px-4 py-2 bg-accent text-white rounded">Đặt hàng</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
