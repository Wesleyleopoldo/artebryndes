import { useState } from "react";
import { formatPrice } from "../utils/formatPrice";
import { SITE } from "../data/siteConfig";
import { FaShoppingCart } from "react-icons/fa";
import ProductModal from "./ProductModal";

function ProductCard({ product }) {
  const [showModal, setShowModal] = useState(false);

  const handleOrderProduct = () => {
    setShowModal(true);
  };

  return (
    <>
      <div
        className="product-card"
        data-testid={`product-card-${product.id}`}
      >
        {product.tag && (
          <div className="product-tag" data-testid={`product-tag-${product.id}`}>
            {product.tag}
          </div>
        )}

        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          data-testid={`product-image-${product.id}`}
          onClick={() => setShowModal(true)}
        />

        <h3
          className="product-name"
          data-testid={`product-name-${product.id}`}
        >
          {product.name}
        </h3>

        <p
          className="product-price"
          data-testid={`product-price-${product.id}`}
        >
          {formatPrice(product.price)}
        </p>

        <button
          onClick={handleOrderProduct}
          className="order-btn"
          data-testid={`order-btn-${product.id}`}
        >
          <FaShoppingCart /> Detalhes
        </button>
      </div>

      {showModal && (
        <ProductModal
          product={product}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default ProductCard;
