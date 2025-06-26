export type UserRole = 'student' | 'consultant'

export interface OnboardingState {
  currentStep: number
  role: UserRole | null
  studentData: StudentOnboardingData
  consultantData: ConsultantOnboardingData
}

export interface StudentOnboardingData {
  dreamSchools: string[]
  year: 'senior' | 'junior' | 'sophomore' | 'transfer' | null
  painPoints: ('essays' | 'interviews' | 'activities' | 'test_prep')[]
  name: string
  email: string
}

export interface ConsultantOnboardingData {
  universityEmail: string
  isVerified: boolean
  university: string
  year: string
  major: string
  gpa: string
  testScores: {
    sat?: string
    act?: string
  }
  successStory: string
  services: ConsultantService[]
}

export interface ConsultantService {
  type: 'essay_review' | 'full_application' | 'interview_prep' | 'strategy_session'
  minPrice: number
  maxPrice: number
  isActive: boolean
}

export interface School {
  id: string
  name: string
  logo: string
  consultantCount: number
  isOnline?: boolean
}