import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useProducts } from '../../context/ProductContext';
import { fetchWithAuth } from '../../lib/fetchWithAuth';

const API_BASE = 'http://localhost:5353';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { products, updateProduct } = useProducts(); // access products to check usage

  // track editing state: null => creating, otherwise id of category being edited
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchWithAuth(`${API_BASE}/api/categories`, { method: 'GET', credentials: 'include' });
        if (!res.ok) {
          console.warn('Failed to load categories', res.status);
          return;
        }
        const data = await res.json();
        // expected shape: [{ id, name, description, products: [...] }, ...]
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('load categories error', err);
      }
    };
    load();
  }, []);

  const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setForm({ name: '', description: '' });
    setEditingId(null);
    setError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name) {
      setError('Nome é obrigatório');
      return;
    }

    try {
      const payload = { name: form.name, description: form.description };

      if (editingId) {
        // EDIT: PUT /api/categories/:id
        const res = await fetchWithAuth(`${API_BASE}/api/categories/${encodeURIComponent(editingId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          let body = {};
          try { body = text ? JSON.parse(text) : {}; } catch {}
          setError(body.message || text || `Erro ${res.status} ao editar categoria`);
          return;
        }

        const updated = await res.json();
        // update local list
        setCategories(prev => prev.map(c => c.id === updated.id ? { ...updated, products: c.products || [] } : c));
        resetForm();
        return;
      }

      // CREATE: POST /api/categories
      const res = await fetchWithAuth(`${API_BASE}/api/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        let body = {};
        try { body = text ? JSON.parse(text) : {}; } catch {}
        setError(body.message || text || `Erro ${res.status} ao criar categoria`);
        return;
      }

      const created = await res.json();
      // ensure products array exists for UI
      const createdWithProducts = { ...created, products: created.products || [] };
      setCategories(prev => [...prev, createdWithProducts]);
      resetForm();
    } catch (err) {
      console.error('create/edit category error', err);
      setError('Erro de rede ao criar/editar categoria');
    }
  };

  const onEdit = (category) => {
    setEditingId(category.id);
    setForm({ name: category.name || '', description: category.description || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id) => {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    const used = (products || []).filter(p => (p.categoryId === id) || (p.categoryName === cat.name));
    if (used.length > 0) {
      const ok = confirm(`A categoria "${cat.name}" está associada a ${used.length} produto(s).\n\nOK = Reatribuir produtos para sem categoria e remover categoria\nCancelar = Não remover`);
      if (!ok) return;
      used.forEach(p => {
        updateProduct(p.id, { ...p, categoryId: '', categoryName: '' });
      });
    }

    try {
      const res = await fetchWithAuth(`${API_BASE}/api/categories/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!res.ok) {
        alert(`Falha ao remover categoria (status ${res.status})`);
        return;
      }
      const next = categories.filter(c => c.id !== id);
      setCategories(next);
      // if we were editing this category, reset form
      if (editingId === id) resetForm();
    } catch (err) {
      console.error('delete category error', err);
      alert('Erro de rede ao remover categoria');
    }
  };

  return (
    <div className="main-content">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="admin-form">
              {error && <div className="auth-error">{error}</div>}

              <div className="auth-input-group">
                <label htmlFor="name">Nome</label>
                <input id="name" name="name" value={form.name} onChange={onChange} className="auth-input" required />
              </div>

              <div className="auth-input-group">
                <label htmlFor="description">Descrição</label>
                <textarea id="description" name="description" value={form.description} onChange={onChange} className="auth-input" />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="submit" className='new-user'>{editingId ? 'Salvar Alterações' : 'Criar Categoria'}</Button>
                {editingId ? (
                  <Button variant="outline" className='new-user' onClick={resetForm}>Cancelar</Button>
                ) : (
                  <Button variant="outline" className='new-user' onClick={() => navigate('/admin/produtos')}>Voltar</Button>
                )}
              </div>
            </form>

            <hr style={{ margin: '1rem 0' }} />

            <h3>Categorias existentes</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {categories.map(c => (
                <li key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0' }}>
                  <div>
                    <strong>{c.name}</strong>
                    <div style={{ color: 'var(--muted)' }}>{c.description}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>{Array.isArray(c.products) ? `${c.products.length} produto(s)` : ''}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn" onClick={() => onEdit(c)}>Editar</button>
                    <button className="btn outline" onClick={() => onDelete(c.id)}>Remover</button>
                  </div>
                </li>
              ))}
              {categories.length === 0 && <li className="text-muted">Nenhuma categoria cadastrada</li>}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
