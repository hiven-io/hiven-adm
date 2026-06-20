'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { UserWithProfile } from '@/types/admin'
import { ITEMS_PER_PAGE } from '@/lib/constants'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRow = Record<string, any>

interface UseUsersParams {
  search?: string
  page?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export function useUsers(params: UseUsersParams = {}) {
  const { search = '', page = 1, sortBy = 'created_at', sortOrder = 'desc' } = params

  return useQuery({
    queryKey: ['users', search, page, sortBy, sortOrder],
    queryFn: async (): Promise<{ data: UserWithProfile[]; count: number }> => {
      const sb = supabase as any
      let query = sb
        .from('users')
        .select('*', { count: 'exact' })
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1)

      if (search) {
        query = query.or(`display_name.ilike.%${search}%,username.ilike.%${search}%`)
      }

      const { data, count, error } = await query
      if (error) throw error

      const usersWithCount = ((data || []) as AnyRow[]).map((user: AnyRow) => ({
        ...user,
        experience_count: 0,
      })) as UserWithProfile[]

      return { data: usersWithCount, count: count || 0 }
    },
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async (): Promise<AnyRow> => {
      const { data, error } = await (supabase as any)
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!id,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AnyRow }) => {
      const { error } = await (supabase as any)
        .from('users')
        .update(data)
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from('users')
        .update({ bio: '[DELETED]' })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useUserExperiences(userId: string) {
  return useQuery({
    queryKey: ['user-experiences', userId],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('experience_participants')
        .select('*, experiences(*)')
        .eq('user_id', userId)
        .order('joined_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}
