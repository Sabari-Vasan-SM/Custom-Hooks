import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { CounterProvider, useGlobalCounter } from "./hooks/useCounter";

function CounterControls() {
  const {
    count,
    increment,
    decrement,
    reset,
    undo,
    redo,
    startAutoIncrement,
    stopAutoIncrement,
  } = useGlobalCounter();

  return (
    <div className="card">
      <h2>Count: {count}</h2>
      <button onClick={increment}>+ Step</button>
      <button onClick={decrement} style={{ marginLeft: "10px" }}>- Step</button>
      <button onClick={reset} style={{ marginLeft: "10px" }}>Reset</button>
      <button onClick={undo} style={{ marginLeft: "10px" }}>Undo</button>
      <button onClick={redo} style={{ marginLeft: "10px" }}>Redo</button>
      <button onClick={() => startAutoIncrement(500)} style={{ marginLeft: "10px" }}>Start Auto</button>
      <button onClick={stopAutoIncrement} style={{ marginLeft: "10px" }}>Stop Auto</button>
    </div>
  );
}

function App() {
  return (
    <CounterProvider config={{ initialValue: 5, step: 2, persistKey: "advCounter" }}>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Ultra Advanced Counter Hook 🚀</h1>
      <CounterControls />
      <CounterControls /> {/* multiple components share same state */}
    </CounterProvider>
  );
}

export default App;
