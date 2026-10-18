import React, { useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { X, Utensils, ShoppingBag, Check } from 'lucide-react';

export default function TableSelectorModal() {
  const dialogRef = useRef(null);
  const { tableNumber, setTableNumber, orderType, setOrderType, isTableModalOpen, setIsTableModalOpen } = useCart();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isTableModalOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isTableModalOpen]);

  // Fallback for browsers without closedby support (modern-web-guidance)
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
          setIsTableModalOpen(false);
        }
      };

      dialog.addEventListener('click', handleBackdropClick);
      return () => dialog.removeEventListener('click', handleBackdropClick);
    }
  }, [setIsTableModalOpen]);

  const handleSelectTable = (num) => {
    setTableNumber(num);
    setOrderType('DINE_IN');
    setIsTableModalOpen(false);
  };

  const handleSelectTakeaway = () => {
    setTableNumber(null);
    setOrderType('TAKEAWAY');
    setIsTableModalOpen(false);
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="tableSelectorTitle"
      onClose={() => setIsTableModalOpen(false)}
      className="m-auto rounded-3xl glass-panel text-stone-100 shadow-2xl p-0 w-full max-w-md border border-orange-500/30 overflow-hidden bg-stone-900/95"
    >
      <div className="relative p-6 sm:p-7">
        <button
          onClick={() => setIsTableModalOpen(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center mx-auto mb-3 shadow-glow-tandoor">
            <Utensils className="w-6 h-6" />
          </div>
          <h2 id="tableSelectorTitle" className="text-xl font-black uppercase tracking-wide font-display text-stone-100">
            Select Your Dining Table
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Choose your current table number for fresh piping hot service.
          </p>
        </div>

        {/* Takeaway Option */}
        <button
          onClick={handleSelectTakeaway}
          className={`w-full mb-4 p-3 rounded-2xl border flex items-center justify-between transition ${
            orderType === 'TAKEAWAY'
              ? 'border-amber-500 bg-amber-500/20 text-amber-300'
              : 'border-stone-800 bg-stone-950/60 text-stone-300 hover:border-stone-700'
          }`}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div className="font-bold text-sm">Takeaway / Parcel Order</div>
              <div className="text-[11px] text-stone-400">Pick up from the front counter</div>
            </div>
          </div>
          {orderType === 'TAKEAWAY' && <Check className="w-5 h-5 text-amber-400" />}
        </button>

        {/* 20 Tables Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
          {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
            const isSelected = orderType === 'DINE_IN' && tableNumber === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => handleSelectTable(num)}
                className={`h-14 rounded-2xl font-bold flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-glow-tandoor scale-105 border-2 border-amber-300'
                    : 'bg-stone-950/80 border border-stone-800/80 hover:border-orange-500/50 text-stone-300 hover:text-white'
                }`}
              >
                <span className="text-[10px] text-stone-400 uppercase font-medium">Table</span>
                <span className="text-base font-black font-display">{num}</span>
              </button>
            );
          })}
        </div>
      </div>
    </dialog>
  );
}
