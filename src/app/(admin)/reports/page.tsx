'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, Loader2, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { REPORT_STATUS_LABELS, REPORT_STATUS_COLORS, REPORT_TARGET_LABELS } from '@/lib/constants'

export default function ReportsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [newStatus, setNewStatus] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['reports', page, statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('reports')
        .select('*, reporter:users!reports_reporter_id_fkey(display_name, avatar_url, username)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * 20, page * 20 - 1)

      if (statusFilter) query = query.eq('status', statusFilter)

      const { data, count, error } = await query
      if (error) throw error
      return { data: (data as any[]) || [], count: count || 0 }
    },
  })

  const updateReport = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const supabaseAny = supabase as any
      const { error } = await supabaseAny.from('reports').update({ status, reviewed_at: new Date().toISOString() }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] })
      setSelectedReport(null)
    },
  })

  const handleUpdateStatus = () => {
    if (!selectedReport || !newStatus) return
    updateReport.mutate({ id: selectedReport.id, status: newStatus })
  }

  const totalPages = data ? Math.ceil(data.count / 20) : 1

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-hiven-text">Relatorios de Moderacao</h2>
          <p className="text-sm text-hiven-text-3">{data?.count || 0} relatorios no total</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v === 'all' || !v ? '' : v); setPage(1) }}>
            <SelectTrigger className="w-[180px] bg-hiven-bg border-hiven-border"><SelectValue placeholder="Todos os status" /></SelectTrigger>
            <SelectContent className="border-hiven-border">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="reviewed">Revisados</SelectItem>
              <SelectItem value="actioned">Acao tomada</SelectItem>
              <SelectItem value="dismissed">Descartados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-hiven-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-hiven-border hover:bg-transparent">
                <TableHead className="text-hiven-text-3 font-medium">Reporter</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Alvo</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Motivo</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Status</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Data</TableHead>
                <TableHead className="text-hiven-text-3 font-medium text-right">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto text-hiven-text-3" /></TableCell></TableRow>
              ) : data?.data?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-hiven-text-3">Nenhum relatorio encontrado</TableCell></TableRow>
              ) : (
                data?.data?.map((report) => (
                  <TableRow key={report.id} className="border-hiven-border">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-hiven-red/10 text-hiven-red text-[10px] font-bold">
                            {(report.reporter as any)?.display_name?.charAt(0)?.toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-hiven-text-2">{(report.reporter as any)?.display_name || '-'}</span>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="border-hiven-border text-xs">{REPORT_TARGET_LABELS[report.target_type] || report.target_type}</Badge></TableCell>
                    <TableCell><p className="text-sm text-hiven-text-2 truncate max-w-[200px]">{report.reason}</p></TableCell>
                    <TableCell><Badge variant="outline" className={REPORT_STATUS_COLORS[report.status]}>{REPORT_STATUS_LABELS[report.status]}</Badge></TableCell>
                    <TableCell className="text-sm text-hiven-text-2">{new Date(report.created_at).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedReport(report); setNewStatus(report.status) }}>
                        <Eye className="h-4 w-4 text-hiven-text-3" />
                      </Button>
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
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="border-hiven-border text-hiven-text-2"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="border-hiven-border text-hiven-text-2"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}

      <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
        <DialogContent className="border-hiven-border bg-hiven-surface-elevated sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-hiven-text flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-hiven-orange/10">
                <AlertTriangle className="h-4 w-4 text-hiven-orange" />
              </div>
              Detalhes do Relatorio
            </DialogTitle>
            <DialogDescription className="text-hiven-text-3">Atualize o status deste relatorio</DialogDescription>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-hiven-bg/80 border border-hiven-border/50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-hiven-text-3">Alvo:</span>
                  <span className="text-hiven-text font-medium">{REPORT_TARGET_LABELS[selectedReport.target_type]} ({selectedReport.target_id.slice(0, 8)}...)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-hiven-text-3">Reporter:</span>
                  <span className="text-hiven-text font-medium">{(selectedReport.reporter as any)?.display_name || '-'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-hiven-text-3">Data:</span>
                  <span className="text-hiven-text font-medium">{new Date(selectedReport.created_at).toLocaleString('pt-BR')}</span>
                </div>
                <div className="text-sm">
                  <span className="text-hiven-text-3">Motivo:</span>
                  <p className="text-hiven-text mt-1.5 leading-relaxed">{selectedReport.reason}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-hiven-text">Status</label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v ?? '')}>
                  <SelectTrigger className="bg-hiven-bg border-hiven-border rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent className="border-hiven-border">
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="reviewed">Revisado</SelectItem>
                    <SelectItem value="actioned">Acao tomada</SelectItem>
                    <SelectItem value="dismissed">Descartado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReport(null)} className="border-hiven-border rounded-xl">Fechar</Button>
            <Button onClick={handleUpdateStatus} disabled={updateReport.isPending || !newStatus} className="bg-hiven-red hover:bg-hiven-dark-red text-white rounded-xl">
              {updateReport.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
