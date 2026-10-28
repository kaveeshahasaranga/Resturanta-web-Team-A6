import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout.jsx';
import ForgotPasswordCard from '../../components/auth/ForgotPasswordCard.jsx';

export default function ForgotPasswordPage({ isAdmin: propIsAdmin }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdmin = Boolean(propIsAdmin || searchParams.get('role') === 'admin');

  return (
    <AuthLayout activeView="forgot-password">
      <ForgotPasswordCard
        isAdmin={isAdmin}
        onSwitchToLogin={(asAdmin) => navigate(asAdmin ? '/admin-login' : '/login')}
        onSwitchToResetPassword={(asAdmin) => navigate(asAdmin ? '/reset-password?role=admin' : '/reset-password')}
      />
    </AuthLayout>
  );
}
