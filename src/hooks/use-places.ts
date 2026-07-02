'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { PlaceWithCategory } from '@/types/admin'
import { ITEMS_PER_PAGE } from '@/lib/constants'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRow = Record<string, any>

interface UsePlacesParams {
  search?: string
  page?: number
  status?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export function usePlaces(params: UsePlacesParams = {}) {
  const { search = '', page = 1, status, sortBy = 'created_at', sortOrder = 'desc' } = params

  return useQuery({
    queryKey: ['places', search, page, status, sortBy, sortOrder],
    queryFn: async (): Promise<{ data: PlaceWithCategory[]; count: number }> => {
      const sb = supabase as any
      let query = sb
        .from('places')
        .select('*, category:place_categories(*), creator:users!places_created_by_fkey(display_name, username, avatar_url)', { count: 'exact' })
        .order(sortBy, { ascending: sortOrder === 'asc' })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1)

      if (search) {
        query = query.or(`name.ilike.%${search}%,address_city.ilike.%${search}%`)
      }
      if (status) {
        query = query.eq('status', status)
      }

      const { data, count, error } = await query
      if (error) throw error

      return { data: ((data || []) as PlaceWithCategory[]), count: count || 0 }
    },
  })
}

export function usePlace(id: string) {
  return useQuery({
    queryKey: ['place', id],
    queryFn: async (): Promise<PlaceWithCategory> => {
      const { data, error } = await (supabase as any)
        .from('places')
        .select('*, category:place_categories(*), creator:users!places_created_by_fkey(display_name, username, avatar_url)')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as PlaceWithCategory
    },
    enabled: !!id,
  })
}

export function useUpdatePlace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AnyRow }) => {
      const res = await fetch('/api/admin/places', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, data }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] })
    },
  })
}

export function useDeletePlace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch('/api/admin/places', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['places'] })
    },
  })
}
