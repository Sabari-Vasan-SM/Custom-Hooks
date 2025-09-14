import { useState, useEffect, useCallback, useRef, useContext, createContext } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useGlobalCart() {
  return useContext(CartContext);
}

function useCart() {
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([[]]);
  const [pointer, setPointer] = useState(0);

  // Save history
  const updateHistory = (newItems) => {
    console.log("📜 History updated:", newItems);
    const newHistory = history.slice(0, pointer + 1);
    newHistory.push(newItems);
    setHistory(newHistory);
    setPointer(newHistory.length - 1);
  };

  // Add item
  const addItem = useCallback((item) => {
    console.log("➕ Adding item:", item);
    setItems((prev) => {
      const newItems = [...prev, item];
      updateHistory(newItems);
      return newItems;
    });
  }, [history, pointer]);

  // Remove item
  const removeItem = useCallback((id) => {
    console.log("❌ Removing item with id:", id);
    setItems((prev) => {
      const newItems = prev.filter((i) => i.id !== id);
      updateHistory(newItems);
      return newItems;
    });
  }, [history, pointer]);

  // Clear cart
  const clearCart = useCallback(() => {
    console.log("🗑 Clearing cart");
    setItems([]);
    updateHistory([]);
  }, []);

  // Undo
  const undo = useCallback(() => {
    if (pointer > 0) {
      console.log("↩ Undo called");
      const prev = history[pointer - 1];
      setPointer(pointer - 1);
      setItems(prev);
    } else {
      console.log("⚠ Undo not possible");
    }
  }, [pointer, history]);

  // Redo
  const redo = useCallback(() => {
    if (pointer < history.length - 1) {
      console.log("↪ Redo called");
      const next = history[pointer + 1];
      setPointer(pointer + 1);
      setItems(next);
    } else {
      console.log("⚠ Redo not possible");
    }
  }, [pointer, history]);

  useEffect(() => {
    console.log("🛒 Current items:", items);
  }, [items]);

  return { items, addItem, removeItem, clearCart, undo, redo };
}

export default useCart;
