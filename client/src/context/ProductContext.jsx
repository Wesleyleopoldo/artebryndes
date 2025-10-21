import { createContext, useContext, useEffect, useState } from "react";
import { categories as seedCategories } from "../data/products";

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

  const updateProduct = (id, updates) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
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
