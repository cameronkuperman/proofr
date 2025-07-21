import React from 'react'
import { View, Text, Image, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { ConsultantWithServices } from '../types/consultant.types'

interface ConsultantProfileHeaderProps {
  consultant: ConsultantWithServices
}

export function ConsultantProfileHeader({ consultant }: ConsultantProfileHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  const universityColors: Record<string, string> = {
    'Stanford University': '#8C1515',
    'Harvard University': '#A51C30',
    'MIT': '#A31F34',
    'Yale University': '#00356B',
    'Princeton University': '#FF6600',
    'Columbia University': '#003DA5',
  }

  const universityColor = universityColors[consultant.current_college] || '#666666'

  return (
    <View className="bg-white dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-800">
      <View className="flex-row items-start">
        {/* Profile Image */}
        <View className="mr-4">
          {consultant.user?.profile_image_url ? (
            <Image
              source={{ uri: consultant.user.profile_image_url }}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <View 
              className="w-24 h-24 rounded-full items-center justify-center"
              style={{ backgroundColor: universityColor }}
            >
              <Text className="text-white text-2xl font-bold">
                {getInitials(consultant.name)}
              </Text>
            </View>
          )}
          {consultant.is_available && !consultant.vacation_mode && (
            <View className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
          )}
        </View>

        {/* Info */}
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {consultant.name}
            </Text>
            {consultant.verification_status === 'approved' && (
              <View className="ml-2">
                <Ionicons name="checkmark-circle" size={20} color="#4ADE80" />
              </View>
            )}
          </View>

          <Text className="text-lg text-gray-600 dark:text-gray-400 mt-1">
            {consultant.current_college} • {consultant.major}
          </Text>

          <Text className="text-gray-500 dark:text-gray-500 mt-1">
            Class of {consultant.graduation_year}
          </Text>

          {/* Rating and Reviews */}
          <View className="flex-row items-center mt-3">
            <View className="flex-row items-center">
              <Ionicons name="star" size={16} color="#FFC107" />
              <Text className="ml-1 font-semibold text-gray-900 dark:text-white">
                {consultant.rating?.toFixed(1) || '0.0'}
              </Text>
            </View>
            <Text className="text-gray-500 dark:text-gray-400 ml-2">
              ({consultant.total_reviews || 0} reviews)
            </Text>
            <Text className="text-gray-400 dark:text-gray-600 mx-2">•</Text>
            <Text className="text-gray-900 dark:text-white font-medium">
              {consultant.total_bookings || 0} sessions
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row mt-6 space-x-3">
        <Pressable className="flex-1 bg-blue-600 py-3 px-6 rounded-xl flex-row items-center justify-center">
          <Ionicons name="calendar" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Book Session</Text>
        </Pressable>
        <Pressable className="bg-gray-100 dark:bg-gray-800 py-3 px-6 rounded-xl flex-row items-center justify-center">
          <Ionicons name="chatbubble-ellipses" size={20} color="#6B7280" />
          <Text className="text-gray-700 dark:text-gray-300 font-semibold ml-2">Message</Text>
        </Pressable>
      </View>
    </View>
  )
}