import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { useState } from "react";
import ProductViewModal from "../../components/ProductViewModal";
import { Button } from "../../components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function AdminProducts() {
  const { products, deleteProduct } = useProducts();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const formatPrice = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(2) : '';
  };

  return (
    <div className="main-content">
      <div className="category-header">

        <div className="back-to-dash">
          <div className="mb-6">
            <Button
              onClick={() => navigate('/admin')}
              className="btn outline"
              aria-label="Voltar ao painel"
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <ChevronLeft style={{ width: 16, height: 16 }} />
                <span>Voltar ao Painel</span>
              </span>
            </Button>
          </div>
        </div>
        <div className="header-description">
          
          <div>
            <h2 className="category-title">Produtos</h2>
            <p className="category-description">Gerencie o catálogo de produtos</p>
          </div>

          <div className="btns-products">
            <button
              className="view-more-btn-new-product"
              onClick={() => navigate("/admin/categorias")}
            >
              Nova categoria
            </button>
            <button
              className="view-more-btn-new-product"
              onClick={() => navigate("/admin/produtos/novo")}
            >
              Novo produto
            </button>
          </div>
        </div>
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
                <span className="product-price">R$ {formatPrice(p.price)}</span>
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
