import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-page container">
      <header className="category-header-layout">
        <div>
          <h1 className="category-title">Administração</h1>
          <p className="category-description">Gerencie produtos e categorias da loja</p>
        </div>
        <nav className="admin-nav">
          <Link to="/admin/produtos" className="view-more-btn">Produtos</Link>
          <Link to="/" className="order-btn">Voltar ao site</Link>
        </nav>
      </header>

      <main className="admin-content">{children}</main>
    </div>
  );
}
