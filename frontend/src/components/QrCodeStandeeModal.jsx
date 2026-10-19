import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '../context/CartContext';
import { QRCodeSVG } from 'qrcode.react';
import { RESTAURANT_INFO } from '../data/defaultMenu';
import { X, Printer, Flame, Sparkles, Download } from 'lucide-react';

export default function QrCodeStandeeModal() {
  const dialogRef = useRef(null);
  const { isQrModalOpen, setIsQrModalOpen, tableNumber } = useCart();
  const [selectedTable, setSelectedTable] = useState(tableNumber || 1);

  useEffect(() => {
    if (tableNumber) setSelectedTable(tableNumber);
  }, [tableNumber]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isQrModalOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isQrModalOpen]);

  // Fallback for browsers without closedby support
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
          setIsQrModalOpen(false);
        }
      };

      dialog.addEventListener('click', handleBackdropClick);
      return () => dialog.removeEventListener('click', handleBackdropClick);
    }
  }, [setIsQrModalOpen]);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://malai-chaap-junction.vercel.app';
  const qrUrl = `${baseUrl}/?table=${selectedTable}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="qrStandeeTitle"
      onClose={() => setIsQrModalOpen(false)}
      className="m-auto rounded-3xl glass-panel text-stone-100 shadow-2xl p-0 w-full max-w-lg border border-orange-500/30 overflow-hidden bg-stone-900/95"
    >
      <div className="relative p-6 sm:p-7 max-h-[92vh] overflow-y-auto no-scrollbar">
        <button
          onClick={() => setIsQrModalOpen(false)}
          className="no-print absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="no-print text-center mb-5">
          <h2 id="qrStandeeTitle" className="text-xl font-black uppercase tracking-wide font-display text-stone-100">
            Table QR Standee
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Printable QR tent standee for instant dine-in digital ordering.
          </p>

          {/* Table Selector Dropdown */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="text-xs font-semibold text-stone-300">Choose Table:</span>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(Number(e.target.value))}
              className="bg-stone-950 border border-orange-500/40 rounded-xl px-3 py-1.5 text-sm font-bold text-amber-400 focus:outline-none"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  Table {n}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Printable Standee Card */}
        <div className="print-standee bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 p-6 rounded-3xl border-2 border-amber-500/50 shadow-2xl text-center relative overflow-hidden">
          {/* Top Decorative Border */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600"></div>

          {/* Logo & Header */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md">
              <Flame className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-amber-400 tracking-wider">SMART QR MENU</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">100% PURE VEG</span>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-stone-100 tracking-tight font-display uppercase leading-tight">
            <span className="text-amber-400">Restaurant</span>
          </h3>
          <p className="text-[11px] text-stone-400 font-medium mt-0.5">
            Pure Vegetarian • Fast Table Service &amp; Dine-In
          </p>

          {/* Table Badge */}
          <div className="my-4 inline-block bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-lg px-6 py-1.5 rounded-full shadow-glow-tandoor font-display uppercase tracking-wider">
            Table Number {selectedTable}
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-4 rounded-2xl inline-block shadow-xl my-2 border-4 border-amber-400/40">
            <QRCodeSVG
              value={qrUrl}
              size={180}
              level="H"
              includeMargin={false}
            />
          </div>

          <div className="mt-3">
            <p className="text-sm font-bold text-amber-300 uppercase tracking-wide">
              Scan With Camera To Order
            </p>
            <p className="text-[11px] text-stone-400 mt-1">
              No App Required &bull; Fast Kitchen Dine-In Service
            </p>
          </div>

          {/* Footer Contact on Standee */}
          <div className="mt-4 pt-3 border-t border-stone-800 text-[10px] text-stone-400 flex items-center justify-around">
            <span>📞 99-1101-3993</span>
            <span>&bull;</span>
            <span>📱 89-2929-9898</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-semibold">100% Pure Veg</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print mt-5 flex gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-glow-tandoor active:scale-95 transition"
          >
            <Printer className="w-4 h-4" />
            <span>Print Table Standee</span>
          </button>
        </div>
      </div>
    </dialog>
  );
}
