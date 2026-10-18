import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { restaurantApi } from '../api/restaurantApi';
import { RESTAURANT_INFO } from '../data/defaultMenu';
import confetti from 'canvas-confetti';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Utensils, 
  MessageSquare, 
  Send, 
  Phone, 
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

import { getCustomerDistanceToRestaurant, detectClientDevice, formatVerificationTag } from '../utils/locationHelper';

export default function CartDrawer({ onOrderSuccess }) {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartSubtotal, 
    cartTax, 
    cartTotal, 
    cartCount,
    tableNumber,
    isQrScanned,
    orderType,
    setIsTableModalOpen,
    isCartOpen, 
    setIsCartOpen 
  } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCartOpen) return null;

  // Send Order to Backend
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    if (orderType === 'DINE_IN' && !tableNumber) {
      setIsTableModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      // Check customer location relative to restaurant (detect if at restaurant or home)
      const loc = await getCustomerDistanceToRestaurant();
      const device = detectClientDevice();
      const verifyTag = formatVerificationTag({
        locationStatus: loc.status,
        distanceMeters: loc.distanceMeters,
        isQrScanned: isQrScanned,
        deviceInfo: device
      });

      const fullNotes = [verifyTag, orderNotes.trim()].filter(Boolean).join(' ');

      const orderPayload = {
        orderType: orderType,
        tableNumber: orderType === 'DINE_IN' ? tableNumber : null,
        customerName: customerName.trim() || 'Guest',
        customerPhone: customerPhone.trim() || '',
        notes: fullNotes,
        paymentMethod: 'UPI / Counter',
        locationStatus: loc.status,
        distanceMeters: loc.distanceMeters,
        isQrScanned: isQrScanned,
        deviceInfo: device,
        verificationStatus: 'PENDING_VERIFICATION',
        items: cart.map(item => ({
          menuItemId: item.menuItemId,
          itemName: item.name,
          portion: item.portion,
          quantity: item.quantity,
          pricePerUnit: item.price,
          notes: item.notes || ''
        }))
      };

      const orderResult = await restaurantApi.placeOrder(orderPayload);

      // Trigger cross-tab notification event for instant real-time admin alert
      try {
        localStorage.setItem('mcj_latest_order_event', JSON.stringify({
          id: orderResult.id || Date.now(),
          orderNumber: orderResult.orderNumber,
          tableNumber: orderType === 'DINE_IN' ? tableNumber : null,
          total: orderResult.total || cartTotal,
          customerName: customerName.trim() || 'Guest',
          customerPhone: customerPhone.trim() || '',
          locationStatus: loc.status,
          distanceMeters: loc.distanceMeters,
          isQrScanned: isQrScanned,
          itemsSummary: cart.map(i => `${i.quantity}x ${i.name}`).join(', '),
          timestamp: Date.now()
        }));
      } catch (e) {}

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Confetti fallback
      }

      clearCart();
      setIsCartOpen(false);
      if (onOrderSuccess) {
        onOrderSuccess(orderResult);
      }
    } catch (err) {
      alert('Error placing order: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct WhatsApp Order
  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;

    let text = `*🍢 NEW ORDER - SVAD MALAI CHAAP JUNCTION 🍢*\n`;
    text += `-----------------------------------------\n`;
    text += `*Type:* ${orderType === 'DINE_IN' ? `Dine-In (Table ${tableNumber || 'Unassigned'})` : 'Takeaway / Parcel'}\n`;
    if (customerName.trim()) text += `*Customer:* ${customerName}\n`;
    if (customerPhone.trim()) text += `*Phone:* ${customerPhone}\n`;
    text += `-----------------------------------------\n`;
    text += `*ITEMS ORDERED:*\n`;

    cart.forEach((item, idx) => {
      const portionText = item.portion === 'SINGLE' ? '' : ` (${item.portion})`;
      text += `${idx + 1}. *${item.name}*${portionText} x ${item.quantity} = ₹${(item.price * item.quantity).toFixed(0)}\n`;
      if (item.notes) text += `   _Note: ${item.notes}_\n`;
    });

    text += `-----------------------------------------\n`;
    text += `*Subtotal:* ₹${cartSubtotal.toFixed(0)}\n`;
    text += `*GST (5%):* ₹${cartTax.toFixed(0)}\n`;
    text += `*GRAND TOTAL:* ₹${cartTotal.toFixed(0)}\n`;
    if (orderNotes.trim()) {
      text += `-----------------------------------------\n`;
      text += `*Special Instructions:* ${orderNotes}\n`;
    }
    text += `-----------------------------------------\n`;
    text += `📍 *Restaurant:* L-127, Sanjay Nagar, Ghaziabad`;

    const encoded = encodeURIComponent(text);
    const waUrl = `https://wa.me/${RESTAURANT_INFO.whatsapp}?text=${encoded}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-950 border-l border-stone-800 text-stone-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-stone-900 to-stone-950 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white shadow-glow-tandoor">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black uppercase tracking-wide font-display">
                  Your Order Cart
                </h2>
                <p className="text-xs text-stone-400">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'} selected
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Table / Order Type Banner */}
          <div className="px-5 py-3 bg-stone-900/90 border-b border-stone-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              <span className="text-stone-300 font-medium">
                {orderType === 'DINE_IN' ? (
                  tableNumber ? `Dine-In Table ${tableNumber}` : 'Table not selected'
                ) : 'Takeaway Order'}
              </span>
            </div>
            <button
              onClick={() => setIsTableModalOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-bold underline transition"
            >
              {tableNumber ? 'Change Table' : 'Select Table'}
            </button>
          </div>

          {/* Scrollable Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 no-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-3xl bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto text-stone-600 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-stone-300">Your Cart is Empty</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Browse our authentic Tandoori Chaaps, Rolls, Gravies and Breads to add items!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs transition shadow-glow-tandoor"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.key}
                  className="p-3.5 rounded-2xl bg-stone-900/80 border border-stone-800/80 hover:border-orange-500/30 transition flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border border-emerald-500 flex items-center justify-center rounded-sm bg-stone-950 p-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span>
                        </span>
                        <h4 className="font-bold text-sm text-stone-100 font-display leading-tight">
                          {item.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        {item.portion !== 'SINGLE' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-950/70 text-orange-400 border border-orange-800/40 uppercase">
                            {item.portion} Portion
                          </span>
                        )}
                        <span className="text-xs font-semibold text-amber-400 font-display">
                          ₹{item.price} each
                        </span>
                      </div>

                      {item.notes && (
                        <p className="text-[11px] text-stone-400 mt-1 italic">
                          "{item.notes}"
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="text-stone-500 hover:text-red-400 p-1 transition"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-800/60 text-xs">
                    <div className="flex items-center gap-2 bg-stone-950 rounded-xl px-2 py-1 border border-stone-800">
                      <button
                        onClick={() => updateQuantity(item.key, -1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-stone-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-stone-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.key, 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-stone-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-stone-100 text-sm font-display">
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}

            {cart.length > 0 && (
              <>
                {/* Table & Presence Verification Notice */}
                {orderType === 'DINE_IN' && tableNumber && (
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-amber-400 flex items-center gap-1.5 uppercase font-display">
                        🪑 Table #{tableNumber} Dine-In
                      </span>
                      {isQrScanned ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          📱 QR Scanned
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">
                          ✍️ Manual Table
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400 leading-tight">
                      🛡️ Order aate hi waiter Table #{tableNumber} par presence verify karega aur kitchen me forward karega.
                    </p>
                  </div>
                )}

                {/* Guest Contact Inputs */}
                <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 space-y-2.5">
                  <div className="text-xs font-bold text-stone-300 uppercase tracking-wide">
                    Contact & Kitchen Note (Optional)
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile No."
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Instructions for chef (e.g. Extra onions, crispy chaap)"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Price Breakdown */}
                <div className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 space-y-1.5 text-xs text-stone-300">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-stone-100">₹{cartSubtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-stone-400">
                    <span>GST (5%)</span>
                    <span>₹{cartTax.toFixed(0)}</span>
                  </div>
                  <div className="pt-2 border-t border-stone-800 flex justify-between text-sm font-bold text-amber-400">
                    <span>Grand Total</span>
                    <span className="text-base font-black">₹{cartTotal.toFixed(0)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-stone-950 border-t border-stone-800 space-y-2.5">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handlePlaceOrder}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-extrabold text-sm sm:text-base flex items-center justify-between shadow-glow-tandoor active:scale-95 transition disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Placing Order...' : 'Send Order to Kitchen'}</span>
                <span className="flex items-center gap-1.5 font-display">
                  ₹{cartTotal.toFixed(0)}
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 px-4 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Instant Order via WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
