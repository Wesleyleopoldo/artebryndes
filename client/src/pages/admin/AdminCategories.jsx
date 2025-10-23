import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

function readCategories() {
  try {
    const raw = localStorage.getItem('categories');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function saveCategories(list) {
  try { localStorage.setItem('categories', JSON.stringify(list)); } catch (e) { /* ignore */ }
}

export default function AdminCategories() {
  const [categories, setCategories] = useState(() => readCategories() || []);
  const [form, setForm] = useState({ id: '', name: '', description: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = readCategories();
    if (stored) setCategories(stored);
  }, []);

  const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.id || !form.name) {
      setError('ID e nome são obrigatórios');
      return;
    }
    if (categories.find(c => c.id === form.id)) {
      setError('ID já existe');
      return;
    }

    const next = [...categories, { ...form, products: [] }];
    setCategories(next);
    saveCategories(next);
    setForm({ id: '', name: '', description: '' });
  };

  const onDelete = (id) => {
    if (!confirm('Remover categoria?')) return;
    const next = categories.filter(c => c.id !== id);
    setCategories(next);
    saveCategories(next);
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
                <label htmlFor="id">ID (ex: "bolsinhas")</label>
                <input id="id" name="id" value={form.id} onChange={onChange} className="auth-input" required />
              </div>

              <div className="auth-input-group">
                <label htmlFor="name">Nome</label>
                <input id="name" name="name" value={form.name} onChange={onChange} className="auth-input" required />
              </div>

              <div className="auth-input-group">
                <label htmlFor="description">Descrição</label>
                <textarea id="description" name="description" value={form.description} onChange={onChange} className="auth-input" />
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="submit" className='new-user'>Criar Categoria</Button>
                <Button variant="outline" className='new-user' onClick={() => navigate('/admin/produtos')} >Voltar</Button>
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
                  </div>
                  <div>
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
