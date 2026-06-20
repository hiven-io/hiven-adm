'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Shield, Database, Globe } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { ROLE_LABELS } from '@/lib/constants'

export default function SettingsPage() {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-hiven-text">Configuracoes</h2>
        <p className="text-sm text-hiven-text-3">Gerencie as configuracoes do painel administrativo</p>
      </div>

      <Card className="border-hiven-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-hiven-text flex items-center gap-2">
            <Shield className="h-4 w-4 text-hiven-red" /> Perfil do Admin
          </CardTitle>
          <CardDescription className="text-hiven-text-3">Informacoes da conta administrativa</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-hiven-text-3">Email</span>
            <span className="text-sm font-medium text-hiven-text">{user?.email || '-'}</span>
          </div>
          <Separator className="bg-hiven-border" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-hiven-text-3">Funcao</span>
            <Badge variant="outline" className="border-hiven-red/30 text-hiven-red bg-hiven-red/5">
              {ROLE_LABELS[user?.role || 'super_admin']}
            </Badge>
          </div>
          <Separator className="bg-hiven-border" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-hiven-text-3">ID da Conta</span>
            <span className="text-xs font-mono text-hiven-text-3">{user?.id || '-'}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="border-hiven-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-hiven-text flex items-center gap-2">
            <Database className="h-4 w-4 text-hiven-orange" /> Conexao com Supabase
          </CardTitle>
          <CardDescription className="text-hiven-text-3">Status da conexao com o banco de dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-hiven-text-3">URL do Projeto</span>
            <span className="text-xs font-mono text-hiven-text-3 truncate max-w-[300px]">orzovvkneqjsxkpcguis.supabase.co</span>
          </div>
          <Separator className="bg-hiven-border" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-hiven-text-3">Status</span>
            <Badge className="bg-hiven-success/10 text-hiven-success border-0">Conectado</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-hiven-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-hiven-text flex items-center gap-2">
            <Globe className="h-4 w-4 text-hiven-info" /> Sobre o Hiven ADM
          </CardTitle>
          <CardDescription className="text-hiven-text-3">Informacoes sobre o painel administrativo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-hiven-text-3">Versao</span>
            <span className="text-sm text-hiven-text">1.0.0</span>
          </div>
          <Separator className="bg-hiven-border" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-hiven-text-3">Stack</span>
            <span className="text-sm text-hiven-text">Next.js 15 + TypeScript + Supabase</span>
          </div>
          <Separator className="bg-hiven-border" />
          <div className="flex items-center justify-between">
            <span className="text-sm text-hiven-text-3">Design System</span>
            <span className="text-sm text-hiven-text">Hiven Design System v1.0</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
