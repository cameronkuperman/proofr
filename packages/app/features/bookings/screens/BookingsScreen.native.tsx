import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import { useThemedColors } from '../../../contexts/ThemeContext'
import { useAuth } from '../../../contexts/AuthContext'
import { useBookings } from '../hooks/useBookings'
import { useSavedConsultants } from '../hooks/useSavedConsultants'
import { useGroupSessions } from '../hooks/useGroupSessions'
import { ActiveBookings } from '../components/ActiveBookings'
import { BookingHistory } from '../components/BookingHistory'
import { SavedConsultants } from '../components/SavedConsultants'
import type { BookingTab } from '../types/bookings.types'

export function BookingsScreen() {
  const colors = useThemedColors()
  const navigation = useNavigation<any>()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<BookingTab>('active')
  const [refreshing, setRefreshing] = useState(false)

  // Fetch data
  const {
    bookings,
    loading: bookingsLoading,
    error: bookingsError,
    stats,
    refetch: refetchBookings,
    submitRating,
  } = useBookings(user?.id || '')

  const {
    savedConsultants,
    waitlists,
    loading: savedLoading,
    error: savedError,
    refetch: refetchSaved,
    toggleSaveConsultant,
    joinWaitlist,
    leaveWaitlist,
  } = useSavedConsultants(user?.id || '')

  const {
    availableSessions,
    enrolledSessions,
    loading: sessionsLoading,
    error: sessionsError,
    refetch: refetchSessions,
    joinGroupSession,
    leaveGroupSession,
  } = useGroupSessions(user?.id || '')

  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([
      refetchBookings(),
      refetchSaved(),
      refetchSessions(),
    ])
    setRefreshing(false)
  }

  const loading = bookingsLoading || savedLoading || sessionsLoading
  const error = bookingsError || savedError || sessionsError

  const tabs: { key: BookingTab; label: string; icon: string }[] = [
    { key: 'active', label: 'Active', icon: 'clock' },
    { key: 'history', label: 'History', icon: 'archive' },
    { key: 'saved', label: 'Saved', icon: 'bookmark' },
  ]

  // Filter bookings by status
  const activeBookings = bookings.filter((b) =>
    ['pending', 'confirmed', 'in_progress'].includes(b.status)
  )
  const completedBookings = bookings.filter((b) =>
    ['completed', 'cancelled', 'refunded'].includes(b.status)
  )

  if (loading && !refreshing) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.default, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.default }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 16,
            backgroundColor: colors.surface.raised,
            borderBottomWidth: 1,
            borderBottomColor: colors.border.default,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text.primary }}>
              My Bookings
            </Text>
            
            {stats.unratedSessions > 0 && (
              <View
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Feather name="star" size={14} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', marginLeft: 4 }}>
                  {stats.unratedSessions} to rate
                </Text>
              </View>
            )}
          </View>

          {/* Stats Row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>
                {stats.totalSessions}
              </Text>
              <Text style={{ fontSize: 12, color: colors.text.secondary }}>
                Total
              </Text>
            </View>
            <View style={{ width: 1, backgroundColor: colors.border.default }} />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>
                {stats.upcomingSessions}
              </Text>
              <Text style={{ fontSize: 12, color: colors.text.secondary }}>
                Upcoming
              </Text>
            </View>
            <View style={{ width: 1, backgroundColor: colors.border.default }} />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>
                ${stats.totalCreditsEarned.toFixed(0)}
              </Text>
              <Text style={{ fontSize: 12, color: colors.text.secondary }}>
                Credits
              </Text>
            </View>
            <View style={{ width: 1, backgroundColor: colors.border.default }} />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>
                {stats.averageRating.toFixed(1)}
              </Text>
              <Text style={{ fontSize: 12, color: colors.text.secondary }}>
                Avg Rating
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 12,
            backgroundColor: colors.surface.default,
            borderBottomWidth: 1,
            borderBottomColor: colors.border.default,
          }}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: activeTab === tab.key ? colors.primary + '10' : 'transparent',
              }}
            >
              <Feather
                name={tab.icon as any}
                size={18}
                color={activeTab === tab.key ? colors.primary : colors.text.secondary}
              />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 14,
                  fontWeight: activeTab === tab.key ? '600' : '500',
                  color: activeTab === tab.key ? colors.primary : colors.text.secondary,
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {error && (
            <View
              style={{
                margin: 20,
                padding: 16,
                backgroundColor: colors.error + '10',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.error + '20',
              }}
            >
              <Text style={{ color: colors.error, fontSize: 14 }}>
                {error}
              </Text>
            </View>
          )}

          {activeTab === 'active' && (
            <ActiveBookings
              bookings={activeBookings}
              enrolledSessions={enrolledSessions}
              availableSessions={availableSessions}
              onJoinSession={joinGroupSession}
              onLeaveSession={leaveGroupSession}
              navigation={navigation}
            />
          )}

          {activeTab === 'history' && (
            <BookingHistory
              bookings={completedBookings}
              unratedCount={stats.unratedSessions}
              onSubmitRating={submitRating}
              navigation={navigation}
            />
          )}

          {activeTab === 'saved' && (
            <SavedConsultants
              savedConsultants={savedConsultants}
              waitlists={waitlists}
              onToggleSave={toggleSaveConsultant}
              onJoinWaitlist={joinWaitlist}
              onLeaveWaitlist={leaveWaitlist}
              navigation={navigation}
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}