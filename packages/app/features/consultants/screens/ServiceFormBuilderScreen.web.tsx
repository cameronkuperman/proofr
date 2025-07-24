import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Eye, Save, Settings, ChevronDown, ChevronUp } from 'lucide-react'
import { supabase } from '../../../../../lib/supabase'
import type { Service } from '../types/consultant.types'
import type { ServiceFormConfig, FormField } from '../types/form-builder.types'
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
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    wordCount: true,
    submission: true,
    customFields: true
  })

  useEffect(() => {
    fetchServiceAndConfig()
  }, [serviceId])

  const fetchServiceAndConfig = async () => {
    try {
      setLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/sign-in')
        return
      }

      // Fetch service details
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .eq('consultant_id', user.id)
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
      alert('Failed to load service configuration')
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

      alert('Form configuration saved successfully!')
      router.push('/consultant-dashboard/services')
    } catch (error) {
      console.error('Error saving form config:', error)
      alert('Failed to save form configuration')
    } finally {
      setSaving(false)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const renderEssayReviewConfig = () => {
    if (!formConfig?.essayReview) return null

    return (
      <div className="space-y-6">
        {/* Essay Categories */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={() => toggleSection('categories')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">Essay Categories</h3>
            {expandedSections.categories ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedSections.categories && (
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-gray-700">Enable category selection</label>
                <input
                  type="checkbox"
                  checked={formConfig.essayReview.essayCategories.enabled}
                  onChange={(e) => setFormConfig({
                    ...formConfig,
                    essayReview: {
                      ...formConfig.essayReview,
                      essayCategories: {
                        ...formConfig.essayReview.essayCategories,
                        enabled: e.target.checked
                      }
                    }
                  })}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </div>
              
              {formConfig.essayReview.essayCategories.enabled && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-3">
                    Students can select from these essay types:
                  </p>
                  {formConfig.essayReview.essayCategories.options.map((option) => (
                    <div key={option.value} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                      <span className="text-gray-700">{option.label}</span>
                      <span className="text-sm text-gray-500">
                        {option.priceModifier && option.priceModifier !== 1 
                          ? `${(option.priceModifier > 1 ? '+' : '')}${((option.priceModifier - 1) * 100).toFixed(0)}%`
                          : 'Base price'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Word Count Pricing */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={() => toggleSection('wordCount')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">Word Count Pricing</h3>
            {expandedSections.wordCount ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedSections.wordCount && (
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-gray-700">Enable tiered pricing by word count</label>
                <input
                  type="checkbox"
                  checked={formConfig.essayReview.wordCountLimits.enabled}
                  onChange={(e) => setFormConfig({
                    ...formConfig,
                    essayReview: {
                      ...formConfig.essayReview,
                      wordCountLimits: {
                        ...formConfig.essayReview.wordCountLimits,
                        enabled: e.target.checked
                      }
                    }
                  })}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </div>
              
              {formConfig.essayReview.wordCountLimits.enabled && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Price adjustments based on essay length:
                  </p>
                  {formConfig.essayReview.wordCountLimits.tiers.map((tier, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {tier.label}
                          </p>
                          <p className="text-sm text-gray-500">
                            {tier.min}-{tier.max} words
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {tier.priceModifier > 1 ? '+' : ''}{((tier.priceModifier - 1) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submission Methods */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <button
            onClick={() => toggleSection('submission')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900">Submission Methods</h3>
            {expandedSections.submission ? <ChevronUp /> : <ChevronDown />}
          </button>
          
          {expandedSections.submission && (
            <div className="px-6 pb-6 space-y-3">
              <div className="flex items-center justify-between py-2">
                <label className="text-gray-700">Text paste</label>
                <input
                  type="checkbox"
                  checked={formConfig.essayReview.submissionMethods.textPaste}
                  onChange={(e) => setFormConfig({
                    ...formConfig,
                    essayReview: {
                      ...formConfig.essayReview,
                      submissionMethods: {
                        ...formConfig.essayReview.submissionMethods,
                        textPaste: e.target.checked
                      }
                    }
                  })}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <label className="text-gray-700">File upload</label>
                <input
                  type="checkbox"
                  checked={formConfig.essayReview.submissionMethods.fileUpload}
                  onChange={(e) => setFormConfig({
                    ...formConfig,
                    essayReview: {
                      ...formConfig.essayReview,
                      submissionMethods: {
                        ...formConfig.essayReview.submissionMethods,
                        fileUpload: e.target.checked
                      }
                    }
                  })}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <label className="text-gray-700">Google Doc link</label>
                <input
                  type="checkbox"
                  checked={formConfig.essayReview.submissionMethods.googleDocLink}
                  onChange={(e) => setFormConfig({
                    ...formConfig,
                    essayReview: {
                      ...formConfig.essayReview,
                      submissionMethods: {
                        ...formConfig.essayReview.submissionMethods,
                        googleDocLink: e.target.checked
                      }
                    }
                  })}
                  className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderCustomFieldBuilder = () => (
    <div className="mt-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <button
          onClick={() => toggleSection('customFields')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900">Custom Fields</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowAddField(true)
              }}
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Add Field
            </button>
            {expandedSections.customFields ? <ChevronUp /> : <ChevronDown />}
          </div>
        </button>
        
        {expandedSections.customFields && (
          <div className="px-6 pb-6">
            {customFields.length > 0 ? (
              <div className="space-y-3">
                {customFields.map((field) => (
                  <div
                    key={field.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{field.label}</p>
                      <p className="text-sm text-gray-500">
                        Type: {field.type} {field.validation?.required && '• Required'}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const newFields = customFields.filter(f => f.id !== field.id)
                        setCustomFields(newFields)
                      }}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No custom fields added yet. Add fields to collect additional information from students.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Customize Form
                </h1>
                <p className="text-sm text-gray-600">{service?.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {}}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Form Configuration
          </h2>
          <p className="text-gray-600">
            Customize the information you collect from students when they book this service.
          </p>
        </div>

        {/* Service-specific configuration */}
        {formConfig?.formType === 'essay_review' && renderEssayReviewConfig()}
        
        {/* Custom fields section */}
        {renderCustomFieldBuilder()}
        
        {/* Preview section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Form Preview
          </h3>
          <p className="text-gray-600 mb-4">
            See how your customized form will appear to students when they book this service.
          </p>
          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors">
            Launch Form Preview →
          </button>
        </div>
      </div>
    </div>
  )
}