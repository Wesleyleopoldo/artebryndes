import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { useToast } from "../../hooks/use-toast";
import { Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { ChevronLeft, Pencil, Trash2 } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', username: '' });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Carrega a lista de usuários
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users', {
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setError('Erro ao carregar usuários');
      }
    } catch (err) {
      setError('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user) => {
    setForm({
      name: user.name || '',
      email: user.email || '',
      username: user.username || ''
    });
    setEditing(user);
  };

  const closeEdit = () => {
    setEditing(null);
    setForm({ name: '', email: '', username: '' });
  };

  const handleResetPassword = async (userId) => {
    if (!confirm('Tem certeza que deseja resetar a senha deste usuário?')) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        toast({
          description: "Solicitação de reset de senha enviada com sucesso.",
          variant: "success",
        });
      } else {
        const data = await res.json();
        toast({
          title: "Erro ao resetar senha",
          description: data.message || "Ocorreu um erro ao tentar resetar a senha",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Erro ao resetar senha",
        description: "Ocorreu um erro ao tentar resetar a senha",
        variant: "destructive",
      });
    }
  };

  const onChange = (e) => {
    setForm(s => ({ ...s, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/admin/users/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });

      if (res.ok) {
        toast({
          description: "Usuário atualizado com sucesso!",
          variant: "success",
        });
        await fetchUsers();
        closeEdit();
      } else {
        const body = await res.json().catch(() => ({}));
        toast({
          title: "Erro ao atualizar usuário",
          description: body.message || "Ocorreu um erro ao tentar atualizar o usuário",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Erro ao atualizar usuário",
        description: "Ocorreu um erro ao tentar atualizar o usuário",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm('Tem certeza que deseja remover este usuário?')) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        toast({
          description: "Usuário removido com sucesso!",
          variant: "success",
        });
        await fetchUsers();
      } else {
        const body = await res.json().catch(() => ({}));
        toast({
          title: "Erro ao remover usuário",
          description: body.message || "Ocorreu um erro ao tentar remover o usuário",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Erro ao remover usuário",
        description: "Ocorreu um erro ao tentar remover o usuário",
        variant: "destructive",
      });
    }
  };

  const onCreate = () => {
    navigate('/_adm/portal/cadastrar-open');
  };

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
    <div className="container py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/_adm/portal')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar ao Painel
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gerenciar Usuários</CardTitle>
            <p className="text-sm text-muted-foreground mt-1.5">
              Crie, edite ou exclua administradores.
            </p>
          </div>
          <Button onClick={onCreate}>Cadastrar novo</Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-destructive/15 text-destructive rounded-md p-3 mb-6">
              {error}
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => startEdit(user)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleResetPassword(user.id)}
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => onDelete(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                      Nenhum usuário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Dialog open={!!editing} onOpenChange={() => editing && closeEdit()}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar Usuário</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Usuário</Label>
                  <Input
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={closeEdit}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
