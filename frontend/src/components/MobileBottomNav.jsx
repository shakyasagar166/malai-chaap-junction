import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { 
  Utensils, 
  ShoppingBag, 
  QrCode, 
  Search, 
  Lock, 
  Sparkles,
  MapPin,
  Receipt
} from 'lucide-react';

export default function MobileBottomNav({ currentPage, onNavigate, onSearchFocus }) {
  const { 
    cartCount, 
    cartTotal, 
    tableNumber, 
    setIsCartOpen, 
    setIsTableModalOpen, 
    setIsQrModalOpen,
    orderHistory,
    setIsOrderHistoryOpen
  } = useCart();
  const { isAdmin } = useAuth();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-2xl border-t border-stone-800/90 pb-safe shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
      <div className="grid grid-cols-5 h-16 items-center px-2 max-w-md mx-auto">
        
        {/* 1. Menu Tab */}
        <button
          onClick={() => onNavigate('menu')}
          className={`flex flex-col items-center justify-center gap-1 transition ${
            currentPage === 'menu' ? 'text-orange-400' : 'text-stone-500 hover:text-stone-300'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${currentPage === 'menu' ? 'bg-orange-500/20' : ''}`}>
            <Utensils className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Menu</span>
        </button>

        {/* 2. Table Picker */}
        <button
          onClick={() => setIsTableModalOpen(true)}
          className="flex flex-col items-center justify-center gap-1 text-stone-400 hover:text-amber-400 transition"
        >
          <div className="p-1 rounded-xl relative">
            <span className="w-2 h-2 rounded-full bg-orange-500 absolute -top-0.5 -right-0.5"></span>
            <div className="w-5 h-5 rounded border border-orange-500/50 flex items-center justify-center text-[10px] font-black text-amber-400">
              {tableNumber || 'T'}
            </div>
          </div>
          <span className="text-[10px] font-bold tracking-tight">
            {tableNumber ? `T-${tableNumber}` : 'Table'}
          </span>
        </button>

        {/* 3. Center Cart Button (Glowing Floating Button) */}
        <div className="flex justify-center -mt-5">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white flex flex-col items-center justify-center shadow-glow-tandoor active:scale-95 transition border-2 border-stone-950 relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-stone-950 text-amber-400 text-[10px] font-black px-1.5 py-0.2 rounded-full border border-amber-400">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* 4. My Orders Tab */}
        <button
          onClick={() => setIsOrderHistoryOpen(true)}
          className="flex flex-col items-center justify-center gap-1 text-stone-400 hover:text-amber-400 transition relative"
        >
          <div className="p-1 rounded-xl relative">
            <Receipt className="w-5 h-5 text-amber-400" />
            {orderHistory && orderHistory.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 text-[9px] font-black px-1 rounded-full">
                {orderHistory.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-tight">Orders</span>
        </button>

        {/* 5. Admin Portal */}
        <button
          onClick={() => onNavigate(isAdmin ? 'admin' : 'login')}
          className={`flex flex-col items-center justify-center gap-1 transition ${
            currentPage === 'admin' ? 'text-amber-400' : 'text-stone-500 hover:text-stone-300'
          }`}
        >
          <div className={`p-1 rounded-xl transition ${currentPage === 'admin' ? 'bg-amber-500/20' : ''}`}>
            <Lock className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold tracking-tight">Admin</span>
        </button>

      </div>
    </div>
  );
}
