"use client"

import { useState } from 'react'
import { NavigationBar } from 'app/features/landing/components/NavigationBar'

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
  'essay reviews',
  'mock interviews',
  'application strategy',
  'resume help',
  'scholarship guidance',
  'SAT tutoring',
  'school-specific advice',
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

  // Filtering logic
  const filteredConsultants = MOCK_CONSULTANTS.filter((consultant) => {
    const matchesSearch =
      consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      consultant.description.toLowerCase().includes(searchQuery.toLowerCase())
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
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      <NavigationBar />
      {/* Top Search Bar */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: isMobile ? '32px 16px 16px 16px' : '48px 0 16px 0',
        position: 'sticky',
        top: 64,
        zIndex: 10,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: '16px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search for consultants, services, or universities..."
            style={{
              flex: 1,
              fontSize: 18,
              padding: '14px 20px',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              background: '#f1f5f9',
              outline: 'none',
              marginBottom: isMobile ? 12 : 0,
            }}
          />
          {/* Verified Toggle */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, color: '#334155', fontWeight: 500 }}>
            <input
              type="checkbox"
              checked={showVerified}
              onChange={() => setShowVerified(v => !v)}
              style={{ accentColor: '#3b82f6', width: 18, height: 18 }}
            />
            Verified Consultants
          </label>
        </div>
        {/* Suggested Tags */}
        <div style={{ maxWidth: 1200, margin: '12px auto 0 auto', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SUGGESTED_TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              style={{
                background: '#e0e7ef',
                color: '#334155',
                border: 'none',
                borderRadius: 20,
                padding: '6px 16px',
                fontSize: 14,
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'background 0.2s',
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      {/* Horizontal Filter Bar */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: isMobile ? '10px 0' : '18px 0',
        position: 'sticky',
        top: isMobile ? 90 : 110,
        zIndex: 9,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          {/* University Filter */}
          <select
            value={selectedUniversity}
            onChange={e => setSelectedUniversity(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 15 }}
          >
            {UNIVERSITY_FILTERS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {/* Service Type Filter */}
          <select
            value={selectedService}
            onChange={e => setSelectedService(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 15 }}
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
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 15 }}
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
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 15 }}
          >
            {AVAILABILITY_FILTERS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {/* Sort By */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, color: '#64748b' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 15 }}
            >
              <option value="rating">Highest Rating</option>
              <option value="reviews">Most Reviews</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
      {/* Results Count */}
      <div style={{ maxWidth: 1200, margin: '24px auto 0 auto', color: '#64748b', fontSize: 16, fontWeight: 500 }}>
        {sortedConsultants.length} consultants found
      </div>
      {/* Consultants Grid */}
      <div style={{
        maxWidth: 1200,
        margin: '24px auto',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 28,
      }}>
        {sortedConsultants.map(consultant => (
          <div
            key={consultant.id}
            style={{
              background: 'white',
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(30,41,59,0.06)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              minHeight: 340,
              transition: 'box-shadow 0.25s, filter 0.25s',
              cursor: 'pointer',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(30,41,59,0.14)';
              e.currentTarget.style.filter = 'brightness(1.03)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(30,41,59,0.06)';
              e.currentTarget.style.filter = 'none';
            }}
          >
            {/* Favorite/Heart Icon */}
            <button style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', zIndex: 2 }}>
              <span style={{ fontSize: 22, color: '#eab308' }}>♡</span>
            </button>
            {/* Profile Image */}
            <img
              src={consultant.image}
              alt={consultant.name}
              style={{ width: '100%', height: 160, objectFit: 'cover', background: '#f1f5f9' }}
            />
            <div style={{ padding: '18px 18px 12px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* Availability Dot */}
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: consultant.available ? '#22c55e' : '#e2e8f0', display: 'inline-block', marginRight: 4, border: '1.5px solid #fff' }} />
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 18 }}>{consultant.name}</span>
                {consultant.verified && (
                  <span style={{ marginLeft: 6, background: '#3b82f6', color: 'white', fontSize: 12, borderRadius: 8, padding: '2px 8px', fontWeight: 600 }}>
                    Verified
                  </span>
                )}
              </div>
              <div style={{ color: '#64748b', fontSize: 15, fontWeight: 500 }}>{consultant.university}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ color: '#fbbf24', fontSize: 16 }}>★</span>
                <span style={{ fontWeight: 600, color: '#0f172a', fontSize: 15 }}>{consultant.rating}</span>
                <span style={{ color: '#64748b', fontSize: 14 }}>({consultant.reviews})</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '4px 0' }}>
                {consultant.services.map(service => (
                  <span key={service} style={{ background: '#f1f5f9', color: '#334155', fontSize: 13, borderRadius: 6, padding: '2px 8px', fontWeight: 500 }}>{service}</span>
                ))}
              </div>
              <div style={{ color: '#64748b', fontSize: 14, margin: '4px 0 0 0', flex: 1 }}>{consultant.description}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                <span style={{ color: '#64748b', fontSize: 14 }}>From</span>
                <span style={{ color: '#0f172a', fontWeight: 700, fontSize: 22 }}>${consultant.price}</span>
                <button style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, padding: '8px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 