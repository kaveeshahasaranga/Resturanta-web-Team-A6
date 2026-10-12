import React from 'react';
import { Link } from 'react-router-dom';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="font-serif text-3xl mb-4">Checkout</h1>
      <Link to="/login" className="praneetha-btn-primary">Return to Access Portal</Link>
    </div>
  );
}
