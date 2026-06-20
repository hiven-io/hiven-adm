import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const userUpdateSchema = z.object({
  display_name: z.string().min(1).max(50).optional(),
  bio: z.string().max(280).optional(),
  city: z.string().max(100).optional(),
  privacy: z.enum(['public', 'private']).optional(),
  verified: z.boolean().optional(),
})

export type UserUpdateInput = z.infer<typeof userUpdateSchema>

export const experienceUpdateSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['draft', 'open', 'ongoing', 'finished', 'cancelled']).optional(),
  visibility: z.enum(['public', 'followers', 'invite_only', 'private']).optional(),
})

export type ExperienceUpdateInput = z.infer<typeof experienceUpdateSchema>

export const reportUpdateSchema = z.object({
  status: z.enum(['pending', 'reviewed', 'actioned', 'dismissed']),
})

export type ReportUpdateInput = z.infer<typeof reportUpdateSchema>
