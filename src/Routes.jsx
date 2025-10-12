import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import ScrollToTop from 'components/ScrollToTop';
import ErrorBoundary from 'components/ErrorBoundary';
import NotFound from 'pages/NotFound';
import Checkout from 'pages/checkout';
import { Navigate, useLocation } from 'react-router-dom';
import OrderConfirmation from 'pages/order-confirmation';
import Login from 'pages/auth/Login';
import Register from 'pages/auth/Register';
import ForgotPassword from 'pages/auth/ForgotPassword';
import ResetPassword from 'pages/auth/ResetPassword';
import UserOrders from 'pages/user-orders';
import ShoppingCart from './pages/shopping-cart';
import AdminPanel from './pages/admin-panel';
import AdminLayout from './pages/admin-panel/AdminLayout';
import ProductsList from './pages/admin/ProductsList';
import ProductForm from './pages/admin/ProductForm';
import CategoryList from './pages/admin/CategoryList';
import CategoryForm from './pages/admin/CategoryForm';
import ProductDetail from './pages/product-detail';
import ProductCatalog from './pages/product-catalog';
import UserDashboard from './pages/user-dashboard';
import Homepage from './pages/homepage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Forbidden from './pages/Forbidden';
import DebugAuth from './pages/DebugAuth';

const Routes = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        <Route path='/' element={<Homepage />} />
        <Route path='/shopping-cart' element={<ShoppingCart />} />

  {/* Checkout entry point: redirect to dashboard checkout tab when authenticated */}
  <Route path='/checkout' element={<ProtectedRoute><Navigate to="/user-dashboard?tab=checkout" replace /></ProtectedRoute>} />
        <Route path='/order-confirmation/:orderId' element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />

        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
  <Route path='/forgot-password' element={<ForgotPassword />} />
  <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/user-orders' element={<ProtectedRoute><UserOrders /></ProtectedRoute>} />

  {/* Admin routes - Only accessible by staff, manager, and admin roles */}
  <Route path='/admin-panel' element={<AdminRoute><AdminPanel /></AdminRoute>} />
  {/* Product and Category forms wrapped in AdminLayout */}
  <Route path='/admin-panel/products/new' element={<AdminRoute><AdminLayout activeTab="products"><ProductForm /></AdminLayout></AdminRoute>} />
  <Route path='/admin-panel/products/:id' element={<AdminRoute><AdminLayout activeTab="products"><ProductForm /></AdminLayout></AdminRoute>} />
  <Route path='/admin-panel/categories/new' element={<AdminRoute><AdminLayout activeTab="categories"><CategoryForm /></AdminLayout></AdminRoute>} />
  <Route path='/admin-panel/categories/:id' element={<AdminRoute><AdminLayout activeTab="categories"><CategoryForm /></AdminLayout></AdminRoute>} />
  
  {/* 403 Forbidden page */}
  <Route path='/forbidden' element={<Forbidden />} />
  
  {/* Debug Auth page - Development only */}
  <Route path='/debug-auth' element={<DebugAuth />} />
  
        <Route path='/product-detail' element={<ProductDetail />} />
        <Route path='/product-catalog' element={<ProductCatalog />} />
  <Route path='/user-dashboard/*' element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path='/homepage' element={<Homepage />} />
        <Route path='*' element={<NotFound />} />
      </RouterRoutes>
    </ErrorBoundary>
  );
};

export default Routes;
