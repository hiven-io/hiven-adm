'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { ExperienceWithCreator } from '@/types/admin'
import { ITEMS_PER_PAGE } from '@/lib/constants'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRow = Record<string, any>

interface UseExperiencesParams {
  search?: string
  page?: number
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export function useExperiences(params: UseExperiencesParams = {}) {
  const { search = '', page = 1, status, sortBy = 'created_at', sortOrder = 'desc' } = params

  return useQuery({
    queryKey: ['experiences', search, page, status, sortBy, sortOrder],
    queryFn: async (): Promise<{ data: ExperienceWithCreator[]; count: number }> => {
      const sb = supabase as any
      let query = sb
        .from('experiences')
        .select('*, creator:users!experiences_creator_id_fkey(*)', { count: 'exact' })
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1)

      if (search) {
        query = query.ilike('title', `%${search}%`)
      }
      if (status) {
        query = query.eq('status', status)
      }

      const { data, count, error } = await query
      if (error) throw error

      return { data: ((data || []) as ExperienceWithCreator[]), count: count || 0 }
    },
  })
}

export function useExperience(id: string) {
  return useQuery({
    queryKey: ['experience', id],
    queryFn: async (): Promise<ExperienceWithCreator> => {
      const { data, error } = await (supabase as any)
        .from('experiences')
        .select('*, creator:users!experiences_creator_id_fkey(*), place:places(*)')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as ExperienceWithCreator
    },
    enabled: !!id,
  })
}

export function useUpdateExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AnyRow }) => {
      const { error } = await (supabase as any)
        .from('experiences')
        .update(data)
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
    },
  })
}

export function useDeleteExperience() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from('experiences')
        .update({ is_deleted: true })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] })
    },
  })
}

export function useExperienceParticipants(experienceId: string) {
  return useQuery({
    queryKey: ['experience-participants', experienceId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('experience_participants')
        .select('*, user:users!experience_participants_user_id_fkey(*)')
        .eq('experience_id', experienceId)
        .order('joined_at', { ascending: false })

      if (error) throw error
      return data
    },
    enabled: !!experienceId,
  })
}
