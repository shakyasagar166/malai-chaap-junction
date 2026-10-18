import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Sparkles, Flame, Plus, Minus, Check, MessageSquare } from 'lucide-react';
import { getDishImageUrl } from '../utils/dishImageHelper';

export default function ItemDetailModal({ item, initialPortion = 'FULL', isOpen, onClose }) {
  const dialogRef = useRef(null);
  const { addToCart } = useCart();

  const [portion, setPortion] = useState(initialPortion);
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item) {
      setPortion(item.hasSinglePrice ? 'SINGLE' : (initialPortion || (item.priceHalf ? 'HALF' : 'FULL')));
      setSpiceLevel(item.spiceLevel || 'Medium');
      setNotes('');
      setQuantity(1);
    }
  }, [item, initialPortion]);

  // Handle open/close with showModal()
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  // Fallback for browsers without native `closedby` attribute support (modern-web-guidance)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const handleBackdropClick = (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          onClose();
        }
      };

      dialog.addEventListener('click', handleBackdropClick);
      return () => dialog.removeEventListener('click', handleBackdropClick);
    }
  }, [onClose]);

  if (!item) return null;

  const isSingle = item.hasSinglePrice;
  const unitPrice = isSingle
    ? item.singlePrice
    : (portion === 'HALF' ? item.priceHalf : item.priceFull);
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    const customNotes = [
      spiceLevel !== item.spiceLevel ? `Spice: ${spiceLevel}` : null,
      notes.trim() ? notes.trim() : null
    ].filter(Boolean).join(' | ');

    addToCart(item, portion, quantity, customNotes);
    onClose();
  };

  const dishImage = getDishImageUrl(item);
  const inStock = item.isAvailable !== false && item.available !== false;

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="itemDetailTitle"
      onClose={onClose}
      className="m-auto rounded-3xl glass-panel text-stone-100 shadow-2xl p-0 w-full max-w-lg border border-orange-500/30 overflow-hidden bg-stone-900/95"
    >
      <div className="relative p-6 sm:p-7 max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-stone-300 hover:text-white flex items-center justify-center transition backdrop-blur-md"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Food Photo Banner */}
        <div className="relative w-full h-52 sm:h-56 rounded-2xl overflow-hidden mb-4 bg-stone-950 border border-stone-800 shadow-lg">
          <img
            src={dishImage}
            alt={item.name}
            className={`w-full h-full object-cover ${!inStock ? 'grayscale-[35%]' : ''}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/30 pointer-events-none"></div>

          {/* Badges on Top of Photo */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 flex-wrap">
            <span className="w-4 h-4 border-2 border-emerald-500 flex items-center justify-center rounded-sm bg-stone-950/90 p-0.5 shadow-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
            </span>
            <span className="text-xs font-black text-emerald-400 bg-stone-950/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-emerald-500/30">
              100% PURE VEG
            </span>
            {!inStock && (
              <span className="text-xs font-black text-white bg-red-600/95 backdrop-blur-md px-2.5 py-0.5 rounded-md border border-white/20 shadow-lg uppercase tracking-wider">
                🚫 OUT OF STOCK
              </span>
            )}
            {item.isChefSpecial && inStock && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 shadow-md uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-stone-950 fill-stone-950" />
                CHEF SPECIAL
              </span>
            )}
            {item.isBestseller && !item.isChefSpecial && inStock && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-600 text-white shadow-md uppercase tracking-wider">
                <Flame className="w-3 h-3 text-white fill-white" />
                BESTSELLER
              </span>
            )}
          </div>
        </div>

        {/* Title & Category */}
        <div className="text-xs font-bold text-orange-400 uppercase tracking-widest font-display">
          {item.categoryName}
        </div>
        <h2 id="itemDetailTitle" className="text-xl sm:text-2xl font-black text-stone-100 uppercase tracking-wide font-display mt-0.5">
          {item.name}
        </h2>

        {item.portionUnit && (
          <span className="inline-block mt-1 text-xs font-bold bg-amber-500/10 text-amber-400 px-2.5 py-0.5 rounded-md border border-amber-500/20">
            {item.portionUnit}
          </span>
        )}

        <p className="text-sm text-stone-300 mt-2.5 leading-relaxed">
          {item.description || "Prepared fresh upon order with authentic tandoor spices, rich butter cream and signature Delhi-NCR seasoning."}
        </p>

        {/* Portion Selector (if Half / Full available) */}
        {!isSingle && item.priceHalf && item.priceFull && (
          <div className="mt-5">
            <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-2">
              Select Portion Size
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPortion('HALF')}
                className={`p-3 rounded-2xl border text-left transition ${
                  portion === 'HALF'
                    ? 'border-orange-500 bg-orange-950/40 text-white shadow-glow-tandoor'
                    : 'border-stone-800 bg-stone-950/50 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">HALF PORTION</span>
                  {portion === 'HALF' && <Check className="w-4 h-4 text-orange-400" />}
                </div>
                <div className="text-lg font-black text-amber-400">₹{item.priceHalf}</div>
              </button>

              <button
                type="button"
                onClick={() => setPortion('FULL')}
                className={`p-3 rounded-2xl border text-left transition ${
                  portion === 'FULL'
                    ? 'border-orange-500 bg-orange-950/40 text-white shadow-glow-tandoor'
                    : 'border-stone-800 bg-stone-950/50 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">FULL PORTION</span>
                  {portion === 'FULL' && <Check className="w-4 h-4 text-orange-400" />}
                </div>
                <div className="text-lg font-black text-amber-400">₹{item.priceFull}</div>
              </button>
            </div>
          </div>
        )}

        {/* Spice Level Preference */}
        <div className="mt-5">
          <label className="text-xs font-bold text-stone-300 uppercase tracking-wider block mb-2">
            Spice Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['Mild', 'Medium', 'Spicy'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSpiceLevel(level)}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  spiceLevel === level
                    ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                    : 'border-stone-800 bg-stone-950/50 text-stone-400 hover:border-stone-700'
                }`}
              >
                <span>{level === 'Mild' ? '🌿' : level === 'Medium' ? '🔥' : '🌶️'}</span>
                <span>{level}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cooking Notes */}
        <div className="mt-5">
          <label className="text-xs font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-stone-400" />
            Special Cooking Instructions
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Extra mint chutney, well roasted, less oil..."
            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        {/* Quantity & Add to Cart Action */}
        <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between gap-4">
          <div className={`flex items-center gap-2 bg-stone-950 border border-stone-800 rounded-2xl p-1 ${!inStock ? 'opacity-50 pointer-events-none' : ''}`}>
            <button
              type="button"
              disabled={!inStock}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition active:scale-95 text-stone-200"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-base text-stone-100">
              {quantity}
            </span>
            <button
              type="button"
              disabled={!inStock}
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 flex items-center justify-center transition active:scale-95 text-stone-200"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {inStock ? (
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-bold text-sm sm:text-base flex items-center justify-between shadow-glow-tandoor active:scale-95 transition"
            >
              <span>Add to Order</span>
              <span>₹{totalPrice}</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="flex-1 py-3 px-5 rounded-2xl bg-stone-800 border border-red-900/40 text-red-400 font-black text-sm sm:text-base flex items-center justify-center cursor-not-allowed uppercase tracking-wider"
            >
              🚫 Currently Sold Out
            </button>
          )}
        </div>
      </div>
    </dialog>
  );
}
