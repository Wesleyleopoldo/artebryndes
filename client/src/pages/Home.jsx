import { useState, useEffect } from "react";
import Hero from "../components/Hero";
import CategoryRow from "../components/CategoryRow";
import { SITE } from "../data/siteConfig";
import { configDotenv } from 'dotenv';

configDotenv();

const API_BASE = process.env.VITE_API_BASE;

function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error('Falha ao carregar categorias');
        }

        const data = await res.json();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar categorias:', err);
        setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="wrap">
      <div data-testid="home-page">
        <Hero
          background={SITE.heroBackground}
          title={SITE.heroTitle}
          subtitle={SITE.heroSubtitle}
        />

        <main className="main-content">
          {loading ? (
            <div className="loading">Carregando produtos...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : categories.length === 0 ? (
            <div className="empty">Nenhum produto disponível no momento.</div>
          ) : (
            categories.map(category => (
              <CategoryRow key={category.id} category={category} />
            ))
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;
