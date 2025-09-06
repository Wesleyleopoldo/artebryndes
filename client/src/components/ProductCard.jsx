import { formatPrice } from "../utils/formatPrice";
import { SITE } from "../data/siteConfig";
import { FaShoppingCart } from "react-icons/fa";

function ProductCard({ product }) {
  const handleOrderProduct = () => {
    const message = encodeURIComponent(`Olá! Gostei do produto ${product.name}.`);
    const whatsappUrl = `https://wa.me/${SITE.contactWhatsapp}?text=${message}`;
    window.open(whatsappUrl, '_blank', 'noopener');
  };

  return (
    <div className="product-card" data-testid={`product-card-${product.id}`}>

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
      />

      <h3 className="product-name" data-testid={`product-name-${product.id}`}>
        {product.name}
      </h3>

      <p className="product-price" data-testid={`product-price-${product.id}`}>
        {formatPrice(product.price)}
      </p>

      <button 
        onClick={handleOrderProduct}
        className="order-btn"
        data-testid={`order-btn-${product.id}`}
      >
        <FaShoppingCart /> Adicionar
      </button>

    </div>
  );
}

export default ProductCard;
