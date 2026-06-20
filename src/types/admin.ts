import type { Tables } from './database'

export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'analyst'

export interface AdminUser {
  id: string
  email: string
  role: AdminRole
  created_at: string
}

export type ExperienceStatus = 'draft' | 'open' | 'ongoing' | 'finished' | 'cancelled'
export type ExperienceApprovalStatus = 'pending' | 'approved' | 'rejected' | 'archived'
export type ReportStatus = 'pending' | 'reviewed' | 'actioned' | 'dismissed'
export type PlaceStatus = 'active' | 'closed' | 'pending'

export interface DashboardMetrics {
  totalUsers: number
  newUsersToday: number
  newUsersWeek: number
  newUsersMonth: number
  totalExperiences: number
  experiencesToday: number
  experiencesWeek: number
  experiencesMonth: number
  totalReviews: number
  averageRating: number
  totalPlaces: number
  placesPending: number
  totalPosts: number
  pendingReports: number
  activeExperiences: number
  totalParticipants: number
}

export interface ChartDataPoint {
  date: string
  count: number
}

export interface CategoryDataPoint {
  name: string
  value: number
  color: string
}

export interface UserWithProfile extends Tables<'users'> {
  experience_count?: number
}

export interface ExperienceWithCreator extends Tables<'experiences'> {
  creator?: Tables<'users'>
  place?: Tables<'places'>
}

export interface PlaceWithCategory extends Tables<'places'> {
  category?: Tables<'place_categories'>
  creator?: Tables<'users'>
}
