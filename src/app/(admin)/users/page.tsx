'use client'

import { useState } from 'react'
import { useUsers, useUpdateUser, useDeleteUser } from '@/hooks/use-users'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, MoreHorizontal, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function UsersPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editUser, setEditUser] = useState<any>(null)
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editCity, setEditCity] = useState('')
  const [editPrivacy, setEditPrivacy] = useState<'public' | 'private'>('public')

  const { data, isLoading } = useUsers({ search, page })
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const handleEdit = (user: any) => {
    setEditUser(user)
    setEditName(user.display_name || '')
    setEditBio(user.bio || '')
    setEditCity(user.city || '')
    setEditPrivacy(user.privacy || 'public')
  }

  const handleSaveEdit = async () => {
    if (!editUser) return
    await updateUser.mutateAsync({
      id: editUser.id,
      data: {
        display_name: editName,
        bio: editBio,
        city: editCity,
        privacy: editPrivacy,
      },
    })
    setEditUser(null)
  }

  const handleDelete = async () => {
    if (!deleteUserId) return
    await deleteUser.mutateAsync(deleteUserId)
    setDeleteUserId(null)
  }

  const totalPages = data ? Math.ceil(data.count / 20) : 1

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hiven-text-3" />
          <Input
            placeholder="Buscar por nome ou username..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9 bg-hiven-bg border-hiven-border focus:border-hiven-red focus:ring-hiven-red/10 rounded-xl"
          />
        </div>
        <div className="text-sm text-hiven-text-3">
          {data?.count || 0} usuarios encontrados
        </div>
      </div>

      {/* Table */}
      <Card className="border-hiven-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-hiven-border hover:bg-transparent">
                <TableHead className="text-hiven-text-3 font-medium">Usuario</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Email</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Cadastro</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Privacidade</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Verificado</TableHead>
                <TableHead className="text-hiven-text-3 font-medium text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-hiven-text-3" />
                  </TableCell>
                </TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-hiven-text-3">
                    Nenhum usuario encontrado
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((user) => (
                  <TableRow key={user.id} className="border-hiven-border hover:bg-hiven-bg/50 transition-colors duration-150">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="bg-hiven-red/10 text-hiven-red text-xs font-bold">
                            {user.display_name?.charAt(0)?.toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-hiven-text">{user.display_name}</p>
                          <p className="text-xs text-hiven-text-3">@{user.username}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-hiven-text-2">
                      -
                    </TableCell>
                    <TableCell className="text-sm text-hiven-text-2">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.privacy === 'public'
                            ? 'border-hiven-success/30 text-hiven-success bg-hiven-success/5'
                            : 'border-hiven-warning/30 text-hiven-warning bg-hiven-warning/5'
                        }
                      >
                        {user.privacy === 'public' ? 'Publico' : 'Privado'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.verified ? (
                        <Badge className="bg-hiven-success/10 text-hiven-success border-0">
                          Sim
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-hiven-border text-hiven-text-3">
                          Nao
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="h-4 w-4 text-hiven-text-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-hiven-border rounded-xl">
                          <DropdownMenuItem onClick={() => router.push(`/users/${user.id}`)} className="rounded-lg">
                            <Eye className="mr-2 h-4 w-4" /> Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(user)} className="rounded-lg">
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteUserId(user.id)}
                            className="text-hiven-error focus:text-hiven-error rounded-lg"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-hiven-text-3">
            Pagina {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-hiven-border text-hiven-text-2 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-hiven-border text-hiven-text-2 rounded-xl"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="border-hiven-border bg-hiven-surface-elevated">
          <DialogHeader>
            <DialogTitle className="text-hiven-text">Editar Usuario</DialogTitle>
            <DialogDescription className="text-hiven-text-3">
              Atualize as informacoes do usuario
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-hiven-text">Nome</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-hiven-bg border-hiven-border focus:border-hiven-red rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-hiven-text">Bio</Label>
              <Input
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="bg-hiven-bg border-hiven-border focus:border-hiven-red rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-hiven-text">Cidade</Label>
              <Input
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                className="bg-hiven-bg border-hiven-border focus:border-hiven-red rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-hiven-text">Privacidade</Label>
              <Select value={editPrivacy} onValueChange={(v) => setEditPrivacy((v ?? 'public') as 'public' | 'private')}>
                <SelectTrigger className="bg-hiven-bg border-hiven-border rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-hiven-border">
                  <SelectItem value="public">Publico</SelectItem>
                  <SelectItem value="private">Privado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)} className="border-hiven-border rounded-xl">
              Cancelar
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={updateUser.isPending}
              className="bg-hiven-red hover:bg-hiven-dark-red text-white rounded-xl"
            >
              {updateUser.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <DialogContent className="border-hiven-border bg-hiven-surface-elevated">
          <DialogHeader>
            <DialogTitle className="text-hiven-text">Confirmar Exclusao</DialogTitle>
            <DialogDescription className="text-hiven-text-3">
              Tem certeza que deseja excluir este usuario? Esta acao nao pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUserId(null)} className="border-hiven-border rounded-xl">
              Cancelar
            </Button>
            <Button
              onClick={handleDelete}
              disabled={deleteUser.isPending}
              className="bg-hiven-error hover:bg-red-700 text-white rounded-xl"
            >
              {deleteUser.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
