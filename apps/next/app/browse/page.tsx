"use client"

import { useState } from 'react'
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

const MOCK_CONSULTANTS = [
  {
    id: 1,
    name: 'Sarah Chen',
    university: 'Harvard University',
    universityType: 'ivy',
    verified: true,
    major: 'Computer Science',
    rating: 4.9,
    reviews: 127,
    price: 150,
    image: '/images/default-avatar.svg',
    tags: ['Essay Review', 'Application Strategy', 'Interview Prep'],
    description: 'Harvard CS graduate helping students get into top tech programs.',
    available: true,
    services: ['Resume Help', 'Application Help', 'Mock Interviews'],
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    university: 'Stanford University',
    universityType: 'hypsm',
    verified: true,
    major: 'Business Administration',
    rating: 4.8,
    reviews: 98,
    price: 175,
    image: '/images/default-avatar.svg',
    tags: ['Business School', 'Application Strategy', 'Profile Building'],
    description: 'Stanford GSB alum specializing in business school applications.',
    available: false,
    services: ['Application Help', 'Scholarship Guidance'],
  },
  {
    id: 3,
    name: 'Emily Thompson',
    university: 'MIT',
    universityType: 'hypsm',
    verified: true,
    major: 'Mechanical Engineering',
    rating: 4.9,
    reviews: 156,
    price: 140,
    image: '/images/default-avatar.svg',
    tags: ['Engineering', 'Essay Review', 'Interview Prep'],
    description: 'MIT engineering graduate with experience in technical program applications.',
    available: true,
    services: ['SAT Tutoring', 'Mock Interviews'],
  },
  {
    id: 4,
    name: 'David Kim',
    university: 'Yale University',
    universityType: 'hypsm',
    verified: false,
    major: 'Political Science',
    rating: 4.7,
    reviews: 89,
    price: 160,
    image: '/images/default-avatar.svg',
    tags: ['Liberal Arts', 'Essay Review', 'Application Strategy'],
    description: 'Yale graduate helping students craft compelling personal statements.',
    available: false,
    services: ['Essay Review', 'School-Specific Advice'],
  },
  {
    id: 5,
    name: 'Sophia Patel',
    university: 'Princeton University',
    universityType: 'ivy',
    verified: true,
    major: 'Computer Science',
    rating: 4.9,
    reviews: 112,
    price: 165,
    image: '/images/default-avatar.svg',
    tags: ['Computer Science', 'Interview Prep', 'Profile Building'],
    description: 'Princeton CS alum specializing in tech program applications.',
    available: true,
    services: ['Resume Help', 'Application Help', 'SAT Tutoring'],
  },
  {
    id: 6,
    name: 'James Wilson',
    university: 'Columbia University',
    universityType: 'top20',
    verified: false,
    major: 'Journalism',
    rating: 4.8,
    reviews: 76,
    price: 145,
    image: '/images/default-avatar.svg',
    tags: ['Liberal Arts', 'Essay Review', 'Application Strategy'],
    description: 'Columbia journalism graduate helping students tell their stories.',
    available: true,
    services: ['Essay Review', 'Resume Help'],
  },
]

