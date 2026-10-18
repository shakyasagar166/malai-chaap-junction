import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Flame, Sparkles, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { getDishImageUrl } from '../utils/dishImageHelper';

export default function MenuCard({ item, viewMode = 'grid', onSelectDetail }) {
  const { addToCart, updateQuantity, getItemQuantityInCart } = useCart();
  
  // Local portion selection ('HALF' or 'FULL') for items with both prices
  const [selectedPortion, setSelectedPortion] = useState(
    item.hasSinglePrice ? 'SINGLE' : (item.priceHalf ? 'HALF' : 'FULL')
  );

  const isSingle = item.hasSinglePrice;
  const currentPrice = isSingle
    ? item.singlePrice
    : (selectedPortion === 'HALF' ? item.priceHalf : item.priceFull);

  const cartKey = `${item.id}-${selectedPortion}`;
  const qtyInCart = getItemQuantityInCart(item.id, selectedPortion);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(item, selectedPortion, 1);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    updateQuantity(cartKey, 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateQuantity(cartKey, -1);
  };

  const dishImage = getDishImageUrl(item);
  const inStock = item.isAvailable !== false && item.available !== false;

  // Compact Mode Rendering (List style with horizontal image)
  if (viewMode === 'compact') {
    return (
      <div 
        onClick={() => onSelectDetail(item, selectedPortion)}
        className={`group relative rounded-2xl glass-card p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 transition-all duration-300 cursor-pointer border border-stone-800/80 bg-stone-900/90 shadow-md ${
          !inStock ? 'opacity-70' : 'hover:shadow-glow-tandoor hover:border-orange-500/40'
        }`}
      >
        {/* Left: Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-stone-950 border border-stone-800">
          <img
            src={dishImage}
            alt={item.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 ${!inStock ? 'grayscale-[40%]' : 'group-hover:scale-105'}`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <span className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border border-emerald-500 flex items-center justify-center rounded-sm bg-stone-950/90 p-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span>
          </span>
          {!inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-[9px] font-black text-white bg-red-600/90 px-1.5 py-0.5 rounded uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Middle: Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className={`text-sm sm:text-base font-black transition-colors uppercase font-display truncate ${!inStock ? 'text-stone-400 line-through' : 'text-stone-100 group-hover:text-amber-400'}`}>
              {item.name}
            </h3>
            {!inStock && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/50">
                Out of Stock
              </span>
            )}
            {item.isChefSpecial && inStock && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                ✨ Special
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
              {item.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm font-black text-amber-400 font-display">
              ₹{currentPrice}
            </span>
            {!isSingle && item.priceHalf && item.priceFull && inStock && (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="flex items-center rounded-lg bg-stone-950 p-0.5 border border-stone-800 text-[10px] font-bold"
              >
                <button
                  type="button"
                  onClick={() => setSelectedPortion('HALF')}
                  className={`px-1.5 py-0.5 rounded ${selectedPortion === 'HALF' ? 'bg-orange-600 text-white' : 'text-stone-400'}`}
                >
                  Half
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPortion('FULL')}
                  className={`px-1.5 py-0.5 rounded ${selectedPortion === 'FULL' ? 'bg-orange-600 text-white' : 'text-stone-400'}`}
                >
                  Full
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Add Button / Sold Out Badge */}
        <div onClick={(e) => e.stopPropagation()} className="flex-shrink-0">
          {!inStock ? (
            <span className="px-2.5 py-1.5 rounded-xl bg-stone-950 border border-red-900/60 text-red-400 text-[11px] font-black uppercase tracking-wider block">
              Sold Out
            </span>
          ) : qtyInCart > 0 ? (
            <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl px-2 py-1 shadow-md">
              <button onClick={handleDecrement} className="w-5 h-5 flex items-center justify-center">
                <Minus className="w-3 h-3 text-white" />
              </button>
              <span className="text-xs font-black min-w-[1rem] text-center font-display">{qtyInCart}</span>
              <button onClick={handleIncrement} className="w-5 h-5 flex items-center justify-center">
                <Plus className="w-3 h-3 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold shadow-md transition active:scale-95"
            >
              + Add
            </button>
          )}
        </div>
      </div>
    );
  }

  // Grid Mode Rendering (Prominent, mouth-watering food photo banner)
  return (
    <div 
      onClick={() => onSelectDetail(item, selectedPortion)}
      className={`group relative rounded-3xl glass-card p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 cursor-pointer border border-stone-800/80 bg-gradient-to-b from-stone-900/90 to-stone-950/90 shadow-md ${
        !inStock ? 'opacity-75' : 'hover:shadow-glow-tandoor hover:-translate-y-1 hover:border-orange-500/40'
      }`}
    >
      <div>
        {/* Food Photo Banner */}
        <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden mb-3.5 bg-stone-950 border border-stone-800/80 shadow-inner">
          <img
            src={dishImage}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80';
            }}
          />
          {/* Subtle gradient shadow over photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-black/30 pointer-events-none"></div>

          {/* Badges on Top of Photo */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Pure Veg Symbol */}
              <span className="w-4 h-4 border-2 border-emerald-500 flex items-center justify-center rounded-sm bg-stone-950/90 backdrop-blur-md p-0.5 shadow-sm" title="100% Pure Veg">
                <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
              </span>

              {item.isChefSpecial && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/95 text-stone-950 shadow-md uppercase tracking-wider backdrop-blur-md">
                  <Sparkles className="w-3 h-3 text-stone-950 fill-stone-950" />
                  Chef's Special
                </span>
              )}

              {item.isBestseller && !item.isChefSpecial && (
                <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-orange-600/95 text-white shadow-md uppercase tracking-wider backdrop-blur-md">
                  <Flame className="w-3 h-3 text-white fill-white" />
                  Bestseller
                </span>
              )}
            </div>

            {/* Spice Indicator */}
            {item.spiceLevel && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg backdrop-blur-md shadow-sm ${
                item.spiceLevel === 'Spicy' 
                  ? 'bg-red-950/90 text-red-300 border border-red-700/60' 
                  : item.spiceLevel === 'Medium' 
                  ? 'bg-orange-950/90 text-orange-200 border border-orange-700/60' 
                  : 'bg-emerald-950/90 text-emerald-200 border border-emerald-700/60'
              }`}>
                {item.spiceLevel === 'Spicy' ? '🌶️ Spicy' : item.spiceLevel === 'Medium' ? '🔥 Med' : '🌿 Mild'}
              </span>
            )}
          </div>

          {/* Portion Unit Tag on bottom corner of image */}
          {item.portionUnit && (
            <div className="absolute bottom-2 left-2.5 pointer-events-none">
              <span className="text-[10px] font-extrabold text-amber-300 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-amber-500/30 shadow-sm">
                {item.portionUnit}
              </span>
            </div>
          )}

          {/* Out of Stock Overlay Banner */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
              <span className="px-3.5 py-1.5 rounded-xl bg-red-600/95 text-white font-black text-xs tracking-wider uppercase shadow-2xl border border-white/25">
                🚫 OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Item Title & Stock Status */}
        <div className="flex items-start justify-between gap-2">
          <h3 className={`text-base sm:text-lg font-black transition-colors uppercase tracking-wide font-display leading-snug ${
            !inStock ? 'text-stone-400 line-through' : 'text-stone-100 group-hover:text-amber-400'
          }`}>
            {item.name}
          </h3>
          {!inStock && (
            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-red-950/80 text-red-400 border border-red-800/50 uppercase flex-shrink-0">
              Sold Out
            </span>
          )}
        </div>

        {/* Short Description */}
        {item.description && (
          <p className="text-xs text-stone-400 mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      {/* Bottom Section: Portion Selector & Pricing & Add-to-cart */}
      <div className="mt-4 pt-3 border-t border-stone-800/80 flex items-center justify-between gap-3">
        {/* Half / Full Switcher or Single Price */}
        {!isSingle && item.priceHalf && item.priceFull ? (
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="flex items-center rounded-xl bg-stone-950/90 p-1 border border-stone-800 text-xs font-bold"
          >
            <button
              type="button"
              disabled={!inStock}
              onClick={() => setSelectedPortion('HALF')}
              className={`px-2.5 py-1 rounded-lg transition-all duration-200 ${
                selectedPortion === 'HALF'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Half ₹{item.priceHalf}
            </button>
            <button
              type="button"
              disabled={!inStock}
              onClick={() => setSelectedPortion('FULL')}
              className={`px-2.5 py-1 rounded-lg transition-all duration-200 ${
                selectedPortion === 'FULL'
                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Full ₹{item.priceFull}
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <span className="text-[10px] text-stone-400 uppercase font-semibold">Price</span>
            <span className="text-lg font-black text-amber-400 font-display">
              ₹{currentPrice}
            </span>
          </div>
        )}

        {/* Add Button or Quantity Controller / Sold Out */}
        <div onClick={(e) => e.stopPropagation()}>
          {!inStock ? (
            <span className="px-3 py-1.5 rounded-xl bg-stone-950 border border-red-900/60 text-red-400 text-xs font-black uppercase tracking-wider block">
              Sold Out
            </span>
          ) : qtyInCart > 0 ? (
            <div className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl px-2.5 py-1.5 shadow-glow-tandoor">
              <button
                onClick={handleDecrement}
                className="w-6 h-6 rounded-lg bg-black/30 hover:bg-black/50 flex items-center justify-center transition active:scale-90"
              >
                <Minus className="w-3.5 h-3.5 text-white" />
              </button>
              <span className="text-sm font-black min-w-[1.2rem] text-center font-display">
                {qtyInCart}
              </span>
              <button
                onClick={handleIncrement}
                className="w-6 h-6 rounded-lg bg-black/30 hover:bg-black/50 flex items-center justify-center transition active:scale-90"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs sm:text-sm font-bold shadow-md transition active:scale-95 group/btn"
            >
              <Plus className="w-4 h-4 transition-transform group-hover/btn:rotate-90" />
              <span>Add</span>
              {!isSingle && (
                <span className="text-white/80 text-[11px] font-normal">
                  (₹{currentPrice})
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

