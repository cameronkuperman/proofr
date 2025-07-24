import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Switch,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import { useThemedColors, useTheme } from '../../../contexts/ThemeContext'

// University colors remain constant across themes
const UNIVERSITY_colors = {
  harvard: '#A51C30',
  yale: '#00356B',
  princeton: '#FF6900',
  stanford: '#8C1515',
  mit: '#A31F34',
}

import type { StudentProfile, Booking, ApplicationMilestone, ProfileStats } from '../types/profile.types'
import { SettingsModal } from './SettingsModal'
import { DocumentsModal } from './DocumentsModal'

// AsyncStorage for data persistence
let AsyncStorage: any
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default
} catch (error) {
  AsyncStorage = {
    getItem: async () => null,
    setItem: async () => {},
  }
}

// Mock data for now
const mockProfile: StudentProfile = {
  id: '1',
  user_id: '1',
  name: 'Alex Johnson',
  current_school: 'Lincoln High School',
  grade_level: 12,
  target_schools: ['Harvard', 'MIT', 'Stanford'],
  interests: ['Computer Science', 'Robotics', 'AI'],
  sat_score: 1520,
  act_score: 34,
  gpa: 4.2,
  extracurriculars: ['Robotics Club President', 'Math Olympiad', 'Volunteer Tutor'],
  awards: ['National Merit Scholar', 'Intel Science Fair Winner'],
  credit_balance: 250,
  preferred_communication: 'video',
  time_zone: 'America/New_York',
  parent_email: 'parent@example.com',
  parent_phone: '+1234567890',
  essay_topics: ['Personal growth through robotics', 'Community impact project'],
  application_deadlines: {
    'Harvard': '2024-01-01',
    'MIT': '2024-01-15',
    'Stanford': '2024-01-02',
  },
  notes: '',
  guides_published: 5,
  guide_views_total: 1250,
  guide_helpful_total: 89,
  created_at: '2024-01-01',
  updated_at: '2024-01-15',
}

function calculateApplicationProgress(profile: StudentProfile): number {
  if (!profile) return 0
  
  let progress = 0
  const totalSteps = 10
  
  if (profile.gpa) progress += 1
  if (profile.sat_score || profile.act_score) progress += 1
  if (profile.target_schools && profile.target_schools.length > 0) progress += 1
  if (profile.extracurriculars && profile.extracurriculars.length > 0) progress += 1
  if (profile.awards && profile.awards.length > 0) progress += 1
  if (profile.essay_topics && profile.essay_topics.length > 0) progress += 1
  if (profile.current_school) progress += 1
  if (profile.interests && profile.interests.length > 0) progress += 1
  if (profile.application_deadlines && Object.keys(profile.application_deadlines).length > 0) progress += 1
  if (profile.preferred_communication) progress += 1
  
  return Math.min(progress, 100)
}

