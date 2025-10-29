import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = 'http://localhost:5353';
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check session by calling backend endpoint that validates HttpOnly cookie.
  // Backend should expose an endpoint like GET /api/admin/session which returns 200 + user
  // if session cookie is valid. Frontend uses credentials: 'include' and cannot read cookie directly.
  const checkSession = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/session`, { 
        method: 'GET', 
        credentials: 'include',
        headers: {
          'Origin': window.location.origin
        }
      });
      if (res.ok) {
        const body = await res.json();
        setIsAuthenticated(true);
        setUser(body.user ?? null);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (e) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (credentials) => {
    // credentials: { username, password }
    const res = await fetch(`${API_BASE}/api/admin/login`, {
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
      await fetch(`${API_BASE}/api/admin/logout`, { 
        method: 'POST', 
        credentials: 'include',
        headers: {
          'Origin': window.location.origin
        }
      });
    } catch (e) {}
    setIsAuthenticated(false);
    setUser(null);
    navigate('/_adm/portal/entrar');
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
    <AuthContext.Provider value={{ isAuthenticated, loading, user, checkSession, login, logout, signup, validateMfa }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
