"use client"

import { useState, useEffect } from 'react'
import MessagingModal from '../../../components/MessagingModal'

// Mock data that mirrors Supabase structure
const mockConsultantProfile = {
  id: 'consultant-123',
  name: 'John Doe',
  email: 'john.doe@harvard.edu',
  university: 'Harvard University',
  major: 'Economics',
  graduation_year: 2024,
  profile_photo: null,
  bio: "Harvard Economics major with a passion for helping students achieve their college dreams. I've helped over 50 students gain admission to top-tier universities through personalized essay reviews and strategic application guidance.",
  years_experience: 3,
  total_students_helped: 47,
  acceptance_rate: 87,
  avg_rating: 4.9,
  total_reviews: 73,
  verified_status: 'pending',
  profile_strength: 82,
  created_at: '2023-01-15',
  last_updated: '2024-01-10'
}

const mockServices = [
  {
    id: 'service-1',
    name: 'Essay Review',
    description: '48-hour turnaround with detailed feedback',
    price: 75,
    delivery_time: '48 hours',
    is_active: true,
    orders_completed: 156,
    avg_rating: 4.9
  },
  {
    id: 'service-2', 
    name: 'College Counseling Session',
    description: 'Comprehensive 1-hour strategy session',
    price: 120,
    delivery_time: 'Scheduled',
    is_active: true,
    orders_completed: 89,
    avg_rating: 5.0
  },
  {
    id: 'service-3',
    name: 'Interview Prep',
    description: 'Mock interview with personalized feedback',
    price: 80,
    delivery_time: 'Scheduled',
    is_active: false,
    orders_completed: 34,
    avg_rating: 4.8
  }
]

const mockSuccessStories = [
  {
    id: 'story-1',
    student_initials: 'S.M.',
    admitted_to: ['Harvard', 'Yale', 'Princeton'],
    year: 2023,
    testimonial: "John's guidance was invaluable. His essay feedback helped me craft a compelling narrative that stood out.",
    is_featured: true
  },
  {
    id: 'story-2',
    student_initials: 'A.K.',
    admitted_to: ['Stanford', 'MIT'],
    year: 2023,
    testimonial: "The strategic advice on school selection and application timing made all the difference.",
    is_featured: false
  }
]

const mockAvailability = {
  timezone: 'America/New_York',
  general_availability: {
    monday: { available: true, start: '17:00', end: '21:00' },
    tuesday: { available: true, start: '17:00', end: '21:00' },
    wednesday: { available: false, start: '09:00', end: '17:00' },
    thursday: { available: true, start: '17:00', end: '21:00' },
    friday: { available: true, start: '15:00', end: '20:00' },
    saturday: { available: true, start: '10:00', end: '18:00' },
    sunday: { available: true, start: '12:00', end: '18:00' }
  },
  blocked_dates: ['2024-03-15', '2024-03-16', '2024-03-22'],
  advance_booking_days: 7,
  min_session_gap_minutes: 30
}

