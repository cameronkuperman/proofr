import React from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { Service } from '../types/consultant.types'

interface ConsultantServicesProps {
  services: Service[]
  onServiceSelect: (service: Service) => void
}

export function ConsultantServices({ services, onServiceSelect }: ConsultantServicesProps) {
  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'essay_review':
        return 'document-text'
      case 'interview_prep':
        return 'mic'
      case 'application_strategy':
        return 'compass'
      case 'test_prep':
        return 'school'
      case 'extracurricular_planning':
        return 'trophy'
      default:
        return 'briefcase'
    }
  }

  const getDeliveryLabel = (deliveryType: string) => {
    switch (deliveryType) {
      case 'async':
        return 'Asynchronous'
      case 'scheduled':
        return 'Live Session'
      case 'instant':
        return 'Instant'
      default:
        return deliveryType
    }
  }

  return (
    <View className="bg-white dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-800">
      <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Services Offered
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {services.map((service) => (
          <Pressable
            key={service.id}
            onPress={() => onServiceSelect(service)}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-3 border border-gray-200 dark:border-gray-700 active:opacity-80"
          >
            <View className="flex-row items-start">
              <View className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
                <Ionicons 
                  name={getServiceIcon(service.service_type) as any} 
                  size={24} 
                  color="#3B82F6" 
                />
              </View>

              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                    {service.title}
                  </Text>
                  {service.rush_available && (
                    <View className="bg-orange-100 dark:bg-orange-900/30 px-2 py-1 rounded">
                      <Text className="text-orange-700 dark:text-orange-300 text-xs font-medium">
                        Rush Available
                      </Text>
                    </View>
                  )}
                </View>

                <Text className="text-gray-600 dark:text-gray-400 mb-3">
                  {service.description}
                </Text>

                {/* Service Details */}
                <View className="flex-row items-center mb-3">
                  <View className="flex-row items-center mr-4">
                    <Ionicons name="time-outline" size={16} color="#6B7280" />
                    <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      {service.delivery_type === 'scheduled' 
                        ? `${service.duration_minutes} min`
                        : `${service.standard_turnaround_hours}h delivery`
                      }
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <Ionicons name="laptop-outline" size={16} color="#6B7280" />
                    <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      {getDeliveryLabel(service.delivery_type)}
                    </Text>
                  </View>
                </View>

                {/* Pricing Tiers */}
                <View className="space-y-2">
                  {service.prices.map((price, index) => (
                    <View 
                      key={index}
                      className="flex-row items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg"
                    >
                      <Text className="text-gray-700 dark:text-gray-300">
                        {service.price_descriptions[index]}
                      </Text>
                      <Text className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        ${price}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Stats */}
                <View className="flex-row items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  {service.total_bookings > 0 && (
                    <View className="flex-row items-center mr-4">
                      <Ionicons name="people" size={16} color="#6B7280" />
                      <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        {service.total_bookings} bookings
                      </Text>
                    </View>
                  )}
                  {service.avg_rating && (
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={16} color="#FFC107" />
                      <Text className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        {service.avg_rating.toFixed(1)} rating
                      </Text>
                    </View>
                  )}
                </View>

                {/* Book Button */}
                <Pressable 
                  onPress={() => onServiceSelect(service)}
                  className="bg-blue-600 py-3 px-4 rounded-lg mt-4 flex-row items-center justify-center"
                >
                  <Ionicons name="calendar" size={18} color="white" />
                  <Text className="text-white font-semibold ml-2">
                    Book Now
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  )
}