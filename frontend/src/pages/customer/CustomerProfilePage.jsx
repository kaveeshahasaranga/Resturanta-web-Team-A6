import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate, Link } from 'react-router-dom';
import ProfileSidebar from '../../components/profile/ProfileSidebar.jsx';
import MyProfileTab from '../../components/profile/MyProfileTab.jsx';
import MyOrdersTab from '../../components/profile/MyOrdersTab.jsx';
import OrderDetailsView from '../../components/profile/OrderDetailsView.jsx';
import SavedDishesTab from '../../components/profile/SavedDishesTab.jsx';
import SecurityTab from '../../components/profile/SecurityTab.jsx';
import PraneethaFooter from '../../components/profile/PraneethaFooter.jsx';
import Navbar from '../../components/layout/Navbar.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useCart } from '../../context/CartContext.jsx';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CustomerProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tab: paramTab } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  // Tab state: 'profile' (Profile 1), 'orders' (Profile 2 & 2.2), 'saved' (Profile 3), 'security' (Profile 4)
  const initialTab = paramTab || searchParams.get('tab') || 'profile';
  const initialOrderId = searchParams.get('orderId') || null;

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedOrderId, setSelectedOrderId] = useState(initialOrderId);

  // Patron profile data
  const [patronProfile, setPatronProfile] = useState(() => {
    const saved = localStorage.getItem('praneetha_patron_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      name: user?.name || 'Thrishala Weerasekara',
      email: user?.email || 'thrishala@example.lk',
      phone: '077 123 4567',
      city: 'Colombo',
      address: '45 Temple Road, Colombo 05',
    };
  });

  // Sync state to URL params
  useEffect(() => {
    const params = {};
    if (activeTab !== 'profile') params.tab = activeTab;
    if (activeTab === 'orders' && selectedOrderId) params.orderId = selectedOrderId;
    setSearchParams(params, { replace: true });
  }, [activeTab, selectedOrderId, setSearchParams]);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'orders') {
      // If clicking MY ORDERS tab from sidebar, reset to orders list
      setSelectedOrderId(null);
    }
  };

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId || '#ORD-1048');
    setActiveTab('orders');
  };

  const handleBackToOrders = () => {
    setSelectedOrderId(null);
  };

  const handleUpdateProfile = (updatedData) => {
    setPatronProfile(updatedData);
    localStorage.setItem('praneetha_patron_profile', JSON.stringify(updatedData));
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col justify-between selection:bg-[#e66200] selection:text-white relative">
      {/* ─── Ambient Glow Background ─── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-80"
        style={{
          background:
            'radial-gradient(ellipse 900px 600px at 50% 30%, rgba(230, 98, 0, 0.07) 0%, rgba(9, 9, 11, 0.98) 75%)',
        }}
      />

      {/* Subtle Warm Particle Glow Orbs */}
      <div className="pointer-events-none fixed top-1/6 left-1/4 w-96 h-96 rounded-full bg-[#e66200]/[0.025] blur-3xl animate-pulse-slow" />
      <div
        className="pointer-events-none fixed bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-orange-600/[0.02] blur-3xl animate-pulse-slow"
        style={{ animationDelay: '2.5s' }}
      />

      {/* ─── Main Header (Image 3) ─── */}
      <Navbar />

      {/* ─── Main Content Area: Sidebar + Tab Content ─── */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          {/* Left Sidebar */}
          <ProfileSidebar
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            onLogout={handleLogout}
            userProfile={patronProfile}
          />

          {/* Right Active Tab Content */}
          <div className="flex-1 w-full min-w-0">
            {activeTab === 'profile' && (
              <MyProfileTab
                profile={patronProfile}
                onUpdateProfile={handleUpdateProfile}
              />
            )}

            {activeTab === 'orders' && (
              <>
                {selectedOrderId ? (
                  <OrderDetailsView
                    orderId={selectedOrderId}
                    onBack={handleBackToOrders}
                  />
                ) : (
                  <MyOrdersTab
                    onViewOrder={handleViewOrder}
                  />
                )}
              </>
            )}

            {activeTab === 'saved' && <SavedDishesTab />}

            {activeTab === 'security' && (
              <SecurityTab userEmail={patronProfile.email} />
            )}
          </div>
        </div>
      </main>

      {/* ─── Luxury Footer ─── */}
      <PraneethaFooter />
    </div>
  );
}
