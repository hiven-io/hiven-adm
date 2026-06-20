'use client'

import { useState } from 'react'
import { useExperiences, useUpdateExperience } from '@/hooks/use-experiences'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Search, CheckCircle, XCircle, Archive, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'archived'
const STATUS_CONFIG: Record<ApprovalStatus, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  approved: { label: 'Aprovada', color: 'bg-green-50 text-green-700 border-green-200' },
  rejected: { label: 'Rejeitada', color: 'bg-red-50 text-red-700 border-red-200' },
  archived: { label: 'Arquivada', color: 'bg-zinc-50 text-zinc-600 border-zinc-200' },
}

export default function ExperienceApprovalPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('')
  const [selectedExp, setSelectedExp] = useState<any>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'archive' | null>(null)

  const { data, isLoading } = useExperiences({ search, status: filter === 'pending' ? 'draft' : filter === 'approved' ? 'open' : filter === 'rejected' ? 'cancelled' : undefined })
  const updateExperience = useUpdateExperience()

  const handleAction = async () => {
    if (!selectedExp || !actionType) return
    const statusMap: Record<string, string> = { approve: 'open', reject: 'cancelled', archive: 'finished' }
    await updateExperience.mutateAsync({ id: selectedExp.id, data: { status: statusMap[actionType] as any } })
    setSelectedExp(null)
    setActionType(null)
  }

  const openAction = (exp: any, action: 'approve' | 'reject' | 'archive') => {
    setSelectedExp(exp)
    setActionType(action)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hiven-text-3" />
          <Input placeholder="Buscar experiencias..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-hiven-bg border-hiven-border focus:border-hiven-red focus:ring-hiven-red/10" />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v ?? '')}>
          <SelectTrigger className="w-[180px] bg-hiven-bg border-hiven-border"><SelectValue placeholder="Todos" /></SelectTrigger>
          <SelectContent className="border-hiven-border">
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="approved">Aprovadas</SelectItem>
            <SelectItem value="rejected">Rejeitadas</SelectItem>
            <SelectItem value="archived">Arquivadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-hiven-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-hiven-border hover:bg-transparent">
                <TableHead className="text-hiven-text-3 font-medium">Experiencia</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Autor</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Status</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Data</TableHead>
                <TableHead className="text-hiven-text-3 font-medium text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto text-hiven-text-3" /></TableCell></TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center py-12 text-hiven-text-3">Nenhuma experiencia encontrada</TableCell></TableRow>
              ) : (
                data?.data?.map((exp) => {
                  const approvalStatus = exp.status === 'open' ? 'approved' : exp.status === 'cancelled' ? 'rejected' : exp.status === 'finished' ? 'archived' : 'pending' as ApprovalStatus
                  return (
                    <TableRow key={exp.id} className="border-hiven-border">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={exp.cover_url || undefined} />
                            <AvatarFallback className="bg-hiven-orange/10 text-hiven-orange text-xs font-bold">{exp.title?.charAt(0)?.toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-medium text-hiven-text truncate max-w-[200px]">{exp.title}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-hiven-text-2">{exp.creator?.display_name || '-'}</TableCell>
                      <TableCell><Badge variant="outline" className={STATUS_CONFIG[approvalStatus].color}>{STATUS_CONFIG[approvalStatus].label}</Badge></TableCell>
                      <TableCell className="text-sm text-hiven-text-2">{exp.created_at ? new Date(exp.created_at).toLocaleDateString('pt-BR') : '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {approvalStatus === 'pending' && (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-hiven-success hover:text-hiven-success hover:bg-hiven-success/10" onClick={() => openAction(exp, 'approve')}>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-hiven-error hover:text-hiven-error hover:bg-hiven-error/10" onClick={() => openAction(exp, 'reject')}>
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-hiven-text-3 hover:text-hiven-text" onClick={() => openAction(exp, 'archive')}>
                            <Archive className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedExp && !!actionType} onOpenChange={() => { setSelectedExp(null); setActionType(null) }}>
        <DialogContent className="border-hiven-border bg-hiven-surface-elevated">
          <DialogHeader>
            <DialogTitle className="text-hiven-text">
              {actionType === 'approve' ? 'Aprovar Experiencia' : actionType === 'reject' ? 'Rejeitar Experiencia' : 'Arquivar Experiencia'}
            </DialogTitle>
            <DialogDescription className="text-hiven-text-3">
              {actionType === 'approve' ? 'A experiencia sera marcada como aprovada e ficara visivel na plataforma.' : actionType === 'reject' ? 'A experiencia sera rejeitada e nao ficara visivel.' : 'A experiencia sera arquivada.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedExp(null); setActionType(null) }} className="border-hiven-border">Cancelar</Button>
            <Button onClick={handleAction} disabled={updateExperience.isPending} className={actionType === 'approve' ? 'bg-hiven-success hover:bg-green-700 text-white' : actionType === 'reject' ? 'bg-hiven-error hover:bg-red-700 text-white' : 'bg-hiven-text-3 hover:bg-hiven-text-2 text-white'}>
              {updateExperience.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {actionType === 'approve' ? 'Aprovar' : actionType === 'reject' ? 'Rejeitar' : 'Arquivar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
