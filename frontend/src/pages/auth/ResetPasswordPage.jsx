import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout.jsx';
import ResetPasswordCard from '../../components/auth/ResetPasswordCard.jsx';

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout activeView="reset-password">
      <ResetPasswordCard
        onSwitchToLogin={() => navigate('/login')}
      />
    </AuthLayout>
  );
}
