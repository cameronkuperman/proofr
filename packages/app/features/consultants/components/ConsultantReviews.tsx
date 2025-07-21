import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../../../../lib/supabase'

interface Review {
  id: string
  rating: number
  review_text: string
  created_at: string
  student: {
    name: string
  }
  service: {
    title: string
  }
}

interface ConsultantReviewsProps {
  consultantId: string
  rating: number
  totalReviews: number
}

export function ConsultantReviews({ consultantId, rating, totalReviews }: ConsultantReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

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
          created_at,
          student:students (name),
          service:services (title)
        `)
        .eq('consultant_id', consultantId)
        .not('rating', 'is', null)
        .not('review_text', 'is', null)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setReviews(data || [])
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

  return (
    <View className="bg-white dark:bg-gray-900 p-6">
      <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Reviews & Ratings
      </Text>

      {/* Overall Rating */}
      <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">
              {rating.toFixed(1)}
            </Text>
            <View className="flex-row items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.round(rating) ? 'star' : 'star-outline'}
                  size={16}
                  color="#FFC107"
                />
              ))}
            </View>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Based on {totalReviews} reviews
            </Text>
          </View>

          {/* Rating Distribution */}
          {reviews.length > 0 && (
            <View className="flex-1 ml-8">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = getRatingDistribution()[star as keyof ReturnType<typeof getRatingDistribution>]
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                
                return (
                  <View key={star} className="flex-row items-center mb-1">
                    <Text className="text-sm text-gray-600 dark:text-gray-400 w-4">
                      {star}
                    </Text>
                    <View className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-2 overflow-hidden">
                      <View 
                        className="h-full bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      />
                    </View>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">
                      {count}
                    </Text>
                  </View>
                )
              })}
            </View>
          )}
        </View>
      </View>

      {/* Individual Reviews */}
      {loading ? (
        <Text className="text-gray-600 dark:text-gray-400">Loading reviews...</Text>
      ) : reviews.length === 0 ? (
        <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center">
          <Ionicons name="chatbubble-outline" size={48} color="#6B7280" />
          <Text className="text-gray-600 dark:text-gray-400 mt-4">
            No reviews yet. Be the first to review!
          </Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {reviews.map((review) => (
            <View 
              key={review.id}
              className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-4 last:border-0"
            >
              <View className="flex-row items-start justify-between mb-2">
                <View>
                  <Text className="font-semibold text-gray-900 dark:text-white">
                    {review.student?.name || 'Anonymous'}
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {review.service?.title}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Ionicons
                      key={star}
                      name={star <= review.rating ? 'star' : 'star-outline'}
                      size={14}
                      color="#FFC107"
                    />
                  ))}
                </View>
              </View>
              
              <Text className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {review.review_text}
              </Text>
              
              <Text className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                {new Date(review.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  )
}