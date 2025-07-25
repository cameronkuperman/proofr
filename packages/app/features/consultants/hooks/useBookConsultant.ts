import { useState } from 'react'
import { supabase } from '../../../../../lib/supabase'
import type { Service } from '../types/consultant.types'
import type { EnhancedBookingFormData } from '../types/form-builder.types'

export function useBookConsultant() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBooking = async (
    consultantId: string, 
    service: Service, 
    formData: EnhancedBookingFormData
  ) => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError('You must be logged in to book a service')
      return null
    }

    try {
      setLoading(true)
      setError(null)

      // Calculate pricing
      const basePrice = service.prices[formData.price_tier_index]
      const rushMultiplier = formData.is_rush && formData.rush_hours 
        ? service.rush_turnarounds?.[formData.rush_hours] || 1
        : 1
      const finalPrice = basePrice * rushMultiplier

      // Calculate delivery time
      const now = new Date()
      let promisedDeliveryAt: Date

      if (service.delivery_type === 'scheduled' && formData.scheduled_time) {
        promisedDeliveryAt = new Date(formData.scheduled_time)
      } else if (formData.is_rush && formData.rush_hours) {
        promisedDeliveryAt = new Date(now.getTime() + formData.rush_hours * 60 * 60 * 1000)
      } else if (service.standard_turnaround_hours) {
        promisedDeliveryAt = new Date(now.getTime() + service.standard_turnaround_hours * 60 * 60 * 1000)
      } else {
        promisedDeliveryAt = new Date(now.getTime() + 48 * 60 * 60 * 1000) // Default 48 hours
      }

      // Prepare booking data
      const bookingData: any = {
        student_id: user.id,
        consultant_id: consultantId,
        service_id: service.id,
        base_price: basePrice,
        price_tier: service.price_descriptions[formData.price_tier_index],
        rush_multiplier: rushMultiplier,
        final_price: finalPrice,
        is_rush: formData.is_rush,
        promised_delivery_at: promisedDeliveryAt.toISOString(),
        status: 'pending',
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        metadata: {}
      }

      // Add service-specific fields
      if (service.service_type === 'essay_review') {
        bookingData.essay_text = formData.essay_text
        bookingData.google_doc_link = formData.google_doc_link
        bookingData.prompt_text = formData.essay_prompt || formData.special_instructions
        
        // Store enhanced essay data in metadata
        bookingData.metadata = {
          ...bookingData.metadata,
          word_count: formData.word_count,
          essay_category: formData.essay_category,
          improvement_goals: formData.improvement_goals,
          essay_prompt: formData.essay_prompt
        }
      } else if (service.service_type === 'interview_prep') {
        bookingData.prompt_text = formData.preparation_focus || formData.special_instructions
        
        // Store interview data in metadata
        bookingData.metadata = {
          ...bookingData.metadata,
          interview_type: formData.interview_type,
          interview_school: formData.interview_school,
          example_questions: formData.example_questions,
          preparation_focus: formData.preparation_focus
        }
      } else if (service.service_type === 'sat_tutoring' || service.service_type === 'act_tutoring' || service.service_type === 'test_prep') {
        bookingData.prompt_text = formData.special_instructions
        
        // Store tutoring data in metadata
        bookingData.metadata = {
          ...bookingData.metadata,
          current_sat_score: formData.current_sat_score,
          current_act_score: formData.current_act_score,
          target_sat_score: formData.target_sat_score,
          target_act_score: formData.target_act_score,
          weak_areas: formData.weak_areas,
          session_preferences: formData.special_instructions
        }
      } else {
        // Generic service
        bookingData.prompt_text = formData.special_instructions
      }

      // Add any custom fields
      if (formData.custom_fields) {
        bookingData.metadata.custom_fields = formData.custom_fields
      }

      if (service.delivery_type === 'scheduled') {
        bookingData.scheduled_at = formData.scheduled_time
      }

      // Handle file uploads if needed (simplified for now)
      if (formData.uploaded_file) {
        // In a real implementation, upload to Supabase Storage first
        bookingData.uploaded_files = [{
          name: formData.uploaded_file.name,
          size: formData.uploaded_file.size,
          type: formData.uploaded_file.type
        }]
      }

      // Create the booking
      const { data, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single()

      if (bookingError) throw bookingError

      // Create user interaction record
      await supabase
        .from('user_interactions')
        .insert({
          student_id: user.id,
          consultant_id: consultantId,
          interaction_type: 'booked',
          service_type: service.service_type,
          created_at: now.toISOString()
        })

      // Create conversation for messaging
      const { data: conversation } = await supabase
        .from('conversations')
        .insert({
          student_id: user.id,
          consultant_id: consultantId,
          booking_id: data.id,
          last_message_at: now.toISOString(),
          last_message_preview: `New booking: ${service.title}`
        })
        .select()
        .single()

      if (conversation) {
        // Send initial system message
        await supabase
          .from('messages')
          .insert({
            conversation_id: conversation.id,
            sender_id: user.id,
            content: `Hi! I just booked your ${service.title} service. ${formData.special_instructions || "Looking forward to working with you!"}`,
            created_at: now.toISOString()
          })
      }

      return data
    } catch (err) {
      console.error('Error creating booking:', err)
      setError(err instanceof Error ? err.message : 'Failed to create booking')
      return null
    } finally {
      setLoading(false)
    }
  }

  const uploadFile = async (file: File, bookingId: string) => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${bookingId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('booking-files')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('booking-files')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (err) {
      console.error('Error uploading file:', err)
      throw err
    }
  }

  return { createBooking, uploadFile, loading, error }
}