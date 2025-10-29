import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoArteBryndes from "../../assets/logo-artebryndes-fundoremovido.png";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(form);
    if (res.ok && res.body.id) { // Verifica se temos o id do usuário
      // Após login bem sucedido, redireciona para MFA com userId
      navigate(`/_adm/portal/mfa?userId=${res.body.id}`);
    } else {
      setError(res.error?.message || res.body?.message || 'Falha ao entrar');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <img src={logoArteBryndes} alt="Arte Bryndes" />
        </div>
        
        <div className="auth-card">
          <h1>Área Administrativa</h1>
          <p className="auth-subtitle">Entre com suas credenciais para acessar</p>
          
          <form onSubmit={onSubmit} className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="username">Usuário</label>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={onChange}
                required
                autoComplete="username"
                className="auth-input"
              />
            </div>

            <div className="auth-input-group">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                required
                autoComplete="current-password"
                className="auth-input"
              />
            </div>

            {error && (
              <div className="auth-error">
                <svg viewBox="0 0 24 24" className="auth-error-icon">
                  <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {error}
              </div>
            )}

            <button type="submit" className="auth-submit">
              Entrar
            </button>

            <p className="text-sm text-muted" style={{ marginTop: '1rem', textAlign: 'center' }}>
              <a href="/_adm/portal/esqueci-senha" className="text-bronze underline">
                Esqueci minha senha
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
