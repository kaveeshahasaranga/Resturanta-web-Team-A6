import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="font-serif text-3xl">Restaurant Dashboard</h1>
      <p className="text-neutral-400 text-sm">Managing PRANEETHA reservations, cellar inventory, and tasting menus.</p>
      <Link to="/login?role=admin" className="praneetha-btn-primary inline-block text-xs">
        Return to Admin Access
      </Link>
    </div>
  );
}
