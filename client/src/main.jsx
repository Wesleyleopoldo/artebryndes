import { createRoot } from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import "./styles.css";

createRoot(document.getElementById("root")).render(
    <CartProvider>
        <App />
    </CartProvider>
);
