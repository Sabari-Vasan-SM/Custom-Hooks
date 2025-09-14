import { useState, useEffect, useCallback, useRef, useContext, createContext } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const cart = useCart({ persistKey: "shopping_cart" });
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useGlobalCart() {
  return useContext(CartContext);
}

function useCart({ persistKey = null } = {}) {
  // Initial state
  const getInitial = () => {
    if (persistKey) {
      const saved = localStorage.getItem(persistKey);
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  };

  const [items, setItems] = useState(getInitial);
  const [history, setHistory] = useState([getInitial()]);
  const [pointer, setPointer] = useState(0);

  // Persist in localStorage
  useEffect(() => {
    if (persistKey) localStorage.setItem(persistKey, JSON.stringify(items));
  }, [items, persistKey]);

  // Update history
  const updateHistory = (newCart) => {
    const newHistory = history.slice(0, pointer + 1);
    newHistory.push(newCart);
    setHistory(newHistory);
    setPointer(newHistory.length - 1);
  };

  // Actions
  const addItem = useCallback((item) => {
    setItems((prev) => {
      const newCart = [...prev, item];
      updateHistory(newCart);
      return newCart;
    });
  }, [history, pointer]);

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const newCart = prev.filter((item) => item.id !== id);
      updateHistory(newCart);
      return newCart;
    });
  }, [history, pointer]);

  const clearCart = useCallback(() => {
    setItems([]);
    updateHistory([]);
  }, []);

  // Undo / Redo
  const undo = useCallback(() => {
    if (pointer > 0) {
      const prevCart = history[pointer - 1];
      setPointer(pointer - 1);
      setItems(prevCart);
    }
  }, [pointer, history]);

  const redo = useCallback(() => {
    if (pointer < history.length - 1) {
      const nextCart = history[pointer + 1];
      setPointer(pointer + 1);
      setItems(nextCart);
    }
  }, [pointer, history]);

  // Auto-clear after inactivity
  const timeoutRef = useRef(null);
  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      clearCart();
    }, 1000 * 60 * 5); // 5 min
  };

  useEffect(() => {
    resetTimeout();
    return () => clearTimeout(timeoutRef.current);
  }, [items]);

  return { items, addItem, removeItem, clearCart, undo, redo };
}
