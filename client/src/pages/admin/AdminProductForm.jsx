import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";
import { fetchWithAuth } from "../../lib/fetchWithAuth";
import { fetchWithAuthForm } from "../../lib/fetchWithAuthForm";

const API_BASE = 'http://localhost:5353';

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

    // basic validation
    if (!form.name) return alert('Nome é obrigatório');

    try {
      const endpoint = existing ? `${API_BASE}/api/products/${encodeURIComponent(existing.id)}` : `${API_BASE}/api/products/`;
      const method = existing ? 'PUT' : 'POST';

      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('price', String(parseFloat(form.price || 0)));
      fd.append('description', form.description || '');
      fd.append('tag', form.tag || '');
      fd.append('categoryId', form.categoryId || '');

      // if a file was selected, append it as "image" (backend expects file)
      if (imageFile) {
        fd.append('image', imageFile);
      } else if (!existing) {
        // no file on create: backend may accept absence; if you want a placeholder, handle here
      }

      const res = await fetchWithAuthForm(endpoint, {
        method,
        credentials: 'include',
        body: fd // do NOT set Content-Type; browser sets multipart boundary
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        let body = {};
        try { body = text ? JSON.parse(text) : {}; } catch {}
        const msg = body.message || text || `Erro ${res.status}`;
        return alert(`Falha ao salvar produto: ${msg}`);
      }

      // backend may not return JSON (or may echo multipart). Safely parse only when JSON.
      let saved = null;
      try {
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (ct.includes('application/json')) {
          saved = await res.json().catch(() => null);
        } else {
          // fallback: try to read text and parse if possible, otherwise ignore
          const text = await res.text().catch(() => '');
          try { saved = text ? JSON.parse(text) : null; } catch { saved = null; }
        }
      } catch (err) {
        console.warn('Could not parse response body as JSON', err);
        saved = null;
      }
 
      // if you also maintain client-side store via createProduct/updateProduct: update it
      if (existing) {
        try { updateProduct(existing.id, saved || {}); } catch {}
      } else {
        try { createProduct(saved || {}); } catch {}
      }

      navigate("/admin/produtos");
    } catch (err) {
      console.error('product save error', err);
      alert('Erro de rede ao salvar produto');
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
