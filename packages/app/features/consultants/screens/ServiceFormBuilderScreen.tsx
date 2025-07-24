import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView, Pressable, TextInput, Switch, ActivityIndicator, Alert } from 'react-native'
import { useRouter } from 'next/router'
import { Ionicons } from '@expo/vector-icons'
import { supabase } from '../../../../../lib/supabase'
import type { Service } from '../types/consultant.types'
import type { ServiceFormConfig, FormField, FieldType } from '../types/form-builder.types'
import { ESSAY_TEMPLATE_FIELDS, INTERVIEW_TEMPLATE_FIELDS, TUTORING_TEMPLATE_FIELDS } from '../types/form-builder.types'

interface ServiceFormBuilderScreenProps {
  serviceId: string
}

export function ServiceFormBuilderScreen({ serviceId }: ServiceFormBuilderScreenProps) {
  const router = useRouter()
  const [service, setService] = useState<Service | null>(null)
  const [formConfig, setFormConfig] = useState<ServiceFormConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [customFields, setCustomFields] = useState<FormField[]>([])
  const [showAddField, setShowAddField] = useState(false)

  useEffect(() => {
    fetchServiceAndConfig()
  }, [serviceId])

  const fetchServiceAndConfig = async () => {
    try {
      setLoading(true)
      
      // Fetch service details
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single()
      
      if (serviceError) throw serviceError
      setService(serviceData)

      // Check if there's existing config in metadata
      if (serviceData.metadata?.form_config) {
        setFormConfig(serviceData.metadata.form_config)
        setCustomFields(serviceData.metadata.form_config.customForm?.fields || [])
      } else {
        // Initialize with default config based on service type
        const defaultConfig = getDefaultConfig(serviceData.service_type)
        setFormConfig(defaultConfig)
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      Alert.alert('Error', 'Failed to load service configuration')
    } finally {
      setLoading(false)
    }
  }

  const getDefaultConfig = (serviceType: string): ServiceFormConfig => {
    switch (serviceType) {
      case 'essay_review':
        return {
          formType: 'essay_review',
          essayReview: {
            essayCategories: ESSAY_TEMPLATE_FIELDS.essayCategories!,
            wordCountLimits: {
              enabled: true,
              tiers: [
                { min: 0, max: 250, label: 'Short Essay', priceModifier: 0.8 },
                { min: 251, max: 500, label: 'Medium Essay', priceModifier: 1.0 },
                { min: 501, max: 650, label: 'Full Essay', priceModifier: 1.2 },
                { min: 651, max: 1000, label: 'Long Essay', priceModifier: 1.5 }
              ]
            },
            promptField: { enabled: true, required: false },
            improvementGoals: ESSAY_TEMPLATE_FIELDS.improvementGoals!,
            submissionMethods: {
              textPaste: true,
              fileUpload: true,
              googleDocLink: true
            },
            customFields: []
          }
        }
      case 'interview_prep':
        return {
          formType: 'interview_prep',
          interviewPrep: {
            interviewTypes: INTERVIEW_TEMPLATE_FIELDS.interviewTypes!,
            exampleQuestions: { enabled: true, required: false, maxQuestions: 10 },
            schoolField: { enabled: true, required: true },
            customFields: []
          }
        }
      case 'sat_tutoring':
      case 'act_tutoring':
      case 'test_prep':
        return {
          formType: 'tutoring',
          tutoring: {
            currentScores: { enabled: true, required: false, scoreType: 'both' },
            targetScores: { enabled: true, required: true },
            weakAreas: TUTORING_TEMPLATE_FIELDS.weakAreas!,
            sessionPreferences: { enabled: true, timeSlots: true, frequency: true },
            customFields: []
          }
        }
      default:
        return {
          formType: 'custom',
          customForm: { fields: [] }
        }
    }
  }

  const handleSave = async () => {
    if (!service || !formConfig) return

    try {
      setSaving(true)
      
      // Update the service metadata with form config
      const { error } = await supabase
        .from('services')
        .update({
          metadata: {
            ...service.metadata,
            form_config: formConfig
          }
        })
        .eq('id', serviceId)

      if (error) throw error

      Alert.alert('Success', 'Form configuration saved successfully')
      router.back()
    } catch (error) {
      console.error('Error saving form config:', error)
      Alert.alert('Error', 'Failed to save form configuration')
    } finally {
      setSaving(false)
    }
  }

  const addCustomField = (field: FormField) => {
    const newFields = [...customFields, field]
    setCustomFields(newFields)
    
    // Update the form config with new custom fields
    if (formConfig?.essayReview) {
      setFormConfig({
        ...formConfig,
        essayReview: {
          ...formConfig.essayReview,
          customFields: newFields
        }
      })
    } else if (formConfig?.interviewPrep) {
      setFormConfig({
        ...formConfig,
        interviewPrep: {
          ...formConfig.interviewPrep,
          customFields: newFields
        }
      })
    } else if (formConfig?.tutoring) {
      setFormConfig({
        ...formConfig,
        tutoring: {
          ...formConfig.tutoring,
          customFields: newFields
        }
      })
    }
    
    setShowAddField(false)
  }

  const removeCustomField = (fieldId: string) => {
    const newFields = customFields.filter(f => f.id !== fieldId)
    setCustomFields(newFields)
    
    // Update form config
    if (formConfig?.essayReview) {
      setFormConfig({
        ...formConfig,
        essayReview: {
          ...formConfig.essayReview,
          customFields: newFields
        }
      })
    }
  }

  const renderEssayReviewConfig = () => {
    if (!formConfig?.essayReview) return null

    return (
      <View className="space-y-6">
        <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Essay Categories
          </Text>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-700 dark:text-gray-300">Enable category selection</Text>
            <Switch
              value={formConfig.essayReview.essayCategories.enabled}
              onValueChange={(value) => setFormConfig({
                ...formConfig,
                essayReview: {
                  ...formConfig.essayReview,
                  essayCategories: {
                    ...formConfig.essayReview.essayCategories,
                    enabled: value
                  }
                }
              })}
            />
          </View>
          {formConfig.essayReview.essayCategories.enabled && (
            <View>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Students can select from these essay types:
              </Text>
              {formConfig.essayReview.essayCategories.options.map((option, index) => (
                <View key={option.value} className="flex-row items-center justify-between py-2">
                  <Text className="text-gray-700 dark:text-gray-300">{option.label}</Text>
                  <Text className="text-sm text-gray-500">
                    {option.priceModifier && option.priceModifier !== 1 
                      ? `${(option.priceModifier > 1 ? '+' : '')}${((option.priceModifier - 1) * 100).toFixed(0)}%`
                      : 'Base price'
                    }
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Word Count Pricing
          </Text>
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-700 dark:text-gray-300">Enable tiered pricing by word count</Text>
            <Switch
              value={formConfig.essayReview.wordCountLimits.enabled}
              onValueChange={(value) => setFormConfig({
                ...formConfig,
                essayReview: {
                  ...formConfig.essayReview,
                  wordCountLimits: {
                    ...formConfig.essayReview.wordCountLimits,
                    enabled: value
                  }
                }
              })}
            />
          </View>
          {formConfig.essayReview.wordCountLimits.enabled && (
            <View>
              <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Price adjustments based on essay length:
              </Text>
              {formConfig.essayReview.wordCountLimits.tiers.map((tier, index) => (
                <View key={index} className="bg-white dark:bg-gray-700 p-3 rounded-lg mb-2">
                  <Text className="text-gray-900 dark:text-white font-medium">
                    {tier.label} ({tier.min}-{tier.max} words)
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {tier.priceModifier > 1 ? '+' : ''}{((tier.priceModifier - 1) * 100).toFixed(0)}% price adjustment
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Submission Methods
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700 dark:text-gray-300">Text paste</Text>
              <Switch
                value={formConfig.essayReview.submissionMethods.textPaste}
                onValueChange={(value) => setFormConfig({
                  ...formConfig,
                  essayReview: {
                    ...formConfig.essayReview,
                    submissionMethods: {
                      ...formConfig.essayReview.submissionMethods,
                      textPaste: value
                    }
                  }
                })}
              />
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700 dark:text-gray-300">File upload</Text>
              <Switch
                value={formConfig.essayReview.submissionMethods.fileUpload}
                onValueChange={(value) => setFormConfig({
                  ...formConfig,
                  essayReview: {
                    ...formConfig.essayReview,
                    submissionMethods: {
                      ...formConfig.essayReview.submissionMethods,
                      fileUpload: value
                    }
                  }
                })}
              />
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-700 dark:text-gray-300">Google Doc link</Text>
              <Switch
                value={formConfig.essayReview.submissionMethods.googleDocLink}
                onValueChange={(value) => setFormConfig({
                  ...formConfig,
                  essayReview: {
                    ...formConfig.essayReview,
                    submissionMethods: {
                      ...formConfig.essayReview.submissionMethods,
                      googleDocLink: value
                    }
                  }
                })}
              />
            </View>
          </View>
        </View>
      </View>
    )
  }

  const renderCustomFieldBuilder = () => (
    <View className="mt-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          Custom Fields
        </Text>
        <Pressable
          onPress={() => setShowAddField(true)}
          className="bg-blue-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">Add Field</Text>
        </Pressable>
      </View>
      
      {customFields.length > 0 ? (
        <View className="space-y-3">
          {customFields.map((field) => (
            <View
              key={field.id}
              className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex-row items-center justify-between"
            >
              <View className="flex-1">
                <Text className="font-medium text-gray-900 dark:text-white">
                  {field.label}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Type: {field.type} {field.validation?.required && '(Required)'}
                </Text>
              </View>
              <Pressable
                onPress={() => removeCustomField(field.id)}
                className="p-2"
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </Pressable>
            </View>
          ))}
        </View>
      ) : (
        <View className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl items-center">
          <Text className="text-gray-500 dark:text-gray-400 text-center">
            No custom fields added yet. Add fields to collect additional information from students.
          </Text>
        </View>
      )}
    </View>
  )

  if (loading) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" />
        <Text className="text-gray-600 dark:text-gray-400 mt-4">Loading form builder...</Text>
      </View>
    )
  }

  if (!service || !formConfig) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900 items-center justify-center">
        <Text className="text-gray-600 dark:text-gray-400">Service not found</Text>
      </View>
    )
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#6B7280" />
          </Pressable>
          <View>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Customize Form
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              {service.title}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={handleSave}
          disabled={saving}
          className={`px-4 py-2 rounded-lg ${
            saving ? 'bg-gray-300' : 'bg-blue-600'
          }`}
        >
          <Text className="text-white font-medium">
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Service-specific configuration */}
        {formConfig.formType === 'essay_review' && renderEssayReviewConfig()}
        
        {/* Custom fields section */}
        {renderCustomFieldBuilder()}
        
        {/* Preview section */}
        <View className="mt-8 mb-20">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Form Preview
          </Text>
          <View className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
            <Text className="text-center text-gray-500 dark:text-gray-400">
              Preview of how your form will appear to students
            </Text>
            <Pressable className="mt-4 bg-blue-600 py-3 rounded-lg">
              <Text className="text-white text-center font-medium">
                Preview Form →
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}