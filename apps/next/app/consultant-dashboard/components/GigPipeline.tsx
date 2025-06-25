"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Mock data for demonstration
const mockGigRequests = {
  pending: [
    {
      id: '1',
      studentName: 'Emma Chen',
      age: 17,
      targetSchools: ['Harvard', 'Yale', 'Princeton'],
      serviceCategory: 'essay' as ServiceCategory,
      essayType: 'Common App Personal Statement',
      wordCount: 650,
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
      price: 150,
      premiumMultiplier: 1.5,
      isPremium: true,
      status: 'pending' as const,
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      draftStatus: 'Second Draft',
      essayPrompt: 'Discuss an accomplishment, event, or realization that sparked personal growth...'
    },
    {
      id: '2',
      studentName: 'Marcus Johnson',
      age: 18,
      targetSchools: ['Stanford', 'MIT', 'Caltech'],
      serviceCategory: 'essay' as ServiceCategory,
      essayType: 'Stanford Supplemental',
      wordCount: 250,
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      price: 80,
      isPremium: false,
      status: 'pending' as const,
      submittedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
      draftStatus: 'First Draft',
      essayPrompt: 'What is the most significant challenge that society faces today?'
    },
    {
      id: '3',
      studentName: 'Sophia Williams',
      age: 17,
      targetSchools: ['Columbia', 'Brown', 'Duke'],
      serviceCategory: 'essay' as ServiceCategory,
      essayType: 'Why Us Essay',
      wordCount: 300,
      deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
      price: 100,
      isPremium: false,
      status: 'pending' as const,
      submittedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      draftStatus: 'Final Review',
      essayPrompt: 'Why Columbia?'
    },
    {
      id: '6',
      studentName: 'Alex Thompson',
      age: 18,
      targetSchools: ['Georgetown', 'NYU', 'Boston University'],
      serviceCategory: 'sat' as ServiceCategory,
      essayType: 'SAT Prep - Math Section',
      wordCount: 0,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
      price: 200,
      isPremium: false,
      status: 'pending' as const,
      submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      draftStatus: 'Initial Assessment',
      essayPrompt: 'Need help improving SAT Math score from 650 to 750+'
    },
    {
      id: '7',
      studentName: 'Rachel Kim',
      age: 17,
      targetSchools: ['Harvard', 'MIT', 'Stanford'],
      serviceCategory: 'interview' as ServiceCategory,
      essayType: 'Mock Interview Prep',
      wordCount: 0,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      price: 175,
      premiumMultiplier: 2,
      isPremium: true,
      status: 'pending' as const,
      submittedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
      draftStatus: 'Schedule Pending',
      essayPrompt: 'Harvard interview scheduled for next week, need intensive prep'
    }
  ],
  accepted: [
    {
      id: '4',
      studentName: 'David Park',
      age: 18,
      targetSchools: ['UPenn', 'Cornell', 'Northwestern'],
      serviceCategory: 'essay' as ServiceCategory,
      essayType: 'Activities Essay',
      wordCount: 150,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      price: 75,
      isPremium: false,
      status: 'accepted' as const,
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      acceptedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      draftStatus: 'First Draft',
      essayPrompt: 'Describe one of your activities and its impact on you.'
    }
  ],
  waitingApproval: [
    {
      id: '5',
      studentName: 'Isabella Martinez',
      age: 17,
      targetSchools: ['UC Berkeley', 'UCLA', 'UCSD'],
      serviceCategory: 'essay' as ServiceCategory,
      essayType: 'UC Personal Insight',
      wordCount: 350,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      price: 120,
      isPremium: false,
      status: 'waitingApproval' as const,
      submittedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      draftStatus: 'First Draft',
      essayPrompt: 'Describe how you have taken advantage of a significant educational opportunity...'
    }
  ]
}

// Type definitions
type ServiceCategory = 'essay' | 'sat' | 'act' | 'interview' | 'strategy' | 'scholarship' | 'other'

type GigRequest = {
  id: string
  studentName: string
  age: number
  targetSchools: string[]
  serviceCategory: ServiceCategory
  essayType: string
  wordCount: number
  deadline: Date
  price: number
  premiumMultiplier?: number
  isPremium: boolean
  status: 'pending' | 'accepted' | 'waitingApproval' | 'completed'
  submittedAt: Date
  acceptedAt?: Date
  draftStatus: string
  essayPrompt: string
}

// Helper functions
const getTimeUntilDeadline = (deadline: Date) => {
  const now = new Date()
  const diff = deadline.getTime() - now.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  
  if (days > 0) return { value: days, unit: days === 1 ? 'day' : 'days', urgent: days <= 2 }
  return { value: hours, unit: hours === 1 ? 'hour' : 'hours', urgent: true }
}

