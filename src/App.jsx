import "./App.css";
import { CartProvider, useGlobalCart } from "./hooks/useCart";

function CartControls() {
  const { items, addItem, removeItem, clearCart, undo, redo } = useGlobalCart();

  return (
    <div className="card">
      <h2>🛒 Shopping Cart</h2>
      <button onClick={() => addItem({ id: Date.now(), name: "Product " + (items.length + 1) })}>
        Add Item
      </button>
      <button onClick={undo} style={{ marginLeft: "10px" }}>Undo</button>
      <button onClick={redo} style={{ marginLeft: "10px" }}>Redo</button>
      <button onClick={clearCart} style={{ marginLeft: "10px" }}>Clear Cart</button>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} 
            <button onClick={() => removeItem(item.id)} style={{ marginLeft: "10px" }}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <h1>🛍️ Real-world Advanced Hook Example</h1>
      <CartControls />
    </CartProvider>
  );
}
