import React from 'react';
import { Navigate, Link } from 'react-router-dom';

export default function HomePage() {
  return <Navigate to="/login" replace />;
}
