'use client'

import React, { useEffect, useState } from 'react'
import { Star, MessageCircle, TrendingUp } from 'lucide-react'
import { supabase } from '../../../../../lib/supabase'
import { formatDistanceToNow } from 'date-fns'

interface Review {
  id: string
  rating: number
  review_text: string
  reviewed_at: string
  student: {
    name: string
    profile_image_url?: string
  }
  service: {
    title: string
    service_type: string
  }
}

interface ConsultantReviewsProps {
  consultantId: string
  rating: number
  totalReviews: number
}

export function ConsultantReviewsWeb({ consultantId, rating, totalReviews }: ConsultantReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'essay_review' | 'interview_prep' | 'test_prep'>('all')

  useEffect(() => {
    fetchReviews()
  }, [consultantId])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          rating,
          review_text,
          reviewed_at,
          student:students!student_id (
            name,
            profile_image_url
          ),
          service:services!service_id (
            title,
            service_type
          )
        `)
        .eq('consultant_id', consultantId)
        .not('rating', 'is', null)
        .not('review_text', 'is', null)
        .order('reviewed_at', { ascending: false })
        .limit(20)

      if (error) throw error
      
      // Transform the data to flatten the relationships
      const transformedData = data?.map(booking => ({
        id: booking.id,
        rating: booking.rating,
        review_text: booking.review_text,
        reviewed_at: booking.reviewed_at,
        student: booking.student?.[0] || { name: 'Anonymous' },
        service: booking.service?.[0] || { title: 'Service', service_type: 'other' }
      })) || []
      
      setReviews(transformedData)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++
      }
    })
    return distribution
  }

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case 'essay_review':
        return '📝'
      case 'interview_prep':
        return '🎤'
      case 'sat_tutoring':
      case 'act_tutoring':
      case 'test_prep':
        return '📚'
      case 'application_strategy':
        return '🎯'
      default:
        return '💬'
    }
  }

  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(r => {
        if (filter === 'test_prep') {
          return ['sat_tutoring', 'act_tutoring', 'test_prep'].includes(r.service.service_type)
        }
        return r.service.service_type === filter
      })

  const distribution = getRatingDistribution()

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h2>

      {/* Overall Rating */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-gray-900">{rating.toFixed(1)}</span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(rating) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-600 mt-2">Based on {totalReviews} reviews</p>
            
            {/* Top qualities */}
            {reviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700">
                  ✨ Knowledgeable
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700">
                  ⚡ Quick Response
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-gray-700">
                  💡 Helpful Feedback
                </span>
              </div>
            )}
          </div>

          {/* Rating Distribution */}
          {reviews.length > 0 && (
            <div className="flex-1 max-w-xs ml-8">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = distribution[star as keyof typeof distribution]
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                
                return (
                  <div key={star} className="flex items-center mb-2">
                    <span className="text-sm text-gray-600 w-4">{star}</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full mx-3 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            filter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All Reviews ({reviews.length})
        </button>
        <button
          onClick={() => setFilter('essay_review')}
          className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            filter === 'essay_review'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📝 Essays ({reviews.filter(r => r.service.service_type === 'essay_review').length})
        </button>
        <button
          onClick={() => setFilter('interview_prep')}
          className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            filter === 'interview_prep'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          🎤 Interviews ({reviews.filter(r => r.service.service_type === 'interview_prep').length})
        </button>
        <button
          onClick={() => setFilter('test_prep')}
          className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
            filter === 'test_prep'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📚 Test Prep ({reviews.filter(r => ['sat_tutoring', 'act_tutoring', 'test_prep'].includes(r.service.service_type)).length})
        </button>
      </div>

      {/* Individual Reviews */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            {filter === 'all' 
              ? 'No reviews yet. Be the first to review!' 
              : `No ${filter.replace('_', ' ')} reviews yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div 
              key={review.id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  {/* Student Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                    {review.student.profile_image_url ? (
                      <img 
                        src={review.student.profile_image_url}
                        alt={review.student.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      review.student.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {review.student.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{getServiceTypeIcon(review.service.service_type)}</span>
                      <span>{review.service.title}</span>
                      <span className="text-gray-400">•</span>
                      <span>{formatDistanceToNow(new Date(review.reviewed_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed">
                {review.review_text}
              </p>
              
              {/* Helpful votes (placeholder) */}
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors">
                  <TrendingUp className="w-4 h-4" />
                  Helpful
                </button>
                <span className="text-sm text-gray-400">
                  Was this review helpful?
                </span>
              </div>
            </div>
          ))}
          
          {/* Load More Button */}
          {reviews.length >= 20 && (
            <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
              Load More Reviews
            </button>
          )}
        </div>
      )}
    </div>
  )
}