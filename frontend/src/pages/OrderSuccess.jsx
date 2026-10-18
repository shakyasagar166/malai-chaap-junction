import React, { useEffect, useState } from 'react';
import { RESTAURANT_INFO } from '../data/defaultMenu';
import { 
  CheckCircle2, 
  Flame, 
  Clock, 
  Utensils, 
  ArrowLeft, 
  PhoneCall, 
  Share2, 
  Sparkles,
  MapPin
} from 'lucide-react';

export default function OrderSuccess({ initialOrder, onOrderMore }) {
  const [order, setOrder] = useState(initialOrder);
  const [simulatedStatusIndex, setSimulatedStatusIndex] = useState(1);

  useEffect(() => {
    // If no initial order, fetch latest from localStorage
    if (!order) {
      const savedOrders = JSON.parse(localStorage.getItem('mcj_orders') || '[]');
      if (savedOrders.length > 0) {
        setOrder(savedOrders[0]);
      }
    }
  }, [initialOrder, order]);

  // Gentle timeline progress simulation for customer delightful experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setSimulatedStatusIndex(2); // In tandoor grilling
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-stone-200">No active order found</h2>
        <button
          onClick={onOrderMore}
          className="mt-4 px-6 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm shadow-glow-tandoor"
        >
          Go to Menu
        </button>
      </div>
    );
  }

  const steps = [
    { title: 'Order Received', desc: 'Sent to Kitchen Display System' },
    { title: 'Skewers in Tandoor', desc: 'Freshly marinating & charcoal grilling' },
    { title: 'Garnishing & Quality Check', desc: 'Topped with fresh malai & spices' },
    { title: 'Served Hot', desc: 'Delivered to your table' }
  ];

  const handleShareWhatsApp = () => {
    let msg = `🍢 *Order Placed at Svad Malai Chaap Junction* 🍢\n`;
    msg += `Order No: *${order.orderNumber}*\n`;
    msg += `Table: *${order.tableNumber ? `Table ${order.tableNumber}` : 'Takeaway'}*\n`;
    msg += `Total Amount: *₹${order.total?.toFixed(0)}*\n`;
    msg += `Status: Cooking in Kitchen 🔥\n`;
    msg += `Address: L-127, Sanjay Nagar, Ghaziabad`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-orange-500/40 shadow-2xl text-center relative overflow-hidden bg-stone-900/90">
        
        {/* Glow Accent */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 bg-orange-500/20 rounded-full blur-2xl pointer-events-none"></div>

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white flex items-center justify-center mx-auto mb-4 shadow-xl">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <span>Order Confirmed &bull; Kitchen Preparing</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-stone-100 font-display uppercase tracking-tight">
          Thank You, {order.customerName || 'Foodie'}!
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          Your order has been routed to our tandoor chef. Sit back and relax!
        </p>

        {/* Order Meta Box */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6 p-4 rounded-2xl bg-stone-950/80 border border-stone-800 text-left">
          <div>
            <div className="text-[10px] text-stone-500 uppercase font-semibold">Order ID</div>
            <div className="text-xs sm:text-sm font-bold text-amber-400 font-mono mt-0.5">
              {order.orderNumber}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-stone-500 uppercase font-semibold">Location</div>
            <div className="text-xs sm:text-sm font-bold text-stone-100 mt-0.5">
              {order.orderType === 'DINE_IN' ? `Table ${order.tableNumber || '-'}` : 'Takeaway Parcel'}
            </div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="text-[10px] text-stone-500 uppercase font-semibold">Estimated Time</div>
            <div className="text-xs sm:text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>12 - 18 Mins</span>
            </div>
          </div>
        </div>

        {/* Live Status Stepper */}
        <div className="my-8 text-left">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 text-center">
            Live Kitchen Status
          </h3>
          <div className="space-y-4">
            {steps.map((st, i) => {
              const isPast = i < simulatedStatusIndex;
              const isCurrent = i === simulatedStatusIndex;
              return (
                <div key={i} className="flex items-start gap-3.5">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5 transition ${
                    isPast
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-orange-500 text-white shadow-glow-tandoor animate-pulse'
                      : 'bg-stone-800 text-stone-500'
                  }`}>
                    {isPast ? '✓' : i + 1}
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${
                      isPast || isCurrent ? 'text-stone-100' : 'text-stone-500'
                    }`}>
                      {st.title}
                    </div>
                    <div className="text-xs text-stone-400">
                      {st.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Itemized Order Receipt */}
        <div className="my-6 rounded-2xl bg-stone-950/70 border border-stone-800/80 p-4 sm:p-5 text-left">
          <div className="text-xs font-bold text-stone-300 uppercase tracking-wider mb-3 pb-2 border-b border-stone-800">
            Order Summary
          </div>
          <div className="space-y-2.5">
            {order.items?.map((it, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-stone-200">{it.itemName}</span>
                  {it.portion && it.portion !== 'SINGLE' && (
                    <span className="text-[10px] text-orange-400 ml-1.5 uppercase font-semibold">
                      ({it.portion})
                    </span>
                  )}
                  <span className="text-stone-500 ml-2">x {it.quantity}</span>
                  {it.notes && (
                    <div className="text-[11px] text-stone-400 italic">"{it.notes}"</div>
                  )}
                </div>
                <div className="font-bold text-stone-100 font-display">
                  ₹{(it.pricePerUnit * it.quantity).toFixed(0)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800 space-y-1 text-xs text-stone-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-stone-200">₹{order.subtotal?.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="text-stone-200">₹{order.tax?.toFixed(0)}</span>
            </div>
            <div className="pt-2 border-t border-stone-800 flex justify-between text-sm sm:text-base font-black text-amber-400">
              <span>Total Bill</span>
              <span>₹{order.total?.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-6">
          <button
            onClick={onOrderMore}
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow-tandoor active:scale-95 transition"
          >
            <Utensils className="w-4 h-4" />
            <span>Order More Items</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-emerald-400 border border-emerald-500/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Receipt</span>
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-800/80 text-xs text-stone-500 flex items-center justify-center gap-3">
          <span>Need assistance?</span>
          <a
            href={`tel:${RESTAURANT_INFO.phones[0].replace(/-/g, '')}`}
            className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
          >
            <PhoneCall className="w-3 h-3" />
            <span>Call Waiter: {RESTAURANT_INFO.phones[0]}</span>
          </a>
        </div>

      </div>
    </div>
  );
}
