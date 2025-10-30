import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminHome() {
  const { logout } = useAuth();
  return (
    <div className="main-content">
      <h2>Área do Administrador</h2>
      <p>Escolha uma ação:</p>

  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 16 }}>
        <Link to="/admin/produtos" className="admin-card">
          <h3>Gerenciar Produtos</h3>
          <p>Adicionar, editar ou remover produtos da loja.</p>
        </Link>

        <Link to="/admin/usuarios" className="admin-card">
          <h3>Gerenciar Usuários</h3>
          <p>Cadastrar, editar e excluir administradores e usuários.</p>
        </Link>

        <Link to="/admin/perfil" className="admin-card">
          <h3>Visualizar minhas informações</h3>
          <p>Editar seus dados de perfil e preferências.</p>
        </Link>

        <button onClick={logout} className="admin-card" style={{ width: '100%', textAlign: 'left', border: 'none', cursor: 'pointer' }}>
          <h3>Sair do Painel Administrativo</h3>
          <p>Voltar para a página de login do administrador.</p>
        </button>
      </div>
    </div>
  );
}
