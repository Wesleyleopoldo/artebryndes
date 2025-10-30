import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoArteBryndes from "../../assets/logo-artebryndes-fundoremovido.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.message || 'Erro ao enviar email de recuperação');
      }
    } catch (err) {
      setError('Erro ao enviar email de recuperação');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <Link to="/admin" className="auth-logo">
            <img src={logoArteBryndes} alt="Arte Bryndes" />
          </Link>
          
          <div className="auth-card">
            <h1>Email Enviado!</h1>
            <p className="auth-subtitle">
              Se existe uma conta associada ao email informado, você receberá instruções para redefinir sua senha.
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
        <Link to="/admin" className="auth-logo">
          <img src={logoArteBryndes} alt="Arte Bryndes" />
        </Link>
        
        <div className="auth-card">
          <h1>Recuperar Senha</h1>
          <p className="auth-subtitle">
            Digite seu email para receber instruções de recuperação de senha
          </p>

          {error && (
            <div className="auth-error">{error}</div>
          )}

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
              <Link to="/_adm" className="text-bronze underline">
                Voltar ao Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}