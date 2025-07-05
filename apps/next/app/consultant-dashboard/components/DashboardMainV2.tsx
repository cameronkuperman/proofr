"use client"

import { useState, useEffect } from 'react'
import { useConsultantData } from '../../../../../lib/hooks/useConsultantData'
import { supabase } from '../../../../../lib/supabase'
import { LogoutButton } from '../../../../../lib/components/LogoutButton'

// Loading skeleton
const DashboardSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-100 rounded-xl h-32"></div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-gray-100 rounded-xl h-96"></div>
      <div className="bg-gray-100 rounded-xl h-96"></div>
    </div>
  </div>
)

// Error component
const DashboardError = ({ error, onRetry }: { error: Error, onRetry: () => void }) => (
  <div className="max-w-md mx-auto text-center py-20">
    <div className="text-6xl mb-4">⚠️</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
    <p className="text-gray-600 mb-6">{error.message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
    >
      Try Again
    </button>
  </div>
)

export default function DashboardMainV2() {
  const { profile, services, stats, loading, error, refetch } = useConsultantData()
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'services'>('overview')
  const [recentBookings, setRecentBookings] = useState<any[]>([])
  const [conversations, setConversations] = useState<any[]>([])
  const [showNotification, setShowNotification] = useState(false)

  // Fetch recent bookings and conversations
  useEffect(() => {
    if (!profile?.id) return

    const fetchData = async () => {
      // Fetch recent bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          students (name, school),
          services (title)
        `)
        .eq('consultant_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (bookingsData) setRecentBookings(bookingsData)

      // Fetch conversations with unread counts
      const { data: convData } = await supabase
        .from('conversations')
        .select(`
          *,
          students (name, school, users(profile_image_url)),
          messages (
            content,
            created_at
          )
        `)
        .eq('consultant_id', profile.id)
        .eq('is_archived', false)
        .order('last_message_at', { ascending: false })
        .limit(5)

      if (convData) setConversations(convData)
    }

    fetchData()

    // Subscribe to new bookings
    const subscription = supabase
      .channel('consultant-bookings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `consultant_id=eq.${profile.id}`
        },
        () => {
          setShowNotification(true)
          fetchData()
          setTimeout(() => setShowNotification(false), 5000)
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [profile?.id])

  if (loading) return <DashboardSkeleton />
  if (error) return <DashboardError error={error} onRetry={refetch} />
  if (!profile) return null

  // Calculate metrics
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.consultant_unread_count, 0)
  const pendingBookings = recentBookings.filter(b => b.status === 'pending').length
  const activeOrders = recentBookings.filter(b => ['accepted', 'in_progress'].includes(b.status)).length
  const completionRate = stats.totalBookings > 0 
    ? Math.round((stats.completedBookings / stats.totalBookings) * 100) 
    : 0

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-semibold">Proofr</h1>
              <nav className="hidden md:flex space-x-8">
                {['overview', 'messages', 'services'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`text-sm font-medium capitalize transition-colors relative py-5 ${
                      activeTab === tab 
                        ? 'text-gray-900' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                    {tab === 'messages' && totalUnread > 0 && (
                      <span className="absolute -top-1 -right-4 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {totalUnread}
                      </span>
                    )}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"></span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              <button 
                onClick={() => window.location.href = '/dev-menu'}
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Dev Menu
              </button>
              <LogoutButton className="text-sm font-medium text-gray-700 hover:text-gray-900">
                Sign out
              </LogoutButton>
            </div>
          </div>
        </div>
      </header>

      {/* New Order Notification */}
      {showNotification && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
          <p className="font-medium">New order received! 🎉</p>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <>
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {profile.name}
              </h2>
              <p className="text-gray-600">
                {profile.vacation_mode 
                  ? "You're in vacation mode. Your profile is hidden."
                  : pendingBookings > 0 
                    ? `You have ${pendingBookings} new order${pendingBookings > 1 ? 's' : ''} waiting for approval.`
                    : "Everything looks good. Keep up the great work!"}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Revenue (30d)</p>
                  <span className="text-2xl">💰</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">${stats.monthlyEarnings.toFixed(0)}</p>
                <p className="text-sm text-green-600 mt-1">
                  +{((stats.monthlyEarnings / Math.max(1, stats.totalEarnings - stats.monthlyEarnings)) * 100).toFixed(0)}% vs last month
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Active Orders</p>
                  <span className="text-2xl">📝</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{activeOrders}</p>
                <p className="text-sm text-gray-500 mt-1">{pendingBookings} pending</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                  <span className="text-2xl">✅</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
                <p className="text-sm text-gray-500 mt-1">{stats.completedBookings} completed</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-600">Avg Response</p>
                  <span className="text-2xl">⚡</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stats.responseTime}h</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.responseTime <= 12 ? 'Excellent' : stats.responseTime <= 24 ? 'Good' : 'Needs improvement'}
                </p>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders */}
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {recentBookings.length > 0 ? (
                    recentBookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              {booking.services?.title || 'Service'}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {booking.students?.name} • {booking.students?.school}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(booking.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">${booking.final_price}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${
                              booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              booking.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <p className="text-gray-500">No orders yet</p>
                    </div>
                  )}
                </div>
                {recentBookings.length > 5 && (
                  <div className="p-4 border-t border-gray-100">
                    <button className="w-full text-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      View all orders →
                    </button>
                  </div>
                )}
              </div>

              {/* Quick Actions & Inbox */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Create New Service</span>
                        <span>→</span>
                      </div>
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Edit Profile</span>
                        <span>→</span>
                      </div>
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Availability Settings</span>
                        <span>→</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Recent Messages */}
                <div className="bg-white border border-gray-200 rounded-xl">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
                      {totalUnread > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">
                          {totalUnread} unread
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {conversations.length > 0 ? (
                      conversations.slice(0, 3).map((conv) => (
                        <div key={conv.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="flex items-start space-x-3">
                            <img
                              src={conv.students?.users?.profile_image_url || '/api/placeholder/40/40'}
                              alt=""
                              className="h-10 w-10 rounded-full"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {conv.students?.name}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {conv.last_message_preview}
                              </p>
                            </div>
                            {conv.consultant_unread_count > 0 && (
                              <span className="flex-shrink-0 h-2 w-2 bg-blue-500 rounded-full"></span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-gray-500 text-sm">No messages yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Messages</h3>
              <p className="text-gray-600 mt-1">Coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="bg-white border border-gray-200 rounded-xl">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900">Services</h3>
              <p className="text-gray-600 mt-1">Manage your services here...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}