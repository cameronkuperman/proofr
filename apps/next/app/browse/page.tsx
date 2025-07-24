"use client"

import { useState, useEffect } from 'react'
import { supabase } from '../../../../lib/supabase' 
import { NavigationBar } from 'app/features/landing/components/NavigationBar'
import ConsultantCard from '../../components/ConsultantCard'

const UNIVERSITY_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Ivy+', value: 'ivy' },
  { label: 'HYPSM', value: 'hypsm' },
  { label: 'Top 20', value: 'top20' },
]
const SERVICE_TYPES = [
  'Resume Help',
  'Application Help',
  'SAT Tutoring',
  'Mock Interviews',
  'Scholarship Guidance',
  'School-Specific Advice',
]
const PRICE_FILTERS = [
  { label: '$0-20', value: [0, 20] },
  { label: '$20-50', value: [20, 50] },
  { label: '$50-100', value: [50, 100] },
  { label: '$100+', value: [100, 10000] },
]
const AVAILABILITY_FILTERS = [
  { label: 'Any', value: 'any' },
  { label: 'Available Now', value: 'now' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
]
const SUGGESTED_TAGS = [
  'Resume Help',
  'Application Help', 
  'SAT Tutoring',
  'Mock Interviews',
  'Scholarship Guidance',
  'School-Specific Advice',
  'Essay Review',
  'Harvard',
  'Stanford',
  'MIT',
  'Computer Science',
  'Business',
]


export default function BrowseConsultants() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUniversity, setSelectedUniversity] = useState('all')
  const [selectedService, setSelectedService] = useState('')
  const [selectedPrice, setSelectedPrice] = useState([0, 10000])
  const [selectedAvailability, setSelectedAvailability] = useState('any')
  const [showVerified, setShowVerified] = useState(false)
  const [sortBy, setSortBy] = useState('rating')
  const [consultants, setConsultants] = useState([])
