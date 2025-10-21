export default function ProductViewModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <div className="modal-body">
          <div className="modal-image">
            <img src={product.image} alt={product.name} />
          </div>
          
          <div className="modal-info">
            <div className="modal-info-header">
              <h2>{product.name}</h2>
              {product.tag && <span className="modal-product-tag">{product.tag}</span>}
            </div>
            <div className="modal-price">R$ {product.price?.toFixed(2)}</div>
            
            <div className="modal-meta">
              <span className="muted">{product.categoryName}</span>
            </div>

            <div className="modal-description-block">
              <div className="modal-description-label">Descrição</div>
              <div className="modal-description-content">{product.description ?? <span className="muted">Sem descrição</span>}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}