import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // State sẽ lưu cả user object và token
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  // useEffect để khôi phục trạng thái từ localStorage
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Kiểm tra token hết hạn
        if (decoded.exp * 1000 < Date.now()) {
          logout(); // Gọi hàm logout để dọn dẹp
        } else {
          // Lấy thông tin user đầy đủ từ localStorage
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }
      } catch (error) {
        console.error("Token không hợp lệ, đang đăng xuất...", error);
        logout();
      }
    }
  }, [token]);

  const login = (userData, userToken) => {
    localStorage.setItem('user', JSON.stringify(userData)); // Lưu user object
    localStorage.setItem('token', userToken);
    setUser(userData);
    setToken(userToken);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    isLoggedIn: !!user, // true nếu user khác null
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để tiện sử dụng
export const useAuth = () => {
  return useContext(AuthContext);
};