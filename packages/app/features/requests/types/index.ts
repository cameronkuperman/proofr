export type RequestStatus = 'active' | 'pending' | 'in_review' | 'completed' | 'revision_requested'

export type ServiceType = 
  | 'essay_review' 
  | 'interview_prep' 
  | 'test_tutoring' 
  | 'application_strategy' 
  | 'school_selection'
  | 'other'

export type UrgencyLevel = 'standard' | 'priority' | 'express'

export interface Consultant {
  id: string
  name: string
  university: string
  graduationYear: string
  profileImage: string
  isVerified: boolean
  isOnline: boolean
  responseTime: string // e.g., "2 hours"
  rating: number
  totalReviews: number
}

export interface ServicePricing {
  standard: number
  priority?: number // +50% for 24hr response
  express?: number  // +100% for 12hr response
}

export interface RequestRevision {
  id: string
  requestedAt: Date
  description: string
  status: 'pending' | 'accepted' | 'completed'
  completedAt?: Date
}

export interface RequestDeliverable {
  id: string
  type: 'document' | 'feedback' | 'video' | 'other'
  title: string
  url?: string
  commentsCount?: number
  trackedChangesCount?: number
  uploadedAt: Date
}

export interface ServiceRequest {
  id: string
  serviceType: ServiceType
  title: string
  consultant: Consultant
  status: RequestStatus
  urgencyLevel: UrgencyLevel
  price: number
  progress: number // 0-100
  createdAt: Date
  startedAt?: Date
  completedAt?: Date
  deadline?: Date
  revisionDeadline?: Date
  revisionsRemaining: number
  totalRevisions: number
  deliverables: RequestDeliverable[]
  revisions: RequestRevision[]
  lastActivity: Date
  description: string
  isConsultantWorking: boolean
  estimatedCompletionTime?: string
  school?: string // For grouped view
}

export interface RequestsStats {
  totalRequests: number
  activeRequests: number
  inReviewRequests: number
  completedRequests: number
  journeyProgress: number // 0-100
}

export interface AdditionalWorkRequest {
  id: string
  originalRequestId: string
  description: string
  proposedPrice: number
  status: 'pending' | 'accepted' | 'declined' | 'countered'
  counterPrice?: number
  createdAt: Date
}