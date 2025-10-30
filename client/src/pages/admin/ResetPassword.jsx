import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import logoArteBryndes from "../../assets/logo-artebryndes-fundoremovido.png";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('As senhas não conferem');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          password: form.password
        })
      });

      if (res.ok) {
        // Sucesso, redireciona para login
        navigate('/_adm', { 
          state: { message: 'Senha alterada com sucesso! Faça login com sua nova senha.' }
        });
      } else {
        const data = await res.json();
        setError(data.message || 'Erro ao redefinir senha');
      }
    } catch (err) {
      setError('Erro ao redefinir senha');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Se não tiver token, mostra erro
  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <Link to="/_adm" className="auth-logo">
            <img src={logoArteBryndes} alt="Arte Bryndes" />
          </Link>
          
          <div className="auth-card">
            <h1>Link Inválido</h1>
            <p className="auth-subtitle">
              Este link de recuperação é inválido ou já expirou.
            </p>
            <Link to="/_adm" className="auth-submit">
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <Link to="/_adm" className="auth-logo">
          <img src={logoArteBryndes} alt="Arte Bryndes" />
        </Link>
        
        <div className="auth-card">
          <h1>Redefinir Senha</h1>
          <p className="auth-subtitle">
            Digite sua nova senha
          </p>

          {error && (
            <div className="auth-error">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="password">Nova Senha</label>
              <input
                type="password"
                id="password"
                name="password"
                className="auth-input"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="confirmPassword">Confirme a Nova Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="auth-input"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <button 
              type="submit" 
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}