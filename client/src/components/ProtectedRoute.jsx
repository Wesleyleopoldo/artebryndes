import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requiredRole = "admin" }) {
  const { isAuthenticated, loading, user } = useAuth();

  // mostra spinner mínimo enquanto valida
  if (loading) return <div aria-busy="true" className="spinner">Carregando...</div>;

  // não autenticado -> redireciona para rota não-convencional de login
  if (!isAuthenticated) return <Navigate to="/_adm/portal/entrar" replace />;

  // checa papel/role (negue acesso se papel incorreto)
  if (requiredRole && (!user || user.role !== requiredRole)) {
    return <Navigate to="/_adm/portal/entrar" replace />;
  }

  return children;
}
