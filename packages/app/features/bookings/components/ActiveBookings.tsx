import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useThemedColors } from '../../../contexts/ThemeContext'
import type { Booking } from '../types/bookings.types'
import { getUniversityColor, isLightColor } from '../../../utils/colorUtils'

interface ActiveBookingsProps {
  bookings: Booking[]
  enrolledSessions: Booking[]
  availableSessions: Booking[]
  onJoinSession: (bookingId: string) => Promise<{ success: boolean; error?: string }>
  onLeaveSession: (bookingId: string) => Promise<{ success: boolean; error?: string }>
  navigation: any
}

// Removed UNIVERSITY_COLORS - now using colorUtils

export function ActiveBookings({
  bookings,
  enrolledSessions,
  availableSessions,
  onJoinSession,
  onLeaveSession,
  navigation,
}: ActiveBookingsProps) {
  const colors = useThemedColors()

  const handleJoinMeeting = (meetingLink: string) => {
    if (meetingLink) {
      Linking.openURL(meetingLink)
    } else {
      Alert.alert('No Meeting Link', 'The meeting link has not been set yet.')
    }
  }

  const handleJoinGroup = async (bookingId: string) => {
    const result = await onJoinSession(bookingId)
    if (result.success) {
      Alert.alert('Success', 'You have joined the group session!')
    } else {
      Alert.alert('Error', result.error || 'Failed to join session')
    }
  }

  const handleLeaveGroup = async (bookingId: string) => {
    Alert.alert(
      'Leave Session',
      'Are you sure you want to leave this group session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            const result = await onLeaveSession(bookingId)
            if (result.success) {
              Alert.alert('Success', 'You have left the group session')
            } else {
              Alert.alert('Error', result.error || 'Failed to leave session')
            }
          },
        },
      ]
    )
  }

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

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.scheduled_at) > new Date()
  )
  const inProgressBookings = bookings.filter((b) => b.status === 'in_progress')
  const pendingBookings = bookings.filter((b) => b.status === 'pending')

  const renderBookingCard = (booking: Booking, showActions = true) => (
    <TouchableOpacity
      key={booking.id}
      style={{
        backgroundColor: colors.surface.raised,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border.default,
      }}
      onPress={() => navigation.navigate('BookingDetail', { bookingId: booking.id })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Image
          source={{ uri: booking.consultant?.avatar_url || `https://ui-avatars.com/api/?name=${booking.consultant?.name || 'Consultant'}&background=10B981&color=fff&size=200` }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.gray[200],
          }}
        />
        
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text.primary }}>
              {booking.consultant?.name || 'Consultant'}
            </Text>
            {booking.consultant?.university && (() => {
              const bgColor = getUniversityColor(booking.consultant.university)
              const textColor = isLightColor(bgColor) ? '#000' : '#fff'
              return (
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    backgroundColor: bgColor,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ fontSize: 10, color: textColor, fontWeight: '600' }}>
                    {booking.consultant.university}
                  </Text>
                </View>
              )
            })()}
          </View>
          
          <Text style={{ fontSize: 14, color: colors.text.secondary, marginTop: 2 }}>
            {booking.service?.title || 'Service'}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Feather name="calendar" size={12} color={colors.text.tertiary} />
            <Text style={{ fontSize: 12, color: colors.text.tertiary, marginLeft: 4 }}>
              {new Date(booking.scheduled_at).toLocaleDateString()} at {new Date(booking.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          
          {booking.is_group_session && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Feather name="users" size={12} color={colors.primary} />
              <Text style={{ fontSize: 12, color: colors.primary, marginLeft: 4 }}>
                {booking.current_participants}/{booking.max_participants} participants
              </Text>
            </View>
          )}
        </View>
        
        <View style={{ alignItems: 'flex-end' }}>
          {booking.status === 'confirmed' && (
            <View
              style={{
                backgroundColor: colors.primary + '20',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.primary, fontWeight: '600' }}>
                {formatTimeUntil(booking.scheduled_at)}
              </Text>
            </View>
          )}
          
          {booking.status === 'in_progress' && (
            <View
              style={{
                backgroundColor: colors.info + '20',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.info, fontWeight: '600' }}>
                In Progress
              </Text>
            </View>
          )}
          
          {booking.status === 'pending' && (
            <View
              style={{
                backgroundColor: colors.warning + '20',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Text style={{ fontSize: 12, color: colors.warning, fontWeight: '600' }}>
                Pending
              </Text>
            </View>
          )}
        </View>
      </View>
      
      {showActions && booking.status === 'confirmed' && (
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          {booking.meeting_link && (
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.primary,
                paddingVertical: 8,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => handleJoinMeeting(booking.meeting_link!)}
            >
              <Feather name="video" size={14} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600', marginLeft: 6 }}>
                Join Meeting
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: colors.surface.default,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border.default,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => navigation.navigate('Messages', { consultantId: booking.consultant_id })}
          >
            <Feather name="message-circle" size={14} color={colors.text.secondary} />
            <Text style={{ color: colors.text.secondary, fontSize: 14, fontWeight: '600', marginLeft: 6 }}>
              Message
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  )

  const renderGroupSessionCard = (session: Booking, isEnrolled: boolean) => (
    <TouchableOpacity
      key={session.id}
      style={{
        backgroundColor: colors.surface.raised,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: isEnrolled ? colors.primary + '40' : colors.border.default,
      }}
      onPress={() => navigation.navigate('BookingDetail', { bookingId: session.id })}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.primary + '20',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Feather name="users" size={24} color={colors.primary} />
        </View>
        
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text.primary }}>
            {session.service?.name || 'Group Session'}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <Text style={{ fontSize: 14, color: colors.text.secondary }}>
              with {session.consultant?.name}
            </Text>
            {session.consultant?.university && (() => {
              const bgColor = getUniversityColor(session.consultant.university)
              const textColor = isLightColor(bgColor) ? '#000' : '#fff'
              return (
                <View
                  style={{
                    paddingHorizontal: 6,
                    paddingVertical: 1,
                    backgroundColor: bgColor,
                    borderRadius: 3,
                  }}
                >
                  <Text style={{ fontSize: 9, color: textColor, fontWeight: '600' }}>
                    {session.consultant.university}
                  </Text>
                </View>
              )
            })()}
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="calendar" size={12} color={colors.text.tertiary} />
              <Text style={{ fontSize: 12, color: colors.text.tertiary, marginLeft: 4 }}>
                {new Date(session.scheduled_at).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="clock" size={12} color={colors.text.tertiary} />
              <Text style={{ fontSize: 12, color: colors.text.tertiary, marginLeft: 4 }}>
                {new Date(session.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Feather name="users" size={12} color={colors.primary} />
              <Text style={{ fontSize: 12, color: colors.primary, marginLeft: 4, fontWeight: '600' }}>
                {session.current_participants}/{session.max_participants}
              </Text>
            </View>
          </View>
        </View>
        
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text.primary }}>
            ${session.final_price}
          </Text>
          <Text style={{ fontSize: 12, color: colors.text.tertiary }}>
            per person
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={{
          marginTop: 12,
          backgroundColor: isEnrolled ? colors.error + '10' : colors.primary,
          paddingVertical: 10,
          borderRadius: 8,
          alignItems: 'center',
        }}
        onPress={() => isEnrolled ? handleLeaveGroup(session.id) : handleJoinGroup(session.id)}
      >
        <Text style={{ color: isEnrolled ? colors.error : '#fff', fontSize: 14, fontWeight: '600' }}>
          {isEnrolled ? 'Leave Session' : 'Join Session'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
      {/* 1:1 Sessions */}
      {upcomingBookings.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text.primary, marginBottom: 12 }}>
            Upcoming Sessions
          </Text>
          {upcomingBookings.filter(b => !b.is_group_session).map(booking => renderBookingCard(booking))}
        </View>
      )}
      
      {inProgressBookings.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text.primary, marginBottom: 12 }}>
            In Progress
          </Text>
          {inProgressBookings.map(booking => renderBookingCard(booking))}
        </View>
      )}
      
      {pendingBookings.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text.primary, marginBottom: 12 }}>
            Awaiting Confirmation
          </Text>
          {pendingBookings.map(booking => renderBookingCard(booking, false))}
        </View>
      )}
      
      {/* Group Sessions */}
      {enrolledSessions.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text.primary, marginBottom: 12 }}>
            My Group Sessions
          </Text>
          {enrolledSessions.map(session => renderGroupSessionCard(session, true))}
        </View>
      )}
      
      {availableSessions.length > 0 && (
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text.primary }}>
              Available Group Sessions
            </Text>
            <TouchableOpacity>
              <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '600' }}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
          {availableSessions.slice(0, 3).map(session => renderGroupSessionCard(session, false))}
        </View>
      )}
      
      {/* Empty State */}
      {bookings.length === 0 && enrolledSessions.length === 0 && (
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 60,
          }}
        >
          <Feather name="calendar" size={48} color={colors.text.tertiary} />
          <Text style={{ fontSize: 18, color: colors.text.secondary, marginTop: 16, textAlign: 'center' }}>
            No active bookings yet
          </Text>
          <Text style={{ fontSize: 14, color: colors.text.tertiary, marginTop: 8, textAlign: 'center' }}>
            Browse consultants to book your first session
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 24,
              backgroundColor: colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
            }}
            onPress={() => navigation.navigate('Browse')}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
              Browse Consultants
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}