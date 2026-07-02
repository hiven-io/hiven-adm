'use client'

import { useState } from 'react'
import { usePlaces, useUpdatePlace, useDeletePlace } from '@/hooks/use-places'
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
import { Search, MoreHorizontal, Pencil, Trash2, ChevronLeft, ChevronRight, Loader2, MapPin, Star, Shield, Eye } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PLACE_STATUS_LABELS, PLACE_STATUS_COLORS } from '@/lib/constants'

export default function PlacesPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [editPlace, setEditPlace] = useState<any>(null)
  const [editName, setEditName] = useState('')
  const [editCity, setEditCity] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [deletePlaceId, setDeletePlaceId] = useState<string | null>(null)
  const [viewPlace, setViewPlace] = useState<any>(null)

  const { data, isLoading } = usePlaces({ search, page, status: statusFilter || undefined })
  const updatePlace = useUpdatePlace()
  const deletePlace = useDeletePlace()

  const handleEdit = (place: any) => {
    setEditPlace(place)
    setEditName(place.name || '')
    setEditCity(place.address_city || '')
    setEditStatus(place.status || '')
  }

  const handleSaveEdit = async () => {
    if (!editPlace) return
    await updatePlace.mutateAsync({
      id: editPlace.id,
      data: { name: editName, address_city: editCity, status: editStatus as any },
    })
    setEditPlace(null)
  }

  const handleDelete = async () => {
    if (!deletePlaceId) return
    await deletePlace.mutateAsync(deletePlaceId)
    setDeletePlaceId(null)
  }

  const totalPages = data ? Math.ceil(data.count / 20) : 1

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-xs text-hiven-text-3">-</span>
    return (
      <div className="flex items-center gap-0.5">
        <Star className="h-3 w-3 fill-hiven-orange text-hiven-orange" />
        <span className="text-sm text-hiven-text">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hiven-text-3" />
          <Input placeholder="Buscar por nome ou cidade..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9 bg-hiven-bg border-hiven-border focus:border-hiven-red focus:ring-hiven-red/10 rounded-xl" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === 'all' || !v ? '' : v); setPage(1) }}>
          <SelectTrigger className="w-[180px] bg-hiven-bg border-hiven-border rounded-xl">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent className="border-hiven-border">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="closed">Fechados</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-hiven-text-3">{data?.count || 0} locais</div>
      </div>

      <Card className="border-hiven-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-hiven-border hover:bg-transparent">
                <TableHead className="text-hiven-text-3 font-medium">Local</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Categoria</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Cidade</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Nota</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Avaliacoes</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Status</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Verificado</TableHead>
                <TableHead className="text-hiven-text-3 font-medium text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-hiven-text-3" />
                  </TableCell>
                </TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-hiven-text-3">
                    Nenhum local encontrado
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((place) => (
                  <TableRow key={place.id} className="border-hiven-border hover:bg-hiven-bg/50 transition-colors duration-150">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={place.photos?.[0] || undefined} />
                          <AvatarFallback className="bg-hiven-orange/10 text-hiven-orange text-xs font-bold">
                            <MapPin className="h-3 w-3" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-hiven-text truncate max-w-[180px]">{place.name}</p>
                          <p className="text-xs text-hiven-text-3">{place.address_neighborhood || '-'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-hiven-text-2">
                      {place.category?.name || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-hiven-text-2">
                      {place.address_city || '-'}
                    </TableCell>
                    <TableCell>{renderStars(place.rating_avg)}</TableCell>
                    <TableCell className="text-sm text-hiven-text-2">{place.rating_count}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={PLACE_STATUS_COLORS[place.status] || ''}>
                        {PLACE_STATUS_LABELS[place.status] || place.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {place.verified ? (
                        <Badge className="bg-hiven-success/10 text-hiven-success border-0">
                          <Shield className="mr-1 h-3 w-3" /> Sim
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-hiven-border text-hiven-text-3">
                          Nao
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-muted hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                          <MoreHorizontal className="h-4 w-4 text-hiven-text-3" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border-hiven-border rounded-xl">
                          <DropdownMenuItem onClick={() => setViewPlace(place)} className="rounded-lg">
                            <Eye className="mr-2 h-4 w-4" /> Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(place)} className="rounded-lg">
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeletePlaceId(place.id)} className="text-hiven-error focus:text-hiven-error rounded-lg">
                            <Trash2 className="mr-2 h-4 w-4" /> Fechar
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

      {/* View Place Dialog - Rich Detail View */}
      <Dialog open={!!viewPlace} onOpenChange={() => setViewPlace(null)}>
        <DialogContent className="border-hiven-border bg-hiven-surface-elevated sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-hiven-text flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-hiven-orange/10">
                <MapPin className="h-4 w-4 text-hiven-orange" />
              </div>
              Detalhes do Local
            </DialogTitle>
          </DialogHeader>
          {viewPlace && (
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={viewPlace.photos?.[0] || undefined} />
                  <AvatarFallback className="bg-hiven-orange/10 text-hiven-orange text-lg font-bold">
                    <MapPin className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-hiven-text">{viewPlace.name}</h3>
                  {viewPlace.address_neighborhood && (
                    <p className="text-sm text-hiven-text-3">{viewPlace.address_neighborhood}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-hiven-bg/80 border border-hiven-border/50">
                  <div className="flex items-center gap-0.5">
                    <Star className="h-4 w-4 fill-hiven-orange text-hiven-orange" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-hiven-text">{viewPlace.rating_avg?.toFixed(1) || 'N/A'}</p>
                    <p className="text-xs text-hiven-text-3">Nota media</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-hiven-bg/80 border border-hiven-border/50">
                  <Star className="h-4 w-4 text-hiven-text-3" />
                  <div>
                    <p className="text-sm font-semibold text-hiven-text">{viewPlace.rating_count || 0}</p>
                    <p className="text-xs text-hiven-text-3">Avaliacoes</p>
                  </div>
                </div>
              </div>

              {viewPlace.address_city && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-hiven-bg/80 border border-hiven-border/50">
                  <MapPin className="h-4 w-4 text-hiven-text-3" />
                  <div>
                    <p className="text-sm font-medium text-hiven-text">{viewPlace.address_city}</p>
                    {viewPlace.address_full && (
                      <p className="text-xs text-hiven-text-3">{viewPlace.address_full}</p>
                    )}
                  </div>
                </div>
              )}

              {viewPlace.category && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-hiven-bg/80 border border-hiven-border/50">
                  <div className="h-2 w-2 rounded-full bg-hiven-orange" />
                  <p className="text-sm text-hiven-text">{viewPlace.category.name}</p>
                </div>
              )}

              <div className="flex items-center justify-between p-3 rounded-xl bg-hiven-bg/80 border border-hiven-border/50">
                <span className="text-sm text-hiven-text-3">Status</span>
                <Badge variant="outline" className={PLACE_STATUS_COLORS[viewPlace.status] || ''}>
                  {PLACE_STATUS_LABELS[viewPlace.status] || viewPlace.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-hiven-bg/80 border border-hiven-border/50">
                <span className="text-sm text-hiven-text-3">Verificado</span>
                {viewPlace.verified ? (
                  <Badge className="bg-hiven-success/10 text-hiven-success border-0">
                    <Shield className="mr-1 h-3 w-3" /> Verificado
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-hiven-border text-hiven-text-3">Nao verificado</Badge>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewPlace(null)} className="border-hiven-border rounded-xl">Fechar</Button>
            <Button onClick={() => { setViewPlace(null); handleEdit(viewPlace) }} className="bg-hiven-red hover:bg-hiven-dark-red text-white rounded-xl">
              <Pencil className="mr-2 h-4 w-4" /> Editar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editPlace} onOpenChange={() => setEditPlace(null)}>
        <DialogContent className="border-hiven-border bg-hiven-surface-elevated">
          <DialogHeader>
            <DialogTitle className="text-hiven-text">Editar Local</DialogTitle>
            <DialogDescription className="text-hiven-text-3">Atualize as informacoes do local</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-hiven-text">Nome</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-hiven-bg border-hiven-border focus:border-hiven-red rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-hiven-text">Cidade</Label>
              <Input value={editCity} onChange={(e) => setEditCity(e.target.value)} className="bg-hiven-bg border-hiven-border focus:border-hiven-red rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-hiven-text">Status</Label>
              <Select value={editStatus} onValueChange={(v) => setEditStatus(v ?? '')}>
                <SelectTrigger className="bg-hiven-bg border-hiven-border rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent className="border-hiven-border">
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="closed">Fechado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPlace(null)} className="border-hiven-border rounded-xl">Cancelar</Button>
            <Button onClick={handleSaveEdit} disabled={updatePlace.isPending} className="bg-hiven-red hover:bg-hiven-dark-red text-white rounded-xl">
              {updatePlace.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletePlaceId} onOpenChange={() => setDeletePlaceId(null)}>
        <DialogContent className="border-hiven-border bg-hiven-surface-elevated">
          <DialogHeader>
            <DialogTitle className="text-hiven-text">Fechar Local</DialogTitle>
            <DialogDescription className="text-hiven-text-3">Tem certeza? O local sera marcado como fechado.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePlaceId(null)} className="border-hiven-border rounded-xl">Cancelar</Button>
            <Button onClick={handleDelete} disabled={deletePlace.isPending} className="bg-hiven-error hover:bg-red-700 text-white rounded-xl">
              {deletePlace.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
