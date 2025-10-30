import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const API_BASE = 'http://localhost:5353';

export default function AdminProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [form, setForm] = useState({ 
    name: '', 
    email: '',
    username: '' 
  });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Origin': window.location.origin
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUserData(data);
        setForm({
          name: data.name || '',
          email: data.email || '',
          username: data.username || ''
        });
      } else {
        setError('Erro ao carregar dados do usuário');
      }
    } catch (err) {
      setError('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };
  
  const isOpenProfile = location.pathname === '/admin/perfil-open';

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const startEdit = () => {
    setForm({ 
      name: userData?.name || '', 
      email: userData?.email || '',
      username: userData?.username || '' 
    });
    setEditing(true);
    setError('');
    setMsg('');
  };

  const cancelEdit = () => {
    setEditing(false);
    setError('');
    setMsg('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/users/me/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name,
          username: form.username,
          email: form.email
        })
      });

      if (res.ok) {
        const updatedData = await res.json();
        setUserData(updatedData);
        setMsg('Alterações salvas com sucesso!');
        setEditing(false);
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body.message || 'Erro ao salvar alterações');
      }
    } catch (err) {
      setError('Erro ao salvar alterações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      {!isOpenProfile && (
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            className="btn outline"
            onClick={() => navigate('/admin')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <ChevronLeft size={18} />
            Voltar ao Painel
          </button>
        </div>
      )}

      <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2>Meu Perfil</h2>
        {error && <div className="auth-error">{error}</div>}
        {msg && <div style={{ background: '#ecfdf5', color: '#065f46', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{msg}</div>}
        
        {loading ? (
          <div>Carregando...</div>
        ) : !editing ? (
          <div className="admin-form">
            <div className="auth-input-group">
              <label>Nome</label>
              <p style={{ padding: '0.75rem', background: 'var(--bg)', borderRadius: '8px' }}>{userData?.name}</p>
            </div>
            <div className="auth-input-group">
              <label>Usuário</label>
              <p style={{ padding: '0.75rem', background: 'var(--bg)', borderRadius: '8px' }}>{userData?.username}</p>
            </div>
            <div className="auth-input-group">
              <label>Email</label>
              <p style={{ padding: '0.75rem', background: 'var(--bg)', borderRadius: '8px' }}>{userData?.email}</p>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <button onClick={startEdit} className="btn primary" style={{ width: '100%' }}>
                Editar Perfil
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="admin-form" style={{ marginTop: '1rem' }}>
            <div className="auth-input-group">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={onChange}
                className="auth-input"
                required
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="username">Usuário</label>
              <input
                id="username"
                name="username"
                value={form.username}
                onChange={onChange}
                className="auth-input"
                required
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                className="auth-input"
                required
              />
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              <button type="button" className="btn outline" onClick={cancelEdit}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
