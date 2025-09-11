import { useState } from "react";
import { FaTimes, FaShoppingCart } from "react-icons/fa";
import { formatPrice } from "../utils/formatPrice";
import QuantityModal from "./QuantityModal";
import { useCart } from "../context/CartContext";

function ProductModal({ product, onClose }) {
    const [ showQty, setShowQty ] = useState(false);
    const { addToCart } = useCart();

    if (!product) return null;

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-content">
                    {/* Botão de fechar */}
                    <button className="modal-close no-focus-outline" onClick={onClose}>
                        <FaTimes />
                    </button>

                    <div className="modal-body">
                        {/* Imagem à esquerda */}
                        <div className="modal-image">
                            <img src={product.image} alt={product.name} />
                        </div>

                        {/* Detalhes à direita */}
                        <div className="modal-info">
                            <h2>{product.name}</h2>
                            <p className="modal-price">{formatPrice(product.price)}</p>
                            <p className="modal-description">
                                {product.description || "Sem descrição disponível."}
                            </p>
                            <button
                                className="order-btn"
                                onClick={() => setShowQty(true)}
                            >
                                <FaShoppingCart /> Adicionar ao Carrinho
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showQty && (
                <QuantityModal product={product} onClose={() => setShowQty(false)} />
            )}
        </>
    );
}

export default ProductModal;
