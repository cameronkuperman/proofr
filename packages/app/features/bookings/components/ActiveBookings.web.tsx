import React from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, Clock, Users, Video, MessageCircle, MapPin, AlertCircle } from 'lucide-react'
import type { Booking } from '../types/bookings.types'

interface ActiveBookingsWebProps {
  bookings: Booking[]
  enrolledSessions: Booking[]
  availableSessions: Booking[]
  onJoinSession: (bookingId: string) => Promise<{ success: boolean; error?: string }>
  onLeaveSession: (bookingId: string) => Promise<{ success: boolean; error?: string }>
}

// University colors
const UNIVERSITY_COLORS = {
  harvard: '#A51C30',
  yale: '#00356B',
  princeton: '#FF6900',
  stanford: '#8C1515',
  mit: '#A31F34',
}

export function ActiveBookingsWeb({
  bookings,
  enrolledSessions,
  availableSessions,
  onJoinSession,
  onLeaveSession,
}: ActiveBookingsWebProps) {
  const router = useRouter()

  const formatTimeUntil = (date: string) => {
    const now = new Date()
    const sessionDate = new Date(date)
    const diff = sessionDate.getTime() - now.getTime()
    
    if (diff < 0) return 'Started'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const handleJoinMeeting = (meetingLink: string) => {
    window.open(meetingLink, '_blank')
  }

  const handleJoinGroup = async (bookingId: string) => {
    const result = await onJoinSession(bookingId)
    if (!result.success) {
      alert(result.error || 'Failed to join session')
    }
  }

  const handleLeaveGroup = async (bookingId: string) => {
    if (confirm('Are you sure you want to leave this group session?')) {
      const result = await onLeaveSession(bookingId)
      if (!result.success) {
        alert(result.error || 'Failed to leave session')
      }
    }
  }

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.scheduled_at) > new Date()
  )
  const inProgressBookings = bookings.filter((b) => b.status === 'in_progress')
  const pendingBookings = bookings.filter((b) => b.status === 'pending')

  const renderBookingCard = (booking: Booking, showActions = true) => (
    <div
      key={booking.id}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => router.push(`/bookings/${booking.id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <img
            src={`https://ui-avatars.com/api/?name=${booking.consultant?.name || 'Consultant'}&background=6366F1&color=fff&size=200`}
            alt={booking.consultant?.name}
            className="w-12 h-12 rounded-full"
          />
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">
                {booking.consultant?.name || 'Consultant'}
              </h3>
              {booking.consultant?.university && (
                <span
                  className="px-2 py-1 text-xs font-semibold text-white rounded"
                  style={{ backgroundColor: UNIVERSITY_COLORS[booking.consultant.university.toLowerCase()] || '#6B7280' }}
                >
                  {booking.consultant.university}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mt-1">
              {booking.service?.title || 'Service'}
            </p>
            
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(booking.scheduled_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(booking.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              {booking.is_group_session && (
                <div className="flex items-center space-x-1 text-indigo-600">
                  <Users className="w-4 h-4" />
                  <span>{booking.current_participants}/{booking.max_participants} participants</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          {booking.status === 'confirmed' && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              {formatTimeUntil(booking.scheduled_at)}
            </div>
          )}
          {booking.status === 'in_progress' && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              In Progress
            </div>
          )}
          {booking.status === 'pending' && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Pending
            </div>
          )}
        </div>
      </div>
      
      {showActions && booking.status === 'confirmed' && (
        <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-100">
          {booking.meeting_link && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleJoinMeeting(booking.meeting_link!)
              }}
              className="flex-1 flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Video className="w-4 h-4" />
              <span>Join Meeting</span>
            </button>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/messages?consultant=${booking.consultant_id}`)
            }}
            className="flex-1 flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message</span>
          </button>
        </div>
      )}
    </div>
  )

  const renderGroupSessionCard = (session: Booking, isEnrolled: boolean) => (
    <div
      key={session.id}
      className={`bg-white border rounded-lg p-6 hover:shadow-md transition-all cursor-pointer ${
        isEnrolled ? 'border-indigo-300 bg-indigo-50/50' : 'border-gray-200'
      }`}
      onClick={() => router.push(`/bookings/${session.id}`)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">
              {session.service?.name || 'Group Session'}
            </h3>
            
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-sm text-gray-600">
                with {session.consultant?.name}
              </p>
              {session.consultant?.university && (
                <span
                  className="px-2 py-0.5 text-xs font-semibold text-white rounded"
                  style={{ backgroundColor: UNIVERSITY_COLORS[session.consultant.university.toLowerCase()] || '#6B7280' }}
                >
                  {session.consultant.university}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(session.scheduled_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex items-center space-x-1 text-indigo-600 font-medium">
                <Users className="w-4 h-4" />
                <span>{session.current_participants}/{session.max_participants}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">${session.final_price}</p>
          <p className="text-sm text-gray-500">per person</p>
        </div>
      </div>
      
      <button
        onClick={(e) => {
          e.stopPropagation()
          isEnrolled ? handleLeaveGroup(session.id) : handleJoinGroup(session.id)
        }}
        className={`w-full mt-4 py-2 px-4 rounded-lg font-medium transition-colors ${
          isEnrolled
            ? 'bg-red-50 text-red-600 hover:bg-red-100'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {isEnrolled ? 'Leave Session' : 'Join Session'}
      </button>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* 1:1 Sessions */}
      {upcomingBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
          <div className="space-y-4">
            {upcomingBookings.filter(b => !b.is_group_session).map(booking => renderBookingCard(booking))}
          </div>
        </div>
      )}
      
      {inProgressBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">In Progress</h2>
          <div className="space-y-4">
            {inProgressBookings.map(booking => renderBookingCard(booking))}
          </div>
        </div>
      )}
      
      {pendingBookings.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Awaiting Confirmation</h2>
          <div className="space-y-4">
            {pendingBookings.map(booking => renderBookingCard(booking, false))}
          </div>
        </div>
      )}
      
      {/* Group Sessions */}
      {enrolledSessions.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">My Group Sessions</h2>
          <div className="space-y-4">
            {enrolledSessions.map(session => renderGroupSessionCard(session, true))}
          </div>
        </div>
      )}
      
      {availableSessions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Available Group Sessions</h2>
            <button
              onClick={() => router.push('/browse?filter=group')}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-sm"
            >
              View All →
            </button>
          </div>
          <div className="space-y-4">
            {availableSessions.slice(0, 3).map(session => renderGroupSessionCard(session, false))}
          </div>
        </div>
      )}
      
      {/* Empty State */}
      {bookings.length === 0 && enrolledSessions.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No active bookings yet</h3>
          <p className="text-gray-600 mb-6">Browse consultants to book your first session</p>
          <button
            onClick={() => router.push('/browse')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Consultants
          </button>
        </div>
      )}
    </div>
  )
}