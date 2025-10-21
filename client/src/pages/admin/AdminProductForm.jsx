import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProducts } from "../../context/ProductContext";

export default function AdminProductForm() {
  const { id } = useParams();
  const { createProduct, updateProduct, getProduct, tags, createTag } = useProducts();
  const navigate = useNavigate();

  const existing = id ? getProduct(id) : null;

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    tag: "",
    categoryName: "",
  });

  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (existing) setForm({ ...existing, price: existing.price?.toString() ?? "" });
  }, [existing]);

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, price: parseFloat(form.price || 0) };
    if (existing) {
      updateProduct(existing.id, payload);
    } else {
      createProduct(payload);
    }
    navigate("/admin/produtos");
  };

  const addTag = () => {
    const t = (newTag || "").trim();
    if (!t) return;
    const created = createTag(t);
    if (created) {
      setForm((s) => ({ ...s, tag: created }));
      setNewTag("");
    }
  };

  return (
    <div>
      <h2>{existing ? "Editar produto" : "Novo produto"}</h2>
      <form onSubmit={onSubmit} className="admin-form">
        <label>
          Nome
          <input name="name" value={form.name} onChange={onChange} required />
        </label>

        <label>
          Preço
          <input name="price" type="number" step="0.01" value={form.price} onChange={onChange} required />
        </label>

        <label>
          Imagem (URL)
          <input name="image" value={form.image} onChange={onChange} />
        </label>

        <label>
          Tag
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <select name="tag" value={form.tag} onChange={onChange}>
              <option value="">(nenhuma)</option>
              {tags?.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <input name="tag" value={form.tag} onChange={onChange} style={{ flex: 1 }} />
          </div>
        </label>

        <label>
          Categoria (nome)
          <input name="categoryName" value={form.categoryName} onChange={onChange} />
        </label>

        <label>
          Criar nova tag
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Nome da tag" />
            <button type="button" className="btn" onClick={addTag}>Adicionar</button>
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
