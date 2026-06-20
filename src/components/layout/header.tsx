'use client'

import { usePathname } from 'next/navigation'
import { Bell, Search, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useThemeStore } from '@/stores/theme-store'

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

export function Header() {
  const pathname = usePathname()
  const title = pageTitles[pathname] || 'Hiven ADM'
  const description = pageDescriptions[pathname] || ''
  const { theme, toggleTheme } = useThemeStore()

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
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl text-hiven-text-2 hover:text-hiven-text hover:bg-hiven-surface/80 transition-all duration-200">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-hiven-orange ring-[2.5px] ring-hiven-surface-elevated" />
        </Button>
      </div>
    </header>
  )
}
