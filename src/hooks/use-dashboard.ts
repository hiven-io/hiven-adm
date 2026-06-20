'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { DashboardMetrics, ChartDataPoint, CategoryDataPoint } from '@/types/admin'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRow = Record<string, any>

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const sb = supabase as any

      const [totalUsers, newUsersToday, newUsersWeek, newUsersMonth] = await Promise.all([
        sb.from('users').select('*', { count: 'exact', head: true }),
        sb.from('users').select('*', { count: 'exact', head: true }).gte('created_at', todayStart),
        sb.from('users').select('*', { count: 'exact', head: true }).gte('created_at', weekStart),
        sb.from('users').select('*', { count: 'exact', head: true }).gte('created_at', monthStart),
      ])

      const [totalExperiences, experiencesToday, experiencesWeek, experiencesMonth] = await Promise.all([
        sb.from('experiences').select('*', { count: 'exact', head: true }).eq('is_deleted', false),
        sb.from('experiences').select('*', { count: 'exact', head: true }).eq('is_deleted', false).gte('created_at', todayStart),
        sb.from('experiences').select('*', { count: 'exact', head: true }).eq('is_deleted', false).gte('created_at', weekStart),
        sb.from('experiences').select('*', { count: 'exact', head: true }).eq('is_deleted', false).gte('created_at', monthStart),
      ])

      const [totalReviews, avgResult] = await Promise.all([
        sb.from('reviews').select('*', { count: 'exact', head: true }),
        sb.from('reviews').select('rating_overall'),
      ])

      const [totalPlaces, placesPending] = await Promise.all([
        sb.from('places').select('*', { count: 'exact', head: true }),
        sb.from('places').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ])

      const [totalPosts, pendingReports, activeExperiences, totalParticipants] = await Promise.all([
        sb.from('posts').select('*', { count: 'exact', head: true }),
        sb.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        sb.from('experiences').select('*', { count: 'exact', head: true }).eq('is_deleted', false).in('status', ['open', 'ongoing']),
        sb.from('experience_participants').select('*', { count: 'exact', head: true }),
      ])

      const ratings = ((avgResult.data || []) as AnyRow[]).map((r: AnyRow) => r.rating_overall).filter(Boolean)
      const averageRating = ratings.length > 0 ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length : 0

      return {
        totalUsers: totalUsers.count || 0,
        newUsersToday: newUsersToday.count || 0,
        newUsersWeek: newUsersWeek.count || 0,
        newUsersMonth: newUsersMonth.count || 0,
        totalExperiences: totalExperiences.count || 0,
        experiencesToday: experiencesToday.count || 0,
        experiencesWeek: experiencesWeek.count || 0,
        experiencesMonth: experiencesMonth.count || 0,
        totalReviews: totalReviews.count || 0,
        averageRating: Math.round(averageRating * 10) / 10,
        totalPlaces: totalPlaces.count || 0,
        placesPending: placesPending.count || 0,
        totalPosts: totalPosts.count || 0,
        pendingReports: pendingReports.count || 0,
        activeExperiences: activeExperiences.count || 0,
        totalParticipants: totalParticipants.count || 0,
      }
    },
    refetchInterval: 30000,
  })
}

export function useUserGrowthChart(period: '7d' | '30d' | '12m' = '30d') {
  return useQuery({
    queryKey: ['user-growth', period],
    queryFn: async (): Promise<ChartDataPoint[]> => {
      const now = new Date()
      let daysBack: number

      switch (period) {
        case '7d': daysBack = 7; break
        case '30d': daysBack = 30; break
        case '12m': daysBack = 365; break
      }

      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000).toISOString()

      const { data, error } = await (supabase as any)
        .from('users')
        .select('created_at')
        .gte('created_at', startDate)
        .order('created_at', { ascending: true })

      if (error) throw error

      const grouped: Record<string, number> = {}
      const d = new Date(startDate)
      while (d <= now) {
        const key = d.toISOString().split('T')[0]
        grouped[key] = 0
        d.setDate(d.getDate() + 1)
      }

      ((data || []) as AnyRow[]).forEach((row: AnyRow) => {
        const dateKey = row.created_at.split('T')[0]
        if (grouped[dateKey] !== undefined) {
          grouped[dateKey]++
        }
      })

      return Object.entries(grouped).map(([date, count]) => ({ date, count }))
    },
  })
}

export function useExperienceGrowthChart(period: '7d' | '30d' | '12m' = '30d') {
  return useQuery({
    queryKey: ['experience-growth', period],
    queryFn: async (): Promise<ChartDataPoint[]> => {
      const now = new Date()
      let daysBack: number

      switch (period) {
        case '7d': daysBack = 7; break
        case '30d': daysBack = 30; break
        case '12m': daysBack = 365; break
      }

      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000).toISOString()

      const { data, error } = await (supabase as any)
        .from('experiences')
        .select('created_at')
        .eq('is_deleted', false)
        .gte('created_at', startDate)
        .order('created_at', { ascending: true })

      if (error) throw error

      const grouped: Record<string, number> = {}
      const d = new Date(startDate)
      while (d <= now) {
        const key = d.toISOString().split('T')[0]
        grouped[key] = 0
        d.setDate(d.getDate() + 1)
      }

      ((data || []) as AnyRow[]).forEach((row: AnyRow) => {
        const dateKey = row.created_at.split('T')[0]
        if (grouped[dateKey] !== undefined) {
          grouped[dateKey]++
        }
      })

      return Object.entries(grouped).map(([date, count]) => ({ date, count }))
    },
  })
}

