import { create } from 'zustand'
import type { AdminUser, AdminRole } from '@/types/admin'

interface AuthState {
  user: AdminUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  logout: () => void
  setUser: (user: AdminUser | null) => void
  setLoading: (loading: boolean) => void
  hasPermission: (requiredRole: AdminRole) => boolean
}

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  analyst: 1,
  moderator: 2,
  admin: 3,
  super_admin: 4,
}

const ADMIN_EMAIL = 'hivenapp@gmail.com'
const ADMIN_PASSWORD = 'ddhiven01'

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })

    await new Promise((resolve) => setTimeout(resolve, 500))

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: AdminUser = {
        id: 'admin-001',
        email: ADMIN_EMAIL,
        role: 'super_admin',
        created_at: new Date().toISOString(),
      }
      set({ user: adminUser, isAuthenticated: true, isLoading: false })
      if (typeof window !== 'undefined') {
        localStorage.setItem('hiven_adm_auth', 'true')
      }
      return {}
    }

    set({ isLoading: false })
    return { error: 'Email ou senha incorretos' }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('hiven_adm_auth')
    }
    set({ user: null, isAuthenticated: false })
  },

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),

  hasPermission: (requiredRole: AdminRole) => {
    const { user } = get()
    if (!user) return false
    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole]
  },
}))
