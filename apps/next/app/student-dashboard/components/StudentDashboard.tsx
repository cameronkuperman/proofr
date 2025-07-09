'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../../../lib/supabase'
import { LogoutButton } from '../../../../../lib/components/LogoutButton'
import ConsultantCard from './ConsultantCard'
import SearchFilters from './SearchFilters'

export default function StudentDashboard() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [consultants, setConsultants] = useState<any[]>([])
  const [savedConsultants, setSavedConsultants] = useState<string[]>([])
  const [activeBookings, setActiveBookings] = useState<any[]>([])
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    school: '',
    service: '',
    minPrice: 0,
    maxPrice: 1000,
    availability: 'all'
  })

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/sign-in')
        return
      }

      // Load student profile
      const { data: studentProfile } = await supabase
        .from('students')
        .select('*, users!inner(email, profile_image_url)')
        .eq('id', user.id)
        .single()

      setProfile(studentProfile)

      // Load consultants with their services
      const { data: consultantData } = await supabase
        .from('consultants')
        .select(`
          *,
          users!inner(email, profile_image_url),
          services(*)
        `)
        .eq('is_available', true)
        .eq('vacation_mode', false)

      setConsultants(consultantData || [])

      // Load saved consultants
      const { data: saved } = await supabase
        .from('saved_consultants')
        .select('consultant_id')
        .eq('student_id', user.id)

      setSavedConsultants(saved?.map(s => s.consultant_id) || [])

      // Load active bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          *,
          consultants(name, users(profile_image_url)),
          services(title)
        `)
        .eq('student_id', user.id)
        .in('status', ['pending', 'accepted', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(3)

      setActiveBookings(bookings || [])

      // Load unread message count
      const { data: conversations } = await supabase
        .from('conversations')
        .select('student_unread_count')
        .eq('student_id', user.id)

      const totalUnread = conversations?.reduce((sum, conv) => sum + conv.student_unread_count, 0) || 0
      setUnreadMessages(totalUnread)

    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleSaveConsultant = async (consultantId: string) => {
    if (savedConsultants.includes(consultantId)) {
      await supabase
        .from('saved_consultants')
        .delete()
        .eq('student_id', profile.id)
        .eq('consultant_id', consultantId)
      
      setSavedConsultants(prev => prev.filter(id => id !== consultantId))
    } else {
      await supabase
        .from('saved_consultants')
        .insert({
          student_id: profile.id,
          consultant_id: consultantId
        })
      
      setSavedConsultants(prev => [...prev, consultantId])
    }
  }

  const filteredConsultants = consultants.filter(consultant => {
    // Search query
    if (searchQuery && !consultant.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !consultant.bio?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // School filter
    if (filters.school && consultant.school !== filters.school) {
      return false
    }

    // Service filter
    if (filters.service && !consultant.services?.some((s: any) => s.service_type === filters.service)) {
      return false
    }

    // Price filter
    const minPrice = Math.min(...(consultant.services?.flatMap((s: any) => s.prices) || [Infinity]))
    if (minPrice < filters.minPrice || minPrice > filters.maxPrice) {
      return false
    }

    // Availability filter
    if (filters.availability === 'now' && !consultant.is_available) {
      return false
    }

    return true
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Proofr</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search consultants, schools, or services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Right Nav */}
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => router.push('/student-dashboard/messages')}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadMessages}
                  </span>
                )}
              </button>

              <button
                onClick={() => router.push('/bookings')}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Orders
              </button>

              <button
                onClick={() => router.push('/saved')}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Saved
              </button>

              <button
                onClick={() => router.push('/dev-menu')}
                className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                Dev Menu
              </button>

              <LogoutButton className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
                Sign out
              </LogoutButton>
            </div>
          </div>
        </div>
      </header>

      {/* Active Bookings Strip */}
      {activeBookings.length > 0 && (
        <div className="bg-cyan-50 border-b border-cyan-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <span className="text-sm font-medium text-cyan-800">Active Orders:</span>
                {activeBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center space-x-2 text-sm">
                    <img 
                      src={booking.consultants.users.profile_image_url || '/api/placeholder/32/32'} 
                      alt={booking.consultants.name}
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="text-gray-700">{booking.services.title}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-cyan-600 font-medium">{booking.status}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => router.push('/bookings')}
                className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
              >
                View all →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <SearchFilters 
              filters={filters}
              setFilters={setFilters}
              consultants={consultants}
            />
          </aside>

          {/* Consultant Grid */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                {filters.school || filters.service || searchQuery 
                  ? `${filteredConsultants.length} consultants found`
                  : 'All Consultants'
                }
              </h2>
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500">
                <option>Best Match</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Reviews</option>
                <option>Highest Rated</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConsultants.map((consultant) => (
                <ConsultantCard
                  key={consultant.id}
                  consultant={consultant}
                  isSaved={savedConsultants.includes(consultant.id)}
                  onToggleSave={() => toggleSaveConsultant(consultant.id)}
                  onMessage={() => router.push(`/student-dashboard/messages?consultant=${consultant.id}`)}
                  onViewProfile={() => router.push(`/consultant/${consultant.id}`)}
                />
              ))}
            </div>

            {filteredConsultants.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No consultants found matching your criteria.</p>
                <button 
                  onClick={() => setFilters({
                    school: '',
                    service: '',
                    minPrice: 0,
                    maxPrice: 1000,
                    availability: 'all'
                  })}
                  className="mt-4 text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}