const getSchoolTier = (schools: string[]) => {
  const ivyPlus = ['Harvard', 'Yale', 'Princeton', 'Stanford', 'MIT', 'Columbia', 'UPenn', 'Brown', 'Cornell', 'Dartmouth', 'Duke', 'Caltech', 'Northwestern']
  const hasIvyPlus = schools.some(school => ivyPlus.includes(school))
  
  if (hasIvyPlus) return { label: 'Ivy+', color: 'from-amber-500 to-yellow-600' }
  if (schools.some(school => school.includes('UC'))) return { label: 'UC', color: 'from-blue-500 to-indigo-600' }
  return { label: 'Top 50', color: 'from-purple-500 to-pink-600' }
}

const getServiceCategoryDetails = (category: ServiceCategory) => {
  const categories = {
    essay: { 
      label: 'Essay Review', 
      icon: '📝', 
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-700 dark:text-blue-300'
    },
    sat: { 
      label: 'SAT Prep', 
      icon: '📊', 
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-700 dark:text-green-300'
    },
    act: { 
      label: 'ACT Prep', 
      icon: '📈', 
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-700 dark:text-purple-300'
    },
    interview: { 
      label: 'Interview Prep', 
      icon: '🎤', 
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-700 dark:text-orange-300'
    },
    strategy: { 
      label: 'App Strategy', 
      icon: '🎯', 
      color: 'from-cyan-500 to-teal-600',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
      textColor: 'text-cyan-700 dark:text-cyan-300'
    },
    scholarship: { 
      label: 'Scholarship', 
      icon: '💰', 
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-700 dark:text-yellow-300'
    },
    other: { 
      label: 'Other', 
      icon: '📚', 
      color: 'from-gray-500 to-gray-600',
      bgColor: 'bg-gray-100 dark:bg-gray-900/30',
      textColor: 'text-gray-700 dark:text-gray-300'
    }
  }
  return categories[category]
}