useEffect(() => {
  const fetchConsultants = async () => {
    console.log('Fetching consultants from Supabase...')
    
    // Use the active_consultants view which joins users and filters approved consultants
    const { data, error } = await supabase
      .from('active_consultants')
      .select(`
        *,
        services:services(
          id,
          service_type,
          title,
          prices,
          delivery_type
        )
      `)
      .order('rating', { ascending: false })
    
    if (error) {
      console.error('Supabase error:', error)
      return
    }
    
    if (data && data.length > 0) {
      console.log('Fetched consultants:', data.length)
      console.log('First consultant:', data[0])
      
      // Transform data to match existing component expectations
      const transformedData = data.map(consultant => ({
        ...consultant,
        // Map services to expected format
        services: consultant.services?.reduce((acc, service) => {
          acc[service.service_type] = service.prices.map(price => `$${price}`)
          return acc
        }, {}) || {},
        // Ensure all expected fields exist
        review_count: consultant.total_reviews || 0,
        about_me: consultant.bio || consultant.long_bio || 'No bio available',
        working: consultant.is_available && !consultant.vacation_mode,
        college: consultant.current_college || 'University',
        verified: consultant.verification_status === 'approved',  // Blue checkmark only for approved
        years_experience: new Date().getFullYear() - (consultant.graduation_year || new Date().getFullYear()),
        location: consultant.timezone || 'Remote',
        price: consultant.services?.[0]?.prices?.[0] || 50, // Use first service's first price
        // Map tier fields (these might need adjustment based on your tier logic)
        ivy: false, // TODO: Calculate from colleges_attended
        ivy_plus: false, // TODO: Calculate from colleges_attended
        T20: false // TODO: Calculate from colleges_attended
      }))
      
      setConsultants(transformedData)
    } else {
      console.log('No consultants found')
      setConsultants([])
    }
  }
  
  fetchConsultants()
}, [])
  // Enhanced filtering logic
  const filteredConsultants = consultants.filter((consultant) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = searchQuery === '' || (
      consultant.name.toLowerCase().includes(searchLower) ||
      (consultant.about_me && consultant.about_me.toLowerCase().includes(searchLower)) ||
      consultant.college.toLowerCase().includes(searchLower) ||
      (consultant.major && consultant.major.toLowerCase().includes(searchLower))
    )
    const matchesUniversity =
      selectedUniversity === 'all' || 
      (selectedUniversity === 'ivy' && consultant.ivy) ||
      (selectedUniversity === 'hypsm' && consultant.ivy_plus) ||
      (selectedUniversity === 'top20' && consultant.T20)
    const matchesService =
      !selectedService || (consultant.services && Object.keys(consultant.services).some(service => 
        service.toLowerCase().includes(selectedService.toLowerCase())
      ))
    const matchesPrice = true
    const matchesAvailability =
      selectedAvailability === 'any' ||
      (selectedAvailability === 'now' && consultant.working) ||
      (selectedAvailability !== 'any' && consultant.working)
    const matchesVerified = !showVerified || consultant.verified
    return (
      matchesSearch &&
      matchesUniversity &&
      matchesService &&
      matchesPrice &&
      matchesAvailability &&
      matchesVerified
    )
  })

  // Sorting
  const sortedConsultants = [...filteredConsultants].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'rating':
        return b.rating - a.rating
      case 'reviews':
        return b.review_count - a.review_count
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      <NavigationBar />
      
      {/* Hero section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white pt-24 pb-16 px-6 lg:pt-32 lg:pb-20 text-center relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1)_0%,transparent_50%),radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1)_0%,transparent_50%)] z-[1]" />
        
        <div className="max-w-6xl mx-auto relative z-[2]">
          <h1 className="text-4xl lg:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Find Your Perfect Consultant
          </h1>
          
          <p className="text-lg lg:text-xl text-gray-300 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
            Connect with verified consultants from top universities to accelerate your academic and career journey.
          </p>

          {/* Enhanced Search Bar */}
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-2 border border-gray-200/20 dark:border-gray-700 shadow-2xl max-w-2xl mx-auto flex items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search consultants, services, or universities..."
              className="flex-1 text-base px-6 py-4 border-none rounded-2xl bg-transparent outline-none text-gray-900 dark:text-white font-medium placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button 
              onClick={() => {
                // Trigger search or focus - could add analytics here
                console.log('Search triggered for:', searchQuery)
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white border-none rounded-2xl px-8 py-4 font-bold text-sm cursor-pointer transition-all uppercase tracking-wide shadow-lg hover:shadow-xl hover:scale-105"
            >
              🔍 Search
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700 py-6 sticky top-16 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto px-5">
          {/* Verified Toggle */}
          <div className="mb-5 flex items-center justify-between">
            <label className="flex items-center gap-3 text-base text-gray-700 dark:text-gray-300 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={showVerified}
                onChange={() => setShowVerified(v => !v)}
                className="w-5 h-5 cursor-pointer accent-blue-600"
              />
              Show only verified consultants
            </label>
            
            <div className="text-base text-gray-600 dark:text-gray-400 font-medium">
              <strong className="text-gray-900 dark:text-white">{sortedConsultants.length}</strong> consultants found
            </div>
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              {/* University Filter */}
              <select
                value={selectedUniversity}
                onChange={e => setSelectedUniversity(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
              >
                {UNIVERSITY_FILTERS.map(opt => (
                  <option key={opt.value} value={opt.value} className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Service Type Filter */}
              <select
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">All Services</option>
                {SERVICE_TYPES.map(type => (
                  <option key={type} value={type} className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">
                    {type}
                  </option>
                ))}
              </select>

              {/* Price Filter */}
              <select
                value={JSON.stringify(selectedPrice)}
                onChange={e => setSelectedPrice(JSON.parse(e.target.value))}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={JSON.stringify([0, 10000])} className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">
                  All Prices
                </option>
                {PRICE_FILTERS.map(opt => (
                  <option key={opt.label} value={JSON.stringify(opt.value)} className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Availability Filter */}
              <select
                value={selectedAvailability}
                onChange={e => setSelectedAvailability(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
              >
                {AVAILABILITY_FILTERS.map(opt => (
                  <option key={opt.value} value={opt.value} className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 cursor-pointer outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rating" className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">Highest Rating</option>
                <option value="reviews" className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">Most Reviews</option>
                <option value="price-low" className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">Price: Low to High</option>
                <option value="price-high" className="text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Suggested Tags */}
          <div className="mt-5 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium mr-2">
              Popular searches:
            </span>
            {SUGGESTED_TAGS.slice(0, 8).map(tag => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className={`rounded-full px-4 py-2 text-xs cursor-pointer font-semibold transition-all capitalize ${
                  searchQuery === tag 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border border-blue-600 shadow-lg hover:shadow-xl -translate-y-0.5' 
                    : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 shadow hover:from-blue-600 hover:to-blue-700 hover:text-white hover:-translate-y-0.5 hover:shadow-lg'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Consultants Grid */}
      <div className="max-w-7xl mx-auto my-10 px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedConsultants.map(consultant => (
          <ConsultantCard
            key={consultant.id}
            consultant={consultant}
            onClick={() => console.log('Navigate to consultant profile:', consultant.id)}
          />
        ))}
      </div>

      {/* Empty state */}
      {sortedConsultants.length === 0 && (
        <div className="max-w-2xl mx-auto my-20 text-center p-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-lg">
          <div className="text-6xl mb-6 opacity-50">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No consultants found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed">
            Try adjusting your filters or search terms to find the perfect consultant for your needs.
          </p>
        </div>
      )}
    </div>
  )
}