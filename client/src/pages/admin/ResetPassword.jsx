import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoArteBryndes from "../../assets/logo-artebryndes-fundoremovido.png";
import { configDotenv } from 'dotenv';

configDotenv();

const API_BASE = process.env.VITE_API_BASE;

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userId = params.get('userId');
  const redirectRef = useRef(null);

  useEffect(() => {
    return () => {
      if (redirectRef.current) clearTimeout(redirectRef.current);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMsg('');
    if (!userId) {
      setError('Usuário não identificado. Volte e solicite um novo código.');
      return;
    }
    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/especial-router/password/${encodeURIComponent(userId)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newPassword: password })
      });

      if (res.ok) {
        setMsg('Senha atualizada com sucesso. Redirecionando para o login...');
        setLoading(false);
        redirectRef.current = setTimeout(() => {
          navigate('/_adm/portal/entrar', { replace: true });
        }, 1400);
      } else if (res.status === 403) {
        setError('Redefinição de senha não aprovada.');
      } else if (res.status === 404) {
        setError('Usuário não encontrado.');
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Erro ao redefinir senha');
      }
    } catch (err) {
      setError('Erro ao redefinir senha');
    } finally {
      if (!redirectRef.current) setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <img src={logoArteBryndes} alt="Arte Bryndes" />
        </div>

        <div className="auth-card">
          <h1>Redefinir Senha</h1>
          <p className="auth-subtitle">
            Escolha uma nova senha para sua conta.
          </p>

          {error && <div className="auth-error">{error}</div>}
          {msg && <div style={{ color: 'green', marginBottom: 12 }}>{msg}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="password">Nova Senha</label>
              <input
                id="password"
                type="password"
                className="auth-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="confirm">Confirmar Senha</label>
              <input
                id="confirm"
                type="password"
                className="auth-input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Redefinir Senha'}
            </button>

            <p className="text-sm text-muted" style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button type="button" onClick={() => navigate('/_adm/portal/entrar')} className="text-bronze underline btn link">
                Voltar ao Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}