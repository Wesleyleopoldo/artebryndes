import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchWithAuth } from "../../lib/fetchWithAuth";
import logoArteBryndes from "../../assets/logo-artebryndes-fundoremovido.png";
import { configDotenv } from 'dotenv';

configDotenv();

const API_BASE = process.env.VITE_API_BASE;

export default function AdminSignup() {
  const [form, setForm] = useState({ username: "", password: "", confirm: "", name: "", email: "", role: "user" });
  const [error, setError] = useState(null);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Preview mode when the route is '/_adm/portal/cadastrar'
  const preview = location.pathname === '/_adm/portal/cadastrar';

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // basic validation
    if (form.password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      // escolha endpoint com base no select role
      const endpoint = form.role === 'admin' ? `${API_BASE}/api/users/admin` : `${API_BASE}/api/users/`;
      const payload = {
        name: form.name,
        username: form.username,
        email: form.email,
        password: form.password
      };

      console.debug('AdminSignup -> sending', endpoint, payload);

      const res = await fetchWithAuth(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // importante se backend usa cookies/sessões
        body: JSON.stringify(payload)
      });

      console.debug('AdminSignup -> response', res);

      if (res.ok) {
        // sucesso: navegar para onde faz sentido
        navigate('/admin/usuarios');
        return;
      }

      // melhor leitura do body de erro
      const text = await res.text().catch(() => '');
      let body = {};
      try { body = text ? JSON.parse(text) : {}; } catch {}
      const message = body.message || text || `Erro ${res.status}`;
      setError(message);
    } catch (err) {
      console.error('AdminSignup -> network error', err);
      setError('Erro de rede ao criar usuário');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container auth-container--wide">
         <div className="auth-logo">
           <Link to="/admin">
             <img src={logoArteBryndes} alt="Arte Bryndes" />
           </Link>
         </div>
 
         {/* widened card */}
         <div className="auth-card auth-card--wide">
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
 
             <div className="auth-input-group" style={{ display: 'flex', gap: 12 }}>
               <div style={{ flex: 1 }}>
                 <label htmlFor="password">Senha</label>
                 <input id="password" name="password" type="password" value={form.password} onChange={onChange} required className="auth-input" />
               </div>
               <div style={{ flex: 1 }}>
                 <label htmlFor="confirm">Confirmar Senha</label>
                 <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={onChange} required className="auth-input" />
               </div>
             </div>
 
             <div className="auth-input-group">
               <label htmlFor="role">Role</label>
               <select id="role" name="role" value={form.role} onChange={onChange} className="auth-input" style={{ width: '100%', padding: '10px' }}>
                 <option value="user">Usuário</option>
                 <option value="admin">Administrador</option>
               </select>
             </div>
 
             <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
               <button type="submit" className="auth-submit">Criar</button>
               <Link to="/admin" className="text-bronze" style={{ alignSelf: 'center', paddingLeft: 8 }}>Cancelar</Link>
             </div>
           </form>
 
           <p className="mt-4 text-sm text-muted">
             Voltar para o painel: <Link to="/admin" className="text-bronze hover:underline">Painel Admin (preview)</Link>
           </p>
         </div>
       </div>
     </div>
   );
}
