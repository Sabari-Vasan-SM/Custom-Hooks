import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import useCounter from "./hooks/useCounter";

function App() {
  const { count, increment, decrement, reset, startAutoIncrement } = useCounter({
    initialValue: 10,
    step: 2,
    persistKey: "myCounter",
  });

  const handleAutoIncrement = () => {
    const stop = startAutoIncrement(500); // auto increment every 500ms
    setTimeout(stop, 5000); // stop after 5 seconds
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Advanced Counter Hook</h1>
      <div className="card">
        <h2>Count: {count}</h2>
        <button onClick={increment}>+ Step</button>
        <button onClick={decrement} style={{ marginLeft: "10px" }}>
          - Step
        </button>
        <button onClick={reset} style={{ marginLeft: "10px" }}>
          Reset
        </button>
        <button onClick={handleAutoIncrement} style={{ marginLeft: "10px" }}>
          Auto Increment (5s)
        </button>
      </div>
    </>
  );
}

export default App;
