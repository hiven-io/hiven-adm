'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FileText, Loader2, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { POST_TYPE_LABELS, POST_TYPE_COLORS } from '@/lib/constants'

export default function PostsPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [selectedPost, setSelectedPost] = useState<any>(null)
  const [deletePostId, setDeletePostId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['posts', page, typeFilter],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select('*, user:users!posts_user_id_fkey(display_name, avatar_url, username), experience:experiences(title)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * 20, page * 20 - 1)

      if (typeFilter) query = query.eq('type', typeFilter)

      const { data, count, error } = await query
      if (error) throw error
      return { data: (data as any[]) || [], count: count || 0 }
    },
  })

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from('posts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      setDeletePostId(null)
    },
  })

  const totalPages = data ? Math.ceil(data.count / 20) : 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-hiven-text-3" />
          <h2 className="text-lg font-semibold text-hiven-text">Posts da Plataforma</h2>
        </div>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v === 'all' || !v ? '' : v); setPage(1) }}>
          <SelectTrigger className="w-[180px] bg-hiven-bg border-hiven-border">
            <SelectValue placeholder="Todos os tipos" />
          </SelectTrigger>
          <SelectContent className="border-hiven-border">
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="review">Reviews</SelectItem>
            <SelectItem value="reference">Referencias</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-hiven-text-3">{data?.count || 0} posts</div>
      </div>

      <Card className="border-hiven-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-hiven-border hover:bg-transparent">
                <TableHead className="text-hiven-text-3 font-medium">Autor</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Tipo</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Conteudo</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Experiencia</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Curtidas</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Comentarios</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Data</TableHead>
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
                    Nenhum post encontrado
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((post) => (
                  <TableRow key={post.id} className="border-hiven-border">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={(post.user as any)?.avatar_url || undefined} />
                          <AvatarFallback className="bg-hiven-red/10 text-hiven-red text-xs font-bold">
                            {(post.user as any)?.display_name?.charAt(0)?.toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-hiven-text">{(post.user as any)?.display_name || '-'}</p>
                          <p className="text-xs text-hiven-text-3">@{(post.user as any)?.username || '-'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={POST_TYPE_COLORS[post.type] || ''}>
                        {POST_TYPE_LABELS[post.type] || post.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-hiven-text-2 truncate max-w-[200px]">
                        {post.body || '-'}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-hiven-text-2">
                      {(post.experience as any)?.title || '-'}
                    </TableCell>
                    <TableCell className="text-sm text-hiven-text-2">{post.likes_count}</TableCell>
                    <TableCell className="text-sm text-hiven-text-2">{post.comments_count}</TableCell>
                    <TableCell className="text-sm text-hiven-text-2">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedPost(post)}>
                          <Eye className="h-4 w-4 text-hiven-text-3" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeletePostId(post.id)}>
                          <Trash2 className="h-4 w-4 text-hiven-error" />
                        </Button>
                      </div>
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
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="border-hiven-border text-hiven-text-2">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="border-hiven-border text-hiven-text-2">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* View Post Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="border-hiven-border bg-hiven-surface-elevated sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-hiven-text flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-hiven-orange/10">
                <FileText className="h-4 w-4 text-hiven-orange" />
              </div>
              Detalhes do Post
            </DialogTitle>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-hiven-bg/80 border border-hiven-border/50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={(selectedPost.user as any)?.avatar_url || undefined} />
                  <AvatarFallback className="bg-hiven-red/10 text-hiven-red text-sm font-bold">
                    {(selectedPost.user as any)?.display_name?.charAt(0)?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-hiven-text">{(selectedPost.user as any)?.display_name || '-'}</p>
                  <p className="text-xs text-hiven-text-3">@{(selectedPost.user as any)?.username || '-'}</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-hiven-bg/80 border border-hiven-border/50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-hiven-text-3">Tipo:</span>
                  <Badge variant="outline" className={POST_TYPE_COLORS[selectedPost.type]}>
                    {POST_TYPE_LABELS[selectedPost.type]}
                  </Badge>
                </div>
                {selectedPost.body && (
                  <div className="text-sm">
                    <span className="text-hiven-text-3">Conteudo:</span>
                    <p className="text-hiven-text mt-1.5 leading-relaxed">{selectedPost.body}</p>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-hiven-text-3">Curtidas:</span>
                  <span className="text-hiven-text font-medium">{selectedPost.likes_count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-hiven-text-3">Comentarios:</span>
                  <span className="text-hiven-text font-medium">{selectedPost.comments_count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-hiven-text-3">Data:</span>
                  <span className="text-hiven-text font-medium">{new Date(selectedPost.created_at).toLocaleString('pt-BR')}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPost(null)} className="border-hiven-border rounded-xl">Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deletePostId} onOpenChange={() => setDeletePostId(null)}>
        <DialogContent className="border-hiven-border bg-hiven-surface-elevated">
          <DialogHeader>
            <DialogTitle className="text-hiven-text">Excluir Post</DialogTitle>
            <DialogDescription className="text-hiven-text-3">
              Tem certeza? O post sera removido da plataforma.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePostId(null)} className="border-hiven-border rounded-xl">Cancelar</Button>
            <Button onClick={() => deletePostId && deletePost.mutate(deletePostId)} disabled={deletePost.isPending} className="bg-hiven-error hover:bg-red-700 text-white rounded-xl">
              {deletePost.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
