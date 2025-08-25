export type BookingRequestStatus = 
  | 'draft'
  | 'pending_review'
  | 'in_discussion'
  | 'accepted'
  | 'rejected'
  | 'paid'
  | 'expired'
  | 'cancelled'

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'urgent'

export type InputType = 'essay' | 'prompt' | 'notes' | 'other'

export type UploadStatus = 'pending' | 'uploading' | 'completed' | 'failed'

export interface BookingRequest {
  id: string
  student_id: string
  consultant_id: string
  service_id: string
  purpose_of_service: string
  additional_requirements?: string
  deadline_date?: string
  urgency_level?: UrgencyLevel
  status: BookingRequestStatus
  submitted_at?: string
  reviewed_at?: string
  accepted_at?: string
  rejected_at?: string
  paid_at?: string
  expires_at?: string
  consultant_notes?: string
  rejection_reason?: string
  estimated_delivery_time?: string
  quoted_price?: number
  selected_tier?: string
  booking_id?: string
  last_saved_at?: string
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
}

export interface BookingTextInput {
  id: string
  request_id: string
  input_type: InputType
  title: string
  content: string
  word_count: number
  display_order: number
  created_at: string
  updated_at: string
}

export interface BookingFileUpload {
  id: string
  request_id: string
  file_name: string
  file_type: string
  file_size: number
  storage_path: string
  upload_status: UploadStatus
  upload_progress: number
  uploaded_at?: string
  scheduled_deletion_date: string
  deletion_notified: boolean
  deleted_at?: string
  description?: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface BookingDocLink {
  id: string
  request_id: string
  doc_url: string
  doc_title?: string
  doc_type?: 'google_doc' | 'google_sheet' | 'google_slide' | 'other'
  is_accessible: boolean
  last_verified_at: string
  description?: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface BookingRequestMessage {
  id: string
  request_id: string
  sender_id: string
  message: string
  is_read: boolean
  read_at?: string
  is_system_message: boolean
  metadata?: Record<string, any>
  created_at: string
}

export interface BookingRequestFormData {
  consultant_id: string
  service_id: string
  purpose_of_service: string
  additional_requirements?: string
  deadline_date?: string
  urgency_level?: UrgencyLevel
  text_inputs: Omit<BookingTextInput, 'id' | 'request_id' | 'created_at' | 'updated_at' | 'word_count'>[]
  file_uploads: File[]
  doc_links: Omit<BookingDocLink, 'id' | 'request_id' | 'created_at' | 'updated_at' | 'is_accessible' | 'last_verified_at'>[]
}