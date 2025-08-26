import Hero from "../components/Hero";
import CategoryRow from "../components/CategoryRow";
import { SITE } from "../data/siteConfig";
import { categories } from "../data/products";

function Home() {
  return (
    <div data-testid="home-page">
      <Hero 
        background={SITE.heroBackground}
        title={SITE.heroTitle}
        subtitle={SITE.heroSubtitle}
      />
      
      <main className="main-content">
        {categories.map(category => (
          <CategoryRow key={category.id} category={category} />
        ))}
      </main>
    </div>
  );
}

export default Home;
