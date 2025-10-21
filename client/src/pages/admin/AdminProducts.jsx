import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useState } from "react";
import ProductViewModal from "../../components/ProductViewModal";

export default function AdminProducts() {
  const { products, deleteProduct } = useProducts();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="main-content">
      <div className="category-header">
        <div>
          <h2 className="category-title">Produtos</h2>
          <p className="category-description">Gerencie o catálogo de produtos</p>
        </div>

        <button 
          className="view-more-btn" 
          onClick={() => navigate("/admin/produtos/novo")}
        >
          Novo produto
        </button>
      </div>

      {products.length === 0 ? (
        <p>Nenhum produto cadastrado.</p>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              {p.tag && <span className="product-tag">{p.tag}</span>}
              <img src={p.image} alt={p.name} className="product-image" />
              <h3 className="product-name">{p.name}</h3>
              <div className="product-meta">
                <span className="muted">{p.categoryName || '—'}</span>
                <span className="product-price">R$ {p.price?.toFixed(2)}</span>
              </div>
              <div className="card-actions">
                <button 
                  className="view-more-btn full-width"
                  onClick={() => setSelectedProduct(p)}
                >
                  Ver detalhes
                </button>
                <Link 
                  to={`/admin/produtos/${p.id}/editar`} 
                  className="order-btn"
                >
                  Editar
                </Link>
                <button
                  className="btn danger full-width"
                  onClick={() => {
                    if (confirm(`Excluir produto "${p.name}"?`)) deleteProduct(p.id);
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedProduct && (
        <ProductViewModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
}
