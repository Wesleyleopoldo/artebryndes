import { createRoot } from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import "./styles.css";
import { ProductProvider } from "./context/ProductContext";

createRoot(document.getElementById("root")).render(
    <CartProvider>
        <ProductProvider>
            <App />
        </ProductProvider>
    </CartProvider>
);
