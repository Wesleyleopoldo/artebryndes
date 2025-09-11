import { useCart } from "../context/CartContext";
import { SITE } from "../data/siteConfig";
import { formatPrice } from "../utils/formatPrice";
import { FaTrash } from "react-icons/fa";

function CartPage() {
    const { cart, removeFromCart, clearCart, decreaseQty, addToCart } = useCart();

    const handleCheckout = () => {
        if (cart.length === 0) return;

        let message = "🛒 Pedido:\n\n";
        cart.forEach((item) => {
            message += `• ${item.quantity}x ${item.name} - ${formatPrice(item.price * item.quantity)}\n`;
        });

        const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
        message += `\nTotal: ${formatPrice(total)}\n`;

        const url = `https://wa.me/${SITE.contactWhatsapp}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank");
    };

    if (cart.length === 0) {
        return (
            <div className="main-content">
                <h1>Carrinho vazio</h1>
                <p>Adicione produtos para prosseguir com seu pedido.</p>
            </div>
        );
    }

    return (
        <div className="main-content">
            <h1>Meu Carrinho</h1>
            <ul className="cart-list">
                {cart.map((item) => (
                    <li key={item.id} className="cart-item">
                        <img src={item.image} alt={item.name} className="cart-image" />
                        <div className="cart-info">
                            <h3>{item.name}</h3>
                            <div className="qty-control">
                                <button onClick={() => decreaseQty(item.id)} className="qty-btn">-</button>
                                <span className="qty-value">{item.quantity}</span>
                                <button onClick={() => addToCart(item)} className="qty-btn">+</button>
                            </div>
                            <p>Preço: {formatPrice(item.price * item.quantity)}</p>
                        </div>

                        <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                            <FaTrash />
                        </button>
                    </li>
                ))}
            </ul>

            {/* Subtotal geral */}
            <h2>Total: {formatPrice(cart.reduce((sum, i) => sum + i.price * i.quantity, 0))}</h2>

            <button className="order-btn" onClick={handleCheckout}>
                Finalizar Pedido no WhatsApp
            </button>
            <button className="remove-btn" onClick={clearCart}>
                Limpar Carrinho
            </button>
        </div>
    );

}

export default CartPage;