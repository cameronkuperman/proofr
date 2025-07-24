'use client'

import React, { useState } from 'react'
import { X, Upload, Link2, FileText, AlertCircle, ChevronRight, Check } from 'lucide-react'
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

export function BookingModalWeb({ consultant, service, visible, onClose, onSuccess }: BookingModalProps) {
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
  const [showExampleQuestions, setShowExampleQuestions] = useState(false)

  const handleSubmit = async () => {
    // Validate required fields based on service type
    if (service.service_type === 'essay_review') {
      if (!formData.essay_category) {
        alert('Please select an essay category')
        return
      }
      if (!formData.essay_text && !formData.google_doc_link && !formData.uploaded_file) {
        alert('Please provide your essay via text, file upload, or Google Doc link')
        return
      }
      if (!formData.word_count) {
        alert('Please enter the word count')
        return
      }
    }

    if (service.service_type === 'interview_prep') {
      if (!formData.interview_type) {
        alert('Please select an interview type')
        return
      }
      if (!formData.interview_school) {
        alert('Please enter the school/organization')
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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📝 Essay Details</h3>
        
        {/* Essay Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Essay Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 gap-2">
            {ESSAY_TEMPLATE_FIELDS.essayCategories?.options.map((category) => (
              <button
                key={category.value}
                onClick={() => setFormData({ ...formData, essay_category: category.value })}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  formData.essay_category === category.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{category.label}</span>
                  {category.priceModifier && category.priceModifier !== 1 && (
                    <span className="text-sm text-gray-500">
                      {category.priceModifier > 1 ? '+' : ''}{((category.priceModifier - 1) * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Essay Prompt */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Essay Prompt/Question
          </label>
          <textarea
            rows={3}
            placeholder="What's the essay prompt or question you're answering?"
            value={formData.essay_prompt || ''}
            onChange={(e) => setFormData({ ...formData, essay_prompt: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Word Count */}
        <div className="mb-4 bg-indigo-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-indigo-900 mb-2">
            Word Count <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="Enter current word count"
            value={formData.word_count || ''}
            onChange={(e) => setFormData({ ...formData, word_count: parseInt(e.target.value) || undefined })}
            className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-sm text-indigo-700 mt-2">
            Accurate word count helps us provide better feedback
          </p>
        </div>

        {/* Improvement Goals */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What would you like help with?
          </label>
          <div className="flex flex-wrap gap-2">
            {ESSAY_TEMPLATE_FIELDS.improvementGoals?.options.map((goal) => (
              <button
                key={goal}
                onClick={() => {
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
                className={`px-3 py-2 rounded-full text-sm transition-all ${
                  formData.improvement_goals?.includes(goal)
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Essay */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Submit Your Essay <span className="text-red-500">*</span>
          </label>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all">
              <Upload className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <span className="block text-sm font-medium">Upload File</span>
              <span className="block text-xs text-gray-500 mt-1">.doc, .docx, .pdf</span>
            </button>
            
            <button
              onClick={() => {
                const link = prompt('Paste your Google Doc sharing link:')
                if (link) setFormData({ ...formData, google_doc_link: link })
              }}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-all relative"
            >
              <Link2 className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <span className="block text-sm font-medium">Google Doc</span>
              {formData.google_doc_link && (
                <Check className="w-4 h-4 text-green-600 absolute top-2 right-2" />
              )}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">OR</span>
            </div>
          </div>

          <textarea
            rows={8}
            placeholder="Paste your essay text here..."
            value={formData.essay_text || ''}
            onChange={(e) => setFormData({ ...formData, essay_text: e.target.value })}
            className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {formData.essay_text && (
            <p className="text-sm text-gray-500 mt-2">
              {formData.essay_text.split(/\s+/).length} words
            </p>
          )}
        </div>
      </div>
    </div>
  )

  const renderInterviewPrepForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎤 Interview Preparation</h3>
        
        {/* Interview Type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interview Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {INTERVIEW_TEMPLATE_FIELDS.interviewTypes?.options.map((type) => (
              <button
                key={type.value}
                onClick={() => setFormData({ ...formData, interview_type: type.value })}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  formData.interview_type === type.value
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* School/Organization */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            School/Organization <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Harvard University, Gates Scholarship"
            value={formData.interview_school || ''}
            onChange={(e) => setFormData({ ...formData, interview_school: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Focus Areas */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What would you like to practice?
          </label>
          <textarea
            rows={4}
            placeholder="Tell me about your background, areas you want to improve, specific concerns..."
            value={formData.preparation_focus || ''}
            onChange={(e) => setFormData({ ...formData, preparation_focus: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Example Questions */}
        <div>
          <button
            onClick={() => setShowExampleQuestions(!showExampleQuestions)}
            className="w-full p-4 bg-gray-50 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-gray-700">Add Example Questions (Optional)</span>
            <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform ${showExampleQuestions ? 'rotate-90' : ''}`} />
          </button>
          
          {showExampleQuestions && (
            <div className="mt-3 p-4 bg-indigo-50 rounded-lg">
              <label className="block text-sm font-medium text-indigo-900 mb-2">
                Questions you'd like to practice
              </label>
              <textarea
                rows={5}
                placeholder="Enter questions you expect or want to practice, one per line..."
                value={formData.example_questions?.join('\n') || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  example_questions: e.target.value.split('\n').filter(q => q.trim()) 
                })}
                className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="text-sm text-indigo-700 mt-2">
                This helps your consultant prepare better mock questions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderTutoringForm = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Test Prep Information</h3>
        
        {/* Current Scores */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Test Scores
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">SAT Score</label>
              <input
                type="number"
                placeholder="e.g., 1450"
                value={formData.current_sat_score || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  current_sat_score: parseInt(e.target.value) || undefined 
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">ACT Score</label>
              <input
                type="number"
                placeholder="e.g., 32"
                value={formData.current_act_score || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  current_act_score: parseInt(e.target.value) || undefined 
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Target Scores */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Scores <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">SAT Goal</label>
              <input
                type="number"
                placeholder="e.g., 1550"
                value={formData.target_sat_score || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  target_sat_score: parseInt(e.target.value) || undefined 
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">ACT Goal</label>
              <input
                type="number"
                placeholder="e.g., 35"
                value={formData.target_act_score || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  target_act_score: parseInt(e.target.value) || undefined 
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Weak Areas */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Areas to Focus On
          </label>
          <div className="flex flex-wrap gap-2">
            {TUTORING_TEMPLATE_FIELDS.weakAreas?.options.map((area) => (
              <button
                key={area}
                onClick={() => {
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
                className={`px-3 py-2 rounded-full text-sm transition-all ${
                  formData.weak_areas?.includes(area)
                    ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-300'
                    : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Session Preferences */}
        <div className="bg-indigo-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-indigo-900 mb-2">
            Session Preferences
          </label>
          <textarea
            rows={3}
            placeholder="Preferred times, frequency (e.g., 2x per week), any scheduling constraints..."
            value={formData.special_instructions || ''}
            onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
            className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  )

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Book {service.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          {/* Consultant Info */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                {consultant.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{consultant.name}</p>
                <p className="text-sm text-gray-600">{consultant.current_college} • {consultant.major}</p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📋 Service Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 mb-2">{service.description}</p>
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="w-4 h-4 mr-1" />
                {service.delivery_type === 'scheduled' 
                  ? `${service.duration_minutes} minute session`
                  : `${service.standard_turnaround_hours} hour delivery`
                }
              </div>
            </div>
          </div>

          {/* Pricing Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">💰 Select Package</h3>
            <div className="space-y-2">
              {service.prices.map((price, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTierIndex(index)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedTierIndex === index
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                        selectedTierIndex === index
                          ? 'border-indigo-600 bg-indigo-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedTierIndex === index && (
                          <Check className="w-3 h-3 text-white mx-auto" />
                        )}
                      </div>
                      <span className="font-medium">{service.price_descriptions[index]}</span>
                    </div>
                    <span className="text-xl font-bold text-indigo-600">${price}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Rush Delivery */}
          {service.rush_available && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">⚡ Need it faster?</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setIsRush(false); setRushHours(undefined); }}
                  className={`px-4 py-2 rounded-full transition-all ${
                    !isRush 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Standard Delivery
                </button>
                {Object.entries(service.rush_turnarounds || {}).map(([hours, multiplier]) => (
                  <button
                    key={hours}
                    onClick={() => { setIsRush(true); setRushHours(parseInt(hours)); }}
                    className={`px-4 py-2 rounded-full transition-all ${
                      isRush && rushHours === parseInt(hours)
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {hours}hr (+{((multiplier - 1) * 100).toFixed(0)}%)
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Service-specific forms */}
          {service.service_type === 'essay_review' && renderEssayReviewForm()}
          {service.service_type === 'interview_prep' && renderInterviewPrepForm()}
          {(service.service_type === 'sat_tutoring' || service.service_type === 'act_tutoring' || service.service_type === 'test_prep') && renderTutoringForm()}

          {/* Additional Instructions */}
          {!['application_strategy', 'test_prep', 'sat_tutoring', 'act_tutoring'].includes(service.service_type) && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💭 Additional Instructions</h3>
              <textarea
                rows={4}
                placeholder="Any other specific requests or information we should know?"
                value={formData.special_instructions || ''}
                onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-start">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-600">Total Price</span>
            <span className="text-2xl font-bold text-gray-900">
              ${calculatePrice().toFixed(2)}
            </span>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                loading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Processing...' : 'Book Now →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}