export const HIVEN_COLORS = {
  background: '#FAF7F5',
  surface: '#F2ECE9',
  surfaceElevated: '#FEFCFB',
  border: '#EAE2DD',
  borderStrong: '#D9CFC9',
  brandRed: '#BE123C',
  brandOrange: '#F97316',
  brandDarkRed: '#2A2422',
  textPrimary: '#2A2320',
  textSecondary: '#6E625C',
  textTertiary: '#A99E98',
  textDisabled: '#C9BFB9',
  success: '#16A34A',
  warning: '#CA8A04',
  error: '#DC2626',
  info: '#0EA5E9',
} as const

export const EXPERIENCE_STATUS_LABELS: Record<string, string> = {
  draft: 'Rascunho',
  open: 'Aberta',
  ongoing: 'Acontecendo',
  finished: 'Encerrada',
  cancelled: 'Cancelada',
}

export const EXPERIENCE_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  open: 'bg-green-50 text-green-700',
  ongoing: 'bg-yellow-50 text-yellow-700',
  finished: 'bg-zinc-100 text-zinc-600',
  cancelled: 'bg-blue-50 text-blue-700',
}

export const REPORT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  reviewed: 'Revisado',
  actioned: 'Ação tomada',
  dismissed: 'Descartado',
}

export const REPORT_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  reviewed: 'bg-blue-50 text-blue-700',
  actioned: 'bg-green-50 text-green-700',
  dismissed: 'bg-zinc-100 text-zinc-600',
}

export const REPORT_TARGET_LABELS: Record<string, string> = {
  user: 'Usuário',
  place: 'Local',
  experience: 'Experiência',
  post: 'Post',
  post_comment: 'Comentário',
}

export const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderador',
  analyst: 'Analista',
}

export const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-purple-50 text-purple-700 border-purple-200',
  admin: 'bg-red-50 text-red-700 border-red-200',
  moderator: 'bg-blue-50 text-blue-700 border-blue-200',
  analyst: 'bg-teal-50 text-teal-700 border-teal-200',
}

export const TAG_CATEGORY_COLORS: Record<string, { bg: string; fg: string }> = {
  vibe: { bg: '#FCE7F3', fg: '#9D174D' },
  type: { bg: '#FFEDD5', fg: '#9A3412' },
  format: { bg: '#EDE9FE', fg: '#5B21B6' },
  audience: { bg: '#CFFAFE', fg: '#0E7490' },
}

export const PLACE_CATEGORY_COLORS: Record<string, string> = {
  gastronomia: '#F97316',
  musica: '#7B2CBF',
  arte: '#BE123C',
  esporte: '#16A34A',
  natureza: '#22C55E',
  'vida noturna': '#581C87',
}

export const PLACE_STATUS_LABELS: Record<string, string> = {
  active: 'Ativo',
  closed: 'Fechado',
  pending: 'Pendente',
}

export const PLACE_STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-50 text-green-700',
  closed: 'bg-zinc-100 text-zinc-600',
  pending: 'bg-yellow-50 text-yellow-700',
}

export const POST_TYPE_LABELS: Record<string, string> = {
  review: 'Review',
  reference: 'Referencia',
}

export const POST_TYPE_COLORS: Record<string, string> = {
  review: 'bg-hiven-orange/10 text-hiven-orange',
  reference: 'bg-hiven-info/10 text-hiven-info',
}

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  like: 'Curtida',
  comment: 'Comentario',
  reply: 'Resposta',
  follow: 'Seguiu',
  invite: 'Convite',
  mention: 'Mencao',
  experience_starting: 'Experiencia iniciando',
  review_reply: 'Resposta a review',
  waitlist_promoted: 'Lista de espera promovida',
}

export const ITEMS_PER_PAGE = 20
