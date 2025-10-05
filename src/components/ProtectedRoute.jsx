import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  try {
    const user = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || 'null');
    const token = typeof window !== 'undefined' && localStorage.getItem('token');
    if (!user || !token) return <Navigate to="/login" replace />;
    return children;
  } catch (e) {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
