'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, setUser, setLoading } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const authed = localStorage.getItem('hiven_adm_auth')
    if (authed === 'true' && !isAuthenticated) {
      setUser({
        id: 'admin-001',
        email: 'hivenapp@gmail.com',
        role: 'super_admin',
        created_at: new Date().toISOString(),
      })
    }
    setLoading(false)
  }, [isAuthenticated, setUser, setLoading])

  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-hiven-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-hiven-border border-t-hiven-red" />
          <p className="text-sm text-hiven-text-3">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen overflow-hidden bg-hiven-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
