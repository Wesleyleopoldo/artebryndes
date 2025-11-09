import React from 'react';

import { configDotenv } from 'dotenv';

configDotenv();

const API_BASE = process.env.VITE_API_BASE;

export default function DevLinks() {
  if (process.env.NODE_ENV !== 'development') return null; // esconda em produção
  const host = typeof window !== 'undefined' ? window.location.origin : API_BASE;
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Categoria (exemplo)', href: '/categoria/exemplo' },
    { label: 'Carrinho', href: '/carrinho' },

    { label: 'Login Admin', href: '/_adm/portal/entrar' },
    { label: 'Esqueci minha senha', href: '/_adm/portal/esqueci-senha' },
    { label: 'Redefinir senha (token exemplo)', href: '/_adm/portal/redefinir-senha?token=test' },
    { label: 'Cadastrar Admin', href: '/_adm/portal/cadastrar' },
    { label: 'MFA Admin', href: '/_adm/portal/mfa' },

    { label: 'Admin Home (dashboard)', href: '/_adm/portal' },
    { label: 'Admin - Produtos', href: '/admin/produtos' },
  { label: 'Admin - Categorias', href: '/admin/categorias' },
    { label: 'Admin - Novo Produto', href: '/admin/produtos/novo' },
    { label: 'Admin - Editar Produto (ex: 123)', href: '/admin/produtos/123/editar' },
    { label: 'Admin - Usuários', href: '/admin/usuarios' },
    { label: 'Admin - Meu Perfil', href: '/admin/perfil' },
  ];

  return (
    <div className="main-content">
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2>Dev Links — Teste rápido</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 12 }}>Clique nos links abaixo para abrir as telas no seu ambiente de desenvolvimento.</p>

        <ul style={{ display: 'grid', gap: 8, listStyle: 'none', padding: 0 }}>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} style={{ display: 'inline-block', padding: '10px 14px', borderRadius: 8, background: 'var(--card-bg)', border: '1px solid var(--border)', textDecoration: 'none', color: 'var(--text)', boxShadow: '0 6px 18px rgba(0,0,0,0.04)' }}>
                {l.label} — {host + l.href}
              </a>
            </li>
          ))}
        </ul>

        <p style={{ marginTop: 16, color: 'var(--muted)' }}>
          Observação: as rotas de admin estão temporariamente sem proteção para facilitar testes. Não deixe isso em produção.
        </p>
      </div>
    </div>
  );
}
