import React, { createContext, useContext, useState, useCallback } from 'react';
import { queryClient } from '../queryClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('iot_user');
      const savedToken = localStorage.getItem('iot_token');
      if (savedUser && savedToken) {
        const parsed = JSON.parse(savedUser);
        if (parsed && (parsed.email || parsed.userId || parsed.id)) {
          return {
            ...parsed,
            userId: parsed.userId || parsed.email || parsed.id,
            email: parsed.email || parsed.userId || parsed.id
          };
        }
      }
    } catch (e) {
      console.error('Error reading saved user session:', e);
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    try {
      const savedUser = localStorage.getItem('iot_user');
      const savedToken = localStorage.getItem('iot_token');
      if (savedUser && savedToken) {
        return savedToken;
      }
    } catch (e) {
      console.error('Error reading saved token:', e);
    }
    return null;
  });

  const isAuthenticated = Boolean(token && user);

  const login = useCallback(async (email, password, customData = {}) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      throw new Error('Email is required for authentication.');
    }

    const rawName = customData.name || cleanEmail.split('@')[0];
    const formattedName = rawName.replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const newToken = `iot-jwt-${btoa(cleanEmail)}-${Date.now()}`;
    const newUser = {
      id: cleanEmail,
      userId: cleanEmail,
      email: cleanEmail,
      name: formattedName || 'User',
      role: customData.role || 'Admin',
      office: customData.office || 'Chennai'
    };

    // 1. Wipe any cached queries so previous user data is never visible
    queryClient.clear();

    // 2. Persist session for this specific user
    localStorage.setItem('iot_token', newToken);
    localStorage.setItem('iot_user', JSON.stringify(newUser));

    // 3. Update React state
    setToken(newToken);
    setUser(newUser);

    return { token: newToken, user: newUser };
  }, []);

  const logout = useCallback(() => {
    // 1. Clear active state
    setToken(null);
    setUser(null);

    // 2. Remove session tokens from storage (retains actual tender database records)
    localStorage.removeItem('iot_token');
    localStorage.removeItem('iot_user');

    // 3. Completely purge React Query cache so previous user's cached tender data disappears immediately
    queryClient.clear();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
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
