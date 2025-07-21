// Consultant-related types shared across platforms

export interface University {
  name: string
  degree: string
  years: string
}

export interface RushMultiplier {
  hours: number
  multiplier: number
}

export interface ServicePreview {
  [key: string]: string
}

export interface ConsultantUser {
  id: string
  email: string
  user_type: 'consultant'
  profile_image_url?: string
  last_login?: string
}

export interface Consultant {
  id: string
  name: string
  bio: string
  long_bio?: string
  current_college: string
  colleges_attended?: University[]
  major: string
  graduation_year: number
  verification_status: 'pending' | 'approved' | 'rejected'
  verified_at?: string
  is_available: boolean
  vacation_mode: boolean
  vacation_message?: string
  services_preview?: ServicePreview
  supports_rush_delivery: boolean
  rush_multipliers?: Record<string, number>
  rating: number
  total_reviews: number
  total_bookings: number
  total_earnings: number
  response_time_hours: number
  timezone?: string
  calendly_url?: string
  profile_views: number
  last_active?: string
  created_at: string
  updated_at: string
  // Joined user data
  user?: ConsultantUser
}

export interface Service {
  id: string
  consultant_id: string
  service_type: string
  title: string
  description: string
  prices: number[]
  price_descriptions: string[]
  delivery_type: 'async' | 'scheduled' | 'instant'
  standard_turnaround_hours?: number
  duration_minutes?: number
  rush_available: boolean
  rush_turnarounds?: Record<string, number>
  max_active_orders: number
  is_active: boolean
  allows_group_sessions: boolean
  max_group_size?: number
  total_bookings: number
  avg_rating?: number
  created_at: string
  updated_at: string
}

export interface ConsultantWithServices extends Consultant {
  services: Service[]
}

export interface Booking {
  id: string
  student_id: string
  consultant_id: string
  service_id: string
  base_price: number
  price_tier: string
  rush_multiplier: number
  final_price: number
  prompt_text?: string
  essay_text?: string
  word_count?: number
  requirements_text?: string
  google_doc_link?: string
  uploaded_files?: any[]
  is_rush: boolean
  promised_delivery_at: string
  delivered_at?: string
  deliverables?: any
  scheduled_at?: string
  calendly_event_url?: string
  meeting_link?: string
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'refunded'
  completed_at?: string
  cancelled_at?: string
  cancellation_reason?: string
  credits_earned?: number
  rating?: number
  review_text?: string
  reviewed_at?: string
  created_at: string
  updated_at: string
}

export interface BookingFormData {
  service_id: string
  price_tier_index: number
  is_rush: boolean
  rush_hours?: number
  prompt_text: string
  // Essay specific
  essay_text?: string
  word_count?: number
  google_doc_link?: string
  uploaded_file?: File
  // Interview specific
  interview_type?: string
  target_school?: string
  scheduled_time?: string
  preparation_notes?: string
  resume_file?: File
  // Strategy specific
  current_situation?: string
  goals?: string
  concerns?: string
}

export interface ConsultantFilters {
  search?: string
  university?: string
  service_type?: string
  min_price?: number
  max_price?: number
  min_rating?: number
  is_available?: boolean
  verified_only?: boolean
  sort_by?: 'rating' | 'price_low' | 'price_high' | 'bookings' | 'newest'
}

export interface ConsultantStats {
  views_today: number
  views_week: number
  last_booking_time?: string
  spots_remaining_week: number
  response_time_display: string
  member_since_display: string
}