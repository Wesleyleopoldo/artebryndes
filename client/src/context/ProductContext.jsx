import { createContext, useContext, useEffect, useState } from "react";
import { fetchWithAuthForm } from "../lib/fetchWithAuthForm";
import { fetchWithAuth } from "../lib/fetchWithAuth";

const API_BASE = 'http://localhost:5353';
const ProductContext = createContext();

function flattenCategories(categories) {
  return categories.flatMap((cat) =>
    (cat.products || []).map((p) => ({ ...p, categoryId: cat.id, categoryName: cat.name }))
  );
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar produtos do servidor
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE}/api/categories`, {
          method: 'GET',
          credentials: 'include'
        });

        if (!res.ok) {
          throw new Error('Falha ao carregar produtos');
        }

        const categories = await res.json();
        
        // Converter categorias em lista plana de produtos
        const flatProducts = flattenCategories(categories);
        
        // Extrair tags únicas dos produtos
        const uniqueTags = Array.from(
          new Set(flatProducts.map(p => p.tag).filter(Boolean))
        );

        setProducts(flatProducts);
        setTags(uniqueTags);
      } catch (err) {
        console.error('Erro ao carregar produtos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const createTag = (tag) => {
    const t = (tag || "").trim();
    if (!t) return null;
    setTags((prev) => (prev.includes(t) ? prev : [t, ...prev]));
    return t;
  };

  const createProduct = async (product) => {
    try {
      const fd = new FormData();
      fd.append('name', product.name);
      fd.append('price', parseFloat(product.price || 0));
      fd.append('description', product.description || '');
      fd.append('tag', product.tag || '');
      fd.append('categoryId', product.categoryId || '');
      if (product.image instanceof File) {
        fd.append('image', product.image);
      }

      const res = await fetchWithAuthForm(`${API_BASE}/api/products`, {
        method: 'POST',
        credentials: 'include',
        body: fd
      });

      if (!res.ok) {
        throw new Error('Erro ao criar produto');
      }

      const newProduct = await res.json();
      setProducts(prev => [newProduct, ...prev]);
      
      if (newProduct.tag) {
        createTag(newProduct.tag);
      }

      return newProduct;
    } catch (err) {
      console.error('Erro ao criar produto:', err);
      throw err;
    }
  };

  const updateProduct = async (id, updates) => {
    try {
      const fd = new FormData();
      
      if ('name' in updates) fd.append('name', updates.name);
      if ('price' in updates) fd.append('price', parseFloat(updates.price || 0));
      if ('description' in updates) fd.append('description', updates.description || '');
      if ('tag' in updates) fd.append('tag', updates.tag || '');
      if ('categoryId' in updates) fd.append('categoryId', updates.categoryId || '');
      if (updates.image instanceof File) fd.append('image', updates.image);

      const res = await fetchWithAuthForm(`${API_BASE}/api/products/${id}`, {
        method: 'PUT',
        credentials: 'include',
        body: fd
      });

      if (!res.ok) {
        if (res.status === 404) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Produto ou categoria não encontrada');
        }
        throw new Error('Erro ao atualizar produto');
      }

      const updatedProduct = await res.json();

      setProducts(prev => prev.map(p => 
        p.id === id ? {
          ...p,
          ...updatedProduct,
          categoryName: updatedProduct.categoryName || p.categoryName,
        } : p
      ));

      if (updatedProduct.tag) {
        createTag(updatedProduct.tag);
      }

      return updatedProduct;

    } catch (err) {
      console.error('Erro ao atualizar produto:', err);
      alert(err.message || 'Erro ao atualizar produto');
      throw err;
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
    <ProductContext.Provider 
      value={{ 
        products, 
        createProduct, 
        updateProduct, 
        deleteProduct, 
        getProduct, 
        tags, 
        createTag,
        loading 
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
