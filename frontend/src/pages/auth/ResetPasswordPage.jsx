import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout.jsx';
import ResetPasswordCard from '../../components/auth/ResetPasswordCard.jsx';

export default function ResetPasswordPage({ isAdmin: propIsAdmin }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isAdmin = Boolean(propIsAdmin || searchParams.get('role') === 'admin');

  return (
    <AuthLayout activeView="reset-password">
      <ResetPasswordCard
        isAdmin={isAdmin}
        onSwitchToLogin={(asAdmin) => navigate(asAdmin ? '/admin-login' : '/login')}
      />
    </AuthLayout>
  );
}
