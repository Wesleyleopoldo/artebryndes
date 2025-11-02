import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/use-toast";
import { Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";
import { fetchWithAuth } from "../../lib/fetchWithAuth";

const API_BASE = 'http://localhost:5353';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', username: '', role: '' });
  const [saving, setSaving] = useState(false);
  const [roleChangingId, setRoleChangingId] = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', username: '', password: '', confirm: '', role: 'user' });
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    fetchUsers();
    return () => { mountedRef.current = false; };
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/users/all`, { method: 'GET' });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setUsers(data.map(u => ({ role: u.role || 'user', ...u })));
        } else {
          setUsers([]);
        }
      } else if (res.status === 403) {
        setError('Acesso negado. Apenas administradores podem acessar a lista de usuários.');
        setUsers([]);
      } else {
        const body = await res.text().catch(() => '');
        console.debug('fetchUsers unexpected', res.status, body);
      }
    } catch (err) {
      console.debug('fetchUsers network error or redirected', err);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const startEdit = (user) => {
    setForm({
      name: user.name || '',
      email: user.email || '',
      username: user.username || '',
      role: user.role || 'user'
    });
    setEditing(user);
  };

  const closeEdit = () => {
    setEditing(null);
    setForm({ name: '', email: '', username: '', role: '' });
  };

  const handleResetPassword = async (userId) => {
    if (!confirm('Tem certeza que deseja resetar a senha deste usuário?')) return;

    try {
      const res = await fetchWithAuth(`${API_BASE}/api/admin/users/${encodeURIComponent(userId)}/reset-password`, {
        method: 'POST'
      });

      if (res.ok) {
        toast({ description: "Solicitação de reset de senha enviada com sucesso.", variant: "success" });
      } else {
        const data = await res.json().catch(() => ({}));
        toast({ title: "Erro ao resetar senha", description: data.message || "Ocorreu um erro ao tentar resetar a senha", variant: "destructive" });
      }
    } catch (err) {
      console.debug('handleResetPassword error', err);
    }
  };

  const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);

    try {
      const payload = {
        ...(form.name ? { name: form.name } : {}),
        ...(form.username ? { username: form.username } : {}),
        ...(form.email ? { email: form.email } : {}),
        ...(form.role ? { role: form.role } : {}),
      };

      const res = await fetchWithAuth(`${API_BASE}/api/users/${encodeURIComponent(editing.id)}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const updated = await res.json().catch(() => null);
        toast({ description: "Usuário atualizado com sucesso!", variant: "success" });
        if (updated && updated.id) setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, ...updated } : u));
        else await fetchUsers();
        closeEdit();
      } else if (res.status === 403) {
        toast({ title: "Acesso negado", description: "Você não tem permissão para atualizar usuários.", variant: "destructive" });
      } else {
        const body = await res.json().catch(() => ({}));
        toast({ title: "Erro ao atualizar usuário", description: body.message || "Ocorreu um erro ao tentar atualizar o usuário", variant: "destructive" });
      }
    } catch (err) {
      console.debug('onSubmit error', err);
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Tem certeza que deseja remover este usuário?')) return;

    try {
      const res = await fetchWithAuth(`${API_BASE}/api/users/${encodeURIComponent(id)}`, { method: 'DELETE' });

      if (res.ok) {
        toast({ description: "Usuário removido com sucesso!", variant: "success" });
        await fetchUsers();
      } else {
        const body = await res.json().catch(() => ({}));
        toast({ title: "Erro ao remover usuário", description: body.message || "Ocorreu um erro ao tentar remover o usuário", variant: "destructive" });
      }
    } catch (err) {
      console.debug('onDelete error', err);
    }
  };

  // Open admin create page (restores original flow)
  const onCreate = () => navigate('/_adm/portal/cadastrar');

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Confirma alterar role de "${user.name}" para "${newRole}"?`)) return;

    setRoleChangingId(user.id);
    try {
      const res = await fetchWithAuth(`${API_BASE}/api/users/${encodeURIComponent(user.id)}`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole })
      });

      if (res.ok) {
        const updated = await res.json().catch(() => null);
        toast({ description: `Role alterada para ${newRole}.`, variant: "success" });
        if (updated && updated.id) setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
        else setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: newRole } : u));
      } else if (res.status === 403) {
        toast({ title: "Acesso negado", description: "Você não tem permissão para alterar roles.", variant: "destructive" });
      } else {
        const body = await res.json().catch(() => ({}));
        toast({ title: "Erro", description: body.message || "Falha ao alterar role", variant: "destructive" });
      }
    } catch (err) {
      console.debug('toggleRole error', err);
    } finally {
      if (mountedRef.current) setRoleChangingId(null);
    }
  };

  const onCreateChange = (e) => setCreateForm(s => ({ ...s, [e.target.name]: e.target.value }));

  if (loading) {
    return (
      <div className="main-content">
        <h2>Gerenciar Usuários</h2>
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <h2>Gerenciar Usuários</h2>
        <div className="auth-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="container py-8 admin-users">
      <div className="mb-6">
        <Button onClick={() => navigate('/admin')} className="btn outline" aria-label="Voltar ao painel">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <ChevronLeft style={{ width: 16, height: 16 }} />
            <span>Voltar ao Painel</span>
          </span>
        </Button>
      </div>

      <Card>
        <CardHeader className="admin-header">
          <div>
            <CardTitle>Gerenciar Usuários</CardTitle>
            <p className="text-sm text-muted mt-4">
              Crie, edite ou exclua administradores.
            </p>
          </div>
          <Button onClick={onCreate} className="new-user">Cadastrar novo</Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead style={{ width: '140px' }}>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="table-cell-strong">{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><span style={{ textTransform: 'capitalize' }}>{user.role || 'user'}</span></TableCell>
                    <TableCell>
                      <div className="table-actions" style={{ display: 'flex', gap: 8 }}>
                        <button className="icon-btn" title="Editar" onClick={() => startEdit(user)}>
                          <Pencil style={{ width: 16, height: 16 }} />
                        </button>
                        <button className="icon-btn" title={user.role === 'admin' ? 'Revoke admin' : 'Make admin'} onClick={() => toggleRole(user)} disabled={roleChangingId === user.id}>
                          {user.role === 'admin' ? 'Revoke' : 'Make'}
                        </button>
                        <button className="icon-btn" title="Resetar senha" onClick={() => handleResetPassword(user.id)}>
                          <Key style={{ width: 16, height: 16 }} />
                        </button>
                        <button className="icon-btn" title="Excluir" onClick={() => onDelete(user.id)} style={{ color: '#b91c1c' }}>
                          <Trash2 style={{ width: 16, height: 16 }} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Edit dialog */}
          {editing && (
  <div className="modal-overlay">
    <div className="modal-content edit-modal">
      <h2 className="modal-title">Editar Usuário</h2>
      
      <form onSubmit={onSubmit} className="admin-form">
        <div className="form-group">
          <Label htmlFor="name" className="form-label">Nome</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={onChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <Label htmlFor="username" className="form-label">Usuário</Label>
          <Input
            id="username" 
            name="username"
            value={form.username}
            onChange={onChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <Label htmlFor="email" className="form-label">Email</Label>
          <Input
            id="email"
            name="email"
            type="email" 
            value={form.email}
            onChange={onChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <Label htmlFor="role" className="form-label">Role</Label>
          <select 
            id="role"
            name="role"
            value={form.role}
            onChange={onChange}
            className="form-select"
          >
            <option value="user">Usuário</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            onClick={closeEdit}
            className="btn outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn primary"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

        </CardContent>
      </Card>
    </div>
  );
}
