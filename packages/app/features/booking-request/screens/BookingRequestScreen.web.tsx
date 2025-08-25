'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSupabase } from '../../../utils/supabase/useSupabase'
import { useCurrentUser } from '../../../utils/useCurrentUser'
import { BookingRequestForm } from '../components/BookingRequestForm.web'
import { UploadStatusPanel } from '../components/UploadStatusPanel.web'
import { ReviewConfirmationModal } from '../components/ReviewConfirmationModal.web'
import type { BookingRequestFormData } from '../types/booking-request.types'

export function BookingRequestScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useSupabase()
  const { user } = useCurrentUser()
  
  const consultantId = searchParams.get('consultant')
  const serviceId = searchParams.get('service')
  
  const [formData, setFormData] = useState<BookingRequestFormData>({
    consultant_id: consultantId || '',
    service_id: serviceId || '',
    purpose_of_service: '',
    additional_requirements: '',
    deadline_date: '',
    urgency_level: 'medium',
    text_inputs: [],
    file_uploads: [],
    doc_links: []
  })
  
  const [consultant, setConsultant] = useState<any>(null)
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [requestId, setRequestId] = useState<string | null>(null)
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})

  useEffect(() => {
    let mounted = true
    
    const loadData = async () => {
      if (consultantId && serviceId && mounted) {
        await fetchConsultantAndService()
      } else if (mounted) {
        setLoading(false)
      }
    }
    
    loadData()
    
    return () => {
      mounted = false
      // Clear any pending timeouts
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
    }
  }, [consultantId, serviceId])

  const fetchConsultantAndService = async () => {
    try {
      setLoading(true)
      
      const [consultantRes, serviceRes] = await Promise.all([
        supabase
          .from('consultants')
          .select('*, users!inner(*)')
          .eq('id', consultantId)
          .single(),
        supabase
          .from('services')
          .select('*')
          .eq('id', serviceId)
          .single()
      ])
      
      if (consultantRes.error) throw consultantRes.error
      if (serviceRes.error) throw serviceRes.error
      
      setConsultant(consultantRes.data)
      setService(serviceRes.data)
    } catch (error) {
      // Error is handled by UI state
    } finally {
      setLoading(false)
    }
  }

  const saveTimeoutRef = useRef<NodeJS.Timeout>()
  
  const handleFormChange = (updates: Partial<BookingRequestFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    
    // Debounce auto-save to prevent excessive API calls
    if (requestId || formData.purpose_of_service) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      saveTimeoutRef.current = setTimeout(() => {
        autoSaveDraft()
      }, 1000) // Save after 1 second of inactivity
    }
  }

  const autoSaveDraft = useCallback(async () => {
    if (!user?.id || saving || !formData.purpose_of_service?.trim()) return
    
    setSaving(true)
    try {
      let currentRequestId = requestId
      
      if (!currentRequestId) {
        const { data: newRequest, error } = await supabase
          .from('booking_requests')
          .insert({
            student_id: user.id,
            consultant_id: formData.consultant_id,
            service_id: formData.service_id,
            purpose_of_service: formData.purpose_of_service,
            additional_requirements: formData.additional_requirements,
            deadline_date: formData.deadline_date,
            urgency_level: formData.urgency_level,
            status: 'draft'
          })
          .select()
          .single()
        
        if (error) throw error
        currentRequestId = newRequest.id
        setRequestId(currentRequestId)
      } else {
        const { error } = await supabase
          .from('booking_requests')
          .update({
            purpose_of_service: formData.purpose_of_service,
            additional_requirements: formData.additional_requirements,
            deadline_date: formData.deadline_date,
            urgency_level: formData.urgency_level
          })
          .eq('id', currentRequestId)
        
        if (error) throw error
      }
      
      if (formData.text_inputs.length > 0) {
        await supabase
          .from('booking_text_inputs')
          .delete()
          .eq('request_id', currentRequestId)
        
        const textInputsToInsert = formData.text_inputs.map((input, idx) => ({
          request_id: currentRequestId,
          input_type: input.input_type,
          title: input.title,
          content: input.content,
          display_order: idx
        }))
        
        await supabase
          .from('booking_text_inputs')
          .insert(textInputsToInsert)
      }
      
      if (formData.doc_links.length > 0) {
        await supabase
          .from('booking_doc_links')
          .delete()
          .eq('request_id', currentRequestId)
        
        const linksToInsert = formData.doc_links.map((link, idx) => ({
          request_id: currentRequestId,
          doc_url: link.doc_url,
          doc_title: link.doc_title,
          doc_type: link.doc_type,
          description: link.description,
          display_order: idx
        }))
        
        await supabase
          .from('booking_doc_links')
          .insert(linksToInsert)
      }
    } catch (error) {
      // Silent fail for auto-save
    } finally {
      setSaving(false)
    }
  }, [user, saving, formData, requestId])

  const handleFileUpload = async (files: File[]) => {
    // Validate file sizes
    const MAX_FILE_SIZE = 250 * 1024 * 1024 // 250MB
    const oversizedFiles = files.filter(file => file.size > MAX_FILE_SIZE)
    
    if (oversizedFiles.length > 0) {
      alert(`The following files exceed 250MB limit: ${oversizedFiles.map(f => f.name).join(', ')}`)
      return
    }
    
    // Add files to the form data for display
    setFormData(prev => ({
      ...prev,
      file_uploads: [...prev.file_uploads, ...files]
    }))
    
    // Note: Actual upload will be implemented when storage is configured
    // For now, we track files locally for UI purposes
    files.forEach(file => {
      const fileId = `${Date.now()}-${file.name}`
      setUploadProgress(prev => ({ ...prev, [fileId]: 100 }))
    })
  }

  const handleSubmitForReview = () => {
    setShowReviewModal(true)
  }

  const handleConfirmSubmission = async () => {
    if (!user?.id) {
      alert('Please sign in to submit a request')
      router.push('/sign-in')
      return
    }
    
    // Ensure we have a draft saved first
    if (!requestId) {
      await autoSaveDraft()
    }
    
    if (!requestId) {
      alert('Unable to save request. Please try again.')
      return
    }
    
    try {
      const { error } = await supabase
        .from('booking_requests')
        .update({
          status: 'pending_review',
          submitted_at: new Date().toISOString()
        })
        .eq('id', requestId)
      
      if (error) throw error
      
      // Clear the timeout if it exists
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
      }
      
      router.push('/student-dashboard/requests')
    } catch (error) {
      alert('Failed to submit request. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking form...</p>
        </div>
      </div>
    )
  }

  if (!consultantId || !serviceId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Service Selected</h2>
          <p className="text-gray-600 mb-4">Please select a consultant and service to book</p>
          <button
            onClick={() => router.push('/browse')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Browse Consultants
          </button>
        </div>
      </div>
    )
  }

  if (!consultant || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Invalid consultant or service</p>
          <button
            onClick={() => router.push('/browse')}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Browse
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
          <p className="text-gray-600 mt-2">
            with {consultant.name} - {service.title}
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="xl:col-span-2 lg:col-span-1">
            <BookingRequestForm
              formData={formData}
              consultant={consultant}
              service={service}
              onChange={handleFormChange}
              onFileUpload={handleFileUpload}
              onSubmit={handleSubmitForReview}
              saving={saving}
            />
          </div>

          <div className="xl:col-span-1 lg:col-span-1">
            <UploadStatusPanel
              uploads={formData.file_uploads}
              uploadProgress={uploadProgress}
              textInputs={formData.text_inputs}
              docLinks={formData.doc_links}
            />
          </div>
        </div>
      </div>

      <ReviewConfirmationModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onConfirm={handleConfirmSubmission}
        formData={formData}
        consultant={consultant}
        service={service}
      />
    </div>
  )
}