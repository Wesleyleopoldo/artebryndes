import { Link } from "react-router-dom";

export default function AdminHome() {
  return (
    <div className="main-content">
      <h2>Área do Administrador</h2>
      <p>Escolha uma ação:</p>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', marginTop: 16 }}>
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

        <Link to="/_adm/portal/entrar" className="admin-card">
          <h3>Sair do Painel Administrativo</h3>
          <p>Voltar para a página de login do administrador.</p>
        </Link>
      </div>
    </div>
  );
}
