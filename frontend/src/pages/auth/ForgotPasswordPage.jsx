import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout.jsx';
import ForgotPasswordCard from '../../components/auth/ForgotPasswordCard.jsx';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout activeView="forgot-password">
      <ForgotPasswordCard
        onSwitchToLogin={() => navigate('/login')}
        onSwitchToResetPassword={() => navigate('/reset-password')}
      />
    </AuthLayout>
  );
}