export function useExperiencesByCategory() {
  return useQuery({
    queryKey: ['experiences-by-category'],
    queryFn: async (): Promise<CategoryDataPoint[]> => {
      const sb = supabase as any
      const { data: categories } = await sb
        .from('place_categories')
        .select('id, name, color')

      if (!categories) return []

      const results = await Promise.all(
        (categories as AnyRow[]).map(async (cat: AnyRow) => {
          const { count } = await sb
            .from('places')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', cat.id)

          return {
            name: cat.name,
            value: count || 0,
            color: cat.color || '#A99E98',
          }
        })
      )

      return results.filter((r) => r.value > 0)
    },
  })
}

export function usePostsGrowthChart(period: '7d' | '30d' | '12m' = '30d') {
  return useQuery({
    queryKey: ['posts-growth', period],
    queryFn: async (): Promise<ChartDataPoint[]> => {
      const now = new Date()
      let daysBack: number

      switch (period) {
        case '7d': daysBack = 7; break
        case '30d': daysBack = 30; break
        case '12m': daysBack = 365; break
      }

      const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000).toISOString()

      const { data, error } = await (supabase as any)
        .from('posts')
        .select('created_at')
        .gte('created_at', startDate)
        .order('created_at', { ascending: true })

      if (error) throw error

      const grouped: Record<string, number> = {}
      const d = new Date(startDate)
      while (d <= now) {
        const key = d.toISOString().split('T')[0]
        grouped[key] = 0
        d.setDate(d.getDate() + 1)
      }

      ((data || []) as AnyRow[]).forEach((row: AnyRow) => {
        const dateKey = row.created_at.split('T')[0]
        if (grouped[dateKey] !== undefined) {
          grouped[dateKey]++
        }
      })

      return Object.entries(grouped).map(([date, count]) => ({ date, count }))
    },
  })
}

export function useExperiencesByStatus() {
  return useQuery({
    queryKey: ['experiences-by-status'],
    queryFn: async (): Promise<CategoryDataPoint[]> => {
      const sb = supabase as any
      const statuses = ['draft', 'open', 'ongoing', 'finished', 'cancelled']
      const labels: Record<string, string> = {
        draft: 'Rascunho',
        open: 'Aberta',
        ongoing: 'Acontecendo',
        finished: 'Encerrada',
        cancelled: 'Cancelada',
      }
      const colors: Record<string, string> = {
        draft: '#9CA3AF',
        open: '#16A34A',
        ongoing: '#EAB308',
        finished: '#6B7280',
        cancelled: '#3B82F6',
      }

      const results = await Promise.all(
        statuses.map(async (status) => {
          const { count } = await sb
            .from('experiences')
            .select('*', { count: 'exact', head: true })
            .eq('status', status)
            .eq('is_deleted', false)

          return {
            name: labels[status],
            value: count || 0,
            color: colors[status],
          }
        })
      )

      return results.filter((r) => r.value > 0)
    },
  })
}

export function useNotificationsByType() {
  return useQuery({
    queryKey: ['notifications-by-type'],
    queryFn: async (): Promise<CategoryDataPoint[]> => {
      const sb = supabase as any
      const types = ['like', 'comment', 'follow', 'invite', 'mention']
      const labels: Record<string, string> = {
        like: 'Curtidas',
        comment: 'Comentarios',
        follow: 'Seguidores',
        invite: 'Convites',
        mention: 'Mensoes',
      }
      const colors: Record<string, string> = {
        like: '#E11D48',
        comment: '#F97316',
        follow: '#16A34A',
        invite: '#0EA5E9',
        mention: '#7B2CBF',
      }

      const results = await Promise.all(
        types.map(async (type) => {
          const { count } = await sb
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('type', type)

          return {
            name: labels[type],
            value: count || 0,
            color: colors[type],
          }
        })
      )

      return results.filter((r) => r.value > 0)
    },
  })
}

export function useEngagementMetrics() {
  return useQuery({
    queryKey: ['engagement-metrics'],
    queryFn: async () => {
      const sb = supabase as any

      const [totalLikes, totalComments, totalReposts, totalSaves] = await Promise.all([
        sb.from('post_likes').select('*', { count: 'exact', head: true }),
        sb.from('post_comments').select('*', { count: 'exact', head: true }),
        sb.from('post_reposts').select('*', { count: 'exact', head: true }),
        sb.from('experience_saves').select('*', { count: 'exact', head: true }),
      ])

      return {
        totalLikes: totalLikes.count || 0,
        totalComments: totalComments.count || 0,
        totalReposts: totalReposts.count || 0,
        totalSaves: totalSaves.count || 0,
      }
    },
  })
}
