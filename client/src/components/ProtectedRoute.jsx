import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // or a spinner
  if (!isAuthenticated) {
    // unconventional path for admin login
    return <Navigate to="/_adm/portal/entrar" replace />;
  }
  return children;
}
