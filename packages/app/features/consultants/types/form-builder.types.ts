// Form Builder Types for Dynamic Service Forms

export type FieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file'
  | 'date'
  | 'time'
  | 'url'
  | 'wordcount'
  | 'category'
  | 'multiselect'

export interface FieldValidation {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  patternMessage?: string
  fileTypes?: string[]
  maxFileSize?: number // in MB
}

export interface FieldOption {
  value: string
  label: string
  description?: string
  priceModifier?: number // percentage modifier for this option
}

export interface FormField {
  id: string
  type: FieldType
  label: string
  placeholder?: string
  description?: string
  defaultValue?: any
  options?: FieldOption[]
  validation?: FieldValidation
  conditional?: {
    field: string
    value: any
  }
  metadata?: Record<string, any>
}

// Service-specific form templates
export interface EssayReviewFormConfig {
  essayCategories: {
    enabled: boolean
    options: FieldOption[]
    required: boolean
  }
  wordCountLimits: {
    enabled: boolean
    tiers: Array<{
      min: number
      max: number
      label: string
      priceModifier: number
    }>
  }
  promptField: {
    enabled: boolean
    required: boolean
    placeholder?: string
  }
  improvementGoals: {
    enabled: boolean
    options: string[]
    allowCustom: boolean
  }
  submissionMethods: {
    textPaste: boolean
    fileUpload: boolean
    googleDocLink: boolean
  }
  customFields: FormField[]
}

export interface InterviewPrepFormConfig {
  interviewTypes: {
    enabled: boolean
    options: FieldOption[]
    allowCustom: boolean
  }
  exampleQuestions: {
    enabled: boolean
    required: boolean
    maxQuestions: number
  }
  schoolField: {
    enabled: boolean
    required: boolean
  }
  customFields: FormField[]
}

export interface TutoringFormConfig {
  currentScores: {
    enabled: boolean
    required: boolean
    scoreType: 'SAT' | 'ACT' | 'both'
  }
  targetScores: {
    enabled: boolean
    required: boolean
  }
  weakAreas: {
    enabled: boolean
    options: string[]
    allowMultiple: boolean
  }
  sessionPreferences: {
    enabled: boolean
    timeSlots: boolean
    frequency: boolean
  }
  customFields: FormField[]
}

export interface ServiceFormConfig {
  formType: 'essay_review' | 'interview_prep' | 'tutoring' | 'custom'
  essayReview?: EssayReviewFormConfig
  interviewPrep?: InterviewPrepFormConfig
  tutoring?: TutoringFormConfig
  customForm?: {
    fields: FormField[]
    submitButtonText?: string
  }
}

// Booking form data with all possible fields
export interface EnhancedBookingFormData {
  // Base fields
  service_id: string
  price_tier_index: number
  is_rush: boolean
  rush_hours?: number
  
  // Essay Review fields
  essay_category?: string
  essay_prompt?: string
  essay_text?: string
  word_count?: number
  word_count_tier?: string
  google_doc_link?: string
  uploaded_file?: File
  improvement_goals?: string[]
  
  // Interview Prep fields
  interview_type?: string
  interview_school?: string
  example_questions?: string[]
  preparation_focus?: string
  
  // Tutoring fields
  current_sat_score?: number
  current_act_score?: number
  target_sat_score?: number
  target_act_score?: number
  weak_areas?: string[]
  preferred_times?: string[]
  session_frequency?: string
  
  // General fields
  special_instructions?: string
  custom_fields?: Record<string, any>
  
  // Metadata
  form_version?: string
  submitted_at?: string
}

// Consultant's service configuration
export interface ServiceConfiguration {
  id: string
  service_id: string
  form_config: ServiceFormConfig
  pricing_rules?: {
    wordCountPricing?: boolean
    categoryPricing?: Record<string, number>
    customFieldPricing?: Record<string, number>
  }
  is_active: boolean
  created_at: string
  updated_at: string
}

// Pre-built templates
export const ESSAY_TEMPLATE_FIELDS: Partial<EssayReviewFormConfig> = {
  essayCategories: {
    enabled: true,
    required: true,
    options: [
      { value: 'common_app_personal', label: 'Common App Personal Statement (650 words)', priceModifier: 1.2 },
      { value: 'supplemental_short', label: 'Supplemental Essay (100-250 words)', priceModifier: 0.8 },
      { value: 'supplemental_medium', label: 'Supplemental Essay (250-500 words)', priceModifier: 1.0 },
      { value: 'scholarship', label: 'Scholarship Essay', priceModifier: 1.1 },
      { value: 'grad_school', label: 'Graduate School Statement', priceModifier: 1.3 },
      { value: 'other', label: 'Other', priceModifier: 1.0 }
    ]
  },
  improvementGoals: {
    enabled: true,
    allowCustom: true,
    options: [
      'Grammar and clarity',
      'Story structure and flow',
      'Making it more compelling',
      'Cutting down word count',
      'Adding personal voice',
      'Strengthening conclusion',
      'Better topic alignment'
    ]
  }
}

export const INTERVIEW_TEMPLATE_FIELDS: Partial<InterviewPrepFormConfig> = {
  interviewTypes: {
    enabled: true,
    allowCustom: false,
    options: [
      { value: 'alumni', label: 'Alumni Interview' },
      { value: 'admissions', label: 'Admissions Officer Interview' },
      { value: 'scholarship', label: 'Scholarship Interview' },
      { value: 'video', label: 'Video Interview Practice' }
    ]
  }
}

export const TUTORING_TEMPLATE_FIELDS: Partial<TutoringFormConfig> = {
  weakAreas: {
    enabled: true,
    allowMultiple: true,
    options: [
      'SAT Math',
      'SAT Reading',
      'SAT Writing',
      'ACT Math',
      'ACT English',
      'ACT Reading',
      'ACT Science',
      'Test Strategy',
      'Time Management'
    ]
  }
}