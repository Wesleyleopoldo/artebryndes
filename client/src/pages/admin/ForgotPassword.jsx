import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoArteBryndes from "../../assets/logo-artebryndes-fundoremovido.png";
import './auth.css';

const API_BASE = 'http://localhost:5353';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/recovery-codes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        // Ler corpo sem tentar consumir duas vezes
        let id = '';
        const ct = (res.headers.get('content-type') || '').toLowerCase();
        if (ct.includes('application/json')) {
          const json = await res.json().catch(() => ({}));
          id = json?.userId || json?.id || '';
        } else {
          const text = await res.text().catch(() => '');
          // tentar extrair JSON de texto, ou usar texto puro
          try {
            const json = JSON.parse(text);
            id = json?.userId || json?.id || text.trim();
          } catch {
            id = text.trim();
          }
        }

        if (id) {
          navigate(`/_adm/portal/recovery-code?userId=${encodeURIComponent(id)}`);
        } else {
          setError('Resposta inesperada do servidor.');
        }
      } else if (res.status === 404) {
        setError('Usuário não encontrado.');
      } else {
        // tentar ler json de erro
        const data = await res.json().catch(() => ({}));
        setError(data.message || 'Erro ao enviar email de recuperação');
      }
    } catch (err) {
      setError('Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <img src={logoArteBryndes} alt="Arte Bryndes" />
        </div>

        <div className="auth-card">
          <h1>Recuperar Senha</h1>
          <p className="auth-subtitle">
            Digite seu email para receber o código de recuperação.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar Email de Recuperação'}
            </button>

            <p className="text-sm text-muted" style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button type="button" onClick={() => navigate('/_adm/portal/entrar')} className="auth-link">
                Voltar ao Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}