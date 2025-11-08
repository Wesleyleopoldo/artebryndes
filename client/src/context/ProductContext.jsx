import { createContext, useContext, useEffect, useState } from "react";
import { categories as seedCategories } from "../data/products";
import { fetchWithAuthForm } from "../lib/fetchWithAuthForm"; // Add this import
const API_BASE = 'http://localhost:5353'; // Adicione a URL base da API

const ProductContext = createContext();

function flattenCategories(categories) {
  return categories.flatMap((cat) =>
    (cat.products || []).map((p) => ({ ...p, categoryId: cat.id, categoryName: cat.name }))
  );
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const stored = localStorage.getItem("products_admin");
      const seedFlat = flattenCategories(seedCategories);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // merge each stored product with seed product (seed provides missing fields)
          return parsed.map((p) => {
            const seedMatch = seedFlat.find((s) => s.id === p.id) || {};
            return { ...seedMatch, ...p };
          });
        } catch (e) {
          // fall back to raw stored if parse fails
          return JSON.parse(stored);
        }
      }
    } catch (e) {
      // ignore parse errors
    }
    return flattenCategories(seedCategories);
  });

  // initialize tags from localStorage or from seed data
  const seedTags = (() => {
    try {
      const all = flattenCategories(seedCategories).map((p) => p.tag).filter(Boolean);
      return Array.from(new Set(all));
    } catch (e) {
      return [];
    }
  })();

  const [tags, setTags] = useState(() => {
    try {
      const stored = localStorage.getItem("product_tags");
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return seedTags;
  });

  useEffect(() => {
    try {
      localStorage.setItem("product_tags", JSON.stringify(tags));
    } catch (e) {
      console.error("Could not persist tags to localStorage", e);
    }
  }, [tags]);

  const createTag = (tag) => {
    const t = (tag || "").trim();
    if (!t) return null;
    setTags((prev) => (prev.includes(t) ? prev : [t, ...prev]));
    return t;
  };

  useEffect(() => {
    try {
      localStorage.setItem("products_admin", JSON.stringify(products));
    } catch (e) {
      console.error("Could not persist products to localStorage", e);
    }
  }, [products]);

  const createProduct = (product) => {
    const id = product.id || `${product.name.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString(36)}`;
    const newProduct = { ...product, id };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = async (id, updates) => {
    try {
      // Create FormData and append fields
      const fd = new FormData();
      fd.append('name', updates.name);
      fd.append('price', parseFloat(updates.price || 0));
      fd.append('description', updates.description || '');
      fd.append('tag', updates.tag || '');
      fd.append('categoryId', updates.categoryId || '');

      // If there's a new image file, append it
      if (updates.image instanceof File) {
        fd.append('image', updates.image);
      }

      const res = await fetchWithAuthForm(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: fd
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Produto não encontrado');
        }
        throw new Error('Erro ao atualizar produto');
      }

      const updatedProduct = await res.json();

      // Update state with returned data
      setProducts(prev => prev.map(p => 
        p.id === id ? { ...p, ...updatedProduct } : p
      ));

      return updatedProduct;

    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      alert(err.message || 'Erro ao atualizar produto');
      throw err; // Re-throw to handle in component
    }
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Produto não encontrado');
        }
        throw new Error('Erro ao excluir produto');
      }

      // Atualiza o estado removendo o produto
      setProducts(prev => prev.filter(p => p.id !== id));
      return true;

    } catch (err) {
      console.error('Erro ao deletar produto:', err);
      alert(err.message || 'Erro ao excluir produto');
      return false;
    }
  };

  const getProduct = (id) => products.find((p) => p.id === id);

  return (
    <ProductContext.Provider value={{ products, createProduct, updateProduct, deleteProduct, getProduct, tags, createTag }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
