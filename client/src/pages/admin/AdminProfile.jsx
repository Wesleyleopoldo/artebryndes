import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function AdminProfile() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    name: user?.name || '', 
    email: user?.email || '',
    username: user?.username || '' 
  });
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  
  const isOpenProfile = location.pathname === '/admin/perfil-open';

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const startEdit = () => {
    setForm({ 
      name: user?.name || '', 
      email: user?.email || '',
      username: user?.username || '' 
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
      const res = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setMsg('Alterações salvas com sucesso!');
        setEditing(false);
        // Recarrega os dados do usuário no contexto
        await useAuth().checkSession();
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
            onClick={() => navigate('/_adm/portal')}
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
        
        {!editing ? (
          <div className="admin-form">
            <div className="auth-input-group">
              <label>Nome</label>
              <p style={{ padding: '0.75rem', background: 'var(--bg)', borderRadius: '8px' }}>{user?.name}</p>
            </div>
            <div className="auth-input-group">
              <label>Usuário</label>
              <p style={{ padding: '0.75rem', background: 'var(--bg)', borderRadius: '8px' }}>{user?.username}</p>
            </div>
            <div className="auth-input-group">
              <label>Email</label>
              <p style={{ padding: '0.75rem', background: 'var(--bg)', borderRadius: '8px' }}>{user?.email}</p>
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
