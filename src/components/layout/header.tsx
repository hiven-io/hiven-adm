'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search, Sun, Moon, Heart, MessageCircle, UserPlus, Mail, AtSign, Sparkles, Star, Clock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useThemeStore } from '@/stores/theme-store'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Visao Geral',
  '/users': 'Pessoas',
  '/users/stats': 'Estatisticas de Pessoas',
  '/experiences': 'Experiencias',
  '/experiences/approval': 'Aprovacao de Experiencias',
  '/experiences/stats': 'Estatisticas de Experiencias',
  '/places': 'Locais',
  '/posts': 'Publicacoes',
  '/reviews': 'Notas',
  '/reports': 'Moderacao',
  '/settings': 'Configuracoes',
}

const pageDescriptions: Record<string, string> = {
  '/dashboard': 'Acompanhe os numeros da plataforma',
  '/users': 'Todas as pessoas que usam o Hiven',
  '/users/stats': 'Dados sobre crescimento de usuarios',
  '/experiences': 'Todas as experiencias criadas',
  '/experiences/approval': 'Experiencias aguardando sua revisao',
  '/experiences/stats': 'Dados sobre experiencias na plataforma',
  '/places': 'Locais cadastrados no Hiven',
  '/posts': 'Todas as publicacoes feitas',
  '/reviews': 'Notas e avaliacoes dos usuarios',
  '/reports': 'Conteudos que precisam de atencao',
  '/settings': 'Suas preferencias e informacoes',
}

const NOTIF_ICONS: Record<string, typeof Heart> = {
  like: Heart,
  comment: MessageCircle,
  reply: MessageCircle,
  follow: UserPlus,
  invite: Mail,
  mention: AtSign,
  experience_starting: Sparkles,
  review_reply: Star,
  waitlist_promoted: Clock,
}

const NOTIF_COLORS: Record<string, string> = {
  like: 'text-hiven-red',
  comment: 'text-hiven-orange',
  reply: 'text-hiven-orange',
  follow: 'text-hiven-success',
  invite: 'text-hiven-info',
  mention: 'text-[#7B2CBF]',
  experience_starting: 'text-hiven-orange',
  review_reply: 'text-hiven-red',
  waitlist_promoted: 'text-hiven-success',
}

const NOTIF_LABELS: Record<string, string> = {
  like: 'curtiu',
  comment: 'comentou',
  reply: 'respondeu',
  follow: 'comecou a seguir',
  invite: 'convidou',
  mention: 'mencionou',
  experience_starting: 'experiencia comecando',
  review_reply: 'respondeu sua nota',
  waitlist_promoted: 'promovido da lista de espera',
}

type NotificationRow = {
  id: string
  user_id: string
  actor_id: string | null
  type: string
  target_type: string | null
  target_id: string | null
  read: boolean
  created_at: string
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'agora'
  if (diff < 3600) return `${Math.floor(diff / 60)}min`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function Header() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || 'Hiven ADM'
  const description = pageDescriptions[pathname] || ''
  const { theme, toggleTheme } = useThemeStore()

  const { data: notifications } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const sb = supabase as any
      try {
        const { data, error } = await sb
          .from('notifications')
          .select('id, user_id, actor_id, type, target_type, target_id, read, created_at')
          .order('created_at', { ascending: false })
          .limit(30)

        if (error) return [] as NotificationRow[]
        return (data || []) as NotificationRow[]
      } catch {
        return [] as NotificationRow[]
      }
    },
    refetchInterval: 30000,
  })

  const unreadCount = notifications?.filter(n => !n.read).length || 0

  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-hiven-border/40 bg-hiven-surface-elevated/60 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-lg font-bold text-hiven-text tracking-tight">{title}</h1>
          {description && (
            <p className="text-xs text-hiven-text-3 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-hiven-text-3" />
          <Input
            placeholder="Buscar..."
            className="pl-9 w-56 h-9 bg-hiven-bg/60 border-hiven-border/40 focus:border-hiven-red focus:ring-hiven-red/10 transition-all duration-200 rounded-xl text-sm"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl text-hiven-text-2 hover:text-hiven-text hover:bg-hiven-surface/80 transition-all duration-200"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'}
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl text-hiven-text-2 hover:text-hiven-text hover:bg-hiven-surface/80 transition-all duration-200" />
            }
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-hiven-red text-[9px] font-bold text-white px-1 ring-[2.5px] ring-hiven-surface-elevated">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </PopoverTrigger>
          <PopoverContent align="end" sideOffset={8} className="w-80 p-0">
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-hiven-border/40">
              <span className="text-sm font-semibold text-hiven-text">Notificacoes</span>
              {unreadCount > 0 && (
                <span className="text-[10px] font-medium text-hiven-red bg-hiven-red/10 px-1.5 py-0.5 rounded-full">
                  {unreadCount} nao lidas
                </span>
              )}
            </div>
            <ScrollArea className="max-h-[360px]">
              {(!notifications || notifications.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-8 text-hiven-text-3">
                  <Bell className="h-8 w-8 mb-2 opacity-30" />
                  <span className="text-xs">Nenhuma notificacao</span>
                </div>
              ) : (
                <div className="py-1">
                  {notifications.map((notif) => {
                    const Icon = NOTIF_ICONS[notif.type] || Bell
                    const color = NOTIF_COLORS[notif.type] || 'text-hiven-text-3'
                    const label = NOTIF_LABELS[notif.type] || notif.type
                    return (
                      <div
                        key={notif.id}
                        className={`flex items-start gap-2.5 px-3 py-2.5 transition-colors hover:bg-hiven-surface/60 ${!notif.read ? 'bg-hiven-orange/5' : ''}`}
                      >
                        <div className={`mt-0.5 flex-shrink-0 ${color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-hiven-text leading-relaxed">
                            <span className="font-semibold">Usuario</span>{' '}
                            {label}
                            {notif.target_type && (
                              <span className="text-hiven-text-3"> em {notif.target_type}</span>
                            )}
                          </p>
                          <span className="text-[10px] text-hiven-text-3 mt-0.5 block">
                            {timeAgo(notif.created_at)}
                          </span>
                        </div>
                        {!notif.read && (
                          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-hiven-orange flex-shrink-0" />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  )
}
