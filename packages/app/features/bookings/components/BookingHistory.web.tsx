import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Calendar, Clock, DollarSign, FileText, RefreshCw, XCircle } from 'lucide-react'
import type { Booking, QuickRatingData } from '../types/bookings.types'

interface BookingHistoryWebProps {
  bookings: Booking[]
  unratedCount: number
  onSubmitRating: (bookingId: string, rating: number, reviewText?: string) => Promise<{ success: boolean; error?: string }>
}

// University colors
const UNIVERSITY_COLORS = {
  harvard: '#A51C30',
  yale: '#00356B',
  princeton: '#FF6900',
  stanford: '#8C1515',
  mit: '#A31F34',
}

export function BookingHistoryWeb({
  bookings,
  unratedCount,
  onSubmitRating,
}: BookingHistoryWebProps) {
  const router = useRouter()
  const [expandedReview, setExpandedReview] = useState<string | null>(null)
  const [ratingData, setRatingData] = useState<{ [key: string]: QuickRatingData }>({})
  const [submitting, setSubmitting] = useState<string | null>(null)

  const handleRatingChange = (bookingId: string, rating: number) => {
    setRatingData(prev => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], booking_id: bookingId, rating }
    }))
  }

  const handleReviewChange = (bookingId: string, reviewText: string) => {
    setRatingData(prev => ({
      ...prev,
      [bookingId]: { ...prev[bookingId], booking_id: bookingId, review_text: reviewText }
    }))
  }

  const handleSubmitRating = async (bookingId: string) => {
    const data = ratingData[bookingId]
    if (!data?.rating) return

    setSubmitting(bookingId)
    const result = await onSubmitRating(bookingId, data.rating, data.review_text)
    
    if (result.success) {
      setRatingData(prev => {
        const updated = { ...prev }
        delete updated[bookingId]
        return updated
      })
      setExpandedReview(null)
    } else {
      alert(result.error || 'Failed to submit rating')
    }
    
    setSubmitting(null)
  }

  const unratedBookings = bookings.filter(b => b.status === 'completed' && !b.rating)
  const ratedBookings = bookings.filter(b => b.status === 'completed' && b.rating)
  const cancelledBookings = bookings.filter(b => ['cancelled', 'refunded'].includes(b.status))

  const renderStarRating = (bookingId: string, currentRating?: number) => {
    const rating = ratingData[bookingId]?.rating || currentRating || 0
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => !currentRating && handleRatingChange(bookingId, star)}
            disabled={!!currentRating}
            className={`${
              currentRating ? 'cursor-default' : 'cursor-pointer hover:scale-110'
            } transition-transform`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-200 text-gray-200'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  const renderBookingCard = (booking: Booking) => {
    const isExpanded = expandedReview === booking.id
    const hasRating = !!booking.rating
    const currentRatingData = ratingData[booking.id]

    return (
      <div
        key={booking.id}
        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <img
              src={booking.consultant?.avatar_url || `https://ui-avatars.com/api/?name=${booking.consultant?.name || 'Consultant'}&background=6366F1&color=fff&size=200`}
              alt={booking.consultant?.name}
              className="w-12 h-12 rounded-full"
            />
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">
                  {booking.consultant?.name || 'Consultant'}
                </h3>
                {booking.consultant?.university && (
                  <span
                    className="px-2 py-1 text-xs font-semibold text-white rounded"
                    style={{ backgroundColor: UNIVERSITY_COLORS[booking.consultant.university.toLowerCase()] || '#6B7280' }}
                  >
                    {booking.consultant.university}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                {booking.service?.title || 'Service'}
              </p>
              
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(booking.scheduled_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>${booking.final_price}</span>
                </div>
                {booking.credits_earned > 0 && (
                  <div className="flex items-center space-x-1 text-green-600">
                    <RefreshCw className="w-4 h-4" />
                    <span>+${booking.credits_earned.toFixed(2)} credits</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            {booking.status === 'completed' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Completed
              </span>
            )}
            {booking.status === 'cancelled' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Cancelled
              </span>
            )}
            {booking.status === 'refunded' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Refunded
              </span>
            )}
          </div>
        </div>

        {/* Rating Section */}
        {booking.status === 'completed' && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {!hasRating && unratedCount > 0 && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-3">
                <p className="text-sm text-indigo-700">
                  <Star className="w-4 h-4 inline mr-1" />
                  Rate your experience and earn <strong>+5 credits</strong> for a detailed review!
                </p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {renderStarRating(booking.id, booking.rating)}
                {hasRating && booking.reviewed_at && (
                  <span className="text-sm text-gray-500">
                    Rated on {new Date(booking.reviewed_at).toLocaleDateString()}
                  </span>
                )}
              </div>

              {!hasRating && (
                <div className="flex items-center space-x-2">
                  {!isExpanded && currentRatingData?.rating && (
                    <button
                      onClick={() => setExpandedReview(booking.id)}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      Add review
                    </button>
                  )}
                  {currentRatingData?.rating && (
                    <button
                      onClick={() => handleSubmitRating(booking.id)}
                      disabled={submitting === booking.id}
                      className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting === booking.id ? 'Submitting...' : 'Submit Rating'}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Review Text */}
            {(isExpanded || booking.review_text) && (
              <div className="mt-3">
                {isExpanded && !hasRating ? (
                  <div>
                    <textarea
                      value={currentRatingData?.review_text || ''}
                      onChange={(e) => handleReviewChange(booking.id, e.target.value)}
                      placeholder="Share your experience (optional)..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => setExpandedReview(null)}
                        className="text-sm text-gray-600 hover:text-gray-700 mr-3"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : booking.review_text ? (
                  <p className="text-sm text-gray-600 italic">"{booking.review_text}"</p>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-3 mt-4">
          <button
            onClick={() => router.push(`/bookings/${booking.id}`)}
            className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>View Details</span>
          </button>
          
          {booking.status === 'completed' && (
            <button
              onClick={() => router.push(`/consultants/${booking.consultant_id}?rebook=true`)}
              className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Book Again</span>
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Unrated Sessions */}
      {unratedBookings.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Rate Your Recent Sessions</h2>
            <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
              {unratedBookings.length} to rate
            </span>
          </div>
          <div className="space-y-4">
            {unratedBookings.map(booking => renderBookingCard(booking))}
          </div>
        </div>
      )}

      {/* Completed Sessions */}
      {ratedBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Completed Sessions</h2>
          <div className="space-y-4">
            {ratedBookings.map(booking => renderBookingCard(booking))}
          </div>
        </div>
      )}

      {/* Cancelled/Refunded */}
      {cancelledBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Cancelled/Refunded</h2>
          <div className="space-y-4">
            {cancelledBookings.map(booking => renderBookingCard(booking))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {bookings.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No booking history yet</h3>
          <p className="text-gray-600">Your completed sessions will appear here</p>
        </div>
      )}
    </div>
  )
}