'use client'

import { useState } from 'react'
import { useExperiences, useUpdateExperience, useDeleteExperience } from '@/hooks/use-experiences'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Search, MoreHorizontal, Eye, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2, Calendar, Users, Heart, MapPin, BookOpen, Flame } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EXPERIENCE_STATUS_LABELS, EXPERIENCE_STATUS_COLORS } from '@/lib/constants'

export default function ExperiencesPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [editExp, setEditExp] = useState<any>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [deleteExpId, setDeleteExpId] = useState<string | null>(null)
  const [viewExp, setViewExp] = useState<any>(null)

  const { data, isLoading } = useExperiences({ search, page, status: statusFilter || undefined })
  const updateExperience = useUpdateExperience()
  const deleteExperience = useDeleteExperience()

  const handleEdit = (exp: any) => {
    setEditExp(exp)
    setEditTitle(exp.title || '')
    setEditDescription(exp.description || '')
    setEditStatus(exp.status || '')
  }

  const handleSaveEdit = async () => {
    if (!editExp) return
    await updateExperience.mutateAsync({
      id: editExp.id,
      data: { title: editTitle, description: editDescription, status: editStatus as any },
    })
    setEditExp(null)
  }

  const handleDelete = async () => {
    if (!deleteExpId) return
    await deleteExperience.mutateAsync(deleteExpId)
    setDeleteExpId(null)
  }

  const totalPages = data ? Math.ceil(data.count / 20) : 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hiven-text-3" />
          <Input placeholder="Buscar por titulo..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9 bg-hiven-bg border-hiven-border focus:border-hiven-red focus:ring-hiven-red/10 rounded-xl" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === 'all' || !v ? '' : v); setPage(1) }}>
          <SelectTrigger className="w-[180px] bg-hiven-bg border-hiven-border rounded-xl">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent className="border-hiven-border">
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="draft">Rascunho</SelectItem>
            <SelectItem value="open">Aberta</SelectItem>
            <SelectItem value="ongoing">Acontecendo</SelectItem>
            <SelectItem value="finished">Encerrada</SelectItem>
            <SelectItem value="cancelled">Cancelada</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-hiven-text-3">{data?.count || 0} experiencias</div>
      </div>

      <Card className="border-hiven-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-hiven-border hover:bg-transparent">
                <TableHead className="text-hiven-text-3 font-medium">Titulo</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Autor</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Status</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Data</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Particip.</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Curtidas</TableHead>
                <TableHead className="text-hiven-text-3 font-medium text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-hiven-text-3" />
                  </TableCell>
                </TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-hiven-text-3">
                    Nenhuma experiencia encontrada
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((exp) => (
                  <TableRow key={exp.id} className="border-hiven-border hover:bg-hiven-bg/50 transition-colors duration-150">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={exp.cover_url || undefined} />
                          <AvatarFallback className="bg-hiven-red/10 text-hiven-red text-xs font-bold">
                            <Flame className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium text-hiven-text truncate max-w-[200px]">{exp.title}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-hiven-text-2">{exp.creator?.display_name || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={EXPERIENCE_STATUS_COLORS[exp.status] || ''}>
                        {EXPERIENCE_STATUS_LABELS[exp.status] || exp.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-hiven-text-2">
                      {exp.starts_at ? new Date(exp.starts_at).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-hiven-text-2">{exp.participants_count}</TableCell>
                    <TableCell className="text-sm text-hiven-text-2">{exp.likes_count}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <MoreHorizontal className="h-4 w-4 text-hiven-text-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-hiven-border rounded-xl">
                          <DropdownMenuItem onClick={() => setViewExp(exp)} className="rounded-lg">
                            <Eye className="mr-2 h-4 w-4" /> Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(exp)} className="rounded-lg">
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteExpId(exp.id)} className="text-hiven-error focus:text-hiven-error rounded-lg">
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-hiven-text-3">Pagina {page} de {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="border-hiven-border text-hiven-text-2 rounded-xl">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="border-hiven-border text-hiven-text-2 rounded-xl">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Experience Dialog - Rich Detail View */}
      <Dialog open={!!viewExp} onOpenChange={() => setViewExp(null)}>
        <DialogContent className="border-hiven-border bg-hiven-surface-elevated sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-hiven-text flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-hiven-orange/10">
                <Eye className="h-4 w-4 text-hiven-orange" />
              </div>
              Detalhes da Experiencia
            </DialogTitle>
          </DialogHeader>
          {viewExp && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-hiven-text">{viewExp.title}</h3>
                {viewExp.description && (
                  <p className="text-sm text-hiven-text-2 mt-1 leading-relaxed">{viewExp.description}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-hiven-bg/80 border border-hiven-border/50">
                  <Users className="h-4 w-4 text-hiven-info" />
                  <div>
                    <p className="text-sm font-semibold text-hiven-text">{viewExp.participants_count}</p>
                    <p className="text-xs text-hiven-text-3">Participantes</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-hiven-bg/80 border border-hiven-border/50">
                  <Heart className="h-4 w-4 text-hiven-red" />
                  <div>
                    <p className="text-sm font-semibold text-hiven-text">{viewExp.likes_count}</p>
                    <p className="text-xs text-hiven-text-3">Curtidas</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-hiven-bg/80 border border-hiven-border/50">
                  <BookOpen className="h-4 w-4 text-hiven-success" />
                  <div>
                    <p className="text-sm font-semibold text-hiven-text">{viewExp.saves_count}</p>
                    <p className="text-xs text-hiven-text-3">Salvos</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-hiven-bg/80 border border-hiven-border/50">
                  <Calendar className="h-4 w-4 text-hiven-orange" />
                  <div>
                    <p className="text-sm font-semibold text-hiven-text">
                      {viewExp.starts_at ? new Date(viewExp.starts_at).toLocaleDateString('pt-BR') : 'N/A'}
                    </p>
                    <p className="text-xs text-hiven-text-3">Data</p>
                  </div>
                </div>
              </div>

              {viewExp.place && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-hiven-orange/5 to-transparent border border-hiven-orange/10">
                  <MapPin className="h-4 w-4 text-hiven-orange" />
                  <div>
                    <p className="text-sm font-medium text-hiven-text">{viewExp.place.name}</p>
                    <p className="text-xs text-hiven-text-3">{viewExp.place.address_city || ''}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-xl bg-hiven-bg/80 border border-hiven-border/50">
                <span className="text-sm text-hiven-text-3">Status</span>
                <Badge variant="outline" className={EXPERIENCE_STATUS_COLORS[viewExp.status] || ''}>
                  {EXPERIENCE_STATUS_LABELS[viewExp.status] || viewExp.status}
                </Badge>
              </div>

              {viewExp.creator && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-hiven-bg/80 border border-hiven-border/50">
                  <div className="h-8 w-8 rounded-full bg-hiven-red/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-hiven-red">
                      {viewExp.creator.display_name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-hiven-text">{viewExp.creator.display_name}</p>
                    <p className="text-xs text-hiven-text-3">@{viewExp.creator.username}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewExp(null)} className="border-hiven-border rounded-xl">Fechar</Button>
            <Button onClick={() => { setViewExp(null); router.push(`/experiences/${viewExp?.id}`) }} className="bg-hiven-red hover:bg-hiven-dark-red text-white rounded-xl">
              Ver pagina completa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editExp} onOpenChange={() => setEditExp(null)}>
        <DialogContent className="border-hiven-border bg-hiven-surface-elevated">
          <DialogHeader>
            <DialogTitle className="text-hiven-text">Editar Experiencia</DialogTitle>
            <DialogDescription className="text-hiven-text-3">Atualize as informacoes</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-hiven-text">Titulo</Label>
              <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="bg-hiven-bg border-hiven-border focus:border-hiven-red rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-hiven-text">Descricao</Label>
              <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="bg-hiven-bg border-hiven-border focus:border-hiven-red rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-hiven-text">Status</Label>
              <Select value={editStatus} onValueChange={(v) => setEditStatus(v ?? '')}>
                <SelectTrigger className="bg-hiven-bg border-hiven-border rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent className="border-hiven-border">
                  <SelectItem value="draft">Rascunho</SelectItem>
                  <SelectItem value="open">Aberta</SelectItem>
                  <SelectItem value="ongoing">Acontecendo</SelectItem>
                  <SelectItem value="finished">Encerrada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditExp(null)} className="border-hiven-border rounded-xl">Cancelar</Button>
            <Button onClick={handleSaveEdit} disabled={updateExperience.isPending} className="bg-hiven-red hover:bg-hiven-dark-red text-white rounded-xl">
              {updateExperience.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteExpId} onOpenChange={() => setDeleteExpId(null)}>
        <DialogContent className="border-hiven-border bg-hiven-surface-elevated">
          <DialogHeader>
            <DialogTitle className="text-hiven-text">Confirmar Exclusao</DialogTitle>
            <DialogDescription className="text-hiven-text-3">Tem certeza? Esta acao nao pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteExpId(null)} className="border-hiven-border rounded-xl">Cancelar</Button>
            <Button onClick={handleDelete} disabled={deleteExperience.isPending} className="bg-hiven-error hover:bg-red-700 text-white rounded-xl">
              {deleteExperience.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
