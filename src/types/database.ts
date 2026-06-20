export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          display_name: string
          avatar_url: string | null
          cover_url: string | null
          bio: string | null
          city: string | null
          privacy: 'public' | 'private'
          verified: boolean
          followers_count: number
          following_count: number
          experiences_count: number
          created_at: string
          updated_at: string
          last_seen_at: string | null
        }
        Insert: {
          id: string
          username: string
          display_name: string
          avatar_url?: string | null
          cover_url?: string | null
          bio?: string | null
          city?: string | null
          privacy?: 'public' | 'private'
          verified?: boolean
          followers_count?: number
          following_count?: number
          experiences_count?: number
          created_at?: string
          updated_at?: string
          last_seen_at?: string | null
        }
        Update: {
          id?: string
          username?: string
          display_name?: string
          avatar_url?: string | null
          cover_url?: string | null
          bio?: string | null
          city?: string | null
          privacy?: 'public' | 'private'
          verified?: boolean
          followers_count?: number
          following_count?: number
          experiences_count?: number
          created_at?: string
          updated_at?: string
          last_seen_at?: string | null
        }
      }
      experiences: {
        Row: {
          id: string
          title: string
          description: string | null
          cover_url: string | null
          place_id: string | null
          address_override: string | null
          creator_id: string
          starts_at: string | null
          ends_at: string | null
          status: 'draft' | 'open' | 'ongoing' | 'finished' | 'cancelled'
          visibility: 'public' | 'followers' | 'invite_only' | 'private'
          capacity_mode: 'open' | 'target' | 'hard_cap'
          target_attendance: number | null
          hard_capacity: number | null
          waitlist_enabled: boolean
          enrollment_status: 'accepting' | 'closed' | 'waitlist_only'
          is_retroactive: boolean
          is_post_hoc: boolean
          min_age: number
          price: number
          price_description: string | null
          external_link: string | null
          recurrence: 'none' | 'daily' | 'weekly' | 'monthly'
          likes_count: number
          saves_count: number
          participants_count: number
          is_reported: boolean
          is_deleted: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          cover_url?: string | null
          place_id?: string | null
          address_override?: string | null
          creator_id: string
          starts_at?: string | null
          ends_at?: string | null
          status?: 'draft' | 'open' | 'ongoing' | 'finished' | 'cancelled'
          visibility?: 'public' | 'followers' | 'invite_only' | 'private'
          capacity_mode?: 'open' | 'target' | 'hard_cap'
          target_attendance?: number | null
          hard_capacity?: number | null
          waitlist_enabled?: boolean
          enrollment_status?: 'accepting' | 'closed' | 'waitlist_only'
          is_retroactive?: boolean
          is_post_hoc?: boolean
          min_age?: number
          price?: number
          price_description?: string | null
          external_link?: string | null
          recurrence?: 'none' | 'daily' | 'weekly' | 'monthly'
          likes_count?: number
          saves_count?: number
          participants_count?: number
          is_reported?: boolean
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          cover_url?: string | null
          place_id?: string | null
          address_override?: string | null
          creator_id?: string
          starts_at?: string | null
          ends_at?: string | null
          status?: 'draft' | 'open' | 'ongoing' | 'finished' | 'cancelled'
          visibility?: 'public' | 'followers' | 'invite_only' | 'private'
          capacity_mode?: 'open' | 'target' | 'hard_cap'
          target_attendance?: number | null
          hard_capacity?: number | null
          waitlist_enabled?: boolean
          enrollment_status?: 'accepting' | 'closed' | 'waitlist_only'
          is_retroactive?: boolean
          is_post_hoc?: boolean
          min_age?: number
          price?: number
          price_description?: string | null
          external_link?: string | null
          recurrence?: 'none' | 'daily' | 'weekly' | 'monthly'
          likes_count?: number
          saves_count?: number
          participants_count?: number
          is_reported?: boolean
          is_deleted?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          experience_id: string
          type: 'review' | 'reference'
          body: string | null
          media_urls: string[] | null
          visibility: 'public' | 'followers' | 'private'
          presence_snapshot: number
          is_retroactive_post: boolean
          likes_count: number
          comments_count: number
          reposts_count: number
          is_reported: boolean
          deleted_at: string | null
          created_at: string
          edited_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          experience_id: string
          type: 'review' | 'reference'
          body?: string | null
          media_urls?: string[] | null
          visibility?: 'public' | 'followers' | 'private'
          presence_snapshot?: number
          is_retroactive_post?: boolean
          likes_count?: number
          comments_count?: number
          reposts_count?: number
          is_reported?: boolean
          deleted_at?: string | null
          created_at?: string
          edited_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          experience_id?: string
          type?: 'review' | 'reference'
          body?: string | null
          media_urls?: string[] | null
          visibility?: 'public' | 'followers' | 'private'
          presence_snapshot?: number
          is_retroactive_post?: boolean
          likes_count?: number
          comments_count?: number
          reposts_count?: number
          is_reported?: boolean
          deleted_at?: string | null
          created_at?: string
          edited_at?: string | null
        }
      }
      reviews: {
        Row: {
          post_id: string
          target_type: 'place' | 'experience'
          target_id: string
          rating_overall: number
          rating_atmosphere: number | null
          rating_cost_benefit: number | null
          rating_accessibility: number | null
          visited_at: string | null
        }
        Insert: {
          post_id: string
          target_type: 'place' | 'experience'
          target_id: string
          rating_overall: number
          rating_atmosphere?: number | null
          rating_cost_benefit?: number | null
          rating_accessibility?: number | null
          visited_at?: string | null
        }
        Update: {
          post_id?: string
          target_type?: 'place' | 'experience'
          target_id?: string
          rating_overall?: number
          rating_atmosphere?: number | null
          rating_cost_benefit?: number | null
          rating_accessibility?: number | null
          visited_at?: string | null
        }
      }
      places: {
        Row: {
          id: string
          slug: string
          name: string
          description: string | null
          category_id: string | null
          address_full: string | null
          address_neighborhood: string | null
          address_city: string | null
          phone: string | null
          website: string | null
          instagram_handle: string | null
          opening_hours: Json | null
          price_range: number
          photos: string[] | null
          rating_avg: number | null
          rating_count: number
          created_by: string
          verified: boolean
          status: 'active' | 'closed' | 'pending'
          is_reported: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          description?: string | null
          category_id?: string | null
          address_full?: string | null
          address_neighborhood?: string | null
          address_city?: string | null
          phone?: string | null
          website?: string | null
          instagram_handle?: string | null
          opening_hours?: Json | null
          price_range?: number
          photos?: string[] | null
          rating_avg?: number | null
          rating_count?: number
          created_by: string
          verified?: boolean
          status?: 'active' | 'closed' | 'pending'
          is_reported?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          description?: string | null
          category_id?: string | null
          address_full?: string | null
          address_neighborhood?: string | null
          address_city?: string | null
          phone?: string | null
          website?: string | null
          instagram_handle?: string | null
          opening_hours?: Json | null
          price_range?: number
          photos?: string[] | null
          rating_avg?: number | null
          rating_count?: number
          created_by?: string
          verified?: boolean
          status?: 'active' | 'closed' | 'pending'
          is_reported?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          slug: string
          name: string
          category: 'vibe' | 'type' | 'format' | 'audience'
          icon: string | null
          color: string | null
          usage_count: number
        }
        Insert: {
          id?: string
          slug: string
          name: string
          category: 'vibe' | 'type' | 'format' | 'audience'
          icon?: string | null
          color?: string | null
          usage_count?: number
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          category?: 'vibe' | 'type' | 'format' | 'audience'
          icon?: string | null
          color?: string | null
          usage_count?: number
        }
      }
      place_categories: {
        Row: {
          id: string
          slug: string
          name: string
          icon: string | null
          color: string | null
          parent_id: string | null
        }
        Insert: {
          id?: string
          slug: string
          name: string
          icon?: string | null
          color?: string | null
          parent_id?: string | null
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          icon?: string | null
          color?: string | null
          parent_id?: string | null
        }
      }
      experience_participants: {
        Row: {
          experience_id: string
          user_id: string
          participation_status: 'pending' | 'confirmed' | 'declined' | 'attended' | 'left' | 'waitlisted'
          presence_level: number
          role: 'creator' | 'co_host' | 'participant'
          joined_at: string
          checked_in_at: string | null
          waitlist_position: number | null
        }
        Insert: {
          experience_id: string
          user_id: string
          participation_status?: 'pending' | 'confirmed' | 'declined' | 'attended' | 'left' | 'waitlisted'
          presence_level?: number
          role?: 'creator' | 'co_host' | 'participant'
          joined_at?: string
          checked_in_at?: string | null
          waitlist_position?: number | null
        }
        Update: {
          experience_id?: string
          user_id?: string
          participation_status?: 'pending' | 'confirmed' | 'declined' | 'attended' | 'left' | 'waitlisted'
          presence_level?: number
          role?: 'creator' | 'co_host' | 'participant'
          joined_at?: string
          checked_in_at?: string | null
          waitlist_position?: number | null
        }
      }
      experience_tags: {
        Row: { experience_id: string; tag_id: string }
        Insert: { experience_id: string; tag_id: string }
        Update: { experience_id?: string; tag_id?: string }
      }
      experience_media: {
        Row: {
          id: string
          experience_id: string
          type: 'image' | 'video'
          url: string
          thumbnail_url: string | null
          duration_ms: number | null
          position: number
          height: number | null
          width: number | null
          created_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          type?: 'image' | 'video'
          url: string
          thumbnail_url?: string | null
          duration_ms?: number | null
          position?: number
          height?: number | null
          width?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          type?: 'image' | 'video'
          url?: string
          thumbnail_url?: string | null
          duration_ms?: number | null
          position?: number
          height?: number | null
          width?: number | null
          created_at?: string
        }
      }
      experience_saves: {
        Row: { experience_id: string; user_id: string; saved_at: string }
        Insert: { experience_id: string; user_id: string; saved_at?: string }
        Update: { experience_id?: string; user_id?: string; saved_at?: string }
      }
      experience_likes: {
        Row: { experience_id: string; user_id: string; created_at: string }
        Insert: { experience_id: string; user_id: string; created_at?: string }
        Update: { experience_id?: string; user_id?: string; created_at?: string }
      }
      experience_invites: {
        Row: {
          id: string
          experience_id: string
          invited_by: string
          invited_user_id: string | null
          invite_token: string | null
          status: 'pending' | 'accepted' | 'declined'
          created_at: string
        }
        Insert: {
          id?: string
          experience_id: string
          invited_by: string
          invited_user_id?: string | null
          invite_token?: string | null
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
        }
        Update: {
          id?: string
          experience_id?: string
          invited_by?: string
          invited_user_id?: string | null
          invite_token?: string | null
          status?: 'pending' | 'accepted' | 'declined'
          created_at?: string
        }
      }
      content_references: {
        Row: {
          post_id: string
          target_type: string
          target_id: string
          caption: string
          is_spontaneous: boolean
        }
        Insert: {
          post_id: string
          target_type: string
          target_id: string
          caption: string
          is_spontaneous?: boolean
        }
        Update: {
          post_id?: string
          target_type?: string
          target_id?: string
          caption?: string
          is_spontaneous?: boolean
        }
      }
      post_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          parent_comment_id: string | null
          body: string
          likes_count: number
          deleted_at: string | null
          created_at: string
          edited_at: string | null
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          parent_comment_id?: string | null
          body: string
          likes_count?: number
          deleted_at?: string | null
          created_at?: string
          edited_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          parent_comment_id?: string | null
          body?: string
          likes_count?: number
          deleted_at?: string | null
          created_at?: string
          edited_at?: string | null
        }
      }
      post_likes: {
        Row: { post_id: string; user_id: string; created_at: string }
        Insert: { post_id: string; user_id: string; created_at?: string }
        Update: { post_id?: string; user_id?: string; created_at?: string }
      }
      post_reposts: {
        Row: { post_id: string; user_id: string; created_at: string }
        Insert: { post_id: string; user_id: string; created_at?: string }
        Update: { post_id?: string; user_id?: string; created_at?: string }
      }
      follows: {
        Row: { follower_id: string; following_id: string; created_at: string }
        Insert: { follower_id: string; following_id: string; created_at?: string }
        Update: { follower_id?: string; following_id?: string; created_at?: string }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          actor_id: string | null
          type: 'like' | 'comment' | 'reply' | 'follow' | 'invite' | 'mention' | 'experience_starting' | 'review_reply' | 'waitlist_promoted'
          target_type: string | null
          target_id: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          actor_id?: string | null
          type: 'like' | 'comment' | 'reply' | 'follow' | 'invite' | 'mention' | 'experience_starting' | 'review_reply' | 'waitlist_promoted'
          target_type?: string | null
          target_id?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          actor_id?: string | null
          type?: 'like' | 'comment' | 'reply' | 'follow' | 'invite' | 'mention' | 'experience_starting' | 'review_reply' | 'waitlist_promoted'
          target_type?: string | null
          target_id?: string | null
          read?: boolean
          created_at?: string
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          target_type: 'user' | 'place' | 'experience' | 'post' | 'post_comment'
          target_id: string
          reason: string
          status: 'pending' | 'reviewed' | 'actioned' | 'dismissed'
          created_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          reporter_id: string
          target_type: 'user' | 'place' | 'experience' | 'post' | 'post_comment'
          target_id: string
          reason: string
          status?: 'pending' | 'reviewed' | 'actioned' | 'dismissed'
          created_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          reporter_id?: string
          target_type?: 'user' | 'place' | 'experience' | 'post' | 'post_comment'
          target_id?: string
          reason?: string
          status?: 'pending' | 'reviewed' | 'actioned' | 'dismissed'
          created_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
      place_tags: {
        Row: { place_id: string; tag_id: string }
        Insert: { place_id: string; tag_id: string }
        Update: { place_id?: string; tag_id?: string }
      }
      place_saves: {
        Row: { place_id: string; user_id: string; saved_at: string }
        Insert: { place_id: string; user_id: string; saved_at?: string }
        Update: { place_id?: string; user_id?: string; saved_at?: string }
      }
      place_suggestions: {
        Row: {
          id: string
          place_id: string
          user_id: string
          field_changed: string
          old_value: string | null
          new_value: string | null
          status: 'pending' | 'accepted' | 'rejected'
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          place_id: string
          user_id: string
          field_changed: string
          old_value?: string | null
          new_value?: string | null
          status?: 'pending' | 'accepted' | 'rejected'
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          place_id?: string
          user_id?: string
          field_changed?: string
          old_value?: string | null
          new_value?: string | null
          status?: 'pending' | 'accepted' | 'rejected'
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          radius_km: number
          preferred_tag_ids: string[]
          feed_algorithm: 'chronological' | 'algorithmic'
          notification_settings: Json
          updated_at: string
        }
        Insert: {
          user_id: string
          radius_km?: number
          preferred_tag_ids?: string[]
          feed_algorithm?: 'chronological' | 'algorithmic'
          notification_settings?: Json
          updated_at?: string
        }
        Update: {
          user_id?: string
          radius_km?: number
          preferred_tag_ids?: string[]
          feed_algorithm?: 'chronological' | 'algorithmic'
          notification_settings?: Json
          updated_at?: string
        }
      }
      mentions: {
        Row: {
          id: string
          source_type: 'post' | 'comment'
          source_id: string
          mention_type: 'user' | 'place' | 'experience'
          mentioned_id: string
          created_at: string
        }
        Insert: {
          id?: string
          source_type: 'post' | 'comment'
          source_id: string
          mention_type: 'user' | 'place' | 'experience'
          mentioned_id: string
          created_at?: string
        }
        Update: {
          id?: string
          source_type?: 'post' | 'comment'
          source_id?: string
          mention_type?: 'user' | 'place' | 'experience'
          mentioned_id?: string
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
