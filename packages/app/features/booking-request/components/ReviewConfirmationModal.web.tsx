'use client'

import React, { useEffect, useRef } from 'react'
import type { BookingRequestFormData } from '../types/booking-request.types'

interface ReviewConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  formData: BookingRequestFormData
  consultant: any
  service: any
}

export function ReviewConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  formData,
  consultant,
  service
}: ReviewConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (isOpen) {
      // Focus the modal when it opens
      modalRef.current?.focus()
      
      // Trap focus within modal
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }
      
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])
  
  if (!isOpen) return null

  const urgencyLabels = {
    low: 'Low - Flexible timeline',
    medium: 'Medium - Within a week',
    high: 'High - Within 2-3 days',
    urgent: 'Urgent - ASAP'
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <div className="p-6">
          <h2 id="review-modal-title" className="text-2xl font-bold mb-4">Review Your Request</h2>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Consultant & Service</h3>
              <p className="text-gray-700">{consultant.name}</p>
              <p className="text-gray-600">{service.title}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Purpose of Service</h3>
              <p className="text-gray-700">{formData.purpose_of_service}</p>
            </div>

            {formData.additional_requirements && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Additional Requirements</h3>
                <p className="text-gray-700">{formData.additional_requirements}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {formData.deadline_date && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Deadline</h3>
                  <p className="text-gray-700">
                    {new Date(formData.deadline_date).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Urgency</h3>
                <p className="text-gray-700">{urgencyLabels[formData.urgency_level || 'medium']}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Materials Attached</h3>
              <div className="space-y-1">
                {formData.text_inputs.length > 0 && (
                  <p className="text-gray-700">
                    • {formData.text_inputs.length} text input{formData.text_inputs.length > 1 ? 's' : ''}
                  </p>
                )}
                {formData.file_uploads.length > 0 && (
                  <p className="text-gray-700">
                    • {formData.file_uploads.length} file{formData.file_uploads.length > 1 ? 's' : ''}
                  </p>
                )}
                {formData.doc_links.length > 0 && (
                  <p className="text-gray-700">
                    • {formData.doc_links.length} document link{formData.doc_links.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">What Happens Next?</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Your request will be sent to {consultant.name} for review</li>
                <li>The consultant may ask clarifying questions via chat</li>
                <li>Once accepted, you'll receive a price quote</li>
                <li>Payment will be collected only after consultant acceptance</li>
                <li>You have 72 hours to complete payment after acceptance</li>
              </ol>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Back to Edit
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}