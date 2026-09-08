import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('iot_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('iot_user');
    return saved ? JSON.parse(saved) : { name: 'XYZ', role: 'Admin', email: 'xyz10@gmail.com' };
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('iot_token', token);
    } else {
      localStorage.removeItem('iot_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('iot_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('iot_user');
    }
  }, [user]);

  const login = (newToken, userData) => {
    setToken(newToken || 'enterprise-mock-jwt-token');
    setUser(userData || { name: 'XYZ', role: 'Admin', email: 'xyz10@gmail.com' });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('iot_token');
    localStorage.removeItem('iot_user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
