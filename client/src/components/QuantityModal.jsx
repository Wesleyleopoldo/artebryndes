import { FaTimes, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";

function QuantityModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const increase = () => setQty((q) => q + 1);
  const decrease = () => setQty((q) => (q > 1 ? q - 1 : 1));

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addToCart(product);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close no-focus-outline" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-body">
          <div className="modal-image">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="modal-info">
            <h2>{product.name}</h2>
            <p className="modal-price">{formatPrice(product.price)}</p>
            <p className="modal-description">
              {product.description || "Sem descrição disponível."}
            </p>

            {/* Controle de quantidade */}
            <div className="qty-control">
              <button onClick={decrease} className="qty-btn"> <FaMinus /> </button>
              <span className="qty-value">{qty}</span>
              <button onClick={increase} className="qty-btn"> <FaPlus /> </button>
            </div>

            <button className="order-btn" onClick={handleAdd}>
              <FaShoppingCart /> Adicionar {qty} ao Carrinho
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuantityModal;