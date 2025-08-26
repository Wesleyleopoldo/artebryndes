import { useRef } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

function CategoryRow({ category }) {
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (!carouselRef.current) return;
    
    const cardWidth = 250 + 16; // card width + gap
    const scrollAmount = cardWidth * 2;
    
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="category-section" data-testid={`category-section-${category.id}`}>
      <div className="category-header">
        <div>
          <h2 className="category-title" data-testid={`category-title-${category.id}`}>
            {category.name}
          </h2>
          <p className="category-description" data-testid={`category-description-${category.id}`}>
            {category.description}
          </p>
        </div>
        <Link 
          to={`/categoria/${category.id}`} 
          className="view-more-btn"
          data-testid={`view-more-btn-${category.id}`}
        >
          Ver mais
        </Link>
      </div>
      
      <div className="carousel-container">
        <button 
          className="carousel-nav prev" 
          onClick={() => scrollCarousel('left')}
          aria-label="Produto anterior"
          data-testid={`carousel-prev-${category.id}`}
        >
          ❮
        </button>
        <button 
          className="carousel-nav next" 
          onClick={() => scrollCarousel('right')}
          aria-label="Próximo produto"
          data-testid={`carousel-next-${category.id}`}
        >
          ❯
        </button>
        
        <div 
          className="products-carousel" 
          ref={carouselRef}
          data-testid={`products-carousel-${category.id}`}
        >
          {category.products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryRow;
