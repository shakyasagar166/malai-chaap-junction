import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { RESTAURANT_INFO } from '../data/defaultMenu';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Flame, 
  ShoppingBag, 
  QrCode, 
  PhoneCall, 
  Smartphone,
  ChevronRight,
  Sparkles,
  Lock,
  X,
  Star
} from 'lucide-react';

export default function Navbar({ onNavigate, currentPage }) {
  const { cartCount, cartTotal, tableNumber, setIsCartOpen, setIsTableModalOpen, setIsQrModalOpen } = useCart();
  const { isAdmin } = useAuth();
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

  // Network URL for testing on mobile device over Wi-Fi
  const mobileUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.hostname}:5173` 
    : 'http://localhost:5173';

  return (
    <>
      <header className="sticky top-0 z-40 glass-nav border-b border-stone-800/80 shadow-xl">
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 text-stone-300 text-xs py-1.5 px-4 border-b border-orange-900/30">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] sm:text-xs">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-extrabold text-emerald-400">100% PURE VEG</span>
              <span className="text-stone-600 hidden sm:inline">&bull;</span>
              <span className="hidden sm:inline text-stone-400">Sanjay Nagar, Ghaziabad</span>
              <span className="hidden md:inline-flex items-center gap-1 text-amber-400 font-bold ml-1">
                <Star className="w-3 h-3 fill-amber-400" /> 4.9 (1,500+ Reviews)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPhoneModalOpen(true)}
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition"
                title="Open on Mobile Phone"
              >
                <Smartphone className="w-3 h-3" />
                <span>Open on Phone</span>
              </button>
              <span className="text-stone-700">|</span>
              <a 
                href={`tel:${RESTAURANT_INFO.phones[0].replace(/-/g, '')}`}
                className="flex items-center gap-1 text-orange-400 hover:text-orange-300 font-medium transition"
              >
                <PhoneCall className="w-3 h-3" />
                <span className="hidden xs:inline">{RESTAURANT_INFO.phones[0]}</span>
                <span className="xs:hidden">Call</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo & Name */}
          <button 
            onClick={() => onNavigate('menu')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-red-600 p-0.5 shadow-glow-tandoor flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center border border-amber-500/40">
                <Flame className="w-5 sm:w-6 h-5 sm:h-6 text-orange-400 fill-orange-500/20 group-hover:text-amber-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] sm:text-xs font-black text-amber-400 uppercase tracking-widest font-display">SVAD</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" title="100% Pure Veg"></span>
              </div>
              <h1 className="text-sm sm:text-lg font-black text-stone-100 tracking-tight font-display leading-none">
                Malai Chaap <span className="text-gradient bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">Junction</span>
              </h1>
            </div>
          </button>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Table Picker Pill */}
            <button
              onClick={() => setIsTableModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-orange-500/30 text-stone-200 text-xs sm:text-sm font-semibold transition group shadow-sm"
            >
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span>{tableNumber ? `Table ${tableNumber}` : 'Select Table'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm shadow-glow-tandoor hover:shadow-orange-500/50 transition-all duration-200 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-stone-950 text-amber-400 text-xs font-black px-2 py-0.5 rounded-full border border-amber-400/30">
                  {cartCount}
                </span>
              )}
              {cartTotal > 0 && (
                <span className="hidden md:inline text-white/95 text-xs font-bold font-display">
                  ₹{cartTotal.toFixed(0)}
                </span>
              )}
            </button>

            {/* Admin Toggle */}
            <button
              onClick={() => onNavigate(isAdmin ? 'admin' : 'login')}
              className={`p-2 rounded-xl border transition ${
                currentPage === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border-stone-800'
              }`}
              title="Kitchen & Admin Panel"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Modal: Open on Phone QR Code */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-stone-900 border border-orange-500/40 rounded-3xl p-6 max-w-sm w-full text-center relative shadow-2xl">
            <button
              onClick={() => setIsPhoneModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black uppercase tracking-wide font-display text-white">
              Scan &amp; Open On Phone
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              Apne mobile phone ke camera se scan kijiye aur phone par live test kijiye (Same Wi-Fi par):
            </p>

            <div className="bg-white p-4 rounded-2xl inline-block my-4 shadow-xl border-2 border-emerald-500">
              <QRCodeSVG value={mobileUrl} size={180} level="M" />
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs font-mono text-emerald-400 select-all">
              {mobileUrl}
            </div>

            <p className="text-[11px] text-stone-500 mt-3">
              Note: Mobile aur PC same Wi-Fi ya Mobile Hotspot se connect hona chahiye.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
