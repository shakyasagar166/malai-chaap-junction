import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import MobileBottomNav from './components/MobileBottomNav';
import CartDrawer from './components/CartDrawer';
import TableSelectorModal from './components/TableSelectorModal';
import QrCodeStandeeModal from './components/QrCodeStandeeModal';
import CustomerMenu from './pages/CustomerMenu';
import OrderSuccess from './pages/OrderSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { RESTAURANT_INFO } from './data/defaultMenu';
import { Flame, MapPin, Phone, Heart } from 'lucide-react';

function MainApp() {
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState('menu'); // 'menu' | 'track' | 'login' | 'admin'
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('page') === 'admin') {
      setCurrentPage(isAdmin ? 'admin' : 'login');
    }
  }, [isAdmin]);

  const handleOrderSuccess = (order) => {
    setLatestOrder(order);
    setCurrentPage('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page) => {
    if (page === 'admin' && !isAdmin) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0908] text-stone-100 flex flex-col justify-between selection:bg-orange-500 selection:text-white pb-20 md:pb-0">
      
      {/* Top Navbar */}
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentPage === 'menu' && (
          <CustomerMenu onNavigate={handleNavigate} />
        )}

        {currentPage === 'track' && (
          <OrderSuccess
            initialOrder={latestOrder}
            onOrderMore={() => handleNavigate('menu')}
          />
        )}

        {currentPage === 'login' && (
          <AdminLogin
            onLoginSuccess={() => handleNavigate('admin')}
            onCancel={() => handleNavigate('menu')}
          />
        )}

        {currentPage === 'admin' && (
          isAdmin ? (
            <AdminDashboard onNavigateToMenu={() => handleNavigate('menu')} />
          ) : (
            <AdminLogin
              onLoginSuccess={() => handleNavigate('admin')}
              onCancel={() => handleNavigate('menu')}
            />
          )
        )}
      </main>

      {/* Mobile Bottom Navigation Bar (Visible on mobile screens) */}
      <MobileBottomNav currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Global Modals & Drawers */}
      <CartDrawer onOrderSuccess={handleOrderSuccess} />
      <TableSelectorModal />
      <QrCodeStandeeModal />

      {/* Footer */}
      <footer className="no-print py-10 border-t border-stone-800 bg-[#070605] text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          
          <div className="flex items-center justify-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-glow-tandoor">
              <Flame className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-amber-400 text-sm uppercase tracking-wider font-display">
              {RESTAURANT_INFO.name}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
          </div>

          <p className="text-stone-400 max-w-lg mx-auto">
            {RESTAURANT_INFO.tagline} &bull; Soya Chaaps, Stuffed Naans, Paneer Curries &amp; Rolls
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-400 text-xs pt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              {RESTAURANT_INFO.address}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              {RESTAURANT_INFO.phones.join(' / ')}
            </span>
          </div>

          <div className="pt-3 border-t border-stone-900 flex justify-center items-center gap-4 text-[11px] text-stone-400">
            <button
              onClick={() => handleNavigate('menu')}
              className="hover:text-amber-400 transition"
            >
              Digital Dining Menu
            </button>
            <span>&bull;</span>
            <button
              onClick={() => handleNavigate(isAdmin ? 'admin' : 'login')}
              className="hover:text-amber-400 transition"
            >
              Kitchen &amp; Admin Portal
            </button>
          </div>

          <p className="text-[10px] text-stone-500 pt-1">
            &copy; {new Date().getFullYear()} {RESTAURANT_INFO.name}. All rights reserved. Pure Vegetarian.
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
