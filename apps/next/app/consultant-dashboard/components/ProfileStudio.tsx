"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    category: 'essay',
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
    category: 'strategy',
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
    category: 'interview',
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

// Helper functions
const getServiceCategoryDetails = (category: string) => {
  const categories = {
    essay: { icon: '📝', color: 'from-blue-500 to-indigo-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    sat: { icon: '📊', color: 'from-green-500 to-emerald-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    act: { icon: '📈', color: 'from-purple-500 to-pink-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    interview: { icon: '🎤', color: 'from-orange-500 to-red-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
    strategy: { icon: '🎯', color: 'from-cyan-500 to-teal-600', bg: 'bg-cyan-100 dark:bg-cyan-900/30' },
    scholarship: { icon: '💰', color: 'from-yellow-500 to-amber-600', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    other: { icon: '📚', color: 'from-gray-500 to-gray-600', bg: 'bg-gray-100 dark:bg-gray-900/30' }
  }
  return categories[category as keyof typeof categories] || categories.other
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
  const [showPhotoUpload, setShowPhotoUpload] = useState(false)

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

  const handleSaveChanges = async () => {
    setHasUnsavedChanges(false)
    setIsEditing(false)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'services', label: 'Services', icon: '💼' },
    { id: 'success', label: 'Success Stories', icon: '🏆' },
    { id: 'availability', label: 'Availability', icon: '📅' },
    { id: 'verification', label: 'Verification', icon: '✅' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Animated Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  Profile Studio
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Craft your perfect consultant profile
                </p>
              </div>
              <div className="flex items-center gap-4">
                <AnimatePresence>
                  {hasUnsavedChanges && (
                    <motion.span 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 font-medium"
                    >
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                      Unsaved changes
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPreview(true)}
                  className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 font-medium"
                >
                  <span className="mr-2">👁️</span>
                  Preview
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={isEditing ? handleSaveChanges : () => setIsEditing(true)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all shadow-lg ${
                    isEditing 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-green-500/25'
                      : 'bg-gradient-to-r from-proofr-cyan to-blue-500 text-white hover:shadow-proofr-cyan/25'
                  }`}
                >
                  {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Strength Indicator */}
        <div className="px-8 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Profile Strength
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {calculateProfileStrength() >= 80 ? '🎉 Excellent! Your profile stands out' : 
                     calculateProfileStrength() >= 60 ? '👍 Good progress, keep improving' : 
                     '💪 Complete your profile for better visibility'}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-3xl font-bold bg-gradient-to-r ${getProfileStrengthColor(calculateProfileStrength())} bg-clip-text text-transparent`}>
                    {calculateProfileStrength()}%
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${calculateProfileStrength()}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${getProfileStrengthColor(calculateProfileStrength())} relative`}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Beautiful Tab Navigation */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-proofr-cyan to-blue-500 text-white shadow-lg shadow-proofr-cyan/25'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="text-lg mr-2">{tab.icon}</span>
                  <span className="text-sm">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tab Content with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {activeTab === 'overview' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-8">
                    Dashboard Overview
                  </h2>
                  
                  {/* Enhanced Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                      { 
                        value: profile.total_students_helped, 
                        label: 'Students Helped', 
                        icon: '🎓', 
                        color: 'from-blue-500 to-indigo-600',
                        bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
                        change: '+12 this month'
                      },
                      { 
                        value: `${profile.acceptance_rate}%`, 
                        label: 'Success Rate', 
                        icon: '📈', 
                        color: 'from-green-500 to-emerald-600',
                        bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
                        change: '+5% vs last year'
                      },
                      { 
                        value: profile.avg_rating, 
                        label: 'Average Rating', 
                        icon: '⭐', 
                        color: 'from-yellow-500 to-orange-600',
                        bgColor: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
                        change: `${profile.total_reviews} reviews`
                      },
                      { 
                        value: `$${(services.reduce((sum, s) => sum + (s.is_active ? s.orders_completed * s.price : 0), 0) / 1000).toFixed(1)}k`, 
                        label: 'Total Earnings', 
                        icon: '💰', 
                        color: 'from-purple-500 to-pink-600',
                        bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
                        change: 'All time'
                      }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="relative group"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity`} />
                        <div className={`relative bg-gradient-to-br ${stat.bgColor} rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="text-3xl">{stat.icon}</div>
                            <span className={`text-xs font-medium bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                              {stat.change}
                            </span>
                          </div>
                          <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1`}>
                            {stat.value}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {stat.label}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Action Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-proofr-cyan/10 to-blue-500/10 rounded-2xl p-6 border border-proofr-cyan/20"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        🚀 Quick Actions
                      </h3>
                      <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 bg-white dark:bg-gray-700 rounded-xl hover:shadow-md transition-all">
                          <span className="mr-2">📝</span> Add New Service
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-white dark:bg-gray-700 rounded-xl hover:shadow-md transition-all">
                          <span className="mr-2">🏆</span> Add Success Story
                        </button>
                        <button className="w-full text-left px-4 py-3 bg-white dark:bg-gray-700 rounded-xl hover:shadow-md transition-all">
                          <span className="mr-2">📅</span> Update Availability
                        </button>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        📈 Performance Tips
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>Respond to messages within 2 hours</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>Keep your calendar up to date</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-500 mt-0.5">!</span>
                          <span>Add 2 more success stories</span>
                        </li>
                      </ul>
                    </motion.div>
                  </div>

                  {/* Profile Completion Checklist */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Profile Completion Checklist
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { done: !!profile.profile_photo, task: 'Add professional photo', points: '+15%' },
                        { done: profile.bio?.length > 100, task: 'Write compelling bio', points: '+20%' },
                        { done: services.filter(s => s.is_active).length >= 2, task: 'List 2+ services', points: '+20%' },
                        { done: successStories.length >= 2, task: 'Add success stories', points: '+25%' },
                        { done: profile.verified_status === 'verified', task: 'Complete verification', points: '+20%' },
                        { done: false, task: 'Connect social profiles', points: '+10%' }
                      ].map((item, index) => (
                        <motion.label 
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl cursor-pointer hover:shadow-md transition-all"
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            item.done 
                              ? 'bg-green-500 border-green-500' 
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {item.done && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <span className={`flex-1 ${item.done ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                            {item.task}
                          </span>
                          <span className={`text-xs font-medium ${
                            item.done 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {item.points}
                          </span>
                        </motion.label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-8">
                    Profile Details
                  </h2>
                  
                  <div className="space-y-8">
                    {/* Profile Photo Section */}
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-proofr-cyan to-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                          {profile.name.charAt(0)}
                        </div>
                        {isEditing && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowPhotoUpload(true)}
                            className="absolute inset-0 w-32 h-32 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </motion.button>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Profile Photo
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          A professional photo increases trust and bookings by 40%
                        </p>
                        {isEditing && (
                          <button className="px-4 py-2 bg-gradient-to-r from-proofr-cyan to-blue-500 text-white rounded-lg hover:shadow-lg transition-all">
                            Upload Photo
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Bio Section */}
                    <div>
                      <label className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        <span>Bio</span>
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                          {profile.bio.length}/500
                        </span>
                      </label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => {
                          setProfile({ ...profile, bio: e.target.value })
                          setHasUnsavedChanges(true)
                        }}
                        disabled={!isEditing}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-proofr-cyan focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-all resize-none"
                        placeholder="Share your experience, achievements, and what makes you a great consultant..."
                      />
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Tips:</span>
                        <span className="text-gray-600 dark:text-gray-400">✓ Mention your university</span>
                        <span className="text-gray-600 dark:text-gray-400">✓ Include success metrics</span>
                        <span className="text-gray-600 dark:text-gray-400">✓ Be authentic</span>
                      </div>
                    </div>

                    {/* Academic Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Academic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            University
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl">🏛️</div>
                            <input
                              type="text"
                              value={profile.university}
                              disabled
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Major
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl">📚</div>
                            <input
                              type="text"
                              value={profile.major}
                              onChange={(e) => {
                                setProfile({ ...profile, major: e.target.value })
                                setHasUnsavedChanges(true)
                              }}
                              disabled={!isEditing}
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-proofr-cyan focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Graduation Year
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl">🎓</div>
                            <input
                              type="number"
                              value={profile.graduation_year}
                              onChange={(e) => {
                                setProfile({ ...profile, graduation_year: parseInt(e.target.value) })
                                setHasUnsavedChanges(true)
                              }}
                              disabled={!isEditing}
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-proofr-cyan focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Years of Experience
                          </label>
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl">⏰</div>
                            <input
                              type="number"
                              value={profile.years_experience}
                              onChange={(e) => {
                                setProfile({ ...profile, years_experience: parseInt(e.target.value) })
                                setHasUnsavedChanges(true)
                              }}
                              disabled={!isEditing}
                              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-proofr-cyan focus:border-transparent dark:bg-gray-700 dark:text-white disabled:bg-gray-50 dark:disabled:bg-gray-800 transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Services & Pricing
                    </h2>
                    {isEditing && (
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-proofr-cyan to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-proofr-cyan/25 transition-all font-medium"
                      >
                        + Add Service
                      </motion.button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {services.map((service, index) => {
                      const categoryDetails = getServiceCategoryDetails(service.category)
                      return (
                        <motion.div 
                          key={service.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ y: -2 }}
                          className={`relative overflow-hidden border rounded-2xl transition-all ${
                            service.is_active 
                              ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg' 
                              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 opacity-75'
                          }`}
                        >
                          {/* Category accent */}
                          <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${categoryDetails.color}`} />
                          
                          <div className="p-6 pl-8">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg ${categoryDetails.bg}`}>
                                    <span>{categoryDetails.icon}</span>
                                    {service.category.toUpperCase()}
                                  </span>
                                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {service.name}
                                  </h3>
                                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                    service.is_active 
                                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                  }`}>
                                    {service.is_active ? '✓ Active' : 'Inactive'}
                                  </span>
                                </div>
                                
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                  {service.description}
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-6 text-sm">
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500 dark:text-gray-400">Price:</span>
                                    <span className="text-2xl font-bold bg-gradient-to-r from-proofr-cyan to-blue-500 bg-clip-text text-transparent">
                                      ${service.price}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500 dark:text-gray-400">⏱️</span>
                                    <span className="text-gray-700 dark:text-gray-300">{service.delivery_time}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500 dark:text-gray-400">📦</span>
                                    <span className="text-gray-700 dark:text-gray-300">{service.orders_completed} delivered</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-yellow-500">⭐</span>
                                    <span className="text-gray-700 dark:text-gray-300">{service.avg_rating}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {isEditing && (
                                <div className="flex items-center gap-2 ml-4">
                                  <motion.button 
                                    whileTap={{ scale: 0.9 }}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                  >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </motion.button>
                                  <motion.button 
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => {
                                      setServices(services.map(s => 
                                        s.id === service.id ? { ...s, is_active: !s.is_active } : s
                                      ))
                                      setHasUnsavedChanges(true)
                                    }}
                                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                  >
                                    {service.is_active ? (
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    ) : (
                                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>
                                    )}
                                  </motion.button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Service Tips */}
                  <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      💡 Pro Tips for Services
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li>• Price competitively - research what similar consultants charge</li>
                      <li>• Offer package deals for multiple services</li>
                      <li>• Keep descriptions clear and specific about deliverables</li>
                      <li>• Update delivery times based on your current workload</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'success' && (
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Success Stories
                    </h2>
                    {isEditing && (
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-gradient-to-r from-proofr-cyan to-blue-500 text-white rounded-xl hover:shadow-lg hover:shadow-proofr-cyan/25 transition-all font-medium"
                      >
                        + Add Story
                      </motion.button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {successStories.map((story, index) => (
                      <motion.div 
                        key={story.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="relative group"
                      >
                        {/* Featured glow */}
                        {story.is_featured && (
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
                        )}
                        
                        <div className={`relative bg-white dark:bg-gray-800 rounded-2xl p-6 border ${
                          story.is_featured 
                            ? 'border-yellow-400/50 dark:border-yellow-500/50' 
                            : 'border-gray-200 dark:border-gray-700'
                        } hover:shadow-xl transition-all`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-proofr-cyan to-blue-500 flex items-center justify-center text-white font-bold">
                                {story.student_initials}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  Student {story.student_initials}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Class of {story.year}
                                </p>
                              </div>
                            </div>
                            {story.is_featured && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                                <span>⭐</span>
                                Featured
                              </span>
                            )}
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                              Admitted to:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {story.admitted_to.map((school, idx) => (
                                <motion.span 
                                  key={school}
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 + idx * 0.05 }}
                                  className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-medium rounded-full"
                                >
                                  {school}
                                </motion.span>
                              ))}
                            </div>
                          </div>

                          <blockquote className="relative">
                            <span className="absolute -top-2 -left-2 text-4xl text-gray-300 dark:text-gray-600">&ldquo;</span>
                            <p className="text-gray-600 dark:text-gray-400 italic pl-6">
                              {story.testimonial}
                            </p>
                            <span className="absolute -bottom-6 right-0 text-4xl text-gray-300 dark:text-gray-600">&rdquo;</span>
                          </blockquote>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Empty State */}
                  {successStories.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🏆</div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No success stories yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Add your first success story to showcase your impact
                      </p>
                      {isEditing && (
                        <button className="px-6 py-3 bg-gradient-to-r from-proofr-cyan to-blue-500 text-white rounded-xl hover:shadow-lg transition-all">
                          Add Your First Story
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'availability' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-8">
                    Availability Settings
                  </h2>
                  
                  <div className="space-y-8">
                    {/* Calendar Preview */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        📅 Your Weekly Schedule
                      </h3>
                      <div className="grid grid-cols-7 gap-2 text-center">
                        {Object.entries(availability.general_availability).map(([day, schedule]) => (
                          <div key={day} className="space-y-2">
                            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                              {day.slice(0, 3)}
                            </div>
                            <div className={`p-2 rounded-lg text-xs ${
                              schedule.available 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                            }`}>
                              {schedule.available ? '✓' : '✗'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        ⏰ Daily Availability
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(availability.general_availability).map(([day, schedule]) => (
                          <motion.div 
                            key={day}
                            whileHover={{ x: 4 }}
                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <label className="flex items-center cursor-pointer">
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
                                  className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                  schedule.available 
                                    ? 'bg-proofr-cyan border-proofr-cyan' 
                                    : 'border-gray-300 dark:border-gray-600'
                                }`}>
                                  {schedule.available && (
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                              </label>
                              <span className="font-medium text-gray-900 dark:text-white capitalize min-w-[100px]">
                                {day}
                              </span>
                            </div>
                            
                            {schedule.available && (
                              <div className="flex items-center gap-3">
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
                                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-proofr-cyan dark:bg-gray-700 dark:text-white"
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
                                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-proofr-cyan dark:bg-gray-700 dark:text-white"
                                />
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Advanced Settings */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        ⚙️ Booking Preferences
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            How far in advance can students book?
                          </label>
                          <div className="relative">
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
                              className="w-full pl-4 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-proofr-cyan dark:bg-gray-700 dark:text-white"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              days
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Buffer time between sessions
                          </label>
                          <div className="relative">
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
                              className="w-full pl-4 pr-16 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-proofr-cyan dark:bg-gray-700 dark:text-white"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                              minutes
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'verification' && (
                <div className="p-8">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-8">
                    Verification Center
                  </h2>
                  
                  {/* Status Banner */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-6 mb-8"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl animate-pulse">⏳</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
                          Verification In Progress
                        </h3>
                        <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                          Your profile is being reviewed by our team. This typically takes 24-48 hours.
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-yellow-600 dark:text-yellow-400">
                            Submitted: {new Date(profile.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-yellow-600 dark:text-yellow-400">
                            Status: Under Review
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Verification Steps */}
                  <div className="space-y-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Verification Progress
                    </h3>
                    
                    <div className="space-y-4">
                      {[
                        { step: 'Email Verification', status: 'completed', icon: '✉️', description: 'Verified university email address' },
                        { step: 'University Enrollment', status: 'completed', icon: '🏛️', description: 'Confirmed current enrollment at Harvard University' },
                        { step: 'Identity Verification', status: 'pending', icon: '🆔', description: 'Government ID verification pending' },
                        { step: 'Background Check', status: 'optional', icon: '🔍', description: 'Optional for premium badge' }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4"
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                            item.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30' :
                            item.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                            'bg-gray-100 dark:bg-gray-800'
                          }`}>
                            {item.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {item.step}
                              </h4>
                              {item.status === 'completed' && (
                                <span className="text-green-500">✓</span>
                              )}
                              {item.status === 'pending' && (
                                <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
                                  In Review
                                </span>
                              )}
                              {item.status === 'optional' && (
                                <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                                  Optional
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {item.description}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Benefits Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      🌟 Verification Benefits
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { benefit: '3x more student bookings', icon: '📈' },
                        { benefit: 'Verified badge on profile', icon: '✅' },
                        { benefit: 'Priority in search results', icon: '🔝' },
                        { benefit: 'Access to premium students', icon: '💎' },
                        { benefit: 'Higher pricing potential', icon: '💰' },
                        { benefit: 'Dedicated support team', icon: '🛟' }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3"
                        >
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-gray-700 dark:text-gray-300">{item.benefit}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
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