'use client'

import { use, useState } from 'react'
import { useExperience, useUpdateExperience, useExperienceParticipants } from '@/hooks/use-experiences'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Loader2, MapPin, Calendar, Users, Heart, BookOpen, Edit, Globe, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { EXPERIENCE_STATUS_LABELS, EXPERIENCE_STATUS_COLORS } from '@/lib/constants'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export default function ExperienceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: experience, isLoading } = useExperience(id)
  const { data: participants } = useExperienceParticipants(id)
  const updateExperience = useUpdateExperience()
  const [editMode, setEditMode] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStatus, setEditStatus] = useState('')

  const startEdit = () => {
    if (!experience) return
    setEditTitle(experience.title)
    setEditDescription(experience.description || '')
    setEditStatus(experience.status)
    setEditMode(true)
  }

  const handleSave = async () => {
    await updateExperience.mutateAsync({ id, data: { title: editTitle, description: editDescription, status: editStatus as any } })
    setEditMode(false)
  }

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-hiven-text-3" /></div>
  if (!experience) return <div className="text-center py-20 text-hiven-text-3">Experiencia nao encontrada</div>

  const statItems = [
    { icon: Users, label: 'Participantes', value: experience.participants_count, color: 'text-hiven-info' },
    { icon: Heart, label: 'Curtidas', value: experience.likes_count, color: 'text-hiven-red' },
    { icon: BookOpen, label: 'Salvos', value: experience.saves_count, color: 'text-hiven-success' },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="text-hiven-text-3 hover:text-hiven-text rounded-xl">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <Button variant="outline" size="sm" onClick={startEdit} className="border-hiven-border text-hiven-text-2 rounded-xl hover:bg-hiven-surface">
          <Edit className="mr-2 h-4 w-4" /> Editar
        </Button>
      </div>

      {/* Main Info Card */}
      <Card className="border-hiven-border overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-hiven-red via-hiven-orange to-hiven-red" />
        <CardContent className="p-6">
          <div className="space-y-5">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <h2 className="text-2xl font-bold text-hiven-text tracking-tight">{experience.title}</h2>
                {experience.description && (
                  <p className="text-sm text-hiven-text-2 max-w-2xl leading-relaxed">{experience.description}</p>
                )}
              </div>
              <Badge variant="outline" className={EXPERIENCE_STATUS_COLORS[experience.status] || ''}>
                {EXPERIENCE_STATUS_LABELS[experience.status]}
              </Badge>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 text-hiven-text-3">
                <Calendar className="h-4 w-4" />
                {experience.starts_at ? new Date(experience.starts_at).toLocaleString('pt-BR') : 'Sem data'}
              </span>
              <span className="flex items-center gap-1.5 text-hiven-text-3">
                {experience.visibility === 'public' ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {experience.visibility === 'public' ? 'Publica' : experience.visibility}
              </span>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3">
              {statItems.map((stat) => (
                <div key={stat.label} className="flex items-center gap-3 p-3 rounded-xl bg-hiven-bg/80 border border-hiven-border/50">
                  <div className={cn('p-2 rounded-lg bg-hiven-surface', stat.color)}>
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-hiven-text">{stat.value}</p>
                    <p className="text-xs text-hiven-text-3">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {experience.place && (
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-hiven-orange/5 to-transparent border border-hiven-orange/10">
                <div className="p-2 rounded-lg bg-hiven-orange/10">
                  <MapPin className="h-4 w-4 text-hiven-orange" />
                </div>
                <div>
                  <p className="text-sm font-medium text-hiven-text">{experience.place.name}</p>
                  {experience.place.address_full && (
                    <p className="text-xs text-hiven-text-3">{experience.place.address_full}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Creator Card */}
      <Card className="border-hiven-border">
        <CardHeader className="pb-2"><CardTitle className="text-base font-semibold text-hiven-text">Criador</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={experience.creator?.avatar_url || undefined} />
              <AvatarFallback className="bg-hiven-red/10 text-hiven-red text-sm font-bold">{experience.creator?.display_name?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-hiven-text">{experience.creator?.display_name}</p>
              <p className="text-xs text-hiven-text-3">@{experience.creator?.username}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Participants Card */}
      <Card className="border-hiven-border">
        <CardHeader><CardTitle className="text-base font-semibold text-hiven-text flex items-center gap-2"><Users className="h-4 w-4 text-hiven-orange" /> Participantes ({participants?.length || 0})</CardTitle></CardHeader>
        <CardContent>
          {!participants || participants.length === 0 ? (
            <p className="text-sm text-hiven-text-3 py-4 text-center">Nenhum participante encontrado</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {participants.slice(0, 20).map((p: any) => (
                <div key={`${p.user_id}-${p.experience_id}`} className="flex items-center justify-between p-3.5 rounded-xl bg-hiven-bg/80 border border-hiven-border/50 transition-all duration-200 hover:border-hiven-border hover:bg-hiven-surface/50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={p.user?.avatar_url || undefined} />
                      <AvatarFallback className="bg-hiven-red/10 text-hiven-red text-xs font-bold">{p.user?.display_name?.charAt(0)?.toUpperCase() || '?'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-hiven-text">{p.user?.display_name}</p>
                      <p className="text-xs text-hiven-text-3">{p.participation_status} - Presenca nivel {p.presence_level}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-hiven-border text-xs">{p.role}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent className="border-hiven-border bg-hiven-surface-elevated">
          <DialogHeader><DialogTitle className="text-hiven-text">Editar Experiencia</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label className="text-sm text-hiven-text">Titulo</Label><Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="bg-hiven-bg border-hiven-border focus:border-hiven-red" /></div>
            <div className="space-y-2"><Label className="text-sm text-hiven-text">Descricao</Label><Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="bg-hiven-bg border-hiven-border focus:border-hiven-red" /></div>
            <div className="space-y-2"><Label className="text-sm text-hiven-text">Status</Label>
              <Select value={editStatus} onValueChange={(v) => setEditStatus(v ?? '')}>
                <SelectTrigger className="bg-hiven-bg border-hiven-border"><SelectValue /></SelectTrigger>
                <SelectContent className="border-hiven-border">
                  <SelectItem value="draft">Rascunho</SelectItem><SelectItem value="open">Aberta</SelectItem><SelectItem value="ongoing">Acontecendo</SelectItem><SelectItem value="finished">Encerrada</SelectItem><SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMode(false)} className="border-hiven-border rounded-xl">Cancelar</Button>
            <Button onClick={handleSave} disabled={updateExperience.isPending} className="bg-hiven-red hover:bg-hiven-dark-red text-white rounded-xl">
              {updateExperience.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
