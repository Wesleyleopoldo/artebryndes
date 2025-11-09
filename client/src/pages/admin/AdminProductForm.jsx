import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { fetchWithAuth } from "../../lib/fetchWithAuth";
import { fetchWithAuthForm } from "../../lib/fetchWithAuthForm";
import { configDotenv } from 'dotenv';

configDotenv();

const API_BASE = process.env.VITE_API_BASE;

export default function AdminProductForm() {
  const { id } = useParams();
  const { createProduct, updateProduct, getProduct, tags, createTag } = useProducts();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const previewRef = useRef(null);

  const existing = id ? getProduct(id) : null;

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    tag: "",
    categoryId: "",      // store selected category id
    categoryName: ""     // keep compatibility with existing schema
  });

  useEffect(() => {
    if (existing) {
      setForm({
        ...existing,
        price: existing.price?.toString() ?? "",
        description: existing.description || "",
        categoryId: existing.categoryId || "",
        categoryName: existing.categoryName || "",
        tag: existing.tag || ""
      });
      // if existing has image URL, show as preview
      if (existing.image) setImagePreview(existing.image);
    }
  }, [existing]);

  useEffect(() => {
    const readBackendCategories = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE}/api/categories/`, { method: 'GET', credentials: 'include' });
        if (!res.ok) {
          console.warn('failed to load categories', res.status);
          return;
        }
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('readBackendCategories error', err);
      }
    };

    readBackendCategories();
  }, []);

  // cleanup preview object urls
  useEffect(() => {
    return () => {
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
        previewRef.current = null;
      }
    };
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'categoryId') {
      const cat = categories.find(c => String(c.id) === String(value));
      setForm(s => ({ ...s, categoryId: value, categoryName: cat ? cat.name : '' }));
      return;
    }
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    const url = URL.createObjectURL(file);
    previewRef.current = url;
    setImageFile(file);
    setImagePreview(url);
  };

  const clearImage = () => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    setImageFile(null);
    setImagePreview('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return alert('Nome é obrigatório');

    try {
      // use only context functions which already perform the network request
      const payload = { 
        name: form.name,
        price: form.price,
        description: form.description,
        tag: form.tag,
        categoryId: form.categoryId,
        // attach file object so context will append it to FormData
        image: imageFile || undefined
      };

      if (existing) {
        await updateProduct(existing.id, payload);
      } else {
        await createProduct(payload);
      }

      navigate("/admin/produtos");
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      alert(err.message || 'Erro ao salvar produto');
    }
  };

  const addTag = () => {
    const t = (newTag || "").trim();
    if (!t) return;
    try {
      const created = createTag(t);
      if (created) {
        setForm((s) => ({ ...s, tag: created }));
        setNewTag("");
      }
    } catch (err) {
      console.error('addTag error', err);
    }
  };

  return (
    <div>
      <h2>{existing ? "Editar produto" : "Novo produto"}</h2>
      <form onSubmit={onSubmit} className="admin-form" encType="multipart/form-data">
        <label>
          Nome
          <input name="name" value={form.name} onChange={onChange} required />
        </label>

        <label>
          Preço
          <input name="price" type="number" step="0.01" value={form.price} onChange={onChange} required />
        </label>

        <label>
          Descrição
          <textarea name="description" value={form.description} onChange={onChange} />
        </label>

        <label>
          Imagem (arquivo)
          <input type="file" accept="image/*" onChange={onImageChange} />
          {imagePreview && (
            <div style={{ marginTop: 8 }}>
              <img src={imagePreview} alt="preview" style={{ maxWidth: 240, maxHeight: 160, display: 'block', objectFit: 'cover' }} />
              <div style={{ marginTop: 6 }}>
                <button type="button" className="btn outline" onClick={clearImage}>Remover imagem</button>
              </div>
            </div>
          )}
        </label>

        <label>
          Tag
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select name="tag" value={form.tag} onChange={onChange} style={{ minWidth: 160 }}>
              <option value="">(nenhuma)</option>
              {tags?.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input name="tag" value={form.tag} onChange={onChange} style={{ flex: 1 }} />
          </div>
        </label>

        <label>
          Criar nova tag
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Nome da tag" />
            <button type="button" className="btn" onClick={addTag}>Adicionar</button>
          </div>
        </label>

        <label>
          Categoria
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select name="categoryId" value={form.categoryId} onChange={onChange} style={{ flex: 1 }}>
              <option value="">(nenhuma)</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {Array.isArray(c.products) ? `(${c.products.length})` : ''}
                </option>
              ))}
            </select>
            <button type="button" className="btn" onClick={() => navigate('/admin/categorias')}>Gerenciar</button>
          </div>
        </label>

        <div className="form-actions">
          <button className="btn primary" type="submit">Salvar</button>
          <button type="button" className="btn" onClick={() => navigate(-1)}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
