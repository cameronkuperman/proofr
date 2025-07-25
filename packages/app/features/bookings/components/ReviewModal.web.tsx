'use client'

import React, { useState } from 'react'
import { X, Star, AlertCircle } from 'lucide-react'
import { useBookings } from '../hooks/useBookings'
import type { Booking } from '../types/bookings.types'

interface ReviewModalProps {
  booking: Booking
  visible: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ReviewModalWeb({ booking, visible, onClose, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { submitRating } = useBookings(booking.student_id)

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    if (!reviewText.trim()) {
      setError('Please write a review')
      return
    }

    setLoading(true)
    setError(null)

    const result = await submitRating(booking.id, rating, reviewText.trim())
    
    if (result.success) {
      onSuccess()
      onClose()
    } else {
      setError(result.error || 'Failed to submit review')
    }
    
    setLoading(false)
  }

  const ratingDescriptions = {
    1: 'Poor - Did not meet expectations',
    2: 'Fair - Below expectations',
    3: 'Good - Met expectations',
    4: 'Very Good - Exceeded expectations',
    5: 'Excellent - Far exceeded expectations'
  }

  const reviewPrompts = [
    "What did you find most helpful?",
    "How did they help you improve?",
    "Would you recommend them to other students?",
    "What specific feedback did they provide?"
  ]

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Service Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{booking.service?.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  with {booking.consultant?.name} • {booking.consultant?.current_college}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Completed on {new Date(booking.completed_at || booking.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Service Type</p>
                <p className="font-medium">{booking.service?.service_type?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Rating Selection */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">How was your experience?</h3>
            <div className="flex items-center justify-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-10 h-10 ${
                      star <= (hoveredRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {(hoveredRating || rating) > 0 && (
              <p className="text-center text-sm text-gray-600">
                {ratingDescriptions[(hoveredRating || rating) as keyof typeof ratingDescriptions]}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tell us more</h3>
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">Consider mentioning:</p>
              <ul className="text-sm text-gray-500 space-y-1">
                {reviewPrompts.map((prompt, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    {prompt}
                  </li>
                ))}
              </ul>
            </div>
            <textarea
              rows={6}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience with other students..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
            <p className="text-sm text-gray-500 mt-2 text-right">
              {reviewText.length} / 1000 characters
            </p>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Review Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Be honest and constructive in your feedback</li>
              <li>• Focus on how the consultant helped you</li>
              <li>• Avoid sharing personal information</li>
              <li>• Keep it respectful and professional</li>
            </ul>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={loading || rating === 0 || !reviewText.trim()}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                loading || rating === 0 || !reviewText.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            Your review will be visible to other students after submission
          </p>
        </div>
      </div>
    </div>
  )
}