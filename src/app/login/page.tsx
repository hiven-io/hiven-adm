'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/auth-store'
import { useThemeStore } from '@/stores/theme-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, EyeOff, Loader2, Sun, Moon, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(email, password)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex bg-hiven-bg relative">
      {/* Theme toggle - absolute top-right corner */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-xl text-hiven-text-2 hover:text-hiven-text hover:bg-hiven-surface/80 backdrop-blur-sm transition-all duration-200"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>

      {/* Left side - brand */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-hiven-red via-hiven-dark-red to-[#1a0a0e]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-hiven-orange blur-[120px]" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-hiven-red blur-[150px]" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 max-w-lg">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white leading-tight tracking-tight">
              Bem-vindo de<br />volta.
            </h1>
            <p className="text-white/60 mt-4 text-base leading-relaxed">
              Gerencie sua plataforma, acompanhe suas pessoas e mantenha tudo funcionando.
            </p>
          </div>
          <div className="flex items-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-hiven-orange" />
              <span className="text-white/50 text-xs font-medium">Seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-white/50 text-xs font-medium">Conectado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-hiven-info" />
              <span className="text-white/50 text-xs font-medium">Tempo real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Logo on white side - always visible */}
          <div className="flex items-center gap-3 mb-10">
            <img
              src="/logo-full.png"
              alt="Hiven"
              className="h-8 object-contain"
            />
          </div>

          {/* Mobile-only logo-mark (smaller, for very small screens) */}
          <div className="hidden max-[480px]:flex justify-center mb-10 lg:hidden">
            <img
              src="/logo-mark.png"
              alt="Hiven"
              className="w-10 h-10 rounded-2xl object-contain"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-hiven-text tracking-tight">Entrar</h2>
            <p className="text-sm text-hiven-text-3 mt-1">
              Acesse o painel de gerenciamento
            </p>
          </div>

          <Card className="border-hiven-border/60 shadow-none">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-hiven-error/5 border border-hiven-error/15 text-sm text-hiven-error flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-hiven-error shrink-0" />
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-medium text-hiven-text-2 uppercase tracking-wider">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-hiven-bg/60 border-hiven-border/60 focus:border-hiven-red focus:ring-hiven-red/10 rounded-xl h-11"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-xs font-medium text-hiven-text-2 uppercase tracking-wider">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-hiven-bg/60 border-hiven-border/60 focus:border-hiven-red focus:ring-hiven-red/10 rounded-xl h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-hiven-text-3 hover:text-hiven-text transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-hiven-red hover:bg-hiven-dark-red text-white rounded-xl h-11 mt-2 transition-all duration-200 shadow-sm shadow-hiven-red/20 hover:shadow-md hover:shadow-hiven-red/25"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <span className="flex items-center gap-2">
                      Entrar
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-[11px] text-hiven-text-disabled mt-8">
            Acesso restrito a administradores autorizados
          </p>
        </div>
      </div>
    </div>
  )
}
