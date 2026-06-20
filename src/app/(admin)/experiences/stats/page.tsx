'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, TrendingUp, Calendar, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import { useDashboardMetrics, useExperienceGrowthChart } from '@/hooks/use-dashboard'

type ChartPeriod = '7d' | '30d' | '12m'

export default function ExperienceStatsPage() {
  const [period, setPeriod] = useState<ChartPeriod>('30d')
  const { data: metrics } = useDashboardMetrics()
  const { data: growth } = useExperienceGrowthChart(period)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-hiven-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-hiven-orange"><Sparkles className="h-5 w-5 text-white" /></div>
              <div><p className="text-sm text-hiven-text-3">Total</p><p className="text-2xl font-bold text-hiven-text">{metrics?.totalExperiences || 0}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-hiven-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-hiven-red"><Calendar className="h-5 w-5 text-white" /></div>
              <div><p className="text-sm text-hiven-text-3">Hoje</p><p className="text-2xl font-bold text-hiven-text">+{metrics?.experiencesToday || 0}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-hiven-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-hiven-success"><TrendingUp className="h-5 w-5 text-white" /></div>
              <div><p className="text-sm text-hiven-text-3">Esta semana</p><p className="text-2xl font-bold text-hiven-text">+{metrics?.experiencesWeek || 0}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-hiven-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-hiven-info"><Users className="h-5 w-5 text-white" /></div>
              <div><p className="text-sm text-hiven-text-3">Este mes</p><p className="text-2xl font-bold text-hiven-text">+{metrics?.experiencesMonth || 0}</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-hiven-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-hiven-text">Crescimento de Experiencias</CardTitle>
          <div className="flex gap-1">
            {(['7d', '30d', '12m'] as const).map((p) => (
              <Button key={p} variant={period === p ? 'default' : 'ghost'} size="sm" onClick={() => setPeriod(p)} className={cn('h-7 text-xs', period === p ? 'bg-hiven-red text-white hover:bg-hiven-dark-red' : 'text-hiven-text-3')}>
                {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '12 meses'}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {growth && growth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={growth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAE2DD" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#A99E98' }} tickFormatter={(v) => { const d = new Date(v); return `${d.getDate()}/${d.getMonth() + 1}` }} />
                  <YAxis tick={{ fontSize: 11, fill: '#A99E98' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#FEFCFB', border: '1px solid #EAE2DD', borderRadius: '8px', fontSize: '12px' }} labelFormatter={(v) => new Date(v).toLocaleDateString('pt-BR')} />
                  <Bar dataKey="count" fill="#F97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-hiven-text-3 text-sm">Nenhum dado disponivel</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
