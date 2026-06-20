'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import {
  House,
  UsersRound,
  Flame,
  MapPinned,
  MessageSquareText,
  Sparkles,
  Flag,
  Settings2,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Crown,
  Map,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ROLE_LABELS } from '@/lib/constants'

const navItems = [
  {
    title: 'Visao Geral',
    href: '/dashboard',
    icon: House,
  },
  {
    title: 'Pessoas',
    href: '/users',
    icon: UsersRound,
    children: [
      { title: 'Listagem', href: '/users' },
      { title: 'Estatisticas', href: '/users/stats' },
    ],
  },
  {
    title: 'Experiencias',
    href: '/experiences',
    icon: Flame,
    children: [
      { title: 'Listagem', href: '/experiences' },
      { title: 'Aprovacao', href: '/experiences/approval' },
      { title: 'Estatisticas', href: '/experiences/stats' },
    ],
  },
  {
    title: 'Locais',
    href: '/places',
    icon: MapPinned,
  },
  {
    title: 'Publicacoes',
    href: '/posts',
    icon: MessageSquareText,
  },
  {
    title: 'Notas',
    href: '/reviews',
    icon: Sparkles,
  },
  {
    title: 'Moderacao',
    href: '/reports',
    icon: Flag,
  },
  {
    title: 'Mapa',
    href: '/map',
    icon: Map,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuthStore()

  return (
    <aside
      className={cn(
        'flex flex-col h-screen border-r border-hiven-border/60 bg-hiven-surface-elevated/90 backdrop-blur-sm transition-all duration-300 ease-out',
        collapsed ? 'w-[72px]' : 'w-[252px]'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center gap-2.5 px-4 pt-5 pb-3', collapsed && 'justify-center px-0')}>
        <img
          src="/logo-mark.png"
          alt="Hiven"
          className="w-8 h-8 rounded-xl object-contain"
        />
        {!collapsed && (
          <img
            src="/logo-wordmark.png"
            alt="Hiven"
            className="h-4 object-contain"
          />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-7 w-7 rounded-xl text-hiven-text-3 hover:text-hiven-text hover:bg-hiven-surface transition-all duration-200"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
          <div key={item.href}>
            <Link
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-hiven-red/10 text-hiven-red shadow-sm shadow-hiven-red/5'
                  : 'text-hiven-text-2 hover:bg-hiven-surface/80 hover:text-hiven-text'
              )}
            >
              <item.icon className={cn(
                'h-[18px] w-[18px] shrink-0 transition-all duration-200',
                isActive ? 'text-hiven-red' : 'text-hiven-text-3'
              )} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
            {!collapsed && item.children && (
              <div className="ml-[30px] mt-1 mb-1 space-y-0.5 pl-3 border-l border-hiven-border/40">
                {item.children.map((child) => {
                  const isChildActive = pathname === child.href
                  return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      'flex items-center px-2.5 py-1.5 rounded-xl text-xs transition-all duration-200',
                      isChildActive
                        ? 'text-hiven-red font-medium bg-hiven-red/5'
                        : 'text-hiven-text-3 hover:text-hiven-text-2 hover:bg-hiven-surface/50'
                    )}
                  >
                    {child.title}
                  </Link>
                )
                })}
              </div>
            )}
          </div>
        )
        })}
      </nav>

      {/* Settings at bottom before user */}
      <div className="px-3 pb-1">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-200',
            pathname === '/settings'
              ? 'bg-hiven-surface text-hiven-text'
              : 'text-hiven-text-3 hover:bg-hiven-surface/80 hover:text-hiven-text-2'
          )}
        >
          <Settings2 className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>Configuracoes</span>}
        </Link>
      </div>

      {/* User */}
      <div className="p-3 border-t border-hiven-border/40">
        <div className={cn(
          'flex items-center gap-2.5 px-2.5 py-2 rounded-2xl hover:bg-hiven-surface/60 transition-colors duration-200',
          collapsed && 'justify-center px-0'
        )}>
          <Avatar className="h-8 w-8 ring-2 ring-hiven-border/30 overflow-hidden">
            <AvatarImage src="/logo-mark.png" alt="Hiven Admin" className="object-contain" />
            <AvatarFallback className="bg-gradient-to-br from-hiven-red/20 to-hiven-orange/20 text-hiven-red text-xs font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-hiven-text truncate leading-tight">
                {user?.email?.split('@')[0] || 'Admin'}
              </p>
              <div className="flex items-center gap-1 mt-0.5">
                <Crown className="h-2.5 w-2.5 text-hiven-orange" />
                <span className="text-[10px] text-hiven-text-3 font-medium uppercase tracking-wider">
                  {ROLE_LABELS[user?.role || 'super_admin']}
                </span>
              </div>
            </div>
          )}
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-xl text-hiven-text-3 hover:text-hiven-error hover:bg-hiven-error/5 transition-all duration-200"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </aside>
  )
}
