import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout.jsx';
import SignInCustomerCard from '../../components/auth/SignInCustomerCard.jsx';
import SignInAdminCard from '../../components/auth/SignInAdminCard.jsx';

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // If visiting /admin-login, default to admin view
  const isAdminRoute = location.pathname.includes('/admin-login');
  const [roleMode, setRoleMode] = useState(isAdminRoute ? 'admin' : 'customer');

  useEffect(() => {
    setRoleMode(location.pathname.includes('/admin-login') ? 'admin' : 'customer');
  }, [location.pathname]);

  return (
    <AuthLayout activeView={roleMode === 'admin' ? 'admin-login' : 'login'}>
      {roleMode === 'admin' ? (
        <SignInAdminCard
          onSwitchToCustomer={() => {
            setRoleMode('customer');
            navigate('/login');
          }}
          onSwitchToForgotPassword={() => navigate('/forgot-password?role=admin')}
        />
      ) : (
        <SignInCustomerCard
          onSwitchToAdmin={() => {
            setRoleMode('admin');
            navigate('/admin-login');
          }}
          onSwitchToRegister={() => navigate('/register')}
          onSwitchToForgotPassword={() => navigate('/forgot-password')}
        />
      )}
    </AuthLayout>
  );
}
