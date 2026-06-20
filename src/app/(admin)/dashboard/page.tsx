'use client'

import { useState } from 'react'
import {
  useDashboardMetrics,
  useUserGrowthChart,
  useExperienceGrowthChart,
  useExperiencesByCategory,
  usePostsGrowthChart,
  useExperiencesByStatus,
  useNotificationsByType,
  useEngagementMetrics,
} from '@/hooks/use-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  UsersRound,
  Flame,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MapPinned,
  MessageSquareText,
  ShieldAlert,
  Sparkles,
  Heart,
  MessageCircle,
  Repeat,
  Bookmark,
  ArrowRight,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const HivenMap = dynamic(
  () => import('@/components/map/hiven-map').then(mod => ({ default: mod.HivenMap })),
  { ssr: false, loading: () => (
    <div className="h-[320px] bg-hiven-bg/50 rounded-xl flex items-center justify-center">
      <span className="text-sm text-hiven-text-3">Carregando mapa...</span>
    </div>
  )}
)

type ChartPeriod = '7d' | '30d' | '12m'

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  color,
  colorBg,
  href,
}: {
  title: string
  value: string | number
  subtitle: string
  icon: React.ElementType
  trend?: 'up' | 'down'
  trendValue?: string
  color: string
  colorBg: string
  href?: string
}) {
  const router = useRouter()
  return (
    <Card
      hoverable={!!href}
      className={cn(
        'border-hiven-border/60 group/card relative overflow-hidden',
        href && 'cursor-pointer'
      )}
      onClick={() => href && router.push(href)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn(
            'p-2 rounded-xl transition-all duration-300 group-hover/card:scale-110 group-hover/card:rotate-3',
            colorBg
          )}>
            <Icon className={cn('h-[18px] w-[18px]', color)} />
          </div>
          {href && (
            <div className="opacity-0 group-hover/card:opacity-100 transition-all duration-200 translate-x-1 group-hover/card:translate-x-0">
              <ArrowRight className="h-4 w-4 text-hiven-text-3" />
            </div>
          )}
        </div>
        <div>
          <p className="text-2xl font-bold text-hiven-text tracking-tight">{value}</p>
          <p className="text-xs text-hiven-text-3 mt-0.5">{title}</p>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-[11px] text-hiven-text-3">{subtitle}</p>
          {trend && trendValue && (
            <div
              className={cn(
                'flex items-center gap-0.5 text-[11px] font-medium',
                trend === 'up' ? 'text-hiven-success' : 'text-hiven-error'
              )}
            >
              {trend === 'up' ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {trendValue}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const [userChartPeriod, setUserChartPeriod] = useState<ChartPeriod>('30d')
  const [expChartPeriod, setExpChartPeriod] = useState<ChartPeriod>('30d')
  const [postsChartPeriod, setPostsChartPeriod] = useState<ChartPeriod>('30d')

  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics()
  const { data: userGrowth } = useUserGrowthChart(userChartPeriod)
  const { data: expGrowth } = useExperienceGrowthChart(expChartPeriod)
  const { data: postsGrowth } = usePostsGrowthChart(postsChartPeriod)
  const { data: categories } = useExperiencesByCategory()
  const { data: expByStatus } = useExperiencesByStatus()
  const { data: notifByType } = useNotificationsByType()
  const { data: engagement } = useEngagementMetrics()

  const periodButtons = (
    current: ChartPeriod,
    onChange: (p: ChartPeriod) => void
  ) => (
    <div className="flex gap-1 bg-hiven-bg/80 rounded-xl p-0.5">
      {(['7d', '30d', '12m'] as const).map((p) => (
        <Button
          key={p}
          variant={current === p ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onChange(p)}
          className={cn(
            'h-6 text-[11px] px-2.5 rounded-lg',
            current === p
              ? 'bg-hiven-red text-white shadow-sm shadow-hiven-red/20'
              : 'text-hiven-text-3 hover:text-hiven-text'
          )}
        >
          {p === '7d' ? '7d' : p === '30d' ? '30d' : '12m'}
        </Button>
      ))}
    </div>
  )

  const PIE_COLORS = [
    '#BE123C',
    '#F97316',
    '#16A34A',
    '#0EA5E9',
    '#7B2CBF',
    '#CA8A04',
  ]

  return (
    <div className="space-y-5">
      {/* Top stats - asymmetric 2-col left, 2-col right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 stagger-children">
        <StatCard
          title="Pessoas na plataforma"
          value={metricsLoading ? '...' : metrics?.totalUsers || 0}
          subtitle={`${metrics?.newUsersToday || 0} novas hoje`}
          icon={UsersRound}
          trend="up"
          trendValue={`${metrics?.newUsersWeek || 0} esta semana`}
          color="text-hiven-red"
          colorBg="bg-hiven-red/8"
          href="/users"
        />
        <StatCard
          title="Experiencias criadas"
          value={metricsLoading ? '...' : metrics?.totalExperiences || 0}
          subtitle={`${metrics?.activeExperiences || 0} ativas agora`}
          icon={Flame}
          trend="up"
          trendValue={`${metrics?.experiencesWeek || 0} esta semana`}
          color="text-hiven-orange"
          colorBg="bg-hiven-orange/8"
          href="/experiences"
        />
        <div className="lg:row-span-1 grid grid-cols-2 gap-4">
          <StatCard
            title="Locais cadastrados"
            value={metricsLoading ? '...' : metrics?.totalPlaces || 0}
            subtitle={`${metrics?.placesPending || 0} pendentes`}
            icon={MapPinned}
            color="text-hiven-success"
            colorBg="bg-hiven-success/8"
            href="/places"
          />
          <StatCard
            title="Publicacoes feitas"
            value={metricsLoading ? '...' : metrics?.totalPosts || 0}
            subtitle={`${metrics?.totalParticipants || 0} participacoes`}
            icon={MessageSquareText}
            color="text-hiven-info"
            colorBg="bg-hiven-info/8"
            href="/posts"
          />
        </div>
      </div>

      {/* Second row - wider left, narrow right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 stagger-children">
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard
            title="Notas recebidas"
            value={metricsLoading ? '...' : metrics?.totalReviews || 0}
            subtitle={`Media: ${metrics?.averageRating || 0}`}
            icon={Sparkles}
            color="text-yellow-500"
            colorBg="bg-yellow-500/8"
            href="/reviews"
          />
          <StatCard
            title="Novos este mes"
            value={metricsLoading ? '...' : metrics?.newUsersMonth || 0}
            subtitle="pessoas novas"
            icon={TrendingUp}
            trend="up"
            trendValue={`${metrics?.experiencesMonth || 0} experiencias`}
            color="text-purple-500"
            colorBg="bg-purple-500/8"
            href="/users/stats"
          />
        </div>
        <StatCard
          title="Precisam de atencao"
          value={metricsLoading ? '...' : metrics?.pendingReports || 0}
          subtitle="relatorios aguardando"
          icon={ShieldAlert}
          color="text-hiven-error"
          colorBg="bg-hiven-error/8"
          href="/reports"
        />
      </div>

      {/* Charts - main row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 stagger-children">
        {/* User Growth - wider */}
        <Card className="border-hiven-border/60 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <div>
              <CardTitle className="text-sm font-semibold text-hiven-text">
                Pessoas entrando
              </CardTitle>
              <p className="text-xs text-hiven-text-3 mt-0.5">Crescimento ao longo do tempo</p>
            </div>
            {periodButtons(userChartPeriod, setUserChartPeriod)}
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[260px]">
              {userGrowth && userGrowth.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={userGrowth}>
                    <defs>
                      <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#BE123C" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#BE123C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#EAE2DD" vertical={false} opacity={0.6} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: '#A99E98' }}
                      tickFormatter={(v) => {
                        const d = new Date(v)
                        return `${d.getDate()}/${d.getMonth() + 1}`
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#A99E98' }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FEFCFB',
                        border: '1px solid #EAE2DD',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                        padding: '10px 14px',
                      }}
                      labelFormatter={(v) => new Date(v).toLocaleDateString('pt-BR')}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#BE123C"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, fill: '#BE123C', stroke: '#fff', strokeWidth: 2 }}
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

        {/* Engagement sidebar */}
        <Card className="border-hiven-border/60 lg:col-span-2">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-semibold text-hiven-text">
              Como as pessoas interagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-2">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-hiven-red/5 to-transparent border border-hiven-red/8 transition-all duration-200 hover:border-hiven-red/15">
              <div className="flex items-center gap-2.5">
                <Heart className="h-4 w-4 text-hiven-red" />
                <span className="text-sm text-hiven-text-2">Curtidas</span>
              </div>
              <span className="text-sm font-bold text-hiven-text">{engagement?.totalLikes || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-hiven-orange/5 to-transparent border border-hiven-orange/8 transition-all duration-200 hover:border-hiven-orange/15">
              <div className="flex items-center gap-2.5">
                <MessageCircle className="h-4 w-4 text-hiven-orange" />
                <span className="text-sm text-hiven-text-2">Comentarios</span>
              </div>
              <span className="text-sm font-bold text-hiven-text">{engagement?.totalComments || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-hiven-info/5 to-transparent border border-hiven-info/8 transition-all duration-200 hover:border-hiven-info/15">
              <div className="flex items-center gap-2.5">
                <Repeat className="h-4 w-4 text-hiven-info" />
                <span className="text-sm text-hiven-text-2">Republicacoes</span>
              </div>
              <span className="text-sm font-bold text-hiven-text">{engagement?.totalReposts || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-hiven-success/5 to-transparent border border-hiven-success/8 transition-all duration-200 hover:border-hiven-success/15">
              <div className="flex items-center gap-2.5">
                <Bookmark className="h-4 w-4 text-hiven-success" />
                <span className="text-sm text-hiven-text-2">Salvos</span>
              </div>
              <span className="text-sm font-bold text-hiven-text">{engagement?.totalSaves || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom charts row - mixed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 stagger-children">
        {/* Experience growth */}
        <Card className="border-hiven-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <div>
              <CardTitle className="text-sm font-semibold text-hiven-text">
                Experiencias criadas
              </CardTitle>
            </div>
            {periodButtons(expChartPeriod, setExpChartPeriod)}
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[220px]">
              {expGrowth && expGrowth.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={expGrowth}>
                    <defs>
                      <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F97316" stopOpacity={1} />
                        <stop offset="100%" stopColor="#F97316" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#EAE2DD" vertical={false} opacity={0.6} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: '#A99E98' }}
                      tickFormatter={(v) => {
                        const d = new Date(v)
                        return `${d.getDate()}/${d.getMonth() + 1}`
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#A99E98' }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FEFCFB',
                        border: '1px solid #EAE2DD',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      }}
                      labelFormatter={(v) => new Date(v).toLocaleDateString('pt-BR')}
                    />
                    <Bar dataKey="count" fill="url(#expGrad)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-hiven-text-3 text-sm">
                  Nenhum dado disponivel
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Category donut */}
        <Card className="border-hiven-border/60">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-semibold text-hiven-text">
              Locais por tipo
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[220px]">
              {categories && categories.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categories}
                      cx="50%"
                      cy="48%"
                      innerRadius={48}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {categories.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color || PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FEFCFB',
                        border: '1px solid #EAE2DD',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      }}
                      formatter={(value, name) => [`${value} locais`, name as string]}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span className="text-[11px] text-hiven-text-2">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-hiven-text-3 text-sm">
                  Nenhum dado disponivel
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Posts growth */}
        <Card className="border-hiven-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-1">
            <div>
              <CardTitle className="text-sm font-semibold text-hiven-text">
                Publicacoes novas
              </CardTitle>
            </div>
            {periodButtons(postsChartPeriod, setPostsChartPeriod)}
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[220px]">
              {postsGrowth && postsGrowth.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={postsGrowth}>
                    <defs>
                      <linearGradient id="postsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.12} />
                        <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#EAE2DD" vertical={false} opacity={0.6} />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: '#A99E98' }}
                      tickFormatter={(v) => {
                        const d = new Date(v)
                        return `${d.getDate()}/${d.getMonth() + 1}`
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#A99E98' }} axisLine={false} tickLine={false} width={30} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FEFCFB',
                        border: '1px solid #EAE2DD',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      }}
                      labelFormatter={(v) => new Date(v).toLocaleDateString('pt-BR')}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#0EA5E9"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, fill: '#0EA5E9', stroke: '#fff', strokeWidth: 2 }}
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

      {/* Status row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 stagger-children">
        <Card className="border-hiven-border/60">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-semibold text-hiven-text">
              Situacao das experiencias
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[240px]">
              {expByStatus && expByStatus.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expByStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FEFCFB',
                        border: '1px solid #EAE2DD',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      }}
                    />
                    <Legend
                      formatter={(value) => (
                        <span className="text-[11px] text-hiven-text-2">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-hiven-text-3 text-sm">
                  Nenhum dado disponivel
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-hiven-border/60">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm font-semibold text-hiven-text">
              Notificacoes enviadas
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-[240px]">
              {notifByType && notifByType.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={notifByType} layout="vertical">
                    <CartesianGrid strokeDasharray="4 4" stroke="#EAE2DD" horizontal={false} opacity={0.6} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#A99E98' }} axisLine={false} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10, fill: '#A99E98' }}
                      width={90}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FEFCFB',
                        border: '1px solid #EAE2DD',
                        borderRadius: '12px',
                        fontSize: '12px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {notifByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
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

      {/* Map section */}
      <div className="stagger-children">
        <HivenMap />
      </div>
    </div>
  )
}
