import { useParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { categories } from "../data/products";

function CategoryPage() {
  const { slug } = useParams();
  const category = categories.find(cat => cat.id === slug);

  if (!category) {
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
