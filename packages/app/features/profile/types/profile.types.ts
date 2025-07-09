export interface StudentProfile {
  id: string
  name: string
  bio?: string
  current_school?: string
  school_type?: 'high-school' | 'college'
  grade_level?: 'senior' | 'junior' | 'sophomore' | 'freshman' | 'transfer'
  target_application_year?: number
  preferred_colleges: string[]
  interests: string[]
  pain_points: string[]
  budget_range?: {
    min: number
    max: number
  }
  credit_balance: number
  lifetime_credits_earned: number
  onboarding_completed: boolean
  onboarding_step: number
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  // From users table join
  email?: string
  profile_image_url?: string
}

export interface Booking {
  id: string
  student_id: string
  consultant_id: string
  service_type: 'essay_review' | 'interview_prep' | 'strategy' | 'test_prep' | 'other'
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  scheduled_at: string
  duration_minutes: number
  price: number
  notes?: string
  meeting_link?: string
  created_at: string
  consultant?: {
    id: string
    name: string
    profile_image_url?: string
    current_college: string
    rating: number
  }
}

export interface ApplicationMilestone {
  id: string
  title: string
  description: string
  due_date?: string
  completed: boolean
  type: 'deadline' | 'task' | 'achievement'
  icon?: string
  college?: string
}

export interface ProfileStats {
  totalSessions: number
  upcomingSessions: number
  totalSpent: number
  averageRating: number
  documentsUploaded: number
  collegesTargeted: number
}