// Components
const GigCard = ({ 
  gig, 
  onAccept, 
  onDecline, 
  onExpand 
}: { 
  gig: GigRequest
  onAccept?: (id: string) => void
  onDecline?: (id: string) => void
  onExpand: (gig: GigRequest) => void
}) => {
  const timeUntil = getTimeUntilDeadline(gig.deadline)
  const schoolTier = getSchoolTier(gig.targetSchools)
  const serviceDetails = getServiceCategoryDetails(gig.serviceCategory)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Premium glow effect */}
      {gig.isPremium && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-500" />
      )}
      
      <div className={`relative bg-white dark:bg-gray-800 rounded-2xl border ${
        gig.isPremium 
          ? 'border-yellow-400/50 dark:border-yellow-500/50' 
          : 'border-gray-200 dark:border-gray-700'
      } overflow-hidden transition-all duration-300`}>
        
        {/* Header with deadline indicator */}
        <div className="p-6 pb-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {gig.studentName}
                </h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Age {gig.age}
                </span>
                {gig.isPremium && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Premium {gig.premiumMultiplier}x
                  </motion.span>
                )}
              </div>
              
              {/* School tier badge */}
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex px-2.5 py-1 text-xs font-medium text-white rounded-lg bg-gradient-to-r ${schoolTier.color}`}>
                  {schoolTier.label}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {gig.targetSchools.slice(0, 2).join(', ')}
                  {gig.targetSchools.length > 2 && ` +${gig.targetSchools.length - 2}`}
                </span>
              </div>
            </div>

            {/* Deadline indicator */}
            <div className={`flex flex-col items-end ${timeUntil.urgent ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'}`}>
              <div className="text-2xl font-bold">{timeUntil.value}</div>
              <div className="text-sm">{timeUntil.unit} left</div>
            </div>
          </div>

          {/* Service category badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg ${serviceDetails.bgColor} ${serviceDetails.textColor}`}>
              <span>{serviceDetails.icon}</span>
              {serviceDetails.label}
            </span>
          </div>

          {/* Essay details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {gig.essayType}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {gig.wordCount > 0 ? `${gig.wordCount} words • ` : ''}{gig.draftStatus}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              &ldquo;{gig.essayPrompt}&rdquo;
            </p>
          </div>
        </div>

        {/* Price and actions */}
        <div className="p-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ${gig.isPremium ? gig.price * (gig.premiumMultiplier || 1.5) : gig.price}
              </span>
              {gig.isPremium && (
                <span className="text-sm text-gray-500 line-through">
                  ${gig.price}
                </span>
              )}
            </div>

            {gig.status === 'pending' && (
              <div className="flex items-center gap-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDecline?.(gig.id)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Decline
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAccept?.(gig.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-proofr-cyan to-blue-500 rounded-lg hover:from-blue-500 hover:to-proofr-cyan transition-all shadow-lg shadow-proofr-cyan/25"
                >
                  Accept
                </motion.button>
              </div>
            )}

            {gig.status === 'accepted' && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => onExpand(gig)}
                className="px-4 py-2 text-sm font-medium text-proofr-cyan hover:text-blue-500 transition-colors"
              >
                View Details →
              </motion.button>
            )}
          </div>
        </div>

        {/* Hover effect overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-proofr-cyan/5 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const SectionHeader = ({ 
  title, 
  count, 
  icon,
  sortBy,
  onSortChange
}: { 
  title: string
  count: number
  icon: React.ReactNode
  sortBy?: string
  onSortChange?: (sort: string) => void
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-proofr-cyan/20 to-blue-500/20 rounded-xl">
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {count} {count === 1 ? 'request' : 'requests'}
          </p>
        </div>
      </div>

      {sortBy !== undefined && onSortChange && (
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-proofr-cyan focus:border-transparent"
        >
          <option value="deadline">Sort by Deadline</option>
          <option value="price">Sort by Price</option>
          <option value="newest">Sort by Newest</option>
        </select>
      )}
    </div>
  )
}

const EmptyState = ({ message }: { message: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
      <div className="w-16 h-16 mb-4 text-gray-400">
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  )
}

export default function GigPipeline() {
  const [gigs, setGigs] = useState(mockGigRequests)
  const [sortBy, setSortBy] = useState('deadline')
  const [filterCategory, setFilterCategory] = useState<ServiceCategory | 'all'>('all')
  const [selectedGig, setSelectedGig] = useState<GigRequest | null>(null)
  const [showNotification, setShowNotification] = useState(false)

  // Filter and sort gigs
  const filterGigs = (gigsList: GigRequest[]) => {
    if (filterCategory === 'all') return gigsList
    return gigsList.filter(gig => gig.serviceCategory === filterCategory)
  }

  const sortGigs = (gigsList: GigRequest[]) => {
    return [...gigsList].sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return a.deadline.getTime() - b.deadline.getTime()
        case 'price':
          const priceA = a.isPremium ? a.price * (a.premiumMultiplier || 1.5) : a.price
          const priceB = b.isPremium ? b.price * (b.premiumMultiplier || 1.5) : b.price
          return priceB - priceA
        case 'newest':
          return b.submittedAt.getTime() - a.submittedAt.getTime()
        default:
          return 0
      }
    })
  }

  const handleAccept = (id: string) => {
    const gig = gigs.pending.find(g => g.id === id)
    if (gig) {
      setGigs(prev => ({
        ...prev,
        pending: prev.pending.filter(g => g.id !== id),
        waitingApproval: [...prev.waitingApproval, { ...gig, status: 'waitingApproval' as const }]
      }))
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }
  }

  const handleDecline = (id: string) => {
    setGigs(prev => ({
      ...prev,
      pending: prev.pending.filter(g => g.id !== id)
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Gig Requests
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your incoming requests and active gigs
              </p>
            </div>
            
            {/* Category filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Filter by:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as ServiceCategory | 'all')}
                className="px-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-proofr-cyan focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="essay">Essay Review</option>
                <option value="sat">SAT Prep</option>
                <option value="act">ACT Prep</option>
                <option value="interview">Interview Prep</option>
                <option value="strategy">App Strategy</option>
                <option value="scholarship">Scholarship</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'New Requests', value: gigs.pending.length, color: 'from-blue-500 to-indigo-600' },
            { label: 'Awaiting Payment', value: gigs.waitingApproval.length, color: 'from-yellow-500 to-orange-600' },
            { label: 'Active Gigs', value: gigs.accepted.length, color: 'from-green-500 to-emerald-600' },
            { label: 'Today\'s Earnings', value: '$425', color: 'from-purple-500 to-pink-600' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur transition duration-500" 
                style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`, '--tw-gradient-from': stat.color.split(' ')[1], '--tw-gradient-to': stat.color.split(' ')[3] }}
              />
              <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* Pending Requests */}
          <section>
            <SectionHeader
              title="Pending Requests"
              count={filterGigs(gigs.pending).length}
              icon={
                <svg className="w-5 h-5 text-proofr-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {sortGigs(filterGigs(gigs.pending)).map(gig => (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    onAccept={handleAccept}
                    onDecline={handleDecline}
                    onExpand={setSelectedGig}
                  />
                ))}
              </AnimatePresence>
              {gigs.pending.length === 0 && (
                <div className="lg:col-span-2">
                  <EmptyState message="No pending requests at the moment" />
                </div>
              )}
            </div>
          </section>

          {/* Awaiting Payment */}
          <section>
            <SectionHeader
              title="Awaiting Payment"
              count={filterGigs(gigs.waitingApproval).length}
              icon={
                <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {filterGigs(gigs.waitingApproval).map(gig => (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    onExpand={setSelectedGig}
                  />
                ))}
              </AnimatePresence>
              {gigs.waitingApproval.length === 0 && (
                <div className="lg:col-span-2">
                  <EmptyState message="No requests awaiting payment" />
                </div>
              )}
            </div>
          </section>

          {/* Active Gigs */}
          <section>
            <SectionHeader
              title="Active Gigs"
              count={filterGigs(gigs.accepted).length}
              icon={
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence>
                {filterGigs(gigs.accepted).map(gig => (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    onExpand={setSelectedGig}
                  />
                ))}
              </AnimatePresence>
              {gigs.accepted.length === 0 && (
                <div className="lg:col-span-2">
                  <EmptyState message="No active gigs" />
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Notification toast */}
        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 right-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 flex items-center gap-3 border border-gray-200 dark:border-gray-700"
            >
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Request accepted!</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Waiting for student payment confirmation</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}