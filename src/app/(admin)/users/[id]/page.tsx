'use client'

import { use } from 'react'
import { useUser, useUserExperiences, useUpdateUser } from '@/hooks/use-users'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Loader2, MapPin, Calendar, Sparkles, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: user, isLoading } = useUser(id)
  const { data: experiences } = useUserExperiences(id)
  const updateUser = useUpdateUser()
  const [editMode, setEditMode] = useState(false)
  const [editName, setEditName] = useState('')
  const [editBio, setEditBio] = useState('')
  const [editCity, setEditCity] = useState('')
  const [editPrivacy, setEditPrivacy] = useState<'public' | 'private'>('public')

  const startEdit = () => {
    if (!user) return
    setEditName(user.display_name)
    setEditBio(user.bio || '')
    setEditCity(user.city || '')
    setEditPrivacy(user.privacy)
    setEditMode(true)
  }

  const handleSave = async () => {
    await updateUser.mutateAsync({
      id,
      data: {
        display_name: editName,
        bio: editBio,
        city: editCity,
        privacy: editPrivacy,
      },
    })
    setEditMode(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-hiven-text-3" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-hiven-text-3">
        Usuario nao encontrado
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="text-hiven-text-3 hover:text-hiven-text"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      {/* Profile Card */}
      <Card className="border-hiven-border">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback className="bg-hiven-red/10 text-hiven-red text-2xl font-bold">
                {user.display_name?.charAt(0)?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-hiven-text">{user.display_name}</h2>
                {user.verified && (
                  <Badge className="bg-hiven-success/10 text-hiven-success border-0">
                    <Shield className="mr-1 h-3 w-3" /> Verificado
                  </Badge>
                )}
              </div>
              <p className="text-sm text-hiven-text-3">@{user.username}</p>
              {user.bio && <p className="text-sm text-hiven-text-2">{user.bio}</p>}
              <div className="flex items-center gap-4 text-xs text-hiven-text-3">
                {user.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {user.city}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={startEdit}
              className="border-hiven-border text-hiven-text-2"
            >
              Editar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-hiven-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-hiven-text">{user.followers_count}</p>
            <p className="text-xs text-hiven-text-3 mt-1">Seguidores</p>
          </CardContent>
        </Card>
        <Card className="border-hiven-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-hiven-text">{user.following_count}</p>
            <p className="text-xs text-hiven-text-3 mt-1">Seguindo</p>
          </CardContent>
        </Card>
        <Card className="border-hiven-border">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-hiven-text">{user.experiences_count}</p>
            <p className="text-xs text-hiven-text-3 mt-1">Experiencias</p>
          </CardContent>
        </Card>
        <Card className="border-hiven-border">
          <CardContent className="p-4 text-center">
            <Badge
              variant="outline"
              className={
                user.privacy === 'public'
                  ? 'border-hiven-success/30 text-hiven-success'
                  : 'border-hiven-warning/30 text-hiven-warning'
              }
            >
              {user.privacy === 'public' ? 'Publico' : 'Privado'}
            </Badge>
            <p className="text-xs text-hiven-text-3 mt-2">Privacidade</p>
          </CardContent>
        </Card>
      </div>

      {/* Experiences */}
      <Card className="border-hiven-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-hiven-text flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-hiven-orange" />
            Experiencias Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!experiences || experiences.length === 0 ? (
            <p className="text-sm text-hiven-text-3 py-4 text-center">
              Nenhuma experiencia encontrada
            </p>
          ) : (
            <div className="space-y-3">
              {experiences.slice(0, 10).map((ep: any) => (
                <div
                  key={ep.experience_id}
                  className="flex items-center justify-between p-3 rounded-lg bg-hiven-bg"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-hiven-orange/10 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-hiven-orange" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-hiven-text">
                        {ep.experiences?.title || 'Experiencia'}
                      </p>
                      <p className="text-xs text-hiven-text-3">
                        {ep.participation_status} - {new Date(ep.joined_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-hiven-border text-xs">
                    {ep.role}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editMode} onOpenChange={setEditMode}>
        <DialogContent className="border-hiven-border bg-hiven-surface-elevated">
          <DialogHeader>
            <DialogTitle className="text-hiven-text">Editar Usuario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm text-hiven-text">Nome</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="bg-hiven-bg border-hiven-border focus:border-hiven-red" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-hiven-text">Bio</Label>
              <Input value={editBio} onChange={(e) => setEditBio(e.target.value)} className="bg-hiven-bg border-hiven-border focus:border-hiven-red" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-hiven-text">Cidade</Label>
              <Input value={editCity} onChange={(e) => setEditCity(e.target.value)} className="bg-hiven-bg border-hiven-border focus:border-hiven-red" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-hiven-text">Privacidade</Label>
              <Select value={editPrivacy} onValueChange={(v) => setEditPrivacy((v ?? 'public') as 'public' | 'private')}>
                <SelectTrigger className="bg-hiven-bg border-hiven-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-hiven-border">
                  <SelectItem value="public">Publico</SelectItem>
                  <SelectItem value="private">Privado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditMode(false)} className="border-hiven-border">
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={updateUser.isPending} className="bg-hiven-red hover:bg-hiven-dark-red text-white">
              {updateUser.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
