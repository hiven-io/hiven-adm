'use client'

import { useDashboardMetrics, useUserGrowthChart } from '@/hooks/use-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, UserPlus, TrendingUp, Activity } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type ChartPeriod = '7d' | '30d' | '12m'

export default function UserStatsPage() {
  const [period, setPeriod] = useState<ChartPeriod>('30d')
  const { data: metrics } = useDashboardMetrics()
  const { data: growth } = useUserGrowthChart(period)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-hiven-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-hiven-red">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-hiven-text-3">Total</p>
                <p className="text-2xl font-bold text-hiven-text">{metrics?.totalUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-hiven-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-hiven-orange">
                <UserPlus className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-hiven-text-3">Hoje</p>
                <p className="text-2xl font-bold text-hiven-text">+{metrics?.newUsersToday || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-hiven-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-hiven-success">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-hiven-text-3">Esta semana</p>
                <p className="text-2xl font-bold text-hiven-text">+{metrics?.newUsersWeek || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-hiven-border">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-hiven-info">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-hiven-text-3">Este mes</p>
                <p className="text-2xl font-bold text-hiven-text">+{metrics?.newUsersMonth || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-hiven-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold text-hiven-text">
            Crescimento de Usuarios
          </CardTitle>
          <div className="flex gap-1">
            {(['7d', '30d', '12m'] as const).map((p) => (
              <Button
                key={p}
                variant={period === p ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setPeriod(p)}
                className={cn(
                  'h-7 text-xs',
                  period === p ? 'bg-hiven-red text-white hover:bg-hiven-dark-red' : 'text-hiven-text-3'
                )}
              >
                {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : '12 meses'}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {growth && growth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAE2DD" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#A99E98' }}
                    tickFormatter={(v) => {
                      const d = new Date(v)
                      return `${d.getDate()}/${d.getMonth() + 1}`
                    }}
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#A99E98' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FEFCFB',
                      border: '1px solid #EAE2DD',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    labelFormatter={(v) => new Date(v).toLocaleDateString('pt-BR')}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#BE123C"
                    strokeWidth={2}
                    dot={{ fill: '#BE123C', r: 3 }}
                    activeDot={{ r: 5, fill: '#BE123C' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-hiven-text-3 text-sm">
                Nenhum dado disponivel
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
