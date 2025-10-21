import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoArteBryndes from "../../assets/logo-artebryndes-fundoremovido.png";

export default function AdminSignup() {
  const [form, setForm] = useState({ username: "", password: "", name: "", email: "" });
  const [error, setError] = useState(null);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Preview mode when the route is '/_adm/portal/cadastrar-open'
  const preview = location.pathname === '/_adm/portal/cadastrar-open';

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (preview) {
      // Simulate success so the user can preview the flow without backend/session
      navigate('/admin/produtos');
      return;
    }

    const res = await signup(form);
    if (res.ok) {
      navigate('/admin/produtos');
    } else {
      setError(res.error?.message || 'Falha ao criar conta');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <Link to="/admin">
            <img src={logoArteBryndes} alt="Arte Bryndes" />
          </Link>
        </div>

        <div className="auth-card">
          <h1>Cadastro de Administrador</h1>
          <p className="auth-subtitle">Somente administradores podem criar novas contas administrativas. O email é obrigatório para autenticação MFA via email.</p>

          {error && (
            <div className="auth-error">
              <svg viewBox="0 0 24 24" className="auth-error-icon">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="name">Nome</label>
              <input id="name" name="name" value={form.name} onChange={onChange} required className="auth-input" />
            </div>

            <div className="auth-input-group">
              <label htmlFor="username">Usuário</label>
              <input id="username" name="username" value={form.username} onChange={onChange} required className="auth-input" />
            </div>

            <div className="auth-input-group">
              <label htmlFor="email">Email (obrigatório)</label>
              <input id="email" name="email" type="email" value={form.email} onChange={onChange} required className="auth-input" />
            </div>

            <div className="auth-input-group">
              <label htmlFor="password">Senha</label>
              <input id="password" name="password" type="password" value={form.password} onChange={onChange} required className="auth-input" />
            </div>

            <button type="submit" className="auth-submit">Criar</button>
          </form>

          <p className="mt-4 text-sm text-muted">
            Voltar para o painel: <Link to="/admin-open" className="text-bronze hover:underline">Painel Admin (preview)</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
