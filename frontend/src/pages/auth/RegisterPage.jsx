import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout.jsx';
import RegisterCard from '../../components/auth/RegisterCard.jsx';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <AuthLayout activeView="register">
      <RegisterCard
        onSwitchToLogin={() => navigate('/login')}
      />
    </AuthLayout>
  );
}
