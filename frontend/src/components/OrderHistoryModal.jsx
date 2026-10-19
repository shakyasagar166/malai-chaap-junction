import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { RESTAURANT_INFO } from '../data/defaultMenu';
import { 
  Receipt, 
  Clock, 
  RotateCcw, 
  Share2, 
  Trash2, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  Flame, 
  Utensils, 
  Sparkles, 
  MapPin, 
  Copy, 
  Check,
  Eye,
  ShoppingBag
} from 'lucide-react';

export default function OrderHistoryModal({ onTrackOrder }) {
  const { 
    orderHistory, 
    isOrderHistoryOpen, 
    setIsOrderHistoryOpen, 
    clearOrderHistory, 
    reorderOrder 
  } = useCart();

  const [copiedId, setCopiedId] = useState(null);

  if (!isOrderHistoryOpen) return null;

  const totalSpent = (orderHistory || []).reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const handleCopyOrderNumber = (orderNumber) => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedId(orderNumber);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareWhatsAppReceipt = (order) => {
    let msg = `*⭐ RESTAURANT ⭐*\n`;
    msg += `_100% Pure Vegetarian Food & Dining_\n`;
    msg += `-----------------------------------------\n`;
    msg += `*ORDER RECEIPT*\n`;
    msg += `*Order No:* ${order.orderNumber}\n`;
    msg += `*Date:* ${new Date(order.createdAt).toLocaleString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })}\n`;
    msg += `*Type:* ${order.orderType === 'DINE_IN' ? `Dine-In (Table ${order.tableNumber || 'Unassigned'})` : 'Takeaway / Parcel'}\n`;
    if (order.customerName) msg += `*Customer:* ${order.customerName}\n`;
    msg += `-----------------------------------------\n`;
    msg += `*ITEMS:*\n`;

    (order.items || []).forEach((it, idx) => {
      const portionText = it.portion === 'SINGLE' ? '' : ` (${it.portion})`;
      const price = it.pricePerUnit || it.price || 0;
      const total = it.totalPrice || (price * it.quantity);
      msg += `${idx + 1}. *${it.name || it.itemName}*${portionText} x ${it.quantity} = ₹${total.toFixed(0)}\n`;
      if (it.notes) msg += `   _Note: ${it.notes}_\n`;
    });

    msg += `-----------------------------------------\n`;
    if (order.subtotal) msg += `*Subtotal:* ₹${Number(order.subtotal).toFixed(0)}\n`;
    if (order.tax) msg += `*GST (5%):* ₹${Number(order.tax).toFixed(0)}\n`;
    msg += `*GRAND TOTAL:* ₹${Number(order.total).toFixed(0)}\n`;
    msg += `*Status:* ${order.status || 'Received'}\n`;
    msg += `-----------------------------------------\n`;
    msg += `📍 *Address:* ${RESTAURANT_INFO.address}\n`;
    msg += `📞 *Call:* ${RESTAURANT_INFO.phones[0]}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleClearHistory = () => {
    if (window.confirm('Kya aap is phone se apni poori order history delete karna chahte hain?')) {
      clearOrderHistory();
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || 'PENDING').toUpperCase();
    switch (s) {
      case 'PENDING':
        return {
          label: 'Order Received',
          icon: '⏱️',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
        };
      case 'VERIFIED':
        return {
          label: 'Seat Verified',
          icon: '✅',
          bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
        };
      case 'PREPARING':
      case 'COOKING':
        return {
          label: 'In Tandoor Kitchen',
          icon: '🔥',
          bg: 'bg-orange-500/10 text-orange-400 border-orange-500/30 animate-pulse'
        };
      case 'SERVED':
        return {
          label: 'Served Hot',
          icon: '🍽️',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        };
      case 'COMPLETED':
        return {
          label: 'Completed & Paid',
          icon: '✨',
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          icon: '❌',
          bg: 'bg-red-500/10 text-red-400 border-red-500/30'
        };
      default:
        return {
          label: s,
          icon: '⏱️',
          bg: 'bg-stone-800 text-stone-300 border-stone-700'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        onClick={() => setIsOrderHistoryOpen(false)}
        className="absolute inset-0" 
      />

      <div className="relative bg-[#121110] border border-orange-500/30 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden z-10 text-stone-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800/80 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 sm:w-11 h-10 sm:h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-red-600 p-0.5 shadow-glow-tandoor flex items-center justify-center">
              <div className="w-full h-full bg-stone-950 rounded-[14px] flex items-center justify-center border border-amber-500/30">
                <Receipt className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white font-display uppercase tracking-wide">
                  Mere Orders <span className="text-amber-400">(Order History)</span>
                </h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-400">
                Aapke is phone par place kiye gaye sabhi orders ka record
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOrderHistoryOpen(false)}
            className="w-9 h-9 rounded-2xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center border border-stone-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Overview Stats Bar (if orders exist) */}
        {orderHistory && orderHistory.length > 0 && (
          <div className="bg-stone-900/60 border-b border-stone-800/80 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-stone-400">Total Orders: </span>
                <span className="font-black text-amber-400 font-display">{orderHistory.length}</span>
              </div>
              <div className="h-3 w-px bg-stone-800"></div>
              <div>
                <span className="text-stone-400">Total Spend: </span>
                <span className="font-black text-emerald-400 font-display">₹{totalSpent.toFixed(0)}</span>
              </div>
            </div>

            <button
              onClick={handleClearHistory}
              className="text-[11px] text-stone-500 hover:text-red-400 flex items-center gap-1 font-semibold transition"
              title="Clear History"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear History</span>
            </button>
          </div>
        )}

        {/* Content Body: Scrollable list of past orders */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {(!orderHistory || orderHistory.length === 0) ? (
            /* Empty State */
            <div className="py-12 sm:py-16 text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto text-stone-500 shadow-inner">
                <ShoppingBag className="w-10 h-10 text-orange-500/40" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h4 className="text-base font-bold text-stone-200">Abhi tak koi order nahi hai</h4>
                <p className="text-xs text-stone-400 leading-relaxed">
                  Aap jo bhi dishes Restaurant se order karenge, unki complete receipt, live status aur re-order option yahan hamesha saved rahenge.
                </p>
              </div>
              <button
                onClick={() => setIsOrderHistoryOpen(false)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs shadow-glow-tandoor active:scale-95 transition"
              >
                <Utensils className="w-4 h-4" />
                <span>Menu Dekhein &amp; Order Karein</span>
              </button>
            </div>
          ) : (
            /* Orders List */
            orderHistory.map((order, index) => {
              const statusInfo = getStatusBadge(order.status);
              const isCopied = copiedId === order.orderNumber;

              return (
                <div 
                  key={order.orderNumber || order.id || index}
                  className="rounded-2xl bg-stone-950/70 border border-stone-800/90 hover:border-orange-500/40 p-4 sm:p-5 transition shadow-lg relative overflow-hidden group"
                >
                  {/* Accent Top Border */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-amber-400 to-transparent"></div>

                  {/* Top Row: Order ID, Date, Type & Status */}
                  <div className="flex flex-wrap items-start justify-between gap-2.5 pb-3 border-b border-stone-800/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-400 text-xs sm:text-sm">
                          {order.orderNumber || `#VR-${order.id}`}
                        </span>
                        <button
                          onClick={() => handleCopyOrderNumber(order.orderNumber)}
                          className="p-1 rounded bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white transition"
                          title="Order number copy karein"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>

                        {/* Order Type Badge */}
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-stone-900 border border-stone-800 text-stone-300">
                          {order.orderType === 'DINE_IN' 
                            ? (order.tableNumber ? `Table ${order.tableNumber}` : 'Dine-In')
                            : 'Takeaway'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-1">
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${statusInfo.bg}`}>
                      <span>{statusInfo.icon}</span>
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="py-3 space-y-2">
                    {(order.items || []).map((item, iIdx) => {
                      const portion = item.portion === 'SINGLE' ? '' : item.portion;
                      const price = item.pricePerUnit || item.price || 0;
                      const lineTotal = item.totalPrice || (price * item.quantity);

                      return (
                        <div key={iIdx} className="flex items-center justify-between text-xs gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-md bg-stone-900 border border-stone-800 flex items-center justify-center text-[10px] font-bold text-amber-400 flex-shrink-0">
                              {item.quantity}x
                            </span>
                            <div className="truncate">
                              <span className="font-semibold text-stone-200">
                                {item.name || item.itemName}
                              </span>
                              {portion && (
                                <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-stone-900 border border-stone-800 text-stone-400">
                                  {portion}
                                </span>
                              )}
                              {item.notes && (
                                <span className="block text-[10px] text-stone-500 italic truncate">
                                  Note: {item.notes}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="font-mono font-bold text-stone-300 flex-shrink-0">
                            ₹{lineTotal.toFixed(0)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Summary & Actions Bottom Row */}
                  <div className="pt-3 border-t border-stone-800/60 flex flex-wrap items-center justify-between gap-3">
                    {/* Amount */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-[11px] text-stone-400">Total Bill:</span>
                      <span className="text-base sm:text-lg font-black text-amber-400 font-display">
                        ₹{(Number(order.total) || 0).toFixed(0)}
                      </span>
                      {order.tax > 0 && (
                        <span className="text-[10px] text-stone-500 font-mono">
                          (inc. 5% GST)
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Live Track Button */}
                      {onTrackOrder && (
                        <button
                          onClick={() => {
                            onTrackOrder(order);
                            setIsOrderHistoryOpen(false);
                          }}
                          className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 hover:text-white text-xs font-bold flex items-center gap-1 transition"
                          title="Track Live Status"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                          <span className="hidden sm:inline">Track</span>
                        </button>
                      )}

                      {/* WhatsApp Receipt Button */}
                      <button
                        onClick={() => handleShareWhatsAppReceipt(order)}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition"
                        title="Share receipt on WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>

                      {/* 1-Click Re-Order Button */}
                      <button
                        onClick={() => reorderOrder(order)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-xs shadow-glow-tandoor active:scale-95 transition flex items-center gap-1.5"
                        title="Order again"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Order Again</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 sm:px-6 py-3 bg-stone-950 border-t border-stone-800/80 text-[11px] text-stone-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span className="text-stone-400 font-semibold">100% Pure Vegetarian Rooftop &amp; Lounge</span>
          </div>
          <div className="hidden sm:block text-stone-500">
            Sector - 23, Sanjay Nagar, Ghaziabad
          </div>
        </div>

      </div>
    </div>
  );
}
