import React, { Children } from 'react'
import {Navigate}from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute =  ({children}) =>{
    const {isLoggedIn} = useAuth();

  if (!isLoggedIn) {
    // Nếu chưa đăng nhập, chuyển hướng về trang /login
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, hiển thị component con
  return children;
};

export default ProtectedRoute;
