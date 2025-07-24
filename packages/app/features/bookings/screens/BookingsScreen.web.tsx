import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Clock, Archive, Bookmark, Star, Calendar, Users, DollarSign, Video, MessageCircle, ChevronRight, ArrowLeft, Home, LayoutDashboard } from 'lucide-react'
import { supabase } from '../../../../../lib/supabase'
import { useBookings } from '../hooks/useBookings'
import { useSavedConsultants } from '../hooks/useSavedConsultants'
import { useGroupSessions } from '../hooks/useGroupSessions'
import { ActiveBookingsWeb } from '../components/ActiveBookings.web'
import { BookingHistoryWeb } from '../components/BookingHistory.web'
import { SavedConsultantsWeb } from '../components/SavedConsultants.web'
import type { BookingTab } from '../types/bookings.types'

export function BookingsScreen() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<BookingTab>('active')
  const [userEmail, setUserEmail] = useState<string>('')
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/sign-in')
        return
      }
      
      // Check if user is a student
      const { data: userData } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', user.id)
        .single()
      
      if (userData?.user_type !== 'student') {
        router.push('/consultant-dashboard')
        return
      }
      
      setUserId(user.id)
      setUserEmail(user.email || '')
    } finally {
      setIsAuthLoading(false)
    }
  }

  // Fetch data
  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
    stats,
    refetch: refetchBookings,
    submitRating,
  } = useBookings(userId || '')

  const {
    savedConsultants,
    waitlists,
    loading: savedLoading,
    error: savedError,
    refetch: refetchSaved,
    toggleSaveConsultant,
    joinWaitlist,
    leaveWaitlist,
  } = useSavedConsultants(userId || '')

  const {
    availableSessions,
    enrolledSessions,
    loading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions,
    joinGroupSession,
    leaveGroupSession,
  } = useGroupSessions(userId || '')

  // Show loading while checking auth
  if (isAuthLoading || !userId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const loading = bookingsLoading || savedLoading || sessionsLoading
  const error = bookingsError || savedError || sessionsError

  const tabs: { key: BookingTab; label: string; icon: React.ReactNode }[] = [
    { key: 'active', label: 'Active', icon: <Clock className="w-4 h-4" /> },
    { key: 'history', label: 'History', icon: <Archive className="w-4 h-4" /> },
    { key: 'saved', label: 'Saved', icon: <Bookmark className="w-4 h-4" /> },
  ]

  // Filter bookings by status
  const activeBookings = bookings.filter((b) =>
    ['pending', 'confirmed', 'in_progress'].includes(b.status)
  )
  const completedBookings = bookings.filter((b) =>
    ['completed', 'cancelled', 'refunded'].includes(b.status)
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/student-dashboard')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Back to Dashboard</span>
              </button>
              <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
              <nav className="hidden sm:flex items-center space-x-4">
                <button
                  onClick={() => router.push('/student-dashboard')}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => router.push('/browse')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Browse
                </button>
                <button
                  onClick={() => router.push('/messages')}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Messages
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{userEmail}</span>
              <button
                onClick={() => router.push('/profile')}
                className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-medium"
              >
                {userEmail.charAt(0).toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            
            {stats.unratedSessions > 0 && (
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-full flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span className="text-sm font-semibold">{stats.unratedSessions} to rate</span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">{stats.totalSessions}</p>
              <p className="text-sm text-gray-600 mt-1">Total Sessions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">{stats.upcomingSessions}</p>
              <p className="text-sm text-gray-600 mt-1">Upcoming</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">${stats.totalCreditsEarned.toFixed(0)}</p>
              <p className="text-sm text-gray-600 mt-1">Credits Earned</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-indigo-600">{stats.averageRating.toFixed(1)}</p>
              <p className="text-sm text-gray-600 mt-1">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-4 text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {activeTab === 'active' && (
            <ActiveBookingsWeb
              bookings={activeBookings}
              enrolledSessions={enrolledSessions}
              availableSessions={availableSessions}
              onJoinSession={joinGroupSession}
              onLeaveSession={leaveGroupSession}
            />
          )}

          {activeTab === 'history' && (
            <BookingHistoryWeb
              bookings={completedBookings}
              unratedCount={stats.unratedSessions}
              onSubmitRating={submitRating}
            />
          )}

          {activeTab === 'saved' && (
            <SavedConsultantsWeb
              savedConsultants={savedConsultants}
              waitlists={waitlists}
              onToggleSave={toggleSaveConsultant}
              onJoinWaitlist={joinWaitlist}
              onLeaveWaitlist={leaveWaitlist}
            />
          )}
        </div>
      </div>
    </div>
  )
}