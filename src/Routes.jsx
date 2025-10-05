import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import ScrollToTop from 'components/ScrollToTop';
import ErrorBoundary from 'components/ErrorBoundary';
import NotFound from 'pages/NotFound';
import Checkout from 'pages/checkout';
import OrderConfirmation from 'pages/order-confirmation';
import Login from 'pages/auth/Login';
import Register from 'pages/auth/Register';
import ForgotPassword from 'pages/auth/ForgotPassword';
import ResetPassword from 'pages/auth/ResetPassword';
import UserOrders from 'pages/user-orders';
import ShoppingCart from './pages/shopping-cart';
import AdminPanel from './pages/admin-panel';
import ProductDetail from './pages/product-detail';
import ProductCatalog from './pages/product-catalog';
import UserDashboard from './pages/user-dashboard';
import Homepage from './pages/homepage';
import ProtectedRoute from './components/ProtectedRoute';

const Routes = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        <Route path='/' element={<Homepage />} />
        <Route path='/shopping-cart' element={<ShoppingCart />} />

        <Route path='/checkout' element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path='/order-confirmation/:orderId' element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
  <Route path='/forgot-password' element={<ForgotPassword />} />
  <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/user-orders' element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />

        <Route path='/admin-panel' element={<AdminPanel />} />
        <Route path='/product-detail' element={<ProductDetail />} />
        <Route path='/product-catalog' element={<ProductCatalog />} />
        <Route path='/user-dashboard' element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path='/homepage' element={<Homepage />} />
        <Route path='*' element={<NotFound />} />
      </RouterRoutes>
    </ErrorBoundary>
  );
};

export default Routes;
