import React, { useState } from 'react'
import { View, Text, Modal, ScrollView, Pressable, TextInput, Platform, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useBookConsultant } from '../hooks/useBookConsultant'
import type { ConsultantWithServices, Service } from '../types/consultant.types'
import type { EnhancedBookingFormData } from '../types/form-builder.types'
import { ESSAY_TEMPLATE_FIELDS, INTERVIEW_TEMPLATE_FIELDS, TUTORING_TEMPLATE_FIELDS } from '../types/form-builder.types'

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
  const [formData, setFormData] = useState<Partial<EnhancedBookingFormData>>({
    special_instructions: '',
    word_count: undefined,
    improvement_goals: [],
    weak_areas: [],
  })

  const handleSubmit = async () => {
    // Validate required fields based on service type
    if (service.service_type === 'essay_review') {
      if (!formData.essay_category) {
        Alert.alert('Missing Information', 'Please select an essay category')
        return
      }
      if (!formData.essay_text && !formData.google_doc_link && !formData.uploaded_file) {
        Alert.alert('Missing Essay', 'Please provide your essay via text, file upload, or Google Doc link')
        return
      }
      if (!formData.word_count) {
        Alert.alert('Missing Information', 'Please enter the word count')
        return
      }
    }

    const bookingData: EnhancedBookingFormData = {
      service_id: service.id,
      price_tier_index: selectedTierIndex,
      is_rush: isRush,
      rush_hours: rushHours,
      submitted_at: new Date().toISOString(),
      ...formData
    }

    const result = await createBooking(consultant.id, service, bookingData as any)
    if (result) {
      onSuccess(result.id)
    }
  }

  const calculatePrice = () => {
    let basePrice = service.prices[selectedTierIndex]
    
    // Apply word count tier pricing for essays
    if (service.service_type === 'essay_review' && formData.essay_category) {
      const category = ESSAY_TEMPLATE_FIELDS.essayCategories?.options.find(
        opt => opt.value === formData.essay_category
      )
      if (category?.priceModifier) {
        basePrice = basePrice * category.priceModifier
      }
    }
    
    // Apply rush multiplier
    const rushMultiplier = isRush && rushHours && service.rush_turnarounds
      ? service.rush_turnarounds[rushHours] || 1
      : 1
      
    return basePrice * rushMultiplier
  }

  const renderEssayReviewForm = () => (
    <>
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📝 Essay Details
        </Text>
        
        <View className="space-y-4">
          {/* Essay Category */}
          <View>
            <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
              Essay Type <Text className="text-red-500">*</Text>
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
              <View className="flex-row">
                {ESSAY_TEMPLATE_FIELDS.essayCategories?.options.map((category) => (
                  <Pressable
                    key={category.value}
                    onPress={() => setFormData({ ...formData, essay_category: category.value })}
                    className={`px-4 py-3 rounded-xl mr-2 border ${
                      formData.essay_category === category.value
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Text className={`font-medium ${
                      formData.essay_category === category.value 
                        ? 'text-white' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {category.label}
                    </Text>
                    {category.priceModifier && category.priceModifier !== 1 && (
                      <Text className={`text-xs mt-1 ${
                        formData.essay_category === category.value 
                          ? 'text-blue-100' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {category.priceModifier > 1 ? '+' : ''}{((category.priceModifier - 1) * 100).toFixed(0)}% price
                      </Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Essay Prompt */}
          <View>
            <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
              Essay Prompt/Question
            </Text>
            <TextInput
              multiline
              numberOfLines={3}
              placeholder="What's the essay prompt or question you're answering?"
              placeholderTextColor="#9CA3AF"
              value={formData.essay_prompt}
              onChangeText={(text) => setFormData({ ...formData, essay_prompt: text })}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
              style={{ textAlignVertical: 'top' }}
            />
          </View>

          {/* Word Count */}
          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <Text className="text-blue-800 dark:text-blue-300 font-medium mb-2">
              Word Count <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              placeholder="Enter current word count"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={formData.word_count?.toString()}
              onChangeText={(text) => setFormData({ ...formData, word_count: parseInt(text) || undefined })}
              className="bg-white dark:bg-gray-800 p-3 rounded-lg text-gray-900 dark:text-white"
            />
            <Text className="text-blue-600 dark:text-blue-400 text-sm mt-2">
              Accurate word count helps us provide better feedback
            </Text>
          </View>

          {/* What to Improve */}
          <View>
            <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
              What would you like help with?
            </Text>
            <View className="flex-row flex-wrap">
              {ESSAY_TEMPLATE_FIELDS.improvementGoals?.options.map((goal) => (
                <Pressable
                  key={goal}
                  onPress={() => {
                    const goals = formData.improvement_goals || []
                    if (goals.includes(goal)) {
                      setFormData({ 
                        ...formData, 
                        improvement_goals: goals.filter(g => g !== goal) 
                      })
                    } else {
                      setFormData({ 
                        ...formData, 
                        improvement_goals: [...goals, goal] 
                      })
                    }
                  }}
                  className={`px-3 py-2 rounded-full mr-2 mb-2 border ${
                    formData.improvement_goals?.includes(goal)
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-600'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Text className={`text-sm ${
                    formData.improvement_goals?.includes(goal)
                      ? 'text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {goal}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Submit Essay Section */}
          <View>
            <Text className="text-gray-700 dark:text-gray-300 mb-3 font-medium">
              Submit Your Essay <Text className="text-red-500">*</Text>
            </Text>
            
            {/* Upload Options */}
            <View className="flex-row justify-between mb-3">
              <Pressable className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mr-2 items-center">
                <Ionicons name="document-attach" size={24} color="#6B7280" />
                <Text className="text-gray-700 dark:text-gray-300 mt-2">Upload File</Text>
                <Text className="text-xs text-gray-500 mt-1">.doc, .docx, .pdf</Text>
              </Pressable>
              
              <Pressable 
                onPress={() => {
                  Alert.prompt(
                    'Google Doc Link',
                    'Paste your Google Doc sharing link',
                    (text) => setFormData({ ...formData, google_doc_link: text }),
                    'plain-text',
                    formData.google_doc_link || ''
                  )
                }}
                className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl ml-2 items-center"
              >
                <Ionicons name="link" size={24} color="#6B7280" />
                <Text className="text-gray-700 dark:text-gray-300 mt-2">Google Doc</Text>
                {formData.google_doc_link && (
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" style={{ position: 'absolute', top: 8, right: 8 }} />
                )}
              </Pressable>
            </View>

            {/* Or Text Input */}
            <View>
              <Text className="text-center text-gray-500 dark:text-gray-400 my-2">— OR —</Text>
              <TextInput
                multiline
                numberOfLines={8}
                placeholder="Paste your essay text here..."
                placeholderTextColor="#9CA3AF"
                value={formData.essay_text}
                onChangeText={(text) => setFormData({ ...formData, essay_text: text })}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                style={{ textAlignVertical: 'top', minHeight: 150 }}
              />
              {formData.essay_text && (
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  {formData.essay_text.split(/\s+/).length} words
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </>
  )

  const renderInterviewPrepForm = () => {
    const [showExampleQuestions, setShowExampleQuestions] = useState(false)
    
    return (
      <>
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            🎤 Interview Preparation
          </Text>
          
          <View className="space-y-4">
            {/* Interview Type */}
            <View>
              <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                Interview Type <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row flex-wrap">
                {INTERVIEW_TEMPLATE_FIELDS.interviewTypes?.options.map((type) => (
                  <Pressable
                    key={type.value}
                    onPress={() => setFormData({ ...formData, interview_type: type.value })}
                    className={`px-4 py-3 rounded-full mr-2 mb-2 border ${
                      formData.interview_type === type.value
                        ? 'bg-blue-600 border-blue-600'
                        : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Text className={`font-medium ${
                      formData.interview_type === type.value 
                        ? 'text-white' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Interviewer Info */}
            <View>
              <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                School/Organization <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                placeholder="e.g., Harvard University, Gates Scholarship"
                placeholderTextColor="#9CA3AF"
                value={formData.interview_school}
                onChangeText={(text) => setFormData({ ...formData, interview_school: text })}
                className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
              />
            </View>

            {/* Focus Areas */}
            <View>
              <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                What would you like to practice?
              </Text>
              <TextInput
                multiline
                numberOfLines={4}
                placeholder="Tell me about your background, areas you want to improve, specific concerns..."
                placeholderTextColor="#9CA3AF"
                value={formData.preparation_focus}
                onChangeText={(text) => setFormData({ ...formData, preparation_focus: text })}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                style={{ textAlignVertical: 'top' }}
              />
            </View>

            {/* Example Questions Toggle */}
            <Pressable
              onPress={() => setShowExampleQuestions(!showExampleQuestions)}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex-row items-center justify-between"
            >
              <Text className="text-gray-700 dark:text-gray-300 font-medium">
                Add Example Questions (Optional)
              </Text>
              <Ionicons 
                name={showExampleQuestions ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#6B7280" 
              />
            </Pressable>

            {/* Example Questions Input */}
            {showExampleQuestions && (
              <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <Text className="text-blue-800 dark:text-blue-300 font-medium mb-2">
                  Questions you'd like to practice
                </Text>
                <TextInput
                  multiline
                  numberOfLines={5}
                  placeholder="Enter questions you expect or want to practice, one per line..."
                  placeholderTextColor="#9CA3AF"
                  value={formData.example_questions?.join('\n')}
                  onChangeText={(text) => setFormData({ 
                    ...formData, 
                    example_questions: text.split('\n').filter(q => q.trim()) 
                  })}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg text-gray-900 dark:text-white"
                  style={{ textAlignVertical: 'top' }}
                />
                <Text className="text-blue-600 dark:text-blue-400 text-xs mt-2">
                  This helps your consultant prepare better mock questions
                </Text>
              </View>
            )}
          </View>
        </View>
      </>
    )
  }

  const renderTutoringForm = () => (
    <>
      <View className="mb-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          📚 Test Prep Information
        </Text>
        
        <View className="space-y-4">
          {/* Current Scores */}
          <View>
            <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
              Current Test Scores
            </Text>
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">SAT Score</Text>
                <TextInput
                  placeholder="e.g., 1450"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={formData.current_sat_score?.toString()}
                  onChangeText={(text) => setFormData({ 
                    ...formData, 
                    current_sat_score: parseInt(text) || undefined 
                  })}
                  className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">ACT Score</Text>
                <TextInput
                  placeholder="e.g., 32"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={formData.current_act_score?.toString()}
                  onChangeText={(text) => setFormData({ 
                    ...formData, 
                    current_act_score: parseInt(text) || undefined 
                  })}
                  className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                />
              </View>
            </View>
          </View>

          {/* Target Scores */}
          <View>
            <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
              Target Scores <Text className="text-red-500">*</Text>
            </Text>
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">SAT Goal</Text>
                <TextInput
                  placeholder="e.g., 1550"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={formData.target_sat_score?.toString()}
                  onChangeText={(text) => setFormData({ 
                    ...formData, 
                    target_sat_score: parseInt(text) || undefined 
                  })}
                  className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">ACT Goal</Text>
                <TextInput
                  placeholder="e.g., 35"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  value={formData.target_act_score?.toString()}
                  onChangeText={(text) => setFormData({ 
                    ...formData, 
                    target_act_score: parseInt(text) || undefined 
                  })}
                  className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                />
              </View>
            </View>
          </View>

          {/* Weak Areas */}
          <View>
            <Text className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
              Areas to Focus On
            </Text>
            <View className="flex-row flex-wrap">
              {TUTORING_TEMPLATE_FIELDS.weakAreas?.options.map((area) => (
                <Pressable
                  key={area}
                  onPress={() => {
                    const areas = formData.weak_areas || []
                    if (areas.includes(area)) {
                      setFormData({ 
                        ...formData, 
                        weak_areas: areas.filter(a => a !== area) 
                      })
                    } else {
                      setFormData({ 
                        ...formData, 
                        weak_areas: [...areas, area] 
                      })
                    }
                  }}
                  className={`px-3 py-2 rounded-full mr-2 mb-2 border ${
                    formData.weak_areas?.includes(area)
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-600'
                      : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Text className={`text-sm ${
                    formData.weak_areas?.includes(area)
                      ? 'text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {area}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Session Preferences */}
          <View className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
            <Text className="text-blue-800 dark:text-blue-300 font-medium mb-2">
              Session Preferences
            </Text>
            <TextInput
              multiline
              numberOfLines={3}
              placeholder="Preferred times, frequency (e.g., 2x per week), any scheduling constraints..."
              placeholderTextColor="#9CA3AF"
              value={formData.special_instructions}
              onChangeText={(text) => setFormData({ ...formData, special_instructions: text })}
              className="bg-white dark:bg-gray-800 p-3 rounded-lg text-gray-900 dark:text-white"
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
            value={formData.special_instructions}
            onChangeText={(text) => setFormData({ ...formData, special_instructions: text })}
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
          {(service.service_type === 'sat_tutoring' || service.service_type === 'act_tutoring' || service.service_type === 'test_prep') && renderTutoringForm()}
          {service.service_type === 'application_strategy' && renderStrategyForm()}

          {/* General Instructions - Only show if not already included in service form */}
          {!['application_strategy', 'test_prep', 'sat_tutoring', 'act_tutoring'].includes(service.service_type) && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                💭 Additional Instructions
              </Text>
              <TextInput
                multiline
                numberOfLines={4}
                placeholder="Any other specific requests or information we should know?"
                placeholderTextColor="#9CA3AF"
                value={formData.special_instructions}
                onChangeText={(text) => setFormData({ ...formData, special_instructions: text })}
                className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                style={{ textAlignVertical: 'top' }}
              />
            </View>
          )}

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