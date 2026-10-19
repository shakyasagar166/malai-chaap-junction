import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { restaurantApi } from '../api/restaurantApi';
import { CATEGORIES, MENU_ITEMS, RESTAURANT_INFO } from '../data/defaultMenu';
import MenuCard from '../components/MenuCard';
import ItemDetailModal from '../components/ItemDetailModal';
import { 
  Search, 
  Flame, 
  Sparkles, 
  LayoutGrid, 
  ListFilter, 
  ShoppingBag, 
  MapPin, 
  Clock, 
  PhoneCall, 
  ChevronRight,
  ArrowRight,
  UtensilsCrossed,
  Filter,
  Star,
  Send,
  Smartphone
} from 'lucide-react';

export default function CustomerMenu() {
  const { cartCount, cartTotal, tableNumber, setIsCartOpen, setIsTableModalOpen, setIsQrModalOpen } = useCart();
  
  const [categories, setCategories] = useState(CATEGORIES);
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'bestseller', 'special', 'spicy'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'compact'

  // Modal State
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [selectedPortionForModal, setSelectedPortionForModal] = useState('FULL');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchMenu = async () => {
      try {
        const [cats, items] = await Promise.all([
          restaurantApi.getCategories(),
          restaurantApi.getMenuItems()
        ]);
        if (isMounted) {
          if (cats && cats.length > 0) setCategories(cats);
          if (items && items.length > 0) setMenuItems(items);
        }
      } catch (err) {
        console.warn('CustomerMenu data fetch error:', err);
      }
    };
    fetchMenu();
    return () => { isMounted = false; };
  }, []);

  const handleOpenDetail = (item, portion = 'FULL') => {
    setSelectedItemForModal(item);
    setSelectedPortionForModal(portion);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedItemForModal(null);
  };

  // Filtered menu items
  const filteredItems = useMemo(() => {
    const active = (activeCategory || '').toLowerCase().trim();
    return menuItems.filter(item => {
      const itemCatSlug = (item.categorySlug || item.category?.slug || '').toLowerCase().trim();
      const itemCatName = (item.categoryName || item.category?.name || '').toLowerCase().trim();

      if (active !== 'all') {
        const matches = itemCatSlug === active || itemCatName === active;
        if (!matches) return false;
      }
      if (filterType === 'bestseller' && !item.isBestseller) return false;
      if (filterType === 'special' && !item.isChefSpecial) return false;
      if (filterType === 'spicy' && item.spiceLevel !== 'Spicy') return false;
      if (filterType === 'instock' && (item.isAvailable === false || item.available === false)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCategory = itemCatName.includes(q) || itemCatSlug.includes(q);
        const matchesDesc = item.description && item.description.toLowerCase().includes(q);
        return matchesName || matchesCategory || matchesDesc;
      }
      return true;
    });
  }, [menuItems, activeCategory, filterType, searchQuery]);

  // Group items by category when 'all' is selected
  const itemsByCategory = useMemo(() => {
    const map = {};
    const matchedIds = new Set();

    categories.forEach(cat => {
      const targetSlug = (cat.slug || '').toLowerCase().trim();
      const targetName = (cat.name || '').toLowerCase().trim();

      const matched = filteredItems.filter(i => {
        const itemSlug = (i.categorySlug || i.category?.slug || '').toLowerCase().trim();
        const itemName = (i.categoryName || i.category?.name || '').toLowerCase().trim();
        const matches = (targetSlug && itemSlug === targetSlug) || 
                        (targetName && itemName === targetName) ||
                        (cat.id && (i.categoryId === cat.id || i.category?.id === cat.id));
        if (matches) matchedIds.add(i.id);
        return matches;
      });
      map[cat.slug] = matched;
    });

    // Safeguard: Put any remaining unmatched items into the first category so nothing is ever hidden
    const unmatched = filteredItems.filter(i => !matchedIds.has(i.id));
    if (unmatched.length > 0 && categories.length > 0) {
      const firstSlug = categories[0].slug;
      map[firstSlug] = [...(map[firstSlug] || []), ...unmatched];
    }

    return map;
  }, [categories, filteredItems]);

  const getCategoryEmoji = (slug) => {
    switch (slug) {
      case 'veg-tandoori': return '🔥';
      case 'veg-roll': return '🌯';
      case 'chaap-gravy': return '🍲';
      case 'veg-daal': return '🥣';
      case 'paneer-gravy': return '🧀';
      case 'breads': return '🫓';
      case 'rice': return '🍚';
      case 'raita': return '🥛';
      case 'noodles': return '🍜';
      case 'potato-masti': return '🍟';
      case 'special-tikka': return '🍢';
      case 'momos-magic': return '🥟';
      case 'king-rolls': return '👑';
      default: return '🍢';
    }
  };

  return (
    <div className="min-h-screen pb-32">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-950 to-[#0a0908] pt-6 sm:pt-8 pb-8 border-b border-stone-800/80">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Restaurant Info Card */}
            <div className="text-center md:text-left space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold tracking-wide">
                <span className="flex items-center text-amber-400 font-black gap-1">
                  ⭐ 4.4
                </span>
                <span className="text-stone-400 font-medium">(1.2K)</span>
                <span className="w-1 h-1 rounded-full bg-stone-600"></span>
                <span className="text-stone-200 font-semibold">₹200–1,000</span>
                <span className="w-1 h-1 rounded-full bg-stone-600"></span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Vegetarian
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-stone-100 font-display tracking-tight leading-tight">
                Vinayaka <span className="text-gradient bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">Restaurant</span>
                <span className="block text-xl sm:text-2xl text-amber-400 font-sans font-bold mt-0.5">(Rooftop & Lounge)</span>
              </h1>

              <p className="text-xs sm:text-base text-stone-300 font-normal leading-relaxed">
                {RESTAURANT_INFO.tagline}. Authentic North Indian delicacies, sizzling starters, royal gravies, and exquisite rooftop lounge ambience.
              </p>

              {/* Badges / Location / Direct Actions */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1 text-xs text-stone-300">
                <div className="flex items-center gap-1.5 bg-stone-900/90 px-3 py-1.5 rounded-xl border border-stone-800">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>{RESTAURANT_INFO.address}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-stone-900/90 px-3 py-1.5 rounded-xl border border-stone-800">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{RESTAURANT_INFO.openingHours}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-950/50 px-3 py-1.5 rounded-xl border border-emerald-800/40 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>100% Pure Veg</span>
                </div>
              </div>
            </div>

            {/* Table & Order Status Card */}
            <div className="w-full md:w-auto flex-shrink-0 bg-stone-900/90 border border-orange-500/30 rounded-3xl p-5 shadow-2xl backdrop-blur-md text-center md:text-left">
              <div className="flex items-center justify-between md:justify-start gap-3">
                <span className="text-xs text-stone-400 font-medium uppercase tracking-wider">
                  Dine-In Session
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-display mt-0.5">
                {tableNumber ? `Table Number ${tableNumber}` : 'Select Table'}
              </div>
              <p className="text-xs text-stone-400 mt-1 max-w-[220px]">
                {tableNumber 
                  ? 'Items ordered will be brought to this table hot.' 
                  : 'Tap below to select table or takeaway.'}
              </p>
              <div className="mt-3.5 flex items-center gap-2">
                <button
                  onClick={() => setIsTableModalOpen(true)}
                  className="flex-1 py-2 px-3.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-glow-tandoor active:scale-95 transition"
                >
                  <span>{tableNumber ? 'Change Table' : 'Choose Table'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsQrModalOpen(true)}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold"
                  title="View Table Standee QR"
                >
                  <Smartphone className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Visual Category Stories (Horizontal Carousel) */}
      <section className="bg-stone-950/80 border-b border-stone-800/60 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveCategory('all')}
              className={`flex flex-col items-center gap-1.5 min-w-[70px] transition-transform active:scale-95 ${
                activeCategory === 'all' ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-lg transition-all ${
                activeCategory === 'all'
                  ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white border-2 border-amber-300 shadow-glow-tandoor'
                  : 'bg-stone-900 border border-stone-800 text-stone-300'
              }`}>
                ✨
              </div>
              <span className={`text-[11px] font-bold tracking-tight text-center ${
                activeCategory === 'all' ? 'text-amber-400 font-extrabold' : 'text-stone-400'
              }`}>
                All ({menuItems.length})
              </span>
            </button>

            {categories.map((cat) => {
              const isActive = activeCategory === cat.slug;
              const emoji = getCategoryEmoji(cat.slug);
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`flex flex-col items-center gap-1.5 min-w-[75px] transition-transform active:scale-95 ${
                    isActive ? 'scale-105' : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl shadow-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white border-2 border-amber-300 shadow-glow-tandoor'
                      : 'bg-stone-900 border border-stone-800 text-stone-300'
                  }`}>
                    {emoji}
                  </div>
                  <span className={`text-[10px] font-bold tracking-tight text-center leading-tight line-clamp-1 max-w-[75px] ${
                    isActive ? 'text-amber-400 font-black' : 'text-stone-400'
                  }`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sticky Search & Filter Bar */}
      <section className="sticky top-16 z-30 bg-[#0a0908]/95 backdrop-blur-xl border-b border-stone-800/80 py-3 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-2.5">
          
          {/* Search Input + View Mode */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search across all dishes (e.g. Paneer Tikka, Dal Makhani, Chaap, Naan)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-900/90 border border-stone-800 focus:border-orange-500 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-100 placeholder-stone-500 focus:outline-none transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 text-xs font-bold px-1.5 py-0.5 rounded-full bg-stone-800"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Badge Filters (Desktop) */}
            <div className="hidden md:flex items-center gap-1.5">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'instock', label: '🟢 In Stock Only' },
                { id: 'bestseller', label: '🔥 Bestsellers' },
                { id: 'special', label: '✨ Chef Special' },
                { id: 'spicy', label: '🌶️ Spicy' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterType(f.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    filterType === f.id
                      ? 'bg-amber-500 text-black shadow-glow-malai'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex items-center bg-stone-900 border border-stone-800 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'grid' ? 'bg-orange-600 text-white' : 'text-stone-500 hover:text-stone-300'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === 'compact' ? 'bg-orange-600 text-white' : 'text-stone-500 hover:text-stone-300'
                }`}
                title="Compact View"
              >
                <ListFilter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Filter Pills (Mobile) */}
          <div className="flex md:hidden items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'instock', label: '🟢 In Stock' },
              { id: 'bestseller', label: '🔥 Bestsellers' },
              { id: 'special', label: '✨ Chef Special' },
              { id: 'spicy', label: '🌶️ Spicy' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  filterType === f.id
                    ? 'bg-amber-500 text-black'
                    : 'bg-stone-900 text-stone-400 border border-stone-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Main Menu Display Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-stone-900/40 rounded-3xl border border-stone-800/80 p-8">
            <UtensilsCrossed className="w-12 h-12 text-stone-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-stone-200 font-display">No dishes match your search</h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Try searching for "Paneer Tikka", "Dal Makhani", "Chaap", "Naan" or choose another category.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); setFilterType('all'); }}
              className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white font-semibold text-xs shadow-glow-tandoor"
            >
              Reset All Filters
            </button>
          </div>
        ) : activeCategory === 'all' && !searchQuery && filterType === 'all' ? (
          // Grouped by Category View
          <div className="space-y-12">
            {categories.map((cat) => {
              const catItems = itemsByCategory[cat.slug] || [];
              if (catItems.length === 0) return null;

              return (
                <section key={cat.id} id={cat.slug} className="scroll-mt-36">
                  {/* Category Header */}
                  <div className="flex items-end justify-between border-b border-orange-500/20 pb-3 mb-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getCategoryEmoji(cat.slug)}</span>
                        <h2 className="text-xl sm:text-2xl font-black text-stone-100 font-display tracking-tight uppercase">
                          {cat.name}
                        </h2>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-950/80 text-orange-400 border border-orange-800/40">
                          {catItems.length} items
                        </span>
                      </div>
                      {(cat.desc || cat.description) && (
                        <p className="text-xs text-stone-400 mt-1 font-normal">
                          {cat.desc || cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Cards Grid */}
                  <div className={
                    viewMode === 'grid'
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
                      : "grid grid-cols-1 md:grid-cols-2 gap-3"
                  }>
                    {catItems.map((item) => (
                      <MenuCard
                        key={item.id}
                        item={item}
                        viewMode={viewMode}
                        onSelectDetail={handleOpenDetail}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          // Flat Filtered Results View
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-stone-100 font-display uppercase tracking-wide">
                Showing {filteredItems.length} Dishes
              </h2>
            </div>
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
                : "grid grid-cols-1 md:grid-cols-2 gap-3"
            }>
              {filteredItems.map((item) => (
                <MenuCard
                  key={item.id}
                  item={item}
                  viewMode={viewMode}
                  onSelectDetail={handleOpenDetail}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Quick Cart Bar (Desktop view when cart has items) */}
      {cartCount > 0 && (
        <div className="hidden md:block fixed bottom-6 left-6 right-6 z-40 max-w-xl mx-auto">
          <div className="glass-panel p-3.5 rounded-2xl border-2 border-orange-500/60 shadow-2xl flex items-center justify-between gap-3 bg-stone-950/95 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-glow-tandoor">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-300">
                    {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
                  </span>
                  <span className="text-stone-600">&bull;</span>
                  <span className="text-xs font-medium text-amber-400">
                    {tableNumber ? `Table ${tableNumber}` : 'Takeaway'}
                  </span>
                </div>
                <div className="text-base font-black text-white font-display leading-none mt-0.5">
                  ₹{cartTotal.toFixed(0)} <span className="text-[11px] text-stone-400 font-normal">(incl. tax)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm flex items-center gap-2 shadow-glow-tandoor active:scale-95 transition"
            >
              <span>View Order Cart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItemForModal}
        initialPortion={selectedPortionForModal}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
