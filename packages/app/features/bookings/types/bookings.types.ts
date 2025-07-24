export interface Booking {
  id: string
  student_id: string
  consultant_id: string
  service_id: string
  service_type?: string // This comes from the service relation, not directly from bookings
  scheduled_at: string
  duration_minutes: number
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded'
  
  // Pricing
  base_price: number
  rush_multiplier?: number
  discount_amount?: number
  final_price: number
  credits_earned: number
  
  // Group session fields
  is_group_session: boolean
  max_participants?: number
  current_participants?: number
  
  // Content
  prompt_text?: string
  essay_text?: string
  requirements_text?: string
  google_doc_link?: string
  uploaded_files?: any[]
  deliverables?: any[]
  
  // Meeting
  meeting_link?: string
  calendly_event_url?: string
  
  // Delivery
  promised_delivery_at?: string
  delivered_at?: string
  
  // Review
  rating?: number
  review_text?: string
  reviewed_at?: string
  
  // Refund
  refund_requested?: boolean
  refund_reason?: string
  refund_status?: 'pending' | 'approved' | 'rejected' | 'processed'
  refund_amount?: number
  refunded_at?: string
  
  // Relations
  consultant?: {
    id: string
    name: string
    university: string
    avatar_url?: string
    rating?: number
  }
  service?: {
    id: string
    name: string
    description?: string
    allows_group_sessions?: boolean
    max_group_size?: number
  }
  participants?: GroupSessionParticipant[]
  
  created_at: string
  updated_at?: string
}

export interface GroupSessionParticipant {
  id: string
  booking_id: string
  student_id: string
  joined_at: string
  student?: {
    id: string
    name?: string
    grade_level?: number
    target_schools?: string[]
  }
}

export interface SavedConsultant {
  id: string
  student_id: string
  consultant_id: string
  saved_at: string
  consultant: {
    id: string
    name: string
    university: string
    avatar_url?: string
    rating?: number
    total_reviews?: number
    hourly_rate?: number
    is_available?: boolean
    last_active?: string
    services?: any[]
  }
}

export interface ConsultantWaitlist {
  id: string
  consultant_id: string
  student_id: string
  service_id?: string
  position: number
  joined_at: string
  expires_at?: string
  notified: boolean
  consultant: {
    id: string
    name: string
    university: string
    avatar_url?: string
  }
}

export interface BookingStats {
  totalSessions: number
  completedSessions: number
  upcomingSessions: number
  totalSpent: number
  totalCreditsEarned: number
  averageRating: number
  unratedSessions: number
}

export interface BookingFilters {
  status?: string[]
  serviceType?: string[]
  consultant?: string[]
  dateRange?: {
    start: string
    end: string
  }
  priceRange?: {
    min: number
    max: number
  }
  hasRating?: boolean
  isGroupSession?: boolean
}

export interface QuickRatingData {
  booking_id: string
  rating: number
  review_text?: string
}

export type BookingTab = 'active' | 'history' | 'saved'