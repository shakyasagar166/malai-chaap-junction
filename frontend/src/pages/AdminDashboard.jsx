import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { restaurantApi } from '../api/restaurantApi';
import { RESTAURANT_INFO, MENU_ITEMS, CATEGORIES } from '../data/defaultMenu';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Utensils, 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  LogOut, 
  Search, 
  Printer, 
  QrCode, 
  ShoppingBag, 
  RefreshCw,
  Phone,
  Layers,
  ChevronRight,
  Sparkles,
  Plus,
  Trash2,
  X,
  Check,
  Camera,
  Upload,
  Image as ImageIcon,
  Edit3,
  Pencil,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  User,
  PhoneCall,
  AlertTriangle,
  Calendar,
  BarChart3,
  IndianRupee,
  FileText
} from 'lucide-react';
import { getDishImageUrl, ADMIN_IMAGE_PRESETS } from '../utils/dishImageHelper';
import { playOrderBellSound, testBellSound, isBellSoundEnabled, toggleBellSound } from '../utils/orderAudioHelper';
import { parseVerificationFromOrder } from '../utils/locationHelper';

export default function AdminDashboard({ onNavigateToMenu }) {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'sales' | 'menu' | 'qrs' | 'analytics'
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrdersCount: 0,
    todayOrdersCount: 0,
    totalRevenue: 0,
    activeOrdersCount: 0
  });

  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(CATEGORIES);
  const [menuSearch, setMenuSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewQrTable, setPreviewQrTable] = useState(1);

  // Add Dish Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSavingDish, setIsSavingDish] = useState(false);
  const [addSuccessMsg, setAddSuccessMsg] = useState('');
  const [dishForm, setDishForm] = useState({
    name: '',
    categorySlug: 'veg-tandoori',
    priceType: 'half_full', // 'half_full' | 'single'
    priceHalf: '',
    priceFull: '',
    singlePrice: '',
    portionUnit: '',
    spiceLevel: 'Medium',
    isChefSpecial: false,
    isBestseller: false,
    description: '',
    imageUrl: ''
  });

  // Edit Dish Photo Modal State
  const [photoEditItem, setPhotoEditItem] = useState(null);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [editingPhotoUrl, setEditingPhotoUrl] = useState('');
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);

  // Edit Dish Details Modal State
  const [editingDishItem, setEditingDishItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    categorySlug: 'veg-tandoori',
    priceType: 'half_full', // 'half_full' | 'single'
    priceHalf: '',
    priceFull: '',
    singlePrice: '',
    portionUnit: '',
    spiceLevel: 'Medium',
    isChefSpecial: false,
    isBestseller: false,
    description: '',
    imageUrl: '',
    isAvailable: true
  });

  // Sound & Real-time Notification Alert State
  const [soundEnabled, setSoundEnabled] = useState(() => isBellSoundEnabled());
  const [latestNewOrder, setLatestNewOrder] = useState(null);
  const knownOrderIdsRef = useRef(new Set());
  const isInitialLoadRef = useRef(true);

  // --- Per-Day Sales & Date Calculation Helpers ---
  const getLocalDateString = (d = new Date()) => {
    const dateObj = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d;
    if (isNaN(dateObj.getTime())) return new Date().toISOString().slice(0, 10);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getOrderDate = (order) => {
    if (!order) return getLocalDateString();
    if (order.createdAt) {
      try {
        const d = new Date(order.createdAt);
        if (!isNaN(d.getTime())) {
          return getLocalDateString(d);
        }
      } catch (e) {}
      const s = String(order.createdAt);
      if (s.length >= 10 && s.includes('-')) {
        return s.slice(0, 10);
      }
    }
    if (order.orderNumber) {
      const m = order.orderNumber.match(/MCJ-(\d{2})(\d{2})(\d{2})-/);
      if (m) {
        return `20${m[1]}-${m[2]}-${m[3]}`;
      }
    }
    return getLocalDateString();
  };

  const formatIndianDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const [y, m, d] = dateStr.split('-');
      if (y && m && d) {
        const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
        const todayStr = getLocalDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yestStr = getLocalDateString(yesterday);

        let suffix = '';
        if (dateStr === todayStr) suffix = ' (Aaj / Today)';
        else if (dateStr === yestStr) suffix = ' (Kal / Yesterday)';

        return dateObj.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }) + suffix;
      }
    } catch (e) {}
    return dateStr;
  };

  const todayDateStr = getLocalDateString();
  const [selectedSalesDate, setSelectedSalesDate] = useState(todayDateStr);

  // Group orders by Date (Per-Day Analytics)
  const salesByDate = React.useMemo(() => {
    const map = {};

    orders.forEach(order => {
      const dStr = getOrderDate(order);
      if (!map[dStr]) {
        map[dStr] = {
          date: dStr,
          orders: [],
          totalOrders: 0,
          completedOrders: 0,
          activeOrders: 0,
          cancelledOrders: 0,
          dineInOrders: 0,
          takeawayOrders: 0,
          totalRevenue: 0, // gross non-cancelled revenue
          completedRevenue: 0,
          itemsMap: {}
        };
      }

      const entry = map[dStr];
      entry.orders.push(order);
      entry.totalOrders += 1;

      const isCancelled = order.status === 'CANCELLED' || order.verificationStatus === 'REJECTED_FAKE';
      const isCompleted = order.status === 'COMPLETED' || order.status === 'SERVED';
      const isActive = order.status === 'PENDING' || order.status === 'PREPARING';
      const orderTotal = Number(order.total) || 0;

      if (isCancelled) {
        entry.cancelledOrders += 1;
      } else {
        entry.totalRevenue += orderTotal;
        if (isCompleted) {
          entry.completedOrders += 1;
          entry.completedRevenue += orderTotal;
        }
        if (isActive) {
          entry.activeOrders += 1;
        }
        if (order.orderType === 'DINE_IN') {
          entry.dineInOrders += 1;
        } else {
          entry.takeawayOrders += 1;
        }

        // Aggregate items sold
        if (Array.isArray(order.items)) {
          order.items.forEach(it => {
            const key = `${it.itemName || 'Item'}_${it.portion || 'STANDARD'}`;
            if (!entry.itemsMap[key]) {
              entry.itemsMap[key] = {
                name: it.itemName || 'Dish',
                portion: it.portion || '',
                quantity: 0,
                totalAmount: 0
              };
            }
            const qty = Number(it.quantity) || 1;
            const unitPrice = Number(it.pricePerUnit) || 0;
            entry.itemsMap[key].quantity += qty;
            entry.itemsMap[key].totalAmount += (unitPrice * qty);
          });
        }
      }
    });

    const sortedDates = Object.keys(map).sort((a, b) => b.localeCompare(a));
    return sortedDates.map(dStr => {
      const item = map[dStr];
      const topItems = Object.values(item.itemsMap).sort((a, b) => b.quantity - a.quantity);
      return {
        ...item,
        topItems
      };
    });
  }, [orders]);

  // Today's summary
  const todaySalesStats = React.useMemo(() => {
    const todayEntry = salesByDate.find(s => s.date === todayDateStr);
    if (!todayEntry) {
      return {
        date: todayDateStr,
        totalOrders: 0,
        completedOrders: 0,
        activeOrders: 0,
        cancelledOrders: 0,
        dineInOrders: 0,
        takeawayOrders: 0,
        totalRevenue: 0,
        completedRevenue: 0,
        topItems: [],
        orders: []
      };
    }
    return todayEntry;
  }, [salesByDate, todayDateStr]);

  // Selected date's summary
  const selectedDateStats = React.useMemo(() => {
    const entry = salesByDate.find(s => s.date === selectedSalesDate);
    if (!entry) {
      return {
        date: selectedSalesDate,
        totalOrders: 0,
        completedOrders: 0,
        activeOrders: 0,
        cancelledOrders: 0,
        dineInOrders: 0,
        takeawayOrders: 0,
        totalRevenue: 0,
        completedRevenue: 0,
        topItems: [],
        orders: []
      };
    }
    return entry;
  }, [salesByDate, selectedSalesDate]);

  // Lifetime Grand Totals
  const lifetimeTotals = React.useMemo(() => {
    let grandRevenue = 0;
    let grandCompletedRevenue = 0;
    let grandTotalOrders = 0;
    let grandCompletedOrders = 0;
    let grandActiveOrders = 0;
    let grandCancelledOrders = 0;
    let grandDineIn = 0;
    let grandTakeaway = 0;

    salesByDate.forEach(s => {
      grandRevenue += s.totalRevenue;
      grandCompletedRevenue += s.completedRevenue;
      grandTotalOrders += s.totalOrders;
      grandCompletedOrders += s.completedOrders;
      grandActiveOrders += s.activeOrders;
      grandCancelledOrders += s.cancelledOrders;
      grandDineIn += s.dineInOrders;
      grandTakeaway += s.takeawayOrders;
    });

    return {
      grandRevenue,
      grandCompletedRevenue,
      grandTotalOrders,
      grandCompletedOrders,
      grandActiveOrders,
      grandCancelledOrders,
      grandDineIn,
      grandTakeaway
    };
  }, [salesByDate]);

  // Load orders, menu & stats
  const refreshData = async () => {
    try {
      const ordersData = await restaurantApi.getAllOrders();
      setOrders(ordersData);

      // Check for incoming new orders to ring the counter bell & trigger persistent toast
      if (Array.isArray(ordersData)) {
        if (isInitialLoadRef.current) {
          // On first load, remember existing orders so we don't bell for past orders
          knownOrderIdsRef.current = new Set(ordersData.map(o => String(o.id)));
          isInitialLoadRef.current = false;
        } else {
          // Find any order whose ID was not in knownOrderIdsRef
          const freshOrders = ordersData.filter(o => !knownOrderIdsRef.current.has(String(o.id)));
          if (freshOrders.length > 0) {
            freshOrders.forEach(o => knownOrderIdsRef.current.add(String(o.id)));
            playOrderBellSound();
            setLatestNewOrder(freshOrders[0]);

            // Browser Web Notification API (shows system banner even if tab is in background)
            if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
              const o = freshOrders[0];
              try {
                new Notification('🔔 Svad Malai Chaap: Naya Order!', {
                  body: `${o.orderType === 'DINE_IN' ? 'Table #' + (o.tableNumber || '-') : 'Takeaway'} | Total: ₹${o.total}`,
                  icon: '/vite.svg'
                });
              } catch (e) {}
            }
          }
        }
      }

      const statsData = await restaurantApi.getAdminStats();
      setStats(statsData);
      const itemsData = await restaurantApi.getMenuItems();
      setMenuItems(itemsData);
      const catsData = await restaurantApi.getCategories();
      setCategories(catsData);
    } catch (err) {
      console.warn('Failed to load admin data:', err);
    }
  };

  useEffect(() => {
    // Request browser notification permission once on dashboard load
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    refreshData();
    const interval = setInterval(refreshData, 2500); // 2.5-second fast polling for real-time orders

    // Real-time cross-tab storage listener (immediate ring when customer places order in another tab)
    const handleStorageEvent = (e) => {
      if (e.key === 'mcj_latest_order_event' && e.newValue) {
        try {
          const orderEvent = JSON.parse(e.newValue);
          playOrderBellSound();
          setLatestNewOrder(orderEvent);
          refreshData();
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageEvent);

    // Light-dismiss dialog on Escape key
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsAddModalOpen(false);
        setIsPhotoModalOpen(false);
        setIsEditModalOpen(false);
        setLatestNewOrder(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageEvent);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleUpdateStatus = async (orderId, nextStatus) => {
    try {
      await restaurantApi.updateOrderStatus(orderId, nextStatus);
      refreshData();
    } catch (err) {
      alert('Failed to update order: ' + err.message);
    }
  };

  const handleVerifyOrder = async (orderId, verificationStatus, nextStatus = 'PREPARING') => {
    try {
      await restaurantApi.updateOrderStatus(orderId, nextStatus, verificationStatus);
      if (latestNewOrder && latestNewOrder.id === orderId) {
        setLatestNewOrder(null);
      }
      refreshData();
    } catch (err) {
      alert('Failed to update order: ' + err.message);
    }
  };

  const handleRejectFakeOrder = async (orderId, tableNum) => {
    const isConfirmed = window.confirm(
      `⚠️ KYA AAP SURE HAIN?\n\nTable ${tableNum || ''} ke is order ko FAKE / REJECT mark karein?\n(Customer table par present nahi hai ya ghr se order kiya hai)`
    );
    if (!isConfirmed) return;

    try {
      await restaurantApi.updateOrderStatus(orderId, 'CANCELLED', 'REJECTED_FAKE');
      if (latestNewOrder && latestNewOrder.id === orderId) {
        setLatestNewOrder(null);
      }
      refreshData();
    } catch (err) {
      alert('Failed to reject order: ' + err.message);
    }
  };

  const handleDeleteOrder = async (orderId, orderNumber) => {
    const isConfirmed = window.confirm(
      `🗑️ Order Remove Karein?\n\nKya aap order "${orderNumber || '#' + orderId}" ko dashboard se permanent delete karna chahte hain?`
    );
    if (!isConfirmed) return;

    try {
      await restaurantApi.deleteOrder(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      if (latestNewOrder && latestNewOrder.id === orderId) {
        setLatestNewOrder(null);
      }
      setAddSuccessMsg(`Order "${orderNumber || '#' + orderId}" successfully remove ho gaya.`);
      setTimeout(() => setAddSuccessMsg(''), 3500);
      refreshData();
    } catch (err) {
      alert('Order delete karne me error: ' + err.message);
    }
  };

  const handleClearAllOrders = async () => {
    const isConfirmed = window.confirm(
      '⚠️ KYA AAP SURE HAIN?\n\nSabhi customer orders ko clear / remove karna chahte hain? Abhi ke saare dummy/test orders hat jayenge aur counter zero ho jayega.'
    );
    if (!isConfirmed) return;

    try {
      await restaurantApi.clearAllOrders();
      setOrders([]);
      setLatestNewOrder(null);
      setAddSuccessMsg('Sabhi customer orders safaltapoorvak remove kar diye gaye hain!');
      setTimeout(() => setAddSuccessMsg(''), 4000);
      refreshData();
    } catch (err) {
      alert('Orders clear karne me error: ' + err.message);
    }
  };

  const handleToggleStock = async (itemId) => {
    const res = await restaurantApi.toggleStock(itemId);
    const nextVal = res ? (res.isAvailable !== false && res.available !== false) : null;
    setMenuItems(prev => prev.map(it => {
      if (it.id === itemId) {
        const val = nextVal !== null ? nextVal : !it.isAvailable;
        return { ...it, isAvailable: val, available: val };
      }
      return it;
    }));
  };

  const handleDeleteDish = async (itemId, itemName) => {
    if (!window.confirm(`Kya aap "${itemName}" ko menu se delete karna chahte hain?`)) {
      return;
    }
    await restaurantApi.deleteMenuItem(itemId);
    setMenuItems(prev => prev.filter(it => it.id !== itemId));
  };

  const handleCreateDish = async (e) => {
    e.preventDefault();
    if (!dishForm.name.trim()) {
      alert('Dish ka naam enter karein');
      return;
    }

    const isSingle = dishForm.priceType === 'single';
    if (isSingle && !dishForm.singlePrice) {
      alert('Single price enter karein');
      return;
    }
    if (!isSingle && !dishForm.priceFull) {
      alert('Full price enter karein');
      return;
    }

    setIsSavingDish(true);
    try {
      const matchedCat = categories.find(c => c.slug === dishForm.categorySlug) || categories[0];
      
      const payload = {
        name: dishForm.name.trim(),
        categoryId: matchedCat.id,
        categorySlug: matchedCat.slug,
        categoryName: matchedCat.name,
        description: dishForm.description.trim(),
        priceHalf: !isSingle && dishForm.priceHalf ? parseFloat(dishForm.priceHalf) : null,
        priceFull: !isSingle && dishForm.priceFull ? parseFloat(dishForm.priceFull) : null,
        singlePrice: isSingle && dishForm.singlePrice ? parseFloat(dishForm.singlePrice) : null,
        hasSinglePrice: isSingle,
        portionUnit: dishForm.portionUnit.trim() || null,
        spiceLevel: dishForm.spiceLevel,
        isChefSpecial: dishForm.isChefSpecial,
        isBestseller: dishForm.isBestseller,
        imageUrl: dishForm.imageUrl?.trim() || null
      };

      const created = await restaurantApi.createMenuItem(payload);
      setMenuItems(prev => [created, ...prev]);

      setAddSuccessMsg(`"${created.name}" menu me add ho gayi hai!`);
      setTimeout(() => setAddSuccessMsg(''), 4000);

      // Reset Form
      setDishForm({
        name: '',
        categorySlug: 'veg-tandoori',
        priceType: 'half_full',
        priceHalf: '',
        priceFull: '',
        singlePrice: '',
        portionUnit: '',
        spiceLevel: 'Medium',
        isChefSpecial: false,
        isBestseller: false,
        description: '',
        imageUrl: ''
      });
      setIsAddModalOpen(false);
    } catch (err) {
      alert('Dish add karne me error: ' + err.message);
    } finally {
      setIsSavingDish(false);
    }
  };

  // Open Edit Dish Details Modal
  const handleOpenEditModal = (item) => {
    setEditingDishItem(item);
    const isSingle = Boolean(item.hasSinglePrice || (!item.priceHalf && (item.singlePrice || item.priceFull)));
    setEditForm({
      name: item.name || '',
      categorySlug: item.categorySlug || 'veg-tandoori',
      priceType: isSingle ? 'single' : 'half_full',
      priceHalf: item.priceHalf != null ? String(item.priceHalf) : '',
      priceFull: item.priceFull != null ? String(item.priceFull) : '',
      singlePrice: item.singlePrice != null ? String(item.singlePrice) : (item.priceFull != null ? String(item.priceFull) : ''),
      portionUnit: item.portionUnit || '',
      spiceLevel: item.spiceLevel || 'Medium',
      isChefSpecial: Boolean(item.isChefSpecial),
      isBestseller: Boolean(item.isBestseller),
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      isAvailable: item.isAvailable !== false && item.available !== false
    });
    setIsEditModalOpen(true);
  };

  // Save Complete Dish Details
  const handleSaveEditDish = async (e) => {
    e.preventDefault();
    if (!editingDishItem) return;
    if (!editForm.name.trim()) {
      alert('Dish ka naam enter karein');
      return;
    }

    const isSingle = editForm.priceType === 'single';
    if (isSingle && !editForm.singlePrice) {
      alert('Single price enter karein');
      return;
    }
    if (!isSingle && !editForm.priceFull) {
      alert('Full price enter karein');
      return;
    }

    setIsSavingEdit(true);
    try {
      const matchedCat = categories.find(c => c.slug === editForm.categorySlug) || { slug: editForm.categorySlug, name: editForm.categorySlug };
      const payload = {
        name: editForm.name.trim().toUpperCase(),
        categoryId: matchedCat.id,
        categorySlug: matchedCat.slug,
        categoryName: matchedCat.name,
        description: editForm.description.trim(),
        priceHalf: !isSingle && editForm.priceHalf ? parseFloat(editForm.priceHalf) : null,
        priceFull: !isSingle && editForm.priceFull ? parseFloat(editForm.priceFull) : null,
        singlePrice: isSingle && editForm.singlePrice ? parseFloat(editForm.singlePrice) : null,
        hasSinglePrice: isSingle,
        portionUnit: editForm.portionUnit.trim() || null,
        spiceLevel: editForm.spiceLevel,
        isChefSpecial: editForm.isChefSpecial,
        isBestseller: editForm.isBestseller,
        imageUrl: editForm.imageUrl?.trim() || null,
        isAvailable: editForm.isAvailable,
        available: editForm.isAvailable
      };

      const updated = await restaurantApi.updateMenuItem(editingDishItem.id, payload);
      setMenuItems(prev => prev.map(it => it.id === editingDishItem.id ? { ...it, ...updated } : it));

      setAddSuccessMsg(`"${payload.name}" details successfully update ho gayi!`);
      setTimeout(() => setAddSuccessMsg(''), 4000);
      setIsEditModalOpen(false);
      setEditingDishItem(null);
    } catch (err) {
      alert('Dish update karne me error: ' + err.message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Upload Photo File Handler (supports Phone camera / File picker -> Base64)
  const handleFileUpload = (e, target = 'add') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (target === 'add') {
        setDishForm(prev => ({ ...prev, imageUrl: reader.result }));
      } else if (target === 'edit_dish') {
        setEditForm(prev => ({ ...prev, imageUrl: reader.result }));
      } else {
        setEditingPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Dish Photo from Edit Photo Modal
  const handleSavePhoto = async () => {
    if (!photoEditItem) return;
    setIsUpdatingPhoto(true);
    try {
      await restaurantApi.updateDishImage(photoEditItem.id, editingPhotoUrl);
      setMenuItems(prev => prev.map(it => {
        if (it.id === photoEditItem.id) {
          return { ...it, imageUrl: editingPhotoUrl };
        }
        return it;
      }));
      setAddSuccessMsg(`"${photoEditItem.name}" ki photo successfully update ho gayi!`);
      setTimeout(() => setAddSuccessMsg(''), 4000);
      setIsPhotoModalOpen(false);
      setPhotoEditItem(null);
    } catch (err) {
      alert('Photo update karne me error: ' + err.message);
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'ALL') return true;
    return o.status === orderStatusFilter;
  });

  const filteredMenu = menuItems.filter(item => {
    if (selectedCategory !== 'all' && (item.categorySlug || '').toLowerCase() !== (selectedCategory || '').toLowerCase()) {
      return false;
    }
    if (menuSearch.trim()) {
      const q = menuSearch.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) || 
        (item.categoryName && item.categoryName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://malai-chaap-junction.vercel.app';
  const pendingVerificationOrders = orders.filter(o => o.status === 'PENDING' && o.orderType === 'DINE_IN');

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-20 relative">
      
      {/* PERSISTENT TOAST NOTIFICATION: INCOMING ORDER ALERT */}
      {latestNewOrder && (
        <aside 
          className="fixed top-20 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md w-full bg-stone-900/95 border-2 border-orange-500 rounded-3xl p-5 shadow-2xl backdrop-blur-xl animate-fade-in"
          role="status"
          aria-live="assertive"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-glow-tandoor flex-shrink-0 animate-pulse">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-orange-400 font-display">
                    🔔 NAYA ORDER AAYA HAI!
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">
                    {latestNewOrder.orderNumber}
                  </span>
                </div>
                <h4 className="text-base font-black text-white font-display">
                  {latestNewOrder.tableNumber ? `Table #${latestNewOrder.tableNumber}` : 'Takeaway Parcel'}
                  <span className="text-amber-400 ml-2 font-mono">₹{latestNewOrder.total}</span>
                </h4>
              </div>
            </div>

            <button
              onClick={() => setLatestNewOrder(null)}
              className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition flex-shrink-0"
              title="Close Notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Table Verification / Fraud Check Badge */}
          {latestNewOrder.tableNumber && (
            <div className={`mt-3 p-2.5 rounded-xl border text-xs ${
              latestNewOrder.locationStatus === 'SUSPECTED_REMOTE'
                ? 'bg-red-950/60 border-red-500/70 text-red-300'
                : latestNewOrder.locationStatus === 'VERIFIED_AT_RESTAURANT'
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/60 text-amber-300'
            }`}>
              <div className="flex items-center justify-between font-bold text-[11px]">
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Presence Verification:
                </span>
                <span className="font-black uppercase">
                  {latestNewOrder.locationStatus === 'VERIFIED_AT_RESTAURANT'
                    ? '🟢 Location Verified'
                    : latestNewOrder.locationStatus === 'SUSPECTED_REMOTE'
                    ? '⚠️ SUSPECTED FAKE / REMOTE!'
                    : '🟡 Location Not Shared'}
                </span>
              </div>
              <p className="text-[11px] mt-1 leading-snug">
                {latestNewOrder.locationStatus === 'SUSPECTED_REMOTE'
                  ? `Customer restaurant se ${latestNewOrder.distanceDisplay || 'door'} hai! Ghr se order kiya ho sakta hai. Table #${latestNewOrder.tableNumber} par physically verify karein!`
                  : latestNewOrder.locationStatus === 'VERIFIED_AT_RESTAURANT'
                  ? `Customer restaurant ke paas (${latestNewOrder.distanceDisplay || '15m'}) present hai.`
                  : `Customer ne GPS share nahi kiya. Table #${latestNewOrder.tableNumber} par customer ko physically check karein.`}
              </p>
            </div>
          )}

          {/* Quick Items Preview */}
          {latestNewOrder.itemsSummary && (
            <p className="text-xs text-stone-400 mt-2 line-clamp-2">
              <strong className="text-stone-300">Items:</strong> {latestNewOrder.itemsSummary}
            </p>
          )}

          {/* Action Buttons */}
          <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex gap-2">
            <button
              onClick={() => {
                setActiveTab('orders');
                setOrderStatusFilter('PENDING');
                if (latestNewOrder.id) {
                  handleVerifyOrder(latestNewOrder.id, 'VERIFIED_ACCEPTED', 'PREPARING');
                }
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Table Par Baithe Hain (Accept)</span>
            </button>
            <button
              onClick={() => {
                if (latestNewOrder.id) {
                  handleRejectFakeOrder(latestNewOrder.id, latestNewOrder.tableNumber);
                }
              }}
              className="py-2 px-3 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700/60 font-bold text-xs transition flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Fake / Reject</span>
            </button>
          </div>
        </aside>
      )}
      
      {/* Top Header */}
      <header className="bg-stone-900 border-b border-stone-800 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-glow-tandoor">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black uppercase tracking-wide font-display text-white">
                  Kitchen Display &amp; Admin Portal
                </h1>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  LIVE
                </span>
                {pendingVerificationOrders.length > 0 && (
                  <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-extrabold flex items-center gap-1 animate-pulse">
                    <Bell className="w-3 h-3 fill-red-400" />
                    {pendingVerificationOrders.length} New Orders Table Check
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400">
                Svad Malai Chaap Junction &bull; Sanjay Nagar, Ghaziabad
              </p>
            </div>
          </div>

          {/* Action buttons with Bell Audio Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            {/* Bell Sound ON / MUTE Switch */}
            <button
              onClick={() => {
                const next = toggleBellSound();
                setSoundEnabled(next);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                soundEnabled
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                  : 'bg-stone-800 text-stone-500 border-stone-700 hover:text-stone-300'
              }`}
              title={soundEnabled ? 'Order Bell Sound Active (Click to Mute)' : 'Order Bell Muted (Click to Unmute)'}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-stone-500" />
              )}
              <span className="hidden sm:inline">{soundEnabled ? 'Bell: ON' : 'Bell: MUTED'}</span>
            </button>

            {/* Test Bell Sound */}
            <button
              onClick={testBellSound}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition active:scale-95"
              title="Test Counter Service Bell Sound (Ding-Ding!)"
            >
              <BellRing className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Test Bell</span>
            </button>

            <button
              onClick={refreshData}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition"
              title="Refresh Orders"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => { setActiveTab('menu'); setIsAddModalOpen(true); }}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-black flex items-center gap-1.5 shadow-glow-tandoor active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Dish</span>
            </button>
            <button
              onClick={onNavigateToMenu}
              className="px-3 py-1.5 rounded-xl bg-orange-600/20 text-orange-400 hover:bg-orange-600/30 border border-orange-500/40 text-xs font-semibold transition"
            >
              View Menu
            </button>
            <button
              onClick={logout}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-red-950/60 text-stone-400 hover:text-red-400 border border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="border-t border-stone-800/80 bg-stone-900/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div 
              onClick={() => { setSelectedSalesDate(todayDateStr); setActiveTab('sales'); }}
              className="cursor-pointer group hover:bg-stone-800/50 p-1.5 -m-1.5 rounded-xl transition"
              title="Click karke Aaj Ki Sale ka pura hisab dekhein"
            >
              <span className="text-stone-500 font-medium group-hover:text-amber-400 transition">Aaj Ki Sale (Today):</span>
              <span className="ml-1.5 font-black text-emerald-400 text-sm group-hover:underline">
                ₹{todaySalesStats.totalRevenue.toFixed(0)}
              </span>
              <span className="text-[10px] text-stone-400 block font-normal mt-0.5">
                {todaySalesStats.totalOrders} Orders ({todaySalesStats.completedOrders} Delivered)
              </span>
            </div>
            <div>
              <span className="text-stone-500 font-medium">Active Kitchen Orders:</span>
              <span className="ml-1.5 font-bold text-amber-400 text-sm">
                {orders.filter(o => o.status === 'PENDING' || o.status === 'PREPARING').length}
              </span>
            </div>
            <div>
              <span className="text-stone-500 font-medium">Total Orders:</span>
              <span className="ml-1.5 font-bold text-stone-200 text-sm">{orders.length}</span>
            </div>
            <div>
              <span className="text-stone-500 font-medium">Total Lifetime Sale:</span>
              <span className="ml-1.5 font-bold text-emerald-400 text-sm">
                ₹{lifetimeTotals.grandRevenue.toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-t border-stone-800 px-4 sm:px-6 flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'orders', label: '🔥 Kitchen Display & Orders', count: orders.filter(o => o.status === 'PENDING' || o.status === 'PREPARING').length },
            { id: 'sales', label: `💰 Aaj Ki Sale & Daily Reports (₹${todaySalesStats.totalRevenue.toFixed(0)})`, count: null },
            { id: 'menu', label: `📋 Menu & Stock (${menuItems.length})`, count: null },
            { id: 'qrs', label: '📱 Table QR Standees (1-20)', count: null },
            { id: 'analytics', label: 'ℹ️ Store Info', count: null }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== null && tab.count > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-orange-600 text-white text-[10px]">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">

        {addSuccessMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{addSuccessMsg}</span>
          </div>
        )}
        
        {/* TAB 1: KITCHEN DISPLAY SYSTEM & ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* AAJ KI TOTAL SALE QUICK BANNER */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-stone-900 to-amber-950/60 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-600/25 border border-emerald-500/50 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-glow">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 font-display">
                      💰 AAJ KI TOTAL SALE ({formatIndianDate(todayDateStr)})
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded-full font-bold">
                      LIVE COUNTER
                    </span>
                  </div>
                  <div className="flex items-baseline gap-3 mt-1">
                    <span className="text-2xl sm:text-3xl font-black text-white font-display">
                      ₹{todaySalesStats.totalRevenue.toFixed(0)}
                    </span>
                    <span className="text-xs text-stone-300">
                      &bull; {todaySalesStats.totalOrders} Orders ({todaySalesStats.completedOrders} Delivered &bull; {todaySalesStats.activeOrders} In-Kitchen)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedSalesDate(todayDateStr);
                    setActiveTab('sales');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition flex items-center gap-1.5 active:scale-95"
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Aaj Ka Pura Hisab / Report 📊</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <span className="text-xs font-semibold text-stone-400 whitespace-nowrap">Filter:</span>
                {[
                  { id: 'ALL', label: `Sabhi (${orders.length})` },
                  { id: 'PENDING', label: `⏳ Pending (${orders.filter(o => o.status === 'PENDING').length})` },
                  { id: 'PREPARING', label: `🔥 Preparing (${orders.filter(o => o.status === 'PREPARING').length})` },
                  { id: 'SERVED', label: `🍽️ Served (${orders.filter(o => o.status === 'SERVED').length})` },
                  { id: 'COMPLETED', label: `✅ Completed (${orders.filter(o => o.status === 'COMPLETED').length})` },
                  { id: 'CANCELLED', label: `❌ Cancelled (${orders.filter(o => o.status === 'CANCELLED').length})` },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setOrderStatusFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      orderStatusFilter === f.id
                        ? 'bg-amber-500 text-black shadow-sm'
                        : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {orders.length > 0 && (
                <button
                  onClick={handleClearAllOrders}
                  className="px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/80 text-red-300 border border-red-700/60 text-xs font-bold flex items-center gap-1.5 transition ml-auto"
                  title="Sabhi customer orders ko clear karein"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>Clear All Orders</span>
                </button>
              )}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 bg-stone-900/40 rounded-3xl border border-stone-800 p-8">
                <Utensils className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-stone-200 font-display">Koi Customer Order Nahi Hai</h3>
                <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
                  Purane dummy/test orders saaf kar diye gaye hain. Jab aap ya customer QR code scan karke ya live menu se order karenge, counter bell bajegi aur order yahan live aayega.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={onNavigateToMenu}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold shadow-md transition"
                  >
                    Naya Order Place Karke Dekhein 🍽️
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map(order => {
                  const isPending = order.status === 'PENDING';
                  const isPreparing = order.status === 'PREPARING';
                  const isServed = order.status === 'SERVED';
                  const isCompleted = order.status === 'COMPLETED';

                  return (
                    <div
                      key={order.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        isPending
                          ? 'bg-orange-950/20 border-orange-500/50 shadow-glow-tandoor'
                          : isPreparing
                          ? 'bg-amber-950/20 border-amber-500/50'
                          : 'bg-stone-900/80 border-stone-800'
                      }`}
                    >
                      <div>
                        {/* Order Header */}
                        <div className="flex items-center justify-between border-b border-stone-800/80 pb-3 mb-3">
                          <div>
                            <span className="text-xs font-mono font-bold text-amber-400">
                              {order.orderNumber}
                            </span>
                            <div className="text-base font-black text-white font-display mt-0.5">
                              {order.orderType === 'DINE_IN' ? `Table ${order.tableNumber || '-'}` : 'Takeaway Parcel'}
                            </div>
                          </div>

                          <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                            isPending
                              ? 'bg-orange-500 text-white border-orange-400 animate-pulse'
                              : isPreparing
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : isServed
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          }`}>
                            {order.status}
                          </span>
                        </div>

                        {/* Customer Info */}
                        <div className="text-xs text-stone-400 mb-3 flex items-center justify-between">
                          <span>👤 {order.customerName || 'Guest'}</span>
                          {order.customerPhone && <span>📞 {order.customerPhone}</span>}
                        </div>

                        {/* Items List */}
                        <div className="space-y-2 py-2 border-y border-stone-800/60 my-2">
                          {order.items?.map((it, idx) => (
                            <div key={idx} className="flex items-start justify-between text-xs">
                              <div>
                                <span className="font-bold text-stone-200">
                                  {it.quantity}x {it.itemName}
                                </span>
                                {it.portion && it.portion !== 'SINGLE' && (
                                  <span className="text-[10px] text-orange-400 ml-1 font-semibold uppercase">
                                    ({it.portion})
                                  </span>
                                )}
                                {it.notes && (
                                  <p className="text-[11px] text-amber-400/90 italic">
                                    "{it.notes}"
                                  </p>
                                )}
                              </div>
                              <span className="font-bold text-stone-300">
                                ₹{(it.pricePerUnit * it.quantity).toFixed(0)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Table Presence & Verification Panel */}
                        {order.orderType === 'DINE_IN' && (
                          <div className={`my-3 p-3 rounded-2xl border text-xs space-y-2 ${
                            order.verificationStatus === 'REJECTED_FAKE'
                              ? 'bg-red-950/70 border-red-600'
                              : order.locationStatus === 'SUSPECTED_REMOTE'
                              ? 'bg-red-950/40 border-red-500/60 shadow-md'
                              : order.locationStatus === 'VERIFIED_AT_RESTAURANT'
                              ? 'bg-emerald-950/30 border-emerald-500/40'
                              : 'bg-stone-950 border-stone-800'
                          }`}>
                            <div className="flex items-center justify-between font-bold">
                              <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-display text-stone-200">
                                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                                Table {order.tableNumber} Presence Check
                              </span>
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                                order.verificationStatus === 'REJECTED_FAKE'
                                  ? 'bg-red-600 text-white border-red-400'
                                  : order.verificationStatus === 'VERIFIED_ACCEPTED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  : order.locationStatus === 'VERIFIED_AT_RESTAURANT'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                  : order.locationStatus === 'SUSPECTED_REMOTE'
                                  ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              }`}>
                                {order.verificationStatus === 'REJECTED_FAKE'
                                  ? '❌ FAKE / REJECTED'
                                  : order.verificationStatus === 'VERIFIED_ACCEPTED'
                                  ? '✓ TABLE VERIFIED'
                                  : order.locationStatus === 'VERIFIED_AT_RESTAURANT'
                                  ? '📍 At Restaurant'
                                  : order.locationStatus === 'SUSPECTED_REMOTE'
                                  ? '⚠️ Suspected Remote'
                                  : '📍 Not Shared'}
                              </span>
                            </div>

                            {/* Distance & Risk Warning */}
                            <p className="text-[11px] leading-tight text-stone-300">
                              {order.verificationStatus === 'REJECTED_FAKE'
                                ? '❌ Order rejected: Customer table par nahi tha ya ghr se order kiya gaya.'
                                : order.verificationStatus === 'VERIFIED_ACCEPTED'
                                ? '✓ Staff confirmed: Customer Table par physically baithe hain.'
                                : order.locationStatus === 'SUSPECTED_REMOTE'
                                ? `⚠️ WARNING: Customer ${order.distanceDisplay || 'door'} se order kar raha hai! Ghr se order ki sambhavna hai. Table ${order.tableNumber} par physically check karein.`
                                : order.locationStatus === 'VERIFIED_AT_RESTAURANT'
                                ? `🟢 Customer restaurant ke andar/paas (${order.distanceDisplay || '15m'}) present hai.`
                                : `Customer ne location share nahi ki. Table ${order.tableNumber} par physically dekh lein.`}
                            </p>

                            {/* QR & Device Metadata */}
                            <div className="flex items-center gap-2 flex-wrap text-[10px] text-stone-400 pt-1.5 border-t border-stone-800/80">
                              <span className="flex items-center gap-1">
                                <QrCode className="w-3 h-3 text-amber-400" />
                                {order.isQrScanned ? '📱 Physical QR Standee Scanned' : '✍️ Manual Table Selected'}
                              </span>
                              {order.deviceInfo && (
                                <span className="flex items-center gap-1">
                                  <Smartphone className="w-3 h-3 text-blue-400" />
                                  {order.deviceInfo}
                                </span>
                              )}
                              {order.customerPhone && (
                                <a
                                  href={`tel:${order.customerPhone}`}
                                  className="flex items-center gap-1 text-amber-400 hover:underline font-semibold ml-auto"
                                >
                                  <PhoneCall className="w-3 h-3" />
                                  <span>Call Customer</span>
                                </a>
                              )}
                            </div>

                            {/* Verification Decision Buttons for Pending Orders */}
                            {order.status === 'PENDING' && order.verificationStatus !== 'REJECTED_FAKE' && (
                              <div className="pt-2 flex gap-2">
                                <button
                                  onClick={() => handleVerifyOrder(order.id, 'VERIFIED_ACCEPTED', 'PREPARING')}
                                  className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm transition"
                                  title="Confirm customer is sitting at Table and send order to kitchen"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Table Par Baithe Hain (Accept)</span>
                                </button>
                                <button
                                  onClick={() => handleRejectFakeOrder(order.id, order.tableNumber)}
                                  className="py-1.5 px-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700/60 font-bold text-[11px] flex items-center justify-center gap-1 transition"
                                  title="Reject if table is empty or customer is remote"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Fake / Ghr Se (Reject)</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {order.cleanNotes ? (
                          <div className="p-2 rounded-xl bg-orange-950/40 border border-orange-800/40 text-[11px] text-orange-300 mt-2">
                            <strong>Chef Note:</strong> {order.cleanNotes}
                          </div>
                        ) : order.notes && !order.notes.startsWith('[VERIFY|') ? (
                          <div className="p-2 rounded-xl bg-orange-950/40 border border-orange-800/40 text-[11px] text-orange-300 mt-2">
                            <strong>Chef Note:</strong> {order.notes}
                          </div>
                        ) : null}

                        <div className="flex items-center justify-between text-xs text-stone-400 mt-3 pt-2">
                          <span>Total Amount</span>
                          <span className="text-sm font-black text-amber-400 font-display">
                            ₹{order.total?.toFixed(0)}
                          </span>
                        </div>
                      </div>

                      {/* In-Card Status & Next Action Control Bar */}
                      <div className="mt-4 pt-3.5 border-t border-stone-800/80 space-y-3">
                        
                        {/* 1. BIG PROMINENT NEXT-ACTION BUTTON */}
                        {order.status === 'PREPARING' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'SERVED')}
                            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2.5 transition active:scale-98 animate-pulse"
                            title="Khana tandoor se ban gaya! Table par Served mark karein"
                          >
                            <Utensils className="w-5 h-5 flex-shrink-0" />
                            <span>Khana Ready! Mark as SERVED (Table Par Bhejo) ➔</span>
                          </button>
                        )}

                        {order.status === 'PENDING' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-black text-sm shadow-glow-tandoor flex items-center justify-center gap-2.5 transition active:scale-98"
                            title="Kitchen me order bhejo aur tandoor par prepare karein"
                          >
                            <Flame className="w-5 h-5 flex-shrink-0" />
                            <span>Kitchen Me Bhejo (Start PREPARING) 🔥 ➔</span>
                          </button>
                        )}

                        {order.status === 'SERVED' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2.5 transition active:scale-98"
                            title="Order poora ho gaya & bill pay ho gaya"
                          >
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            <span>Order Complete &amp; Bill Paid (COMPLETE) ✅ ➔</span>
                          </button>
                        )}

                        {order.status === 'COMPLETED' && (
                          <div className="py-2.5 px-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Order Safaltapoorvak Complete Ho Chuka Hai</span>
                          </div>
                        )}

                        {/* 2. DIRECT STATUS CHANGER (Manual override buttons for all 4 states) */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-[11px] font-bold text-stone-400">
                            <span className="flex items-center gap-1.5 text-stone-300">
                              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                              Order Status:
                            </span>
                            <span className="text-[10px] text-stone-500">
                              (Click to switch status anytime)
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'PENDING')}
                              className={`py-2 px-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 ${
                                order.status === 'PENDING'
                                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg ring-2 ring-amber-300 scale-[1.02]'
                                  : 'bg-stone-800/90 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/60'
                              }`}
                              title="Status ko Pending set karein"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Pending</span>
                            </button>

                            <button
                              onClick={() => handleUpdateStatus(order.id, 'PREPARING')}
                              className={`py-2 px-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 ${
                                order.status === 'PREPARING'
                                  ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-glow-tandoor ring-2 ring-orange-400 scale-[1.02]'
                                  : 'bg-stone-800/90 text-stone-300 hover:bg-orange-950/40 hover:text-orange-300 border border-stone-700/60'
                              }`}
                              title="Kitchen me Preparing mark karein"
                            >
                              <Flame className="w-3.5 h-3.5" />
                              <span>Preparing</span>
                            </button>

                            <button
                              onClick={() => handleUpdateStatus(order.id, 'SERVED')}
                              className={`py-2 px-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 ${
                                order.status === 'SERVED'
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg ring-2 ring-blue-300 scale-[1.02]'
                                  : 'bg-stone-800/90 text-stone-300 hover:bg-blue-950/40 hover:text-blue-300 border border-stone-700/60'
                              }`}
                              title="Table par Served mark karein"
                            >
                              <Utensils className="w-3.5 h-3.5" />
                              <span>Served</span>
                            </button>

                            <button
                              onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                              className={`py-2 px-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1 ${
                                order.status === 'COMPLETED'
                                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg ring-2 ring-emerald-300 scale-[1.02]'
                                  : 'bg-stone-800/90 text-stone-300 hover:bg-emerald-950/40 hover:text-emerald-300 border border-stone-700/60'
                              }`}
                              title="Order Complete mark karein"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Complete</span>
                            </button>
                          </div>
                        </div>

                        {/* Card Bottom Row: Reject & Delete */}
                        <div className="flex items-center justify-between gap-2 pt-1 text-xs">
                          {order.status !== 'CANCELLED' ? (
                            <button
                              onClick={() => handleRejectFakeOrder(order.id, order.tableNumber)}
                              className="py-1.5 px-3 rounded-xl bg-red-950/40 hover:bg-red-900/80 text-red-300 border border-red-800/50 text-[11px] font-bold transition flex items-center gap-1"
                              title="Order Reject / Cancel Karein"
                            >
                              <X className="w-3 h-3" />
                              <span>Reject / Cancel</span>
                            </button>
                          ) : (
                            <span className="text-[11px] font-bold text-red-400 flex items-center gap-1 bg-red-950/40 px-2.5 py-1 rounded-xl border border-red-800/40">
                              <X className="w-3 h-3" /> Cancelled Order
                            </span>
                          )}

                          <button
                            onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                            className="py-1.5 px-3 rounded-xl bg-stone-800/80 hover:bg-red-950/80 text-stone-400 hover:text-red-400 border border-stone-700/60 text-[11px] font-bold transition flex items-center gap-1 ml-auto"
                            title="Order permanently remove karein"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AAJ KI SALE & PER-DAY SALES REPORTS */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            
            {/* Sales Section Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900/60 p-5 rounded-2xl border border-stone-800 shadow-xl">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600/25 border border-emerald-500/50 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-glow">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-black uppercase text-white font-display tracking-wide">
                        Daily Sales &amp; Business Reports
                      </h2>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                        HISAB-KITAB
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Svad Malai Chaap Junction &bull; Sanjay Nagar, Sector - 23, Ghaziabad
                    </p>
                  </div>
                </div>
              </div>

              {/* Date Filter & Print Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Date Picker Input */}
                <div className="flex items-center gap-2 bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs">
                  <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-stone-400 text-[11px] font-semibold">Tarikh:</span>
                  <input
                    type="date"
                    value={selectedSalesDate}
                    onChange={(e) => setSelectedSalesDate(e.target.value)}
                    className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
                  />
                </div>

                {/* Quick Date Pills */}
                <button
                  onClick={() => setSelectedSalesDate(todayDateStr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedSalesDate === todayDateStr
                      ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  Aaj (Today)
                </button>

                <button
                  onClick={() => {
                    const yest = new Date();
                    yest.setDate(yest.getDate() - 1);
                    setSelectedSalesDate(getLocalDateString(yest));
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedSalesDate === getLocalDateString(new Date(Date.now() - 86400000))
                      ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  Kal (Yesterday)
                </button>

                {/* Print Report */}
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md transition active:scale-95"
                  title="Is din ka report print karein"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report 🖨️</span>
                </button>
              </div>
            </div>

            {/* Selected Date Summary Headline */}
            <div className="flex items-center justify-between text-xs text-stone-400 px-1">
              <span className="font-bold text-stone-300">
                📅 Showing Reports for:{' '}
                <strong className="text-amber-400 font-display text-sm uppercase ml-1">
                  {formatIndianDate(selectedSalesDate)}
                </strong>
              </span>
              <span className="text-[11px] text-stone-500">
                (Click any date below in the history table to inspect)
              </span>
            </div>

            {/* KPI Summary Cards Grid for Selected Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Revenue for Selected Date */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/50 via-stone-900 to-stone-950 border border-emerald-500/40 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                  <span className="font-black uppercase tracking-wider text-emerald-400 text-[11px]">
                    {selectedSalesDate === todayDateStr ? 'Aaj Ki Total Sale' : 'Is Din Ki Total Sale'}
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    REVENUE
                  </span>
                </div>
                <div className="text-3xl font-black text-white font-display mt-2 flex items-baseline gap-1">
                  <span className="text-emerald-400 text-2xl font-sans">₹</span>
                  <span>{selectedDateStats.totalRevenue.toFixed(0)}</span>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-800 text-[11px] flex justify-between items-center text-stone-400">
                  <span>Delivered / Completed:</span>
                  <strong className="text-emerald-400 font-bold">₹{selectedDateStats.completedRevenue.toFixed(0)}</strong>
                </div>
              </div>

              {/* Card 2: Total Orders on this Day */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/50 via-stone-900 to-stone-950 border border-amber-500/40 shadow-xl">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                  <span className="font-black uppercase tracking-wider text-amber-400 text-[11px]">
                    Total Orders Placed
                  </span>
                  <Utensils className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-black text-white font-display mt-2 flex items-baseline gap-1.5">
                  <span>{selectedDateStats.totalOrders}</span>
                  <span className="text-sm font-normal text-stone-400">Orders</span>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>{selectedDateStats.completedOrders} Served</span>
                  <span>&bull;</span>
                  <span className="text-amber-300">{selectedDateStats.activeOrders} Active</span>
                  <span>&bull;</span>
                  <span className="text-red-400">{selectedDateStats.cancelledOrders} Cancelled</span>
                </div>
              </div>

              {/* Card 3: Dine-In vs Takeaway */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/50 via-stone-900 to-stone-950 border border-blue-500/40 shadow-xl">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                  <span className="font-black uppercase tracking-wider text-blue-400 text-[11px]">
                    Dine-In vs Takeaway
                  </span>
                  <ShoppingBag className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black text-white font-display mt-2 flex items-center gap-4">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-normal uppercase">Table Dine-In</span>
                    <span className="text-xl text-blue-300 font-bold">{selectedDateStats.dineInOrders}</span>
                  </div>
                  <div className="w-px h-8 bg-stone-800"></div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-normal uppercase">Takeaway Parcel</span>
                    <span className="text-xl text-amber-300 font-bold">{selectedDateStats.takeawayOrders}</span>
                  </div>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-800 text-[11px] text-stone-400">
                  Total customers served on this day
                </div>
              </div>

              {/* Card 4: Average Order Value (AOV) */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-orange-950/50 via-stone-900 to-stone-950 border border-orange-500/40 shadow-xl">
                <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
                  <span className="font-black uppercase tracking-wider text-orange-400 text-[11px]">
                    Avg Order Value (AOV)
                  </span>
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                </div>
                <div className="text-3xl font-black text-white font-display mt-2 flex items-baseline gap-1">
                  <span className="text-orange-400 text-2xl font-sans">₹</span>
                  <span>
                    {selectedDateStats.totalOrders > 0
                      ? (selectedDateStats.totalRevenue / selectedDateStats.totalOrders).toFixed(0)
                      : 0}
                  </span>
                  <span className="text-xs font-normal text-stone-400 ml-1">/ order</span>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-800 text-[11px] text-stone-400">
                  Per customer average counter spend
                </div>
              </div>

            </div>

            {/* Two-Column Grid: Top Dishes Sold & Orders List for Selected Date */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              
              {/* LEFT COLUMN: Top Selling Dishes on Selected Date */}
              <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <h3 className="text-sm font-black uppercase text-white font-display">
                      {selectedSalesDate === todayDateStr ? 'Aaj Sabse Zyada Bikne Wali Dishes' : 'Is Din Bikne Wali Dishes'}
                    </h3>
                  </div>
                  <span className="text-xs text-stone-400">
                    {selectedDateStats.topItems.length} Dishes Sold
                  </span>
                </div>

                {selectedDateStats.topItems.length === 0 ? (
                  <div className="text-center py-12 text-stone-500 text-xs">
                    <Utensils className="w-8 h-8 text-stone-700 mx-auto mb-2" />
                    <span>Is din koi dish sale nahi hui ya koi order nahi tha.</span>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[420px] overflow-y-auto no-scrollbar pr-1">
                    {selectedDateStats.topItems.map((dish, idx) => {
                      const maxQty = selectedDateStats.topItems[0]?.quantity || 1;
                      const percent = Math.min(100, Math.round((dish.quantity / maxQty) * 100));

                      return (
                        <div 
                          key={idx}
                          className="p-3 rounded-xl bg-stone-950 border border-stone-800/80 hover:border-orange-500/40 transition space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                idx === 0 
                                  ? 'bg-amber-500 text-black' 
                                  : idx === 1 
                                  ? 'bg-stone-300 text-black' 
                                  : idx === 2 
                                  ? 'bg-orange-700 text-white' 
                                  : 'bg-stone-800 text-stone-400'
                              }`}>
                                #{idx + 1}
                              </span>
                              <div>
                                <span className="font-bold text-stone-100 font-display uppercase">
                                  {dish.name}
                                </span>
                                {dish.portion && dish.portion !== 'STANDARD' && (
                                  <span className="text-[10px] text-orange-400 font-semibold uppercase ml-1.5">
                                    ({dish.portion})
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="font-black text-amber-400 font-mono text-sm block">
                                ₹{dish.totalAmount.toFixed(0)}
                              </span>
                              <span className="text-[10px] text-stone-400">
                                {dish.quantity} Plates / Pcs
                              </span>
                            </div>
                          </div>

                          {/* Progress Volume Bar */}
                          <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: Customer Orders on Selected Date */}
              <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-black uppercase text-white font-display">
                      {selectedSalesDate === todayDateStr ? 'Aaj Ke Orders' : 'Is Din Ke Orders'} ({selectedDateStats.orders.length})
                    </h3>
                  </div>
                  <span className="text-xs text-stone-400">
                    Total: ₹{selectedDateStats.totalRevenue.toFixed(0)}
                  </span>
                </div>

                {selectedDateStats.orders.length === 0 ? (
                  <div className="text-center py-12 text-stone-500 text-xs">
                    <Utensils className="w-8 h-8 text-stone-700 mx-auto mb-2" />
                    <span>Is tarikh ko koi customer order nahi aaya.</span>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto no-scrollbar pr-1">
                    {selectedDateStats.orders.map(o => (
                      <div
                        key={o.id}
                        className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 hover:border-amber-500/40 transition space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-mono font-bold text-amber-400">
                              {o.orderNumber}
                            </span>
                            <div className="text-xs font-black text-white font-display mt-0.5">
                              {o.orderType === 'DINE_IN' ? `Table #${o.tableNumber || '-'}` : '🥡 Takeaway Parcel'}
                              <span className="text-stone-400 font-normal ml-2">&bull; {o.customerName || 'Guest'}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-sm font-black text-amber-400 font-display block">
                              ₹{o.total?.toFixed(0)}
                            </span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border inline-block ${
                              o.status === 'PENDING'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : o.status === 'PREPARING'
                                ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                                : o.status === 'SERVED'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                : o.status === 'COMPLETED'
                                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                : 'bg-red-500/20 text-red-400 border-red-500/40'
                            }`}>
                              {o.status}
                            </span>
                          </div>
                        </div>

                        {/* Items Preview */}
                        <div className="text-[11px] text-stone-400 border-t border-stone-800/80 pt-1.5 line-clamp-2">
                          {o.items?.map(it => `${it.quantity}x ${it.itemName}`).join(', ') || 'Items details'}
                        </div>

                        {/* Fast Status Change Row */}
                        <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-stone-800/60 flex-wrap">
                          {o.status === 'PREPARING' && (
                            <button
                              onClick={() => handleUpdateStatus(o.id, 'SERVED')}
                              className="py-1 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] transition flex items-center gap-1 shadow-md"
                              title="Table par Served mark karein"
                            >
                              <Utensils className="w-3 h-3" />
                              <span>Mark Served 🍽️ ➔</span>
                            </button>
                          )}
                          {o.status === 'PENDING' && (
                            <button
                              onClick={() => handleUpdateStatus(o.id, 'PREPARING')}
                              className="py-1 px-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-[11px] transition flex items-center gap-1 shadow-md"
                              title="Kitchen me Preparing mark karein"
                            >
                              <Flame className="w-3 h-3" />
                              <span>Send to Kitchen 🔥 ➔</span>
                            </button>
                          )}
                          {o.status === 'SERVED' && (
                            <button
                              onClick={() => handleUpdateStatus(o.id, 'COMPLETED')}
                              className="py-1 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] transition flex items-center gap-1 shadow-md"
                              title="Order Complete mark karein"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Mark Complete ✅ ➔</span>
                            </button>
                          )}

                          <div className="flex items-center gap-1 ml-auto overflow-x-auto no-scrollbar">
                            {['PENDING', 'PREPARING', 'SERVED', 'COMPLETED'].map(st => (
                              <button
                                key={st}
                                onClick={() => handleUpdateStatus(o.id, st)}
                                className={`py-0.5 px-2 rounded-lg text-[10px] font-bold transition whitespace-nowrap ${
                                  o.status === st
                                    ? 'bg-amber-500 text-black font-black'
                                    : 'bg-stone-800/80 text-stone-400 hover:text-white'
                                }`}
                              >
                                {st === 'PENDING' ? 'Pending' : st === 'PREPARING' ? 'Preparing' : st === 'SERVED' ? 'Served' : 'Complete'}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* FULL PER-DAY SALES HISTORY TABLE ("PER DAY KA RECORD") */}
            <div className="bg-stone-900/60 p-5 rounded-2xl border border-stone-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
                <div>
                  <h3 className="text-base font-black uppercase text-white font-display tracking-wide flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Tarikh-Wise Per-Day Sales Record (Daily Collection Table)</span>
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Har din kitni sale hui aur kitne orders complete hue, pura hisab neeche diya gaya hai:
                  </p>
                </div>

                <div className="text-xs text-stone-300 font-mono font-bold bg-stone-950 px-3 py-1.5 rounded-xl border border-stone-800">
                  Total Days Recorded: {salesByDate.length} Din
                </div>
              </div>

              {salesByDate.length === 0 ? (
                <div className="text-center py-10 text-stone-500 text-xs">
                  Koi sales record nahi mila. Jab orders aayenge to din-wise table yahan update ho jayegi.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-stone-800 bg-stone-950">
                  <table className="w-full text-left text-xs text-stone-300">
                    <thead className="bg-stone-900 text-stone-400 uppercase font-semibold border-b border-stone-800">
                      <tr>
                        <th className="py-3 px-4">Tarikh (Date)</th>
                        <th className="py-3 px-4 text-center">Total Orders</th>
                        <th className="py-3 px-4 text-center">Completed</th>
                        <th className="py-3 px-4 text-center">Active Kitchen</th>
                        <th className="py-3 px-4 text-center">Cancelled</th>
                        <th className="py-3 px-4 text-center">Table / Takeaway</th>
                        <th className="py-3 px-4 text-right">Daily Sale (₹)</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-800/80">
                      {salesByDate.map(row => {
                        const isSelected = row.date === selectedSalesDate;
                        const isToday = row.date === todayDateStr;

                        return (
                          <tr 
                            key={row.date}
                            className={`transition ${
                              isSelected
                                ? 'bg-amber-950/20 border-l-4 border-l-amber-500'
                                : 'hover:bg-stone-900/40'
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white font-display">
                                  {formatIndianDate(row.date)}
                                </span>
                                {isToday && (
                                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-bold">
                                    TODAY
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-stone-500 font-mono block">
                                {row.date}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-center font-bold text-stone-200">
                              {row.totalOrders}
                            </td>

                            <td className="py-3 px-4 text-center">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                {row.completedOrders} Served
                              </span>
                            </td>

                            <td className="py-3 px-4 text-center">
                              {row.activeOrders > 0 ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                  {row.activeOrders} Active
                                </span>
                              ) : (
                                <span className="text-stone-500 font-mono">-</span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-center">
                              {row.cancelledOrders > 0 ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                                  {row.cancelledOrders}
                                </span>
                              ) : (
                                <span className="text-stone-500 font-mono">0</span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-center text-[11px] text-stone-400 font-mono">
                              🍽️ {row.dineInOrders} / 🥡 {row.takeawayOrders}
                            </td>

                            <td className="py-3 px-4 text-right">
                              <span className="text-sm font-black text-emerald-400 font-display">
                                ₹{row.totalRevenue.toFixed(0)}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedSalesDate(row.date);
                                  window.scrollTo({ top: 300, behavior: 'smooth' });
                                }}
                                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition flex items-center gap-1 ml-auto ${
                                  isSelected
                                    ? 'bg-amber-500 text-black shadow-sm font-black'
                                    : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                                }`}
                              >
                                <span>{isSelected ? 'Selected ✓' : 'Report Dekhein 🔍'}</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    
                    {/* Grand Total Summary Row */}
                    <tfoot className="bg-stone-900 border-t-2 border-stone-700 font-bold text-stone-200">
                      <tr>
                        <td className="py-3.5 px-4 text-amber-400 font-display font-black uppercase">
                          LIFETIME GRAND TOTAL (Sabhi Din Ka Total)
                        </td>
                        <td className="py-3.5 px-4 text-center text-white text-sm font-black font-mono">
                          {lifetimeTotals.grandTotalOrders}
                        </td>
                        <td className="py-3.5 px-4 text-center text-emerald-400 font-bold">
                          {lifetimeTotals.grandCompletedOrders}
                        </td>
                        <td className="py-3.5 px-4 text-center text-amber-400 font-bold">
                          {lifetimeTotals.grandActiveOrders}
                        </td>
                        <td className="py-3.5 px-4 text-center text-red-400 font-bold">
                          {lifetimeTotals.grandCancelledOrders}
                        </td>
                        <td className="py-3.5 px-4 text-center text-stone-300 font-mono">
                          🍽️ {lifetimeTotals.grandDineIn} / 🥡 {lifetimeTotals.grandTakeaway}
                        </td>
                        <td className="py-3.5 px-4 text-right text-base text-emerald-400 font-black font-display">
                          ₹{lifetimeTotals.grandRevenue.toFixed(0)}
                        </td>
                        <td className="py-3.5 px-4 text-right text-stone-500 text-[10px]">
                          All Time
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: MENU & STOCK MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              
              {/* Search input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search dish name..."
                  value={menuSearch}
                  onChange={(e) => setMenuSearch(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Category Filter & Add Dish Button */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 sm:flex-initial bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs font-semibold text-stone-300 focus:outline-none"
                >
                  <option value="all">All Categories ({menuItems.length} items)</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-glow-tandoor active:scale-95 transition whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Dish</span>
                </button>
              </div>
            </div>

            {/* Menu Items Table */}
            <div className="rounded-2xl border border-stone-800 overflow-hidden bg-stone-900/60 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-900 text-stone-400 uppercase font-semibold border-b border-stone-800">
                    <tr>
                      <th className="py-3 px-3">Photo</th>
                      <th className="py-3 px-4">Dish Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Half Price</th>
                      <th className="py-3 px-4">Full / Single Price</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800">
                    {filteredMenu.map(item => {
                      const inStock = item.isAvailable !== false;
                      const dishPic = getDishImageUrl(item);
                      return (
                        <tr key={item.id} className="hover:bg-stone-800/30 transition">
                          <td className="py-3 px-3">
                            <div 
                              onClick={() => {
                                setPhotoEditItem(item);
                                setEditingPhotoUrl(item.imageUrl || dishPic);
                                setIsPhotoModalOpen(true);
                              }}
                              className="group/thumb relative w-12 h-12 rounded-xl overflow-hidden cursor-pointer border border-stone-700 bg-stone-950 shadow-sm"
                              title="Click to Change Dish Photo"
                            >
                              <img
                                src={dishPic}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover/thumb:scale-110 transition duration-300"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80';
                                }}
                              />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition">
                                <Camera className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="w-3.5 h-3.5 border border-emerald-500 flex items-center justify-center rounded-sm bg-stone-950 p-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span>
                              </span>
                              <div className="font-bold text-stone-100 font-display uppercase">
                                {item.name}
                              </div>
                            </div>
                            {item.portionUnit && (
                              <span className="text-[10px] text-amber-400 block ml-5">{item.portionUnit}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-stone-400">
                            {item.categoryName}
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {item.priceHalf ? `₹${item.priceHalf}` : '-'}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-amber-400">
                            ₹{item.hasSinglePrice ? item.singlePrice : item.priceFull}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              inStock
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                              {inStock ? 'IN STOCK' : 'SOLD OUT'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditModal(item)}
                                className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-orange-500/10 hover:bg-orange-500/25 text-orange-400 border border-orange-500/30 transition flex items-center gap-1 shadow-sm"
                                title="Edit Dish Name, Price, Photo, Category & Details"
                              >
                                <Pencil className="w-3.5 h-3.5 text-orange-400" />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => {
                                  setPhotoEditItem(item);
                                  setEditingPhotoUrl(item.imageUrl || dishPic);
                                  setIsPhotoModalOpen(true);
                                }}
                                className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition flex items-center gap-1"
                                title="Change Dish Photo"
                              >
                                <Camera className="w-3.5 h-3.5 text-amber-400" />
                                <span className="hidden sm:inline">Photo</span>
                              </button>
                              <button
                                onClick={() => handleToggleStock(item.id)}
                                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition ${
                                  inStock
                                    ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                }`}
                              >
                                {inStock ? 'Out of Stock' : 'In Stock'}
                              </button>
                              <button
                                onClick={() => handleDeleteDish(item.id, item.name)}
                                className="p-1 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-950/40 transition"
                                title="Delete Dish"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TABLE QR STANDEES */}
        {activeTab === 'qrs' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900/60 p-5 rounded-2xl border border-stone-800">
              <div>
                <h3 className="text-base font-bold text-white font-display uppercase">
                  Table QR Generator &amp; Standee Printing
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Print high-res QR tent standees for Tables 1 to 20. Scanning automatically opens the menu with that table pre-selected.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-glow-tandoor"
              >
                <Printer className="w-4 h-4" />
                <span>Print Standees</span>
              </button>
            </div>

            {/* Standee Preview & Table Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              
              {/* Standee Preview Card */}
              <div className="md:col-span-1 print-standee bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 p-6 rounded-3xl border-2 border-amber-500/50 shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600"></div>

                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                    <Flame className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-amber-400">SVAD</span>
                </div>

                <h4 className="text-lg font-black text-white uppercase font-display">
                  Malai Chaap <span className="text-amber-400">Junction</span>
                </h4>
                <p className="text-[10px] text-stone-400">
                  L-127, Sanjay Nagar, Ghaziabad
                </p>

                <div className="my-3 inline-block bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-sm px-5 py-1 rounded-full shadow-glow-tandoor">
                  Table {previewQrTable}
                </div>

                <div className="bg-white p-3 rounded-2xl inline-block shadow-xl my-2 border-2 border-amber-400">
                  <QRCodeSVG
                    value={`${baseUrl}/?table=${previewQrTable}`}
                    size={160}
                    level="H"
                  />
                </div>

                <p className="text-xs font-bold text-amber-300 uppercase mt-1">
                  Scan To View Menu &amp; Order
                </p>
                <div className="mt-3 text-[10px] text-stone-400 pt-2 border-t border-stone-800 flex justify-around">
                  <span>📞 99-1101-3993</span>
                  <span>100% Pure Veg</span>
                </div>
              </div>

              {/* 20 Table Buttons Grid */}
              <div className="md:col-span-2 space-y-3">
                <div className="text-xs font-bold text-stone-300 uppercase">
                  Select Table to Preview:
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                    <button
                      key={num}
                      onClick={() => setPreviewQrTable(num)}
                      className={`h-14 rounded-2xl font-bold flex flex-col items-center justify-center transition ${
                        previewQrTable === num
                          ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-glow-tandoor scale-105 border-2 border-amber-300'
                          : 'bg-stone-900 border border-stone-800 text-stone-300 hover:text-white hover:border-orange-500/40'
                      }`}
                    >
                      <span className="text-[10px] text-stone-400 uppercase">Table</span>
                      <span className="text-base font-black font-display">{num}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: STORE INFO & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Store Details Card */}
              <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                  Restaurant Information
                </h3>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-stone-500 block">Brand Name:</span>
                    <span className="font-bold text-stone-200">{RESTAURANT_INFO.name}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Address:</span>
                    <span className="font-bold text-stone-200">{RESTAURANT_INFO.address}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Helpline Numbers:</span>
                    <span className="font-bold text-stone-200">{RESTAURANT_INFO.phones.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">WhatsApp Orders:</span>
                    <span className="font-bold text-emerald-400">+{RESTAURANT_INFO.whatsapp}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Operating Hours:</span>
                    <span className="font-bold text-stone-200">{RESTAURANT_INFO.openingHours}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Food Type:</span>
                    <span className="font-bold text-emerald-400">100% Pure Vegetarian</span>
                  </div>
                </div>
              </div>

              {/* Quick Tech Architecture Card */}
              <div className="p-6 rounded-2xl bg-stone-900/60 border border-stone-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
                  Full Stack Architecture
                </h3>
                <div className="space-y-2 text-xs text-stone-300">
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80">
                    <span className="font-bold text-orange-400 block">Frontend:</span>
                    React 18 + Vite + Tailwind CSS + Lucide Icons + QRCode Generator
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80">
                    <span className="font-bold text-amber-400 block">Backend:</span>
                    Spring Boot 3 + Java 17/25 + RESTful APIs + Data Seeder
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80">
                    <span className="font-bold text-emerald-400 block">Database:</span>
                    MySQL 8.0 (`malai_chaap_junction_db`) + Spring Data JPA
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* MODAL: ADD NEW DISH (ADMIN DISH BUILDER) */}
      {isAddModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            className="bg-stone-900 border border-orange-500/40 rounded-3xl p-6 sm:p-7 max-w-lg w-full text-left relative shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="w-3.5 h-3.5 border border-emerald-500 flex items-center justify-center rounded-sm bg-stone-950 p-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block"></span>
              </span>
              <span className="text-xs font-bold text-emerald-400">100% PURE VEG</span>
            </div>

            <h3 className="text-xl font-black uppercase tracking-wide font-display text-white">
              Add New Dish To Menu
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Yeh dish live menu me add hokar customer aur QR code par turant dikhegi.
            </p>

            <form onSubmit={handleCreateDish} className="mt-5 space-y-4 text-xs">
              
              {/* Dish Name */}
              <div>
                <label className="font-bold text-stone-300 uppercase block mb-1">
                  Dish Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. SPECIAL AFGHANI STUFF CHAAP"
                  value={dishForm.name}
                  onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-orange-500 text-sm font-semibold uppercase"
                />
              </div>

              {/* Category Select */}
              <div>
                <label className="font-bold text-stone-300 uppercase block mb-1">
                  Category *
                </label>
                <select
                  value={dishForm.categorySlug}
                  onChange={(e) => setDishForm({ ...dishForm, categorySlug: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-orange-500 text-sm font-semibold"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Price Type (Half/Full vs Single) */}
              <div>
                <label className="font-bold text-stone-300 uppercase block mb-1.5">
                  Pricing Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDishForm({ ...dishForm, priceType: 'half_full' })}
                    className={`py-2 rounded-xl font-bold border transition ${
                      dishForm.priceType === 'half_full'
                        ? 'border-orange-500 bg-orange-950/40 text-orange-400'
                        : 'border-stone-800 bg-stone-950 text-stone-400'
                    }`}
                  >
                    Half &amp; Full Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setDishForm({ ...dishForm, priceType: 'single' })}
                    className={`py-2 rounded-xl font-bold border transition ${
                      dishForm.priceType === 'single'
                        ? 'border-orange-500 bg-orange-950/40 text-orange-400'
                        : 'border-stone-800 bg-stone-950 text-stone-400'
                    }`}
                  >
                    Single Fixed Price
                  </button>
                </div>
              </div>

              {/* Price Inputs */}
              {dishForm.priceType === 'half_full' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-stone-400 block mb-1">Half Price (₹)</label>
                    <input
                      type="number"
                      placeholder="e.g. 150"
                      value={dishForm.priceHalf}
                      onChange={(e) => setDishForm({ ...dishForm, priceHalf: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-mono text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-stone-400 block mb-1">Full Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 220"
                      value={dishForm.priceFull}
                      onChange={(e) => setDishForm({ ...dishForm, priceFull: e.target.value })}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-mono text-sm focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="font-semibold text-stone-400 block mb-1">Single Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 40"
                    value={dishForm.singlePrice}
                    onChange={(e) => setDishForm({ ...dishForm, singlePrice: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-mono text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              {/* Unit Note & Spice Level */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-400 block mb-1">
                    Portion Detail (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6/10 pcs, 500 ml"
                    value={dishForm.portionUnit}
                    onChange={(e) => setDishForm({ ...dishForm, portionUnit: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-400 block mb-1">Spice Level</label>
                  <select
                    value={dishForm.spiceLevel}
                    onChange={(e) => setDishForm({ ...dishForm, spiceLevel: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:outline-none focus:border-orange-500"
                  >
                    <option value="Mild">🌿 Mild</option>
                    <option value="Medium">🔥 Medium</option>
                    <option value="Spicy">🌶️ Spicy</option>
                  </select>
                </div>
              </div>

              {/* Highlights Checkboxes */}
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-amber-300">
                  <input
                    type="checkbox"
                    checked={dishForm.isChefSpecial}
                    onChange={(e) => setDishForm({ ...dishForm, isChefSpecial: e.target.checked })}
                    className="w-4 h-4 rounded accent-orange-500"
                  />
                  <span>Chef's Special ✨</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-orange-400">
                  <input
                    type="checkbox"
                    checked={dishForm.isBestseller}
                    onChange={(e) => setDishForm({ ...dishForm, isBestseller: e.target.checked })}
                    className="w-4 h-4 rounded accent-orange-500"
                  />
                  <span>Bestseller 🔥</span>
                </label>
              </div>

              {/* Description */}
              <div>
                <label className="font-semibold text-stone-400 block mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Charcoal roasted rich malai chaap with cardamom and creamy herbs..."
                  value={dishForm.description}
                  onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Dish Photo Section */}
              <div className="bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-400 uppercase flex items-center gap-1.5 text-xs">
                    <Camera className="w-4 h-4 text-orange-400" />
                    <span>Dish Photo (Photo Upload Karein / Chunein)</span>
                  </label>
                  {dishForm.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setDishForm({ ...dishForm, imageUrl: '' })}
                      className="text-[11px] text-red-400 hover:text-red-300 font-bold"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                {/* Live Preview If Selected */}
                {dishForm.imageUrl ? (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-orange-500/50 bg-stone-900 shadow-md">
                    <img
                      src={dishForm.imageUrl}
                      alt="Dish preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] text-emerald-400 font-bold">
                      ✓ Photo Selected
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-stone-500">
                    Aap camera se photo khinch sakte hain, phone gallery se upload kar sakte hain, ya niche kisi photo par click kar sakte hain.
                  </div>
                )}

                {/* Upload from Device / Phone Camera */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <label className="cursor-pointer flex-1 py-2 px-3 rounded-xl bg-orange-950/40 hover:bg-orange-950/60 border border-orange-500/40 text-orange-300 text-xs font-bold flex items-center justify-center gap-2 transition text-center shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-orange-400" />
                    <span>Phone Camera / Gallery Se Photo Chunein</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'add')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="url"
                    placeholder="ya online image URL paste karein (https://...)"
                    value={dishForm.imageUrl}
                    onChange={(e) => setDishForm({ ...dishForm, imageUrl: e.target.value })}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                {/* 1-Click Quick Food Photo Presets */}
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block mb-1.5 uppercase">
                    ⚡ Quick 1-Click Dish Photo Presets:
                  </span>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {ADMIN_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setDishForm({ ...dishForm, imageUrl: preset.url })}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition ${
                          dishForm.imageUrl === preset.url
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-sm'
                            : 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-5 h-5 rounded-md object-cover" />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingDish}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black shadow-glow-tandoor transition disabled:opacity-50"
                >
                  {isSavingDish ? 'Adding Dish...' : 'Save & Publish Dish'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT DISH PHOTO (FOR EXISTING DISHES) */}
      {isPhotoModalOpen && photoEditItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div 
            className="bg-stone-900 border border-amber-500/50 rounded-3xl p-6 max-w-md w-full text-left relative shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsPhotoModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Camera className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Dish Photo Studio</span>
            </div>

            <h3 className="text-lg font-black uppercase tracking-wide font-display text-white">
              {photoEditItem.name}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Nayi photo upload karein ya preset me se chunein. Yeh turant live menu par lag jayegi.
            </p>

            {/* Photo Preview */}
            <div className="mt-4 relative w-full h-44 rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-stone-950 shadow-inner">
              <img
                src={editingPhotoUrl || getDishImageUrl(photoEditItem)}
                alt={photoEditItem.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=700&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs">
                <span className="font-bold text-white uppercase">{photoEditItem.categoryName}</span>
                <span className="font-mono text-amber-400 font-bold">
                  ₹{photoEditItem.hasSinglePrice ? photoEditItem.singlePrice : photoEditItem.priceFull}
                </span>
              </div>
            </div>

            {/* Action 1: Upload from device / camera */}
            <div className="mt-4 space-y-3">
              <label className="cursor-pointer w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-tandoor transition">
                <Upload className="w-4 h-4" />
                <span>Phone Camera / Gallery Se Photo Upload Karein</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'edit')}
                  className="hidden"
                />
              </label>

              {/* Action 2: Image URL input */}
              <div>
                <label className="text-[11px] font-bold text-stone-400 block mb-1">
                  Ya Image Link (URL) Paste Karein:
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={editingPhotoUrl}
                  onChange={(e) => setEditingPhotoUrl(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 placeholder-stone-600 text-xs font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Action 3: Presets Grid */}
              <div>
                <label className="text-[11px] font-bold text-stone-400 block mb-1.5 uppercase">
                  ⚡ Ya Fast Preset Chunein:
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto no-scrollbar p-1 bg-stone-950/60 rounded-xl border border-stone-800/80">
                  {ADMIN_IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditingPhotoUrl(preset.url)}
                      className={`flex items-center gap-2 p-1.5 rounded-lg border text-left text-[11px] font-semibold transition ${
                        editingPhotoUrl === preset.url
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                          : 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-700'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-7 h-7 rounded-md object-cover flex-shrink-0" />
                      <span className="truncate">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePhoto}
                disabled={isUpdatingPhoto}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md transition disabled:opacity-50"
              >
                {isUpdatingPhoto ? 'Saving Photo...' : '✓ Set & Save Photo'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: FULL EDIT DISH DETAILS (NAME, PRICE, CATEGORY, PHOTO, STOCK, ETC.) */}
      {isEditModalOpen && editingDishItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            className="bg-stone-900 border border-orange-500/50 rounded-3xl p-6 sm:p-7 max-w-xl w-full text-left relative shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <Pencil className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Edit Dish Details</span>
            </div>

            <h3 className="text-xl font-black uppercase tracking-wide font-display text-white">
              {editingDishItem.name}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Dish ka naam, price, photo, category, spice level aur stock status update karein.
            </p>

            <form onSubmit={handleSaveEditDish} className="mt-5 space-y-4">
              
              {/* Dish Name */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">
                  Dish Ka Naam <span className="text-orange-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AFGHANI CHAAP / DAL MAKHANI"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 placeholder-stone-600 text-sm focus:outline-none focus:border-orange-500 uppercase font-semibold"
                />
              </div>

              {/* Category & Stock Status in a 2-col row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">
                    Category <span className="text-orange-500">*</span>
                  </label>
                  <select
                    value={editForm.categorySlug}
                    onChange={(e) => setEditForm({ ...editForm, categorySlug: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">
                    Stock Status (Customer Menu Me Dikhega)
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditForm(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                    className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-between transition ${
                      editForm.isAvailable
                        ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400'
                        : 'border-red-500/40 bg-red-950/30 text-red-400'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${editForm.isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                      {editForm.isAvailable ? 'In Stock (Available)' : 'Out of Stock (Sold Out)'}
                    </span>
                    <span className="text-[10px] underline">Toggle</span>
                  </button>
                </div>
              </div>

              {/* Pricing Type Selector */}
              <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-300">Pricing Mode:</span>
                  <div className="flex bg-stone-900 rounded-xl p-0.5 border border-stone-800 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, priceType: 'half_full' })}
                      className={`px-3 py-1 rounded-lg transition ${
                        editForm.priceType === 'half_full'
                          ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Half &amp; Full
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, priceType: 'single' })}
                      className={`px-3 py-1 rounded-lg transition ${
                        editForm.priceType === 'single'
                          ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-sm'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      Single Price
                    </button>
                  </div>
                </div>

                {editForm.priceType === 'half_full' ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-400 block mb-1">
                        Half Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g. 150"
                        value={editForm.priceHalf}
                        onChange={(e) => setEditForm({ ...editForm, priceHalf: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 placeholder-stone-600 text-xs font-mono focus:outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-stone-400 block mb-1">
                        Full Price (₹) <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        step="1"
                        placeholder="e.g. 270"
                        value={editForm.priceFull}
                        onChange={(e) => setEditForm({ ...editForm, priceFull: e.target.value })}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 placeholder-stone-600 text-xs font-mono focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-bold text-stone-400 block mb-1">
                      Dish Price (₹) <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="1"
                      placeholder="e.g. 190"
                      value={editForm.singlePrice}
                      onChange={(e) => setEditForm({ ...editForm, singlePrice: e.target.value })}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 placeholder-stone-600 text-xs font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>
                )}
              </div>

              {/* Portion Unit & Spice Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">
                    Portion Details / Pieces
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 6 pcs / 10 pcs ya with 2 Rumali"
                    value={editForm.portionUnit}
                    onChange={(e) => setEditForm({ ...editForm, portionUnit: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-300 block mb-1">
                    Spice Level
                  </label>
                  <select
                    value={editForm.spiceLevel}
                    onChange={(e) => setEditForm({ ...editForm, spiceLevel: e.target.value })}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 text-xs focus:outline-none focus:border-orange-500"
                  >
                    <option value="Mild">🌿 Mild (Sweet / Creamy)</option>
                    <option value="Medium">🔥 Medium (Balanced Tandoori)</option>
                    <option value="Spicy">🌶️ Spicy (Teekha / Hot)</option>
                  </select>
                </div>
              </div>

              {/* Tags: Chef's Special & Bestseller */}
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-300">
                  <input
                    type="checkbox"
                    checked={editForm.isChefSpecial}
                    onChange={(e) => setEditForm({ ...editForm, isChefSpecial: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 bg-stone-950 border-stone-800 focus:ring-orange-500"
                  />
                  <span>✨ Chef's Special Dish</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-300">
                  <input
                    type="checkbox"
                    checked={editForm.isBestseller}
                    onChange={(e) => setEditForm({ ...editForm, isBestseller: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-600 bg-stone-950 border-stone-800 focus:ring-orange-500"
                  />
                  <span>🔥 Bestseller Badge</span>
                </label>
              </div>

              {/* Dish Photo Section */}
              <div className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dish Photo (Upload ya Choose)</span>
                  </label>
                  {editForm.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setEditForm({ ...editForm, imageUrl: '' })}
                      className="text-[10px] text-red-400 hover:underline"
                    >
                      Clear Photo
                    </button>
                  )}
                </div>

                {/* Photo Preview */}
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-amber-500/30 bg-stone-900 shadow-inner">
                  <img
                    src={editForm.imageUrl || getDishImageUrl({ name: editForm.name, categorySlug: editForm.categorySlug, imageUrl: '' })}
                    alt={editForm.name || 'Dish preview'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-white uppercase truncate">{editForm.name || 'Preview'}</span>
                    <span className="font-mono text-amber-400 font-bold flex-shrink-0">
                      ₹{editForm.priceType === 'single' ? (editForm.singlePrice || 0) : (editForm.priceFull || 0)}
                    </span>
                  </div>
                </div>

                {/* Upload Button */}
                <label className="cursor-pointer w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-850 text-stone-200 border border-stone-800 hover:border-amber-500/40 font-bold text-xs flex items-center justify-center gap-2 transition">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Phone Camera / Gallery Se Photo Upload Karein</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'edit_dish')}
                    className="hidden"
                  />
                </label>

                {/* URL Input */}
                <input
                  type="url"
                  placeholder="ya online image URL paste karein (https://...)"
                  value={editForm.imageUrl}
                  onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-orange-500 font-mono"
                />

                {/* Fast Presets Slider */}
                <div>
                  <span className="text-[10px] font-bold text-stone-400 block mb-1 uppercase">
                    ⚡ Quick 1-Click Dish Photo Presets:
                  </span>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {ADMIN_IMAGE_PRESETS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, imageUrl: preset.url })}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-xl border text-[11px] font-semibold transition ${
                          editForm.imageUrl === preset.url
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-sm'
                            : 'border-stone-800 bg-stone-900 text-stone-300 hover:border-stone-700'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-5 h-5 rounded-md object-cover" />
                        <span>{preset.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">
                  Dish Description (Ingredients, Flavour Notes)
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Soya chaap marinated in rich cashew cream and char-grilled in tandoor."
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 placeholder-stone-600 text-xs focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-xs shadow-glow-tandoor transition disabled:opacity-50"
                >
                  {isSavingEdit ? 'Saving Changes...' : '✓ Save All Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