export default function ProfileStudio() {
  const [activeTab, setActiveTab] = useState('overview')
  const [profile, setProfile] = useState(mockConsultantProfile)
  const [services, setServices] = useState(mockServices)
  const [successStories, setSuccessStories] = useState(mockSuccessStories)
  const [availability, setAvailability] = useState(mockAvailability)
  const [isEditing, setIsEditing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // SUPABASE TODO: Replace with real data fetching
  // useEffect(() => {
  //   const fetchProfileData = async () => {
  //     const { data: profileData } = await supabase
  //       .from('consultant_profiles')
  //       .select('*')
  //       .eq('id', currentUserId)
  //       .single()
  //     
  //     const { data: servicesData } = await supabase
  //       .from('consultant_services')
  //       .select('*')
  //       .eq('consultant_id', currentUserId)
  //     
  //     const { data: storiesData } = await supabase
  //       .from('success_stories')
  //       .select('*')
  //       .eq('consultant_id', currentUserId)
  //     
  //     if (profileData) setProfile(profileData)
  //     if (servicesData) setServices(servicesData)
  //     if (storiesData) setSuccessStories(storiesData)
  //   }
  //   fetchProfileData()
  // }, [currentUserId])

  const calculateProfileStrength = () => {
    let strength = 0
    if (profile.profile_photo) strength += 15
    if (profile.bio && profile.bio.length > 100) strength += 20
    if (services.filter(s => s.is_active).length >= 2) strength += 20
    if (successStories.length >= 2) strength += 25
    if (profile.verified_status === 'verified') strength += 20
    return strength
  }

  const getProfileStrengthColor = (strength: number) => {
    if (strength >= 80) return 'from-green-500 to-emerald-500'
    if (strength >= 60) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  const getProfileStrengthMessage = (strength: number) => {
    if (strength >= 80) return 'Excellent! Your profile is optimized for success.'
    if (strength >= 60) return 'Good progress! Add more details to attract more students.'
    return 'Your profile needs work. Complete all sections for better visibility.'
  }

  const handleSaveChanges = async () => {
    // SUPABASE TODO: Save changes to database
    // await supabase.from('consultant_profiles').update(profile).eq('id', currentUserId)
    // await Promise.all(services.map(service => 
    //   supabase.from('consultant_services').upsert(service)
    // ))
    setHasUnsavedChanges(false)
    setIsEditing(false)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profile', label: 'Profile Details', icon: '👤' },
    { id: 'services', label: 'Services & Pricing', icon: '💼' },
    { id: 'success', label: 'Success Stories', icon: '🏆' },
    { id: 'availability', label: 'Availability', icon: '📅' },
    { id: 'verification', label: 'Verification', icon: '✓' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Profile Studio
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your consultant profile and attract more students
              </p>
            </div>
            <div className="flex items-center gap-4">
              {hasUnsavedChanges && (
                <span className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                  • Unsaved changes
                </span>
              )}
              <button
                onClick={() => setShowPreview(true)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Preview Profile
              </button>
              <button
                onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  isEditing 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
                }`}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Strength Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Profile Strength
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {calculateProfileStrength()}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${getProfileStrengthColor(calculateProfileStrength())} transition-all duration-500`}
              style={{ width: `${calculateProfileStrength()}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {getProfileStrengthMessage(calculateProfileStrength())}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="flex space-x-1 mb-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            {activeTab === 'overview' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Profile Overview
                </h2>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200/20 dark:border-blue-700/20">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile.total_students_helped}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Students Helped</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200/20 dark:border-green-700/20">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile.acceptance_rate}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Success Rate</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-yellow-200/20 dark:border-yellow-700/20">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">⭐ {profile.avg_rating}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Average Rating</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-purple-200/20 dark:border-purple-700/20">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{profile.total_reviews}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Reviews</p>
                  </div>
                </div>

                {/* Profile Completion Checklist */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Profile Completion Checklist
                  </h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={!!profile.profile_photo} 
                        readOnly 
                        className="mr-3 h-4 w-4 text-blue-600 rounded"
                      />
                      <span className={profile.profile_photo ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                        Add a professional profile photo
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={profile.bio && profile.bio.length > 100} 
                        readOnly 
                        className="mr-3 h-4 w-4 text-blue-600 rounded"
                      />
                      <span className={profile.bio && profile.bio.length > 100 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                        Write a compelling bio (100+ characters)
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={services.filter(s => s.is_active).length >= 2} 
                        readOnly 
                        className="mr-3 h-4 w-4 text-blue-600 rounded"
                      />
                      <span className={services.filter(s => s.is_active).length >= 2 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                        List at least 2 active services
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={successStories.length >= 2} 
                        readOnly 
                        className="mr-3 h-4 w-4 text-blue-600 rounded"
                      />
                      <span className={successStories.length >= 2 ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                        Add at least 2 success stories
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={profile.verified_status === 'verified'} 
                        readOnly 
                        className="mr-3 h-4 w-4 text-blue-600 rounded"
                      />
                      <span className={profile.verified_status === 'verified' ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
                        Complete identity verification
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Profile Details
                </h2>
                
                <div className="space-y-6">
                  {/* Profile Photo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Profile Photo
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                        {profile.name.charAt(0)}
                      </div>
                      <button 
                        disabled={!isEditing}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Upload Photo
                      </button>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => {
                        setProfile({ ...profile, bio: e.target.value })
                        setHasUnsavedChanges(true)
                      }}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                      placeholder="Tell students about your experience and what makes you a great consultant..."
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {profile.bio.length}/500 characters
                    </p>
                  </div>

                  {/* University Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        University
                      </label>
                      <input
                        type="text"
                        value={profile.university}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Major
                      </label>
                      <input
                        type="text"
                        value={profile.major}
                        onChange={(e) => {
                          setProfile({ ...profile, major: e.target.value })
                          setHasUnsavedChanges(true)
                        }}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Services & Pricing
                  </h2>
                  <button 
                    disabled={!isEditing}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Service
                  </button>
                </div>

                <div className="space-y-4">
                  {services.map((service) => (
                    <div 
                      key={service.id} 
                      className={`border rounded-lg p-6 transition-all ${
                        service.is_active 
                          ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800' 
                          : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {service.name}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              service.is_active 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}>
                              {service.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {service.description}
                          </p>
                          <div className="flex items-center gap-6 text-sm">
                            <span className="font-semibold text-gray-900 dark:text-white">
                              ${service.price}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {service.delivery_time}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              {service.orders_completed} completed
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              ⭐ {service.avg_rating}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            disabled={!isEditing}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
                          >
                            ✏️
                          </button>
                          <button 
                            disabled={!isEditing}
                            onClick={() => {
                              setServices(services.map(s => 
                                s.id === service.id ? { ...s, is_active: !s.is_active } : s
                              ))
                              setHasUnsavedChanges(true)
                            }}
                            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
                          >
                            {service.is_active ? '⏸️' : '▶️'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'success' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Success Stories
                  </h2>
                  <button 
                    disabled={!isEditing}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Story
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {successStories.map((story) => (
                    <div 
                      key={story.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Student {story.student_initials}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Class of {story.year}
                          </p>
                        </div>
                        {story.is_featured && (
                          <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Admitted to:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {story.admitted_to.map((school) => (
                            <span 
                              key={school}
                              className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs rounded-full"
                            >
                              {school}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-400 italic">
                        &ldquo;{story.testimonial}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Availability Settings
                </h2>
                
                <div className="space-y-6">
                  {/* Weekly Schedule */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Weekly Schedule
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(availability.general_availability).map(([day, schedule]) => (
                        <div key={day} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-white capitalize">
                            {day}
                          </span>
                          <div className="flex items-center gap-4">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={schedule.available}
                                onChange={(e) => {
                                  setAvailability({
                                    ...availability,
                                    general_availability: {
                                      ...availability.general_availability,
                                      [day]: { ...schedule, available: e.target.checked }
                                    }
                                  })
                                  setHasUnsavedChanges(true)
                                }}
                                disabled={!isEditing}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                            </label>
                            {schedule.available && (
                              <div className="flex items-center gap-2 text-sm">
                                <input
                                  type="time"
                                  value={schedule.start}
                                  onChange={(e) => {
                                    setAvailability({
                                      ...availability,
                                      general_availability: {
                                        ...availability.general_availability,
                                        [day]: { ...schedule, start: e.target.value }
                                      }
                                    })
                                    setHasUnsavedChanges(true)
                                  }}
                                  disabled={!isEditing}
                                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                  type="time"
                                  value={schedule.end}
                                  onChange={(e) => {
                                    setAvailability({
                                      ...availability,
                                      general_availability: {
                                        ...availability.general_availability,
                                        [day]: { ...schedule, end: e.target.value }
                                      }
                                    })
                                    setHasUnsavedChanges(true)
                                  }}
                                  disabled={!isEditing}
                                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking Settings */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Booking Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Advance Booking (days)
                        </label>
                        <input
                          type="number"
                          value={availability.advance_booking_days}
                          onChange={(e) => {
                            setAvailability({
                              ...availability,
                              advance_booking_days: parseInt(e.target.value)
                            })
                            setHasUnsavedChanges(true)
                          }}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Buffer Between Sessions (minutes)
                        </label>
                        <input
                          type="number"
                          value={availability.min_session_gap_minutes}
                          onChange={(e) => {
                            setAvailability({
                              ...availability,
                              min_session_gap_minutes: parseInt(e.target.value)
                            })
                            setHasUnsavedChanges(true)
                          }}
                          disabled={!isEditing}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'verification' && (
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Verification Status
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">⚠️</div>
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200">
                          Verification Pending
                        </h3>
                        <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                          Your profile is currently under review. This usually takes 24-48 hours.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Verification Steps
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                          ✓
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Email verified</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">
                          ✓
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">University confirmed</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center text-sm">
                          ⏳
                        </div>
                        <span className="text-gray-700 dark:text-gray-300">Identity verification pending</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 text-white flex items-center justify-center text-sm">
                          
                        </div>
                        <span className="text-gray-500 dark:text-gray-400">Background check (optional)</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Why Verification Matters
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Verified consultants see 3x more bookings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Builds trust with students and parents</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Access to premium features and priority support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <MessagingModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          consultant={{
            id: parseInt(profile.id),
            name: profile.name,
            college: profile.university,
            verified: profile.verified_status === 'verified',
            services: services.reduce((acc, service) => {
              if (service.is_active) {
                acc[service.name.toLowerCase().replace(' ', '_')] = [
                  `$${service.price}`,
                  service.delivery_time
                ]
              }
              return acc
            }, {} as Record<string, string[]>),
            rating: profile.avg_rating,
            review_count: profile.total_reviews
          }}
          currentUserId="preview-mode"
          currentUserType="student"
          mode="new_conversation"
        />
      )}
    </div>
  )
}

// SUPABASE TODO: Database schema for profile management
/*
-- Consultant profiles table
CREATE TABLE consultant_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  university TEXT NOT NULL,
  major TEXT,
  graduation_year INTEGER,
  profile_photo TEXT,
  bio TEXT,
  years_experience INTEGER DEFAULT 0,
  total_students_helped INTEGER DEFAULT 0,
  acceptance_rate INTEGER DEFAULT 0,
  avg_rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  verified_status TEXT DEFAULT 'pending' CHECK (verified_status IN ('pending', 'verified', 'rejected')),
  profile_strength INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultant services table
CREATE TABLE consultant_services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultant_id UUID REFERENCES consultant_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  delivery_time TEXT,
  is_active BOOLEAN DEFAULT true,
  orders_completed INTEGER DEFAULT 0,
  avg_rating DECIMAL(2,1) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Success stories table  
CREATE TABLE success_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultant_id UUID REFERENCES consultant_profiles(id) ON DELETE CASCADE,
  student_initials TEXT NOT NULL,
  admitted_to TEXT[] NOT NULL,
  year INTEGER NOT NULL,
  testimonial TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consultant availability table
CREATE TABLE consultant_availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  consultant_id UUID REFERENCES consultant_profiles(id) ON DELETE CASCADE UNIQUE,
  timezone TEXT NOT NULL,
  general_availability JSONB NOT NULL,
  blocked_dates DATE[],
  advance_booking_days INTEGER DEFAULT 7,
  min_session_gap_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_consultant_profiles_user_id ON consultant_profiles(user_id);
CREATE INDEX idx_consultant_services_consultant_id ON consultant_services(consultant_id);
CREATE INDEX idx_success_stories_consultant_id ON success_stories(consultant_id);
CREATE INDEX idx_consultant_availability_consultant_id ON consultant_availability(consultant_id);

-- RLS Policies
ALTER TABLE consultant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultant_availability ENABLE ROW LEVEL SECURITY;

-- Consultants can view and edit their own profiles
CREATE POLICY "Consultants can manage their own profile" ON consultant_profiles
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Public can view active consultant profiles" ON consultant_profiles
  FOR SELECT USING (verified_status = 'verified');

-- Similar policies for other tables...
*/ 