'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sparkles, Loader2, BarChart3 } from 'lucide-react'

export default function ReviewsPage() {
  const [page] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', page],
    queryFn: async () => {
      const supabaseAny = supabase as any

      const { data: reviewsData, count, error } = await supabaseAny
        .from('reviews')
        .select('*', { count: 'exact' })
        .order('rating_overall', { ascending: false })
        .range((page - 1) * 20, page * 20 - 1)

      if (error) throw error

      const reviews = (reviewsData as any[]) || []

      if (reviews.length === 0) return { data: [], count: count || 0 }

      const postIds = [...new Set(reviews.map((r: any) => r.post_id).filter(Boolean))]
      const targetIds = [...new Set(reviews.map((r: any) => r.target_id).filter(Boolean))]

      const [postsResult, usersResult, placesResult, experiencesResult] = await Promise.all([
        postIds.length > 0
          ? supabaseAny.from('posts').select('id, user_id, body, created_at, experience_id').in('id', postIds)
          : { data: [] },
        postIds.length > 0
          ? supabaseAny.from('users').select('id, display_name, avatar_url, username').in('id',
              (await supabaseAny.from('posts').select('user_id').in('id', postIds)).data?.map((p: any) => p.user_id) || []
            )
          : { data: [] },
        targetIds.length > 0
          ? supabaseAny.from('places').select('id, name').in('id', targetIds)
          : { data: [] },
        targetIds.length > 0
          ? supabaseAny.from('experiences').select('id, title').in('id', targetIds)
          : { data: [] },
      ])

      const postsMap = new Map((postsResult.data || []).map((p: any) => [p.id, p]))
      const usersMap = new Map((usersResult.data || []).map((u: any) => [u.id, u]))
      const placesMap = new Map((placesResult.data || []).map((p: any) => [p.id, p]))
      const experiencesMap = new Map((experiencesResult.data || []).map((e: any) => [e.id, e]))

      const enriched = reviews.map((review: any) => {
        const post = postsMap.get(review.post_id) as any
        const user = post ? usersMap.get(post.user_id) as any : null
        const target = (review.target_type === 'place'
          ? placesMap.get(review.target_id)
          : experiencesMap.get(review.target_id)) as any

        return {
          ...review,
          post: post ? { ...post, user } : null,
          target_name: target?.name || target?.title || '-',
        }
      })

      return { data: enriched, count: count || 0 }
    },
  })

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Sparkles
            key={star}
            className={`h-3.5 w-3.5 ${star <= rating ? 'fill-hiven-orange text-hiven-orange' : 'text-hiven-border'}`}
          />
        ))}
        <span className="ml-1.5 text-sm font-medium text-hiven-text">{rating.toFixed(1)}</span>
      </div>
    )
  }

  const averageRating = data?.data?.length
    ? data.data.reduce((acc: number, r: any) => acc + r.rating_overall, 0) / data.data.length
    : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-hiven-text">Avaliacoes da Plataforma</h2>
          <p className="text-sm text-hiven-text-3 mt-0.5">{data?.count || 0} avaliacoes no total</p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="border-hiven-border px-5 py-3 bg-gradient-to-r from-hiven-orange/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-hiven-orange/10">
                <BarChart3 className="h-4 w-4 text-hiven-orange" />
              </div>
              <div>
                <p className="text-xs text-hiven-text-3">Media Geral</p>
                <p className="text-xl font-bold text-hiven-orange">
                  {averageRating ? averageRating.toFixed(1) : '-'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="border-hiven-border">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-hiven-border hover:bg-transparent">
                <TableHead className="text-hiven-text-3 font-medium">Avaliador</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Nota</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Atmosfera</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Custo-Beneficio</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Acessibilidade</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Alvo</TableHead>
                <TableHead className="text-hiven-text-3 font-medium">Data</TableHead>
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
                    Nenhuma avaliacao encontrada
                  </TableCell>
                </TableRow>
              ) : (
                data?.data?.map((review: any) => (
                  <TableRow key={review.post_id} className="border-hiven-border hover:bg-hiven-bg/50 transition-colors duration-150">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.post?.user?.avatar_url || undefined} />
                          <AvatarFallback className="bg-hiven-red/10 text-hiven-red text-xs font-bold">
                            {review.post?.user?.display_name?.charAt(0)?.toUpperCase() || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-hiven-text">{review.post?.user?.display_name || '-'}</p>
                          <p className="text-xs text-hiven-text-3">@{review.post?.user?.username || '-'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{renderStars(review.rating_overall)}</TableCell>
                    <TableCell className="text-sm text-hiven-text-2">{review.rating_atmosphere || '-'}</TableCell>
                    <TableCell className="text-sm text-hiven-text-2">{review.rating_cost_benefit || '-'}</TableCell>
                    <TableCell className="text-sm text-hiven-text-2">{review.rating_accessibility || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={review.target_type === 'place' ? 'border-hiven-orange/30 text-hiven-orange bg-hiven-orange/5' : 'border-hiven-red/30 text-hiven-red bg-hiven-red/5'}>
                        {review.target_type === 'place' ? review.target_name : review.target_name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-hiven-text-2">
                      {review.post?.created_at ? new Date(review.post.created_at).toLocaleDateString('pt-BR') : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
