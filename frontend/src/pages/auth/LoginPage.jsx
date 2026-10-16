import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout.jsx';
import SignInCustomerCard from '../../components/auth/SignInCustomerCard.jsx';
import SignInAdminCard from '../../components/auth/SignInAdminCard.jsx';

export default function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const roleParam = searchParams.get('role');
  
  const [isAdmin, setIsAdmin] = useState(
    roleParam === 'admin' || location.pathname === '/admin-login'
  );

  useEffect(() => {
    setIsAdmin(roleParam === 'admin' || location.pathname === '/admin-login');
  }, [roleParam, location.pathname]);

  const handleRoleChange = (adminMode) => {
    setIsAdmin(adminMode);
    setSearchParams({ role: adminMode ? 'admin' : 'customer' });
  };

  return (
    <AuthLayout
      activeView={isAdmin ? 'admin-login' : 'customer-login'}
      onViewChange={(viewId) => {
        if (viewId === 'admin-login') handleRoleChange(true);
        if (viewId === 'customer-login') handleRoleChange(false);
      }}
    >
      {isAdmin ? (
        <SignInAdminCard
          onSwitchToCustomer={() => handleRoleChange(false)}
          onSwitchToForgotPassword={() => navigate('/forgot-password')}
        />
      ) : (
        <SignInCustomerCard
          onSwitchToAdmin={() => handleRoleChange(true)}
          onSwitchToRegister={() => navigate('/register')}
          onSwitchToForgotPassword={() => navigate('/forgot-password')}
        />
      )}
    </AuthLayout>
  );
}