export function ProfileScreen() {
  const colors = useThemedColors()
  const { isDark, setTheme } = useTheme()
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')
  
  // Get navigation safely
  let navigation: any = null
  try {
    navigation = useNavigation<any>()
  } catch (error) {
    // Navigation not available yet
  }
  
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<ProfileStats>({
    totalSessions: 0,
    upcomingSessions: 0,
    totalSpent: 0,
    averageRating: 0,
    documentsUploaded: 0,
    collegesTargeted: 0,
  })
  
  // Modal states
  const [settingsVisible, setSettingsVisible] = useState(false)
  const [documentsVisible, setDocumentsVisible] = useState(false)
  
  const applicationProgress = profile ? calculateApplicationProgress(profile) : 0
  
  // Sample milestones - in real app, these would come from database
  const milestones: ApplicationMilestone[] = [
    {
      id: '1',
      title: 'Complete Common App',
      description: 'Fill out all sections of the Common Application',
      deadline: '2024-12-01',
      completed: true,
      icon: 'check-circle',
      type: 'application',
    },
    {
      id: '2',
      title: 'Submit SAT Scores',
      description: 'Send official SAT scores to all target schools',
      deadline: '2024-12-15',
      completed: true,
      icon: 'send',
      type: 'test',
    },
    {
      id: '3',
      title: 'Teacher Recommendations',
      description: 'Request letters from 2 teachers',
      deadline: '2024-11-30',
      completed: false,
      icon: 'users',
      type: 'recommendation',
    },
    {
      id: '4',
      title: 'Harvard Supplemental Essays',
      description: 'Complete all Harvard-specific essays',
      deadline: '2024-12-20',
      completed: false,
      icon: 'edit-3',
      type: 'essay',
      college: 'Harvard',
    },
  ]

  // Sample bookings
  const mockBookings: Booking[] = [
    {
      id: '1',
      student_id: '1',
      consultant_id: '2',
      service_type: 'essay_review',
      scheduled_at: '2024-01-20T15:00:00Z',
      duration_minutes: 60,
      status: 'completed',
      price: 120,
      cashback_earned: 2.4,
      meeting_link: '',
      notes: 'Great session on Common App essay',
      rating: 5,
      review: 'Very helpful feedback',
      consultant: {
        id: '2',
        name: 'Sarah Chen',
        university: 'Harvard',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      },
      created_at: '2024-01-15',
    },
    {
      id: '2',
      student_id: '1',
      consultant_id: '3',
      service_type: 'interview_prep',
      scheduled_at: '2024-01-25T14:00:00Z',
      duration_minutes: 45,
      status: 'confirmed',
      price: 80,
      cashback_earned: 1.6,
      meeting_link: 'https://zoom.us/j/123456789',
      consultant: {
        id: '3',
        name: 'Michael Park',
        university: 'MIT',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      },
      created_at: '2024-01-18',
    },
  ]

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      setLoading(true)
      // In real app, fetch from Supabase
      setProfile(mockProfile)
      setBookings(mockBookings)
      setStats({
        totalSessions: 12,
        upcomingSessions: 2,
        totalSpent: 1450,
        averageRating: 4.8,
        documentsUploaded: 15,
        collegesTargeted: mockProfile.target_schools?.length || 0,
      })
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadProfile()
    setRefreshing(false)
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background.default, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.default }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
          }
        >
          {/* Header Section */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: 24,
              backgroundColor: colors.surface.raised,
              borderBottomWidth: 1,
              borderBottomColor: colors.border.default,
            }}
          >
            {/* Top Bar */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: colors.text.primary }}>
                Profile
              </Text>
              
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setSettingsVisible(true)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.surface.raised,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: colors.border.default,
                  }}
                >
                  <Feather name="settings" size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Profile Info */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{ uri: `https://ui-avatars.com/api/?name=${profile?.name || 'Student'}&background=10B981&color=fff&size=200` }}
                style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.gray[200] }}
              />
              
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text.primary }}>
                  {profile?.name || 'Student'}
                </Text>
                <Text style={{ fontSize: 16, color: colors.text.secondary, marginTop: 4 }}>
                  {profile?.current_school || 'Add your school'}
                </Text>
              </View>
            </View>
          </View>

          {/* Application Progress */}
          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            <View
              style={{
                backgroundColor: colors.surface.raised,
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: colors.border.default,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text.primary }}>
                  Application Journey
                </Text>
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>
                  {applicationProgress}%
                </Text>
              </View>
              
              <View style={{ height: 8, backgroundColor: colors.gray[200], borderRadius: 4, overflow: 'hidden' }}>
                <View
                  style={{
                    height: '100%',
                    width: `${applicationProgress}%`,
                    backgroundColor: colors.primary,
                    borderRadius: 4,
                  }}
                />
              </View>
              
              <Text style={{ fontSize: 14, color: colors.text.secondary, marginTop: 8 }}>
                Keep going! You're making great progress.
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {/* Credits */}
              <View
                style={{
                  flex: 1,
                  minWidth: '45%',
                  backgroundColor: colors.primary + '10',
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.primary + '20',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: colors.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Feather name="dollar-sign" size={16} color="#fff" />
                  </View>
                  <Text style={{ fontSize: 12, color: colors.primary, marginLeft: 8, fontWeight: '600' }}>
                    Credits
                  </Text>
                </View>
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text.primary }}>
                  ${profile?.credit_balance || 0}
                </Text>
              </View>

              {/* Sessions */}
              <View
                style={{
                  flex: 1,
                  minWidth: '45%',
                  backgroundColor: colors.purple[50],
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.purple[100],
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: colors.purple[600],
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Feather name="calendar" size={16} color="#fff" />
                  </View>
                  <Text style={{ fontSize: 12, color: colors.purple[600], marginLeft: 8, fontWeight: '600' }}>
                    Sessions
                  </Text>
                </View>
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text.primary }}>
                  {stats.totalSessions}
                </Text>
                <Text style={{ fontSize: 12, color: colors.text.secondary, marginTop: 4 }}>
                  {stats.upcomingSessions} upcoming
                </Text>
              </View>

              {/* Colleges */}
              <View
                style={{
                  flex: 1,
                  minWidth: '45%',
                  backgroundColor: colors.teal[50],
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.teal[100],
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: colors.teal[600],
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Feather name="flag" size={16} color="#fff" />
                  </View>
                  <Text style={{ fontSize: 12, color: colors.teal[600], marginLeft: 8, fontWeight: '600' }}>
                    Colleges
                  </Text>
                </View>
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text.primary }}>
                  {stats.collegesTargeted}
                </Text>
                <Text style={{ fontSize: 12, color: colors.teal[600], fontWeight: '600' }}>
                  Schools Ready
                </Text>
              </View>

              {/* Guides */}
              <View
                style={{
                  flex: 1,
                  minWidth: '45%',
                  backgroundColor: colors.orange[50],
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.orange[100],
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: colors.orange[600],
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Feather name="book-open" size={16} color="#fff" />
                  </View>
                  <Text style={{ fontSize: 12, color: colors.orange[600], marginLeft: 8, fontWeight: '600' }}>
                    Guides
                  </Text>
                </View>
                <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text.primary }}>
                  {profile?.guides_published || 0}
                </Text>
                <Text style={{ fontSize: 12, color: colors.orange[600], fontWeight: '600' }}>
                  Published
                </Text>
              </View>
            </View>
          </View>

          {/* Milestones */}
          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text.primary }}>
                Upcoming Milestones
              </Text>
            </View>

            {milestones.map((milestone) => (
              <TouchableOpacity
                key={milestone.id}
                style={{
                  backgroundColor: colors.surface.raised,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: colors.border.default,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => Alert.alert(milestone.title, milestone.description)}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: milestone.completed ? colors.primary + '20' : colors.gray[100],
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <Feather
                    name={milestone.completed ? 'check' : (milestone.icon as any || 'circle')}
                    size={20}
                    color={milestone.completed ? colors.primary : colors.text.secondary}
                  />
                </View>
                
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text.primary }}>
                      {milestone.title}
                    </Text>
                    {milestone.college && (
                      <View
                        style={{
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          backgroundColor: UNIVERSITY_colors[milestone.college.toLowerCase()] || colors.gray[600],
                          borderRadius: 4,
                        }}
                      >
                        <Text style={{ fontSize: 10, color: '#fff', fontWeight: '600' }}>
                          {milestone.college}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 14, color: colors.text.secondary, marginTop: 2 }}>
                    {milestone.description}
                  </Text>
                  {!milestone.completed && milestone.deadline && (
                    <Text style={{ fontSize: 12, color: colors.warning, marginTop: 4, fontWeight: '500' }}>
                      Due: {new Date(milestone.deadline).toLocaleDateString()}
                    </Text>
                  )}
                </View>
                
                <Feather name="chevron-right" size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Recent Sessions */}
          {bookings.length > 0 && (
            <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text.primary }}>
                  Recent Sessions
                </Text>
              </View>

              {bookings.map((booking) => (
                <TouchableOpacity
                  key={booking.id}
                  style={{
                    backgroundColor: colors.surfaceRaised,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => Alert.alert('Session Details', booking.notes || 'No notes available')}
                >
                  <Image
                    source={{ uri: booking.consultant?.avatar }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: colors.gray[200],
                      marginRight: 12,
                    }}
                  />
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text.primary }}>
                      {booking.consultant?.name || 'Consultant'}
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.text.secondary }}>
                      {booking.service_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.text.tertiary, marginTop: 2 }}>
                      {new Date(booking.scheduled_at).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View style={{ alignItems: 'flex-end' }}>
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        backgroundColor: 
                          booking.status === 'completed' 
                            ? colors.primary + '20'
                            : booking.status === 'confirmed'
                            ? colors.info + '20'
                            : colors.gray[100],
                        borderRadius: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color: 
                            booking.status === 'completed'
                              ? colors.primary
                              : booking.status === 'confirmed'
                              ? colors.info
                              : colors.text.secondary,
                          textTransform: 'capitalize',
                        }}
                      >
                        {booking.status}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: colors.text.secondary, marginTop: 4 }}>
                      ${booking.price}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Guide Impact */}
          {profile && profile.guides_published > 0 && (
            <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text.primary }}>
                  Your Guide Impact
                </Text>
              </View>
              
              <View
                style={{
                  backgroundColor: colors.surface.raised,
                  borderRadius: 16,
                  padding: 20,
                  borderWidth: 1,
                  borderColor: colors.border.default,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: colors.orange[100],
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Feather name="book-open" size={24} color={colors.orange[600]} />
                  </View>
                  <View>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text.primary }}>
                      {profile.guides_published} Guides Published
                    </Text>
                    <Text style={{ fontSize: 14, color: colors.text.secondary }}>
                      Helping students succeed
                    </Text>
                  </View>
                </View>
                
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>
                      {profile.guide_views_total.toLocaleString()}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.text.secondary, marginTop: 4 }}>
                      Total Views
                    </Text>
                  </View>
                  
                  <View style={{ width: 1, backgroundColor: colors.border.default, marginHorizontal: 20 }} />
                  
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>
                      {profile.guide_helpful_total}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.text.secondary, marginTop: 4 }}>
                      Helpful Votes
                    </Text>
                  </View>
                  
                  <View style={{ width: 1, backgroundColor: colors.border.default, marginHorizontal: 20 }} />
                  
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, fontWeight: '700', color: colors.primary }}>
                      {Math.round(profile.guide_helpful_total / profile.guides_published)}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.text.secondary, marginTop: 4 }}>
                      Avg. Rating
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Quick Actions */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text.primary, marginBottom: 16 }}>
              Quick Actions
            </Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  minWidth: '45%',
                  backgroundColor: colors.surface.raised,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.border.default,
                }}
                onPress={() => setDocumentsVisible(true)}
              >
                <Feather name="file-text" size={24} color={colors.primary} />
                <Text style={{ color: colors.text.primary, fontWeight: '600', marginTop: 8 }}>
                  My Documents
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flex: 1,
                  minWidth: '45%',
                  backgroundColor: colors.surface.raised,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.border.default,
                }}
                onPress={() => Alert.alert('Messages', 'Opens messaging interface')}
              >
                <Feather name="message-circle" size={24} color={colors.primary} />
                <Text style={{ color: colors.text.primary, fontWeight: '600', marginTop: 8 }}>
                  Messages
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flex: 1,
                  minWidth: '45%',
                  backgroundColor: colors.surface.raised,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.border.default,
                }}
                onPress={() => navigation?.navigate('Payments')}
              >
                <Feather name="credit-card" size={24} color={colors.primary} />
                <Text style={{ color: colors.text.primary, fontWeight: '600', marginTop: 8 }}>
                  Payment History
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flex: 1,
                  minWidth: '45%',
                  backgroundColor: colors.primary,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                }}
                onPress={() => Alert.alert('Browse Consultants', 'Opens consultant browser')}
              >
                <Feather name="search" size={24} color="#fff" />
                <Text style={{ color: '#fff', fontWeight: '600', marginTop: 8 }}>
                  Find Consultants
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Sign Out Button */}
            <TouchableOpacity
              style={{
                marginTop: 32,
                backgroundColor: colors.surface.raised,
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: colors.accent,
              }}
              onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?')}
            >
              <Feather name="log-out" size={24} color={colors.accent} />
              <Text style={{ color: colors.accent, fontWeight: '600', marginTop: 8 }}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Modals */}
      <SettingsModal visible={settingsVisible} onClose={() => setSettingsVisible(false)} />
      <DocumentsModal visible={documentsVisible} onClose={() => setDocumentsVisible(false)} />
    </View>
  )
}