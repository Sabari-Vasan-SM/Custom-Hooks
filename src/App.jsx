import "./App.css";
import { CartProvider, useGlobalCart } from "./hooks/useCart";

function CartControls() {
  const { items, addItem, removeItem, clearCart, undo, redo } = useGlobalCart();

  return (
    <div className="cart-container">
      <h2>🛒 Shopping Cart</h2>

      <div className="cart-actions">
        <button className="btn primary" onClick={() => addItem({ id: Date.now(), name: "Product " + (items.length + 1) })}>
          ➕ Add Item
        </button>
        <button className="btn" onClick={undo}>↩ Undo</button>
        <button className="btn" onClick={redo}>↪ Redo</button>
        <button className="btn danger" onClick={clearCart}>🗑 Clear</button>
      </div>

      <ul className="cart-list">
        {items.length === 0 ? (
          <p className="empty">Your cart is empty 🛍️</p>
        ) : (
          items.map((item) => (
            <li key={item.id} className="cart-item">
              <span>{item.name}</span>
              <button className="btn small danger" onClick={() => removeItem(item.id)}>
                Remove
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <div className="app">
        <h1 className="title">🛍️ Real-world Advanced Hook Example</h1>
        <CartControls />
      </div>
    </CartProvider>
  );
}
