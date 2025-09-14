import { useState, useEffect, useCallback, useRef, useContext, createContext } from "react";

const CounterContext = createContext(null);

export function CounterProvider({ children, config }) {
  const counter = useCounter(config);
  return (
    <CounterContext.Provider value={counter}>
      {children}
    </CounterContext.Provider>
  );
}

export function useGlobalCounter() {
  return useContext(CounterContext);
}

function useCounter({ initialValue = 0, step = 1, persistKey = null } = {}) {
  const getInitial = () => {
    if (persistKey) {
      const saved = localStorage.getItem(persistKey);
      return saved ? parseInt(saved, 10) : initialValue;
    }
    return initialValue;
  };

  const [count, setCount] = useState(getInitial);
  const [history, setHistory] = useState([getInitial()]);
  const [pointer, setPointer] = useState(0);

  useEffect(() => {
    if (persistKey) localStorage.setItem(persistKey, count);
  }, [count, persistKey]);

  const updateHistory = (newValue) => {
    const newHistory = history.slice(0, pointer + 1);
    newHistory.push(newValue);
    setHistory(newHistory);
    setPointer(newHistory.length - 1);
  };

  const increment = useCallback(() => {
    setCount((c) => {
      const newValue = c + step;
      updateHistory(newValue);
      return newValue;
    });
  }, [step, history, pointer]);

  const decrement = useCallback(() => {
    setCount((c) => {
      const newValue = c - step;
      updateHistory(newValue);
      return newValue;
    });
  }, [step, history, pointer]);

  const reset = useCallback(() => {
    setCount(initialValue);
    updateHistory(initialValue);
  }, [initialValue]);

  const undo = useCallback(() => {
    if (pointer > 0) {
      const prevValue = history[pointer - 1];
      setPointer(pointer - 1);
      setCount(prevValue);
    }
  }, [pointer, history]);

  const redo = useCallback(() => {
    if (pointer < history.length - 1) {
      const nextValue = history[pointer + 1];
      setPointer(pointer + 1);
      setCount(nextValue);
    }
  }, [pointer, history]);

  const intervalRef = useRef(null);
  const startAutoIncrement = useCallback(
    (interval = 1000) => {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(() => {
        setCount((c) => {
          const newValue = c + step;
          updateHistory(newValue);
          return newValue;
        });
      }, interval);
    },
    [step, history, pointer]
  );

  const stopAutoIncrement = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const listeners = useRef([]);
  const subscribe = useCallback((fn) => {
    listeners.current.push(fn);
    return () => {
      listeners.current = listeners.current.filter((l) => l !== fn);
    };
  }, []);

  useEffect(() => {
    listeners.current.forEach((fn) => fn(count));
  }, [count]);

  return {
    count,
    increment,
    decrement,
    reset,
    undo,
    redo,
    startAutoIncrement,
    stopAutoIncrement,
    subscribe,
  };
}

export default useCounter;
