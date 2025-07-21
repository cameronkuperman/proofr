import { useState } from 'react'
import { supabase } from '../../../../../lib/supabase'
import type { BookingFormData, Service } from '../types/consultant.types'

export function useBookConsultant() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBooking = async (
    consultantId: string, 
    service: Service, 
    formData: BookingFormData
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
        prompt_text: formData.prompt_text,
        is_rush: formData.is_rush,
        promised_delivery_at: promisedDeliveryAt.toISOString(),
        status: 'pending',
        created_at: now.toISOString(),
        updated_at: now.toISOString()
      }

      // Add service-specific fields
      if (service.service_type === 'essay_review') {
        bookingData.essay_text = formData.essay_text
        bookingData.google_doc_link = formData.google_doc_link
        // Store user-provided word count in metadata
        bookingData.metadata = { word_count: formData.word_count }
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