export default function BrowseConsultants() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUniversity, setSelectedUniversity] = useState('all')
  const [selectedService, setSelectedService] = useState('')
  const [selectedPrice, setSelectedPrice] = useState([0, 10000])
  const [selectedAvailability, setSelectedAvailability] = useState('any')
  const [showVerified, setShowVerified] = useState(false)
  const [sortBy, setSortBy] = useState('rating')

  // Enhanced filtering logic
  const filteredConsultants = MOCK_CONSULTANTS.filter((consultant) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = searchQuery === '' || (
      consultant.name.toLowerCase().includes(searchLower) ||
      consultant.description.toLowerCase().includes(searchLower) ||
      consultant.university.toLowerCase().includes(searchLower) ||
      consultant.major.toLowerCase().includes(searchLower) ||
      consultant.services.some(service => service.toLowerCase().includes(searchLower)) ||
      consultant.tags.some(tag => tag.toLowerCase().includes(searchLower))
    )
    const matchesUniversity =
      selectedUniversity === 'all' || consultant.universityType === selectedUniversity
    const matchesService =
      !selectedService || consultant.services.includes(selectedService)
    const matchesPrice =
      consultant.price >= selectedPrice[0] && consultant.price <= selectedPrice[1]
    const matchesAvailability =
      selectedAvailability === 'any' ||
      (selectedAvailability === 'now' && consultant.available) ||
      (selectedAvailability !== 'any' && consultant.available) // Simplified for mock
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
        return b.reviews - a.reviews
      default:
        return 0
    }
  })

  // Responsive styles
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 800

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #fafbfc 0%, #f1f5f9 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <NavigationBar />
      
      {/* Hero section */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        padding: isMobile ? '100px 20px 60px 20px' : '120px 0 80px 0',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)',
          zIndex: 1
        }} />
        
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontSize: isMobile ? '2.5rem' : '4rem',
            fontWeight: 800,
            margin: '0 0 24px 0',
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Find Your Perfect Consultant
          </h1>
          
          <p style={{
            fontSize: isMobile ? '1.1rem' : '1.3rem',
            color: '#cbd5e1',
            margin: '0 0 40px 0',
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
            fontWeight: 400
          }}>
            Connect with verified consultants from top universities to accelerate your academic and career journey.
          </p>

          {/* Enhanced Search Bar */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            padding: 8,
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            maxWidth: 600,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: 12
          }}>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search consultants, services, or universities..."
              style={{
                flex: 1,
                fontSize: 16,
                padding: '18px 24px',
                border: 'none',
                borderRadius: 20,
                background: 'transparent',
                outline: 'none',
                color: '#0f172a',
                fontWeight: 500
              }}
            />
            <button 
              onClick={() => {
                // Trigger search or focus - could add analytics here
                console.log('Search triggered for:', searchQuery)
              }}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 20,
                padding: '18px 32px',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)'
              }}
            >
              🔍 Search
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.5)',
        padding: isMobile ? '20px' : '24px 0',
        position: 'sticky',
        top: 64,
        zIndex: 10,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          {/* Verified Toggle */}
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12, 
              fontSize: 16, 
              color: '#334155', 
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={showVerified}
                onChange={() => setShowVerified(v => !v)}
                style={{ 
                  accentColor: '#3b82f6', 
                  width: 20, 
                  height: 20,
                  cursor: 'pointer'
                }}
              />
              Show only verified consultants
            </label>
            
            <div style={{ fontSize: 16, color: '#64748b', fontWeight: 500 }}>
              <strong style={{ color: '#0f172a' }}>{sortedConsultants.length}</strong> consultants found
            </div>
          </div>

          {/* Filter Row */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 16, 
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
              {/* University Filter */}
              <select
                value={selectedUniversity}
                onChange={e => setSelectedUniversity(e.target.value)}
                style={{ 
                  padding: '12px 18px', 
                  borderRadius: 12, 
                  border: '1px solid #e2e8f0', 
                  fontSize: 15,
                  fontWeight: 500,
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {UNIVERSITY_FILTERS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {/* Service Type Filter */}
              <select
                value={selectedService}
                onChange={e => setSelectedService(e.target.value)}
                style={{ 
                  padding: '12px 18px', 
                  borderRadius: 12, 
                  border: '1px solid #e2e8f0', 
                  fontSize: 15,
                  fontWeight: 500,
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="">All Services</option>
                {SERVICE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              {/* Price Filter */}
              <select
                value={JSON.stringify(selectedPrice)}
                onChange={e => setSelectedPrice(JSON.parse(e.target.value))}
                style={{ 
                  padding: '12px 18px', 
                  borderRadius: 12, 
                  border: '1px solid #e2e8f0', 
                  fontSize: 15,
                  fontWeight: 500,
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value={JSON.stringify([0, 10000])}>All Prices</option>
                {PRICE_FILTERS.map(opt => (
                  <option key={opt.label} value={JSON.stringify(opt.value)}>{opt.label}</option>
                ))}
              </select>

              {/* Availability Filter */}
              <select
                value={selectedAvailability}
                onChange={e => setSelectedAvailability(e.target.value)}
                style={{ 
                  padding: '12px 18px', 
                  borderRadius: 12, 
                  border: '1px solid #e2e8f0', 
                  fontSize: 15,
                  fontWeight: 500,
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {AVAILABILITY_FILTERS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 15, color: '#64748b', fontWeight: 500 }}>Sort by:</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ 
                  padding: '12px 18px', 
                  borderRadius: 12, 
                  border: '1px solid #e2e8f0', 
                  fontSize: 15,
                  fontWeight: 500,
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="rating">Highest Rating</option>
                <option value="reviews">Most Reviews</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Suggested Tags */}
          <div style={{ 
            marginTop: 20,
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 10,
            alignItems: 'center'
          }}>
            <span style={{ fontSize: 14, color: '#64748b', fontWeight: 500, marginRight: 8 }}>
              Popular searches:
            </span>
            {SUGGESTED_TAGS.slice(0, 8).map(tag => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                style={{
                  background: searchQuery === tag 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                    : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                  color: searchQuery === tag ? 'white' : '#475569',
                  border: searchQuery === tag ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                  borderRadius: 20,
                  padding: '8px 16px',
                  fontSize: 13,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  textTransform: 'capitalize',
                  boxShadow: searchQuery === tag 
                    ? '0 4px 15px rgba(59, 130, 246, 0.25)' 
                    : '0 2px 8px rgba(0, 0, 0, 0.05)',
                  transform: searchQuery === tag ? 'translateY(-1px)' : 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                  if (searchQuery !== tag) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                    e.currentTarget.style.color = 'white'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (searchQuery !== tag) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
                    e.currentTarget.style.color = '#475569'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)'
                  }
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Consultants Grid */}
      <div style={{
        maxWidth: 1400,
        margin: '40px auto',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: isMobile 
          ? '1fr' 
          : typeof window !== 'undefined' && window.innerWidth < 1024
          ? 'repeat(2, 1fr)'
          : typeof window !== 'undefined' && window.innerWidth < 1280
          ? 'repeat(3, 1fr)'
          : 'repeat(4, 1fr)',
        gap: isMobile ? 20 : 24,
      }}>
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
        <div style={{
          maxWidth: 600,
          margin: '80px auto',
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: 24,
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{
            fontSize: 64,
            marginBottom: 24,
            opacity: 0.5
          }}>🔍</div>
          <h3 style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#0f172a',
            margin: '0 0 16px 0'
          }}>
            No consultants found
          </h3>
          <p style={{
            color: '#64748b',
            fontSize: 16,
            lineHeight: 1.6,
            margin: 0
          }}>
            Try adjusting your filters or search terms to find the perfect consultant for your needs.
          </p>
        </div>
      )}
    </div>
  )
} 