import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('mcj_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [tableNumber, setTableNumber] = useState(() => {
    // Check URL search parameter ?table=X
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('table');
      if (t) return parseInt(t, 10);
      const saved = localStorage.getItem('mcj_table');
      return saved ? parseInt(saved, 10) : null;
    }
    return null;
  });

  const [isQrScanned, setIsQrScanned] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return Boolean(params.get('table'));
    }
    return false;
  });

  const [orderType, setOrderType] = useState('DINE_IN'); // 'DINE_IN' or 'TAKEAWAY'
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('mcj_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (tableNumber) {
      localStorage.setItem('mcj_table', tableNumber.toString());
    }
  }, [tableNumber]);

  const addToCart = (item, portion = 'FULL', quantity = 1, notes = '') => {
    let price = 0;
    if (item.hasSinglePrice) {
      price = item.singlePrice;
      portion = 'SINGLE';
    } else {
      price = portion === 'HALF' ? (item.priceHalf || item.priceFull) : item.priceFull;
    }

    const key = `${item.id}-${portion}`;

    setCart(prev => {
      const existingIdx = prev.findIndex(ci => ci.key === key);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += quantity;
        if (notes) updated[existingIdx].notes = notes;
        return updated;
      } else {
        return [
          ...prev,
          {
            key,
            menuItemId: item.id,
            name: item.name,
            portion,
            portionUnit: item.portionUnit,
            price,
            quantity,
            notes,
            categorySlug: item.categorySlug
          }
        ];
      }
    });
  };

  const updateQuantity = (key, delta) => {
    setCart(prev => {
      return prev
        .map(ci => {
          if (ci.key === key) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (key) => {
    setCart(prev => prev.filter(ci => ci.key !== key));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('mcj_cart');
  };

  const getItemQuantityInCart = (itemId, portion) => {
    const key = `${itemId}-${portion}`;
    const found = cart.find(ci => ci.key === key);
    return found ? found.quantity : 0;
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartTax = Math.round(cartSubtotal * 0.05 * 100) / 100; // 5% GST
  const cartTotal = cartSubtotal + cartTax;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantityInCart,
        cartSubtotal,
        cartTax,
        cartTotal,
        cartCount,
        tableNumber,
        setTableNumber,
        isQrScanned,
        setIsQrScanned,
        orderType,
        setOrderType,
        isCartOpen,
        setIsCartOpen,
        isTableModalOpen,
        setIsTableModalOpen,
        isQrModalOpen,
        setIsQrModalOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
