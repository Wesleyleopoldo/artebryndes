import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = 'http://localhost:5353';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = async (credentials) => {
    // credentials: { username, password }
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify(credentials),
    });
    if (res.ok) {
      const body = await res.json();
      console.log('Login response:', body); // Debug para ver o que retorna
      // Não seta autenticado ainda - aguarda MFA
      return { ok: true, body };
    }
    const err = await res.json().catch(() => ({ message: 'Erro ao autenticar' }));
    return { ok: false, error: err };
  };

  const logout = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/logout`, { 
        method: 'POST', 
        credentials: 'include',
        headers: {
          'Origin': window.location.origin
        }
      });
      
      if (res.ok) {
        setIsAuthenticated(false);
        setUser(null);
        navigate('/_adm/portal/entrar');
      }
    } catch (e) {
      console.error('Erro ao fazer logout:', e);
    }
  };

  const validateMfa = async (userId, code) => {
    const res = await fetch(`${API_BASE}/api/auth/mfa/${userId}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify({ code }),
    });
    if (res.ok) {
      const body = await res.json();
      setIsAuthenticated(true);
      setUser(body.user ?? null);
      navigate('/admin'); // Só redireciona para home após MFA
      return { ok: true, body };
    }
    const err = await res.json().catch(() => ({ message: 'Erro na validação MFA' }));
    return { ok: false, error: err };
  };

  const signup = async (payload) => {
    // Only callable when authenticated (per your requirement). Backend should verify session.
    const res = await fetch(`${API_BASE}/api/admin/signup`, {
      method: 'POST',
      credentials: 'include',
      headers: { 
        'Content-Type': 'application/json',
        'Origin': window.location.origin
      },
      body: JSON.stringify(payload),
    });
    if (res.ok) return { ok: true };
    const err = await res.json().catch(() => ({ message: 'Erro' }));
    return { ok: false, error: err };
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout, signup, validateMfa }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
