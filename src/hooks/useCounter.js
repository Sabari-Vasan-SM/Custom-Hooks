// src/hooks/useCounter.js
import { useState, useEffect, useCallback } from "react";

function useCounter({ initialValue = 0, step = 1, persistKey = null } = {}) {
  // Load from localStorage if persistKey is provided
  const getInitial = () => {
    if (persistKey) {
      const saved = localStorage.getItem(persistKey);
      return saved ? parseInt(saved, 10) : initialValue;
    }
    return initialValue;
  };

  const [count, setCount] = useState(getInitial);

  // Save to localStorage when count changes
  useEffect(() => {
    if (persistKey) {
      localStorage.setItem(persistKey, count);
    }
  }, [count, persistKey]);

  // Basic actions
  const increment = useCallback(() => setCount((c) => c + step), [step]);
  const decrement = useCallback(() => setCount((c) => c - step), [step]);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  // Auto increment (returns a function to stop it)
  const startAutoIncrement = useCallback(
    (interval = 1000) => {
      const id = setInterval(() => {
        setCount((c) => c + step);
      }, interval);
      return () => clearInterval(id); // cleanup fn
    },
    [step]
  );

  return { count, increment, decrement, reset, startAutoIncrement };
}

export default useCounter;
