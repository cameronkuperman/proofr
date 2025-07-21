import React, { useState } from 'react'
import { View, Text, Modal, ScrollView, Pressable, TextInput, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useBookConsultant } from '../hooks/useBookConsultant'
import type { ConsultantWithServices, Service, BookingFormData } from '../types/consultant.types'

interface BookingModalProps {
  consultant: ConsultantWithServices
  service: Service
  visible: boolean
  onClose: () => void
  onSuccess: (bookingId: string) => void
}

export function BookingModal({ consultant, service, visible, onClose, onSuccess }: BookingModalProps) {
  const { createBooking, loading, error } = useBookConsultant()
  const [selectedTierIndex, setSelectedTierIndex] = useState(0)
  const [isRush, setIsRush] = useState(false)
  const [rushHours, setRushHours] = useState<number | undefined>()
  const [formData, setFormData] = useState<Partial<BookingFormData>>({
    prompt_text: '',
    word_count: undefined,
  })

  const handleSubmit = async () => {
    const bookingData: BookingFormData = {
      service_id: service.id,
      price_tier_index: selectedTierIndex,
      is_rush: isRush,
      rush_hours: rushHours,
      prompt_text: formData.prompt_text || '',
      ...formData
    }

    const result = await createBooking(consultant.id, service, bookingData)
    if (result) {
      onSuccess(result.id)
    }
  }

  const calculatePrice = () => {
    const basePrice = service.prices[selectedTierIndex]
    const rushMultiplier = isRush && rushHours && service.rush_turnarounds
      ? service.rush_turnarounds[rushHours] || 1
      : 1
    return basePrice * rushMultiplier
  }

  const renderEssayReviewForm = () => (
    <>
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📄 Submit Your Essay
        </Text>
        
        <View className="space-y-4">
          {/* Upload Options */}
          <View className="flex-row justify-between">
            <Pressable className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mr-2 items-center">
              <Ionicons name="cloud-upload" size={24} color="#6B7280" />
              <Text className="text-gray-700 dark:text-gray-300 mt-2">Upload File</Text>
            </Pressable>
            
            <Pressable className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl ml-2 items-center">
              <Ionicons name="link" size={24} color="#6B7280" />
              <Text className="text-gray-700 dark:text-gray-300 mt-2">Google Doc</Text>
            </Pressable>
          </View>

          {/* Or Text Input */}
          <View>
            <Text className="text-center text-gray-500 dark:text-gray-400 my-2">— OR —</Text>
            <TextInput
              multiline
              numberOfLines={6}
              placeholder="Paste your essay text here..."
              placeholderTextColor="#9CA3AF"
              value={formData.essay_text}
              onChangeText={(text) => setFormData({ ...formData, essay_text: text })}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          {/* Word Count */}
          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <Text className="text-blue-800 dark:text-blue-300 font-medium mb-2">
              Essay Word Count
            </Text>
            <TextInput
              placeholder="Enter word count (e.g., 650)"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={formData.word_count?.toString()}
              onChangeText={(text) => setFormData({ ...formData, word_count: parseInt(text) || undefined })}
              className="bg-white dark:bg-gray-800 p-3 rounded-lg text-gray-900 dark:text-white"
            />
            <Text className="text-blue-600 dark:text-blue-400 text-sm mt-2">
              Please provide the word count for accurate feedback
            </Text>
          </View>
        </View>
      </View>
    </>
  )

  const renderInterviewPrepForm = () => (
    <>
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          🎯 Interview Details
        </Text>
        
        <View className="space-y-4">
          {/* Interview Type */}
          <View>
            <Text className="text-gray-700 dark:text-gray-300 mb-2">Interview Type</Text>
            <View className="flex-row flex-wrap">
              {['Alumni Interview', 'Admissions Interview', 'Scholarship Interview'].map((type) => (
                <Pressable
                  key={type}
                  onPress={() => setFormData({ ...formData, interview_type: type })}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                    formData.interview_type === type
                      ? 'bg-blue-600'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <Text className={formData.interview_type === type ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Target School */}
          <View>
            <Text className="text-gray-700 dark:text-gray-300 mb-2">Target School</Text>
            <TextInput
              placeholder="Enter your target school"
              placeholderTextColor="#9CA3AF"
              value={formData.target_school}
              onChangeText={(text) => setFormData({ ...formData, target_school: text })}
              className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
            />
          </View>

          {/* Preparation Notes */}
          <View>
            <Text className="text-gray-700 dark:text-gray-300 mb-2">What would you like to focus on?</Text>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Tell me about your background, specific questions you're worried about, etc."
              placeholderTextColor="#9CA3AF"
              value={formData.preparation_notes}
              onChangeText={(text) => setFormData({ ...formData, preparation_notes: text })}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
              style={{ textAlignVertical: 'top' }}
            />
          </View>
        </View>
      </View>
    </>
  )

  const renderStrategyForm = () => (
    <>
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📊 Tell Me About Your Goals
        </Text>
        
        <View className="space-y-4">
          <TextInput
            multiline
            numberOfLines={6}
            placeholder="What are your dream schools? What's your current situation? What are your main concerns about the application process?"
            placeholderTextColor="#9CA3AF"
            value={formData.prompt_text}
            onChangeText={(text) => setFormData({ ...formData, prompt_text: text })}
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
            style={{ textAlignVertical: 'top' }}
          />
        </View>
      </View>
    </>
  )

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white dark:bg-gray-900">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            Book {service.title}
          </Text>
          <Pressable onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color="#6B7280" />
          </Pressable>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Consultant Info */}
          <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-6">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-blue-600 rounded-full items-center justify-center mr-3">
                <Text className="text-white font-bold">
                  {consultant.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-900 dark:text-white">
                  {consultant.name}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400">
                  {consultant.current_college} • {consultant.major}
                </Text>
              </View>
            </View>
          </View>

          {/* Service Details */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              📋 Service Details
            </Text>
            <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
              <Text className="text-gray-700 dark:text-gray-300 mb-2">{service.description}</Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 dark:text-gray-400 ml-1">
                  {service.delivery_type === 'scheduled' 
                    ? `${service.duration_minutes} minute session`
                    : `${service.standard_turnaround_hours} hour delivery`
                  }
                </Text>
              </View>
            </View>
          </View>

          {/* Pricing Selection */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              💰 Select Package
            </Text>
            {service.prices.map((price, index) => (
              <Pressable
                key={index}
                onPress={() => setSelectedTierIndex(index)}
                className={`p-4 rounded-xl mb-2 border-2 ${
                  selectedTierIndex === index
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <View className={`w-5 h-5 rounded-full border-2 mr-3 ${
                      selectedTierIndex === index
                        ? 'border-blue-600 bg-blue-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedTierIndex === index && (
                        <View className="w-2 h-2 bg-white rounded-full m-auto" />
                      )}
                    </View>
                    <Text className="text-gray-900 dark:text-white font-medium">
                      {service.price_descriptions[index]}
                    </Text>
                  </View>
                  <Text className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    ${price}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Rush Delivery */}
          {service.rush_available && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                ⚡ Need it faster?
              </Text>
              <View className="flex-row flex-wrap">
                <Pressable
                  onPress={() => { setIsRush(false); setRushHours(undefined); }}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                    !isRush ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <Text className={!isRush ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>
                    Standard Delivery
                  </Text>
                </Pressable>
                {Object.entries(service.rush_turnarounds || {}).map(([hours, multiplier]) => (
                  <Pressable
                    key={hours}
                    onPress={() => { setIsRush(true); setRushHours(parseInt(hours)); }}
                    className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                      isRush && rushHours === parseInt(hours)
                        ? 'bg-orange-600'
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}
                  >
                    <Text className={
                      isRush && rushHours === parseInt(hours)
                        ? 'text-white'
                        : 'text-gray-700 dark:text-gray-300'
                    }>
                      {hours}hr (+{((multiplier - 1) * 100).toFixed(0)}%)
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Service-specific forms */}
          {service.service_type === 'essay_review' && renderEssayReviewForm()}
          {service.service_type === 'interview_prep' && renderInterviewPrepForm()}
          {service.service_type === 'application_strategy' && renderStrategyForm()}

          {/* General Instructions */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              💭 Special Instructions
            </Text>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Any specific areas to focus on? Additional context?"
              placeholderTextColor="#9CA3AF"
              value={formData.prompt_text}
              onChangeText={(text) => setFormData({ ...formData, prompt_text: text })}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          {/* Error Message */}
          {error && (
            <View className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl mb-6">
              <Text className="text-red-700 dark:text-red-300">{error}</Text>
            </View>
          )}
        </ScrollView>

        {/* Bottom Bar */}
        <View className="p-4 border-t border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-gray-600 dark:text-gray-400">Total Price</Text>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              ${calculatePrice().toFixed(2)}
            </Text>
          </View>
          
          <View className="flex-row space-x-3">
            <Pressable
              onPress={onClose}
              className="flex-1 bg-gray-100 dark:bg-gray-800 py-3 rounded-xl"
            >
              <Text className="text-center text-gray-700 dark:text-gray-300 font-semibold">
                Cancel
              </Text>
            </Pressable>
            
            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className={`flex-1 py-3 rounded-xl ${
                loading 
                  ? 'bg-gray-300 dark:bg-gray-700' 
                  : 'bg-blue-600'
              }`}
            >
              <Text className="text-center text-white font-semibold">
                {loading ? 'Processing...' : 'Book Now →'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}