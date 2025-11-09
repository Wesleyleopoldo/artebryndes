import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import NotFound from "./pages/not-found";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminHome from "./pages/admin/AdminHome";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminMFA from "./pages/admin/AdminMFA";
import ForgotPassword from "./pages/admin/ForgotPassword";
import ResetPassword from "./pages/admin/ResetPassword";
import RecoveryCode from "./pages/admin/RecoveryCode";
import DevLinks from "./pages/admin/DevLinks";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rotas de autenticação - sem header/footer */} 
          <Route path="/_adm/portal/entrar" element={<AdminLogin />} />
          <Route path="/_adm/portal/esqueci-senha" element={<ForgotPassword />} />
          <Route path="/_adm/portal/recovery-code" element={<RecoveryCode />} />
          <Route path="/_adm/portal/redefinir-senha" element={<ResetPassword />} />
          <Route path="/_adm/dev-links" element={<DevLinks />} />
          {/* Rotas de autenticação - sem header/footer */}
          <Route path="/_adm/portal/cadastrar" element={<AdminSignup />} />
          {/* Admin MFA route */}
          <Route path="/_adm/portal/mfa" element={<AdminMFA />} />

          {/* Rotas normais com header/footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/categoria/:slug" element={<CategoryPage />} />
            <Route path="/carrinho" element={<CartPage />} />

            {/* Admin area - protected */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout><AdminHome /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/produtos" element={
              <ProtectedRoute>
                <AdminLayout><AdminProducts /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/categorias" element={
              <ProtectedRoute>
                <AdminLayout><AdminCategories /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/produtos/novo" element={
              <ProtectedRoute>
                <AdminLayout><AdminProductForm /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/produtos/:id/editar" element={
              <ProtectedRoute>
                <AdminLayout><AdminProductForm /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/usuarios" element={
              <ProtectedRoute>
                <AdminLayout><AdminUsers /></AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/perfil" element={
              <ProtectedRoute>
                <AdminLayout><AdminProfile /></AdminLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

// Layout wrapper com header/footer
function MainLayout() {
  return (
    <div className="app">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
