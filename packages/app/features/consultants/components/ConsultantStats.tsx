import React from 'react'
import { View, Text } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { ConsultantWithServices, ConsultantStats as StatsType } from '../types/consultant.types'

interface ConsultantStatsProps {
  consultant: ConsultantWithServices
  stats: StatsType
}

export function ConsultantStats({ consultant, stats }: ConsultantStatsProps) {
  return (
    <View className="bg-gray-50 dark:bg-gray-800/50 p-4">
      {/* Live Activity Badge */}
      <View className="flex-row items-center justify-center mb-4">
        <View className="bg-red-100 dark:bg-red-900/30 px-3 py-1 rounded-full flex-row items-center">
          <View className="w-2 h-2 bg-red-500 rounded-full mr-2" />
          <Text className="text-red-700 dark:text-red-300 text-sm font-medium">
            🔥 {stats.views_today} students viewed this profile today
          </Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View className="flex-row flex-wrap -mx-2">
        {/* Response Time */}
        <View className="w-1/2 px-2 mb-4">
          <View className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center mb-2">
              <Ionicons name="time" size={20} color="#6B7280" />
              <Text className="text-gray-600 dark:text-gray-400 ml-2 text-sm">
                Response Time
              </Text>
            </View>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.response_time_display}
            </Text>
          </View>
        </View>

        {/* Member Since */}
        <View className="w-1/2 px-2 mb-4">
          <View className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center mb-2">
              <Ionicons name="shield-checkmark" size={20} color="#6B7280" />
              <Text className="text-gray-600 dark:text-gray-400 ml-2 text-sm">
                Member Since
              </Text>
            </View>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.member_since_display}
            </Text>
          </View>
        </View>

        {/* Availability */}
        <View className="w-1/2 px-2">
          <View className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center mb-2">
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              <Text className="text-gray-600 dark:text-gray-400 ml-2 text-sm">
                This Week
              </Text>
            </View>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.spots_remaining_week} spots left
            </Text>
          </View>
        </View>

        {/* Last Booking */}
        <View className="w-1/2 px-2">
          <View className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center mb-2">
              <Ionicons name="checkmark-circle" size={20} color="#6B7280" />
              <Text className="text-gray-600 dark:text-gray-400 ml-2 text-sm">
                Last Booking
              </Text>
            </View>
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              {stats.last_booking_time ? getTimeAgo(stats.last_booking_time) : 'Recently'}
            </Text>
          </View>
        </View>
      </View>

      {/* Success Counter */}
      {consultant.total_bookings > 10 && (
        <View className="mt-4 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
          <Text className="text-green-800 dark:text-green-300 text-center font-medium">
            🎉 Helped {consultant.total_bookings} students get into their dream schools
          </Text>
        </View>
      )}
    </View>
  )
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = diffInMs / (1000 * 60 * 60)
  
  if (diffInHours < 1) return 'Just now'
  if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
  if (diffInHours < 48) return 'Yesterday'
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
  return `${Math.floor(diffInHours / 168)}w ago`
}