import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('fuchsius_token');
    const stored = localStorage.getItem('fuchsius_user');
    if (token && stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    localStorage.setItem('fuchsius_token', data.data.token);
    localStorage.setItem('fuchsius_user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const loginAsAdmin = useCallback((email) => {
    const adminUser = {
      id: 'mock-admin',
      name: email.split('@')[0] || 'Hearth Admin',
      email,
      role: 'ADMIN',
    };
    localStorage.setItem('fuchsius_token', 'mock-admin-session');
    localStorage.setItem('fuchsius_user', JSON.stringify(adminUser));
    setUser(adminUser);
    return adminUser;
  }, []);

  const loginAsCustomer = useCallback((email) => {
    const customerUser = {
      id: 'mock-customer',
      name: email.split('@')[0] || 'Patron Member',
      email,
      role: 'CUSTOMER',
    };
    localStorage.setItem('fuchsius_token', 'mock-customer-session');
    localStorage.setItem('fuchsius_user', JSON.stringify(customerUser));
    setUser(customerUser);
    return customerUser;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('fuchsius_token', data.data.token);
    localStorage.setItem('fuchsius_user',  JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('fuchsius_token');
    localStorage.removeItem('fuchsius_user');
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, loginAsAdmin, loginAsCustomer, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
