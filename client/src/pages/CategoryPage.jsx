import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const API_BASE = 'http://localhost:5353';

function CategoryPage() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories/${slug}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError('Categoria não encontrada');
            return;
          }
          throw new Error('Falha ao carregar categoria');
        }

        const data = await res.json();
        setCategory(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar categoria:', err);
        setError('Erro ao carregar categoria');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  if (loading) {
    return (
      <div className="main-content">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="main-content" data-testid="category-not-found">
        <div className="breadcrumb">
          <Link to="/">Início</Link> / Categoria não encontrada
        </div>
        <h1>Categoria não encontrada</h1>
        <p>A categoria solicitada não existe.</p>
        <Link to="/" className="view-more-btn">Voltar ao início</Link>
      </div>
    );
  }

  return (
    <div className="main-content" data-testid={`category-page-${category.id}`}>
      <div className="breadcrumb" data-testid="breadcrumb">
        <Link to="/">Início</Link> / {category.name}
      </div>
      
      <h1 className="category-title" data-testid="category-page-title">
        {category.name}
      </h1>
      <p className="category-description" data-testid="category-page-description">
        {category.description}
      </p>
      
      <div className="products-grid" data-testid="products-grid">
        {category.products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
