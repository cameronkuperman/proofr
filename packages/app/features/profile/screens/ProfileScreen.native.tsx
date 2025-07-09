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
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
// AsyncStorage for data persistence
let AsyncStorage: any
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default
} catch (error) {
  AsyncStorage = {
    getItem: async () => null,
    setItem: async () => {},
    removeItem: async () => {},
  }
}
import { useTheme, useThemedColors, usePrimaryColors } from '../../../contexts/ThemeContext'
import { colors } from '../../../constants/colors'
import { ThemeSwitcherCompact } from '../../../components/ThemeSwitcher'
import type { StudentProfile, Booking, ApplicationMilestone, ProfileStats } from '../types/profile.types'

// Progress calculation helper
const calculateApplicationProgress = (profile: StudentProfile): number => {
  let progress = 0
  const weights = {
    profileComplete: 20,
    schoolsSelected: 20,
    essayStarted: 20,
    consultantBooked: 20,
    applicationSubmitted: 20,
  }
  
  // Profile completion
  if (profile.bio && profile.current_school && profile.interests.length > 0) {
    progress += weights.profileComplete
  }
  
  // Schools selected
  if (profile.preferred_colleges.length >= 3) {
    progress += weights.schoolsSelected
  }
  
  // This would need actual data from bookings/documents
  // For now, just placeholder logic
  if (profile.lifetime_credits_earned > 0) {
    progress += weights.consultantBooked
  }
  
  return Math.min(progress, 100)
}

export function ProfileScreen() {
  const navigation = useNavigation<any>()
  const { isDark } = useTheme()
  const themedColors = useThemedColors()
  const primaryColors = usePrimaryColors()
  
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
  
  const applicationProgress = profile ? calculateApplicationProgress(profile) : 0
  
  // Sample milestones - in real app, these would come from database
  const milestones: ApplicationMilestone[] = [
    {
      id: '1',
      title: 'Complete Common App Essay',
      description: 'First draft due',
      due_date: '2024-10-15',
      completed: false,
      type: 'deadline',
      icon: 'edit-3',
    },
    {
      id: '2',
      title: 'Harvard Interview Prep',
      description: 'With Sarah Chen',
      due_date: '2024-09-20',
      completed: true,
      type: 'task',
      icon: 'mic',
      college: 'Harvard',
    },
    {
      id: '3',
      title: 'Submit Early Applications',
      description: 'Yale, Princeton, Stanford',
      due_date: '2024-11-01',
      completed: false,
      type: 'deadline',
      icon: 'send',
    },
  ]
  
  const loadProfile = async () => {
    try {
      // Load profile from AsyncStorage
      const storedProfile = await AsyncStorage.getItem('userProfile')
      const storedName = await AsyncStorage.getItem('userName')
      const storedEmail = await AsyncStorage.getItem('userEmail')
      
      // Mock student profile data
      const mockProfile: StudentProfile = {
        id: '1',
        name: storedName || 'Alex Johnson',
        email: storedEmail || 'alex.johnson@email.com',
        bio: 'Aspiring computer scientist passionate about AI and social impact',
        current_school: 'Thomas Jefferson High School',
        school_type: 'high-school',
        grade_level: 'senior',
        target_application_year: 2025,
        preferred_colleges: ['MIT', 'Stanford', 'Harvard', 'Yale', 'Princeton'],
        interests: ['Computer Science', 'AI/ML', 'Robotics', 'Social Impact'],
        pain_points: ['essays', 'interviews', 'activities'],
        budget_range: { min: 50, max: 200 },
        credit_balance: 250,
        lifetime_credits_earned: 1200,
        onboarding_completed: true,
        onboarding_step: 5,
        created_at: '2024-01-01',
        updated_at: '2024-01-15',
        profile_image_url: 'https://randomuser.me/api/portraits/men/32.jpg',
      }
      
      setProfile(mockProfile)
      
      // Mock bookings data
      const mockBookings: Booking[] = [
        {
          id: '1',
          student_id: '1',
          consultant_id: '101',
          service_type: 'essay_review',
          status: 'completed',
          scheduled_at: '2024-01-10T15:00:00Z',
          duration_minutes: 60,
          price: 150,
          notes: 'Common App essay review',
          created_at: '2024-01-05',
          consultant: {
            id: '101',
            name: 'Sarah Chen',
            profile_image_url: 'https://randomuser.me/api/portraits/women/1.jpg',
            current_college: 'Harvard',
            rating: 4.9,
          },
        },
        {
          id: '2',
          student_id: '1',
          consultant_id: '102',
          service_type: 'interview_prep',
          status: 'confirmed',
          scheduled_at: '2024-01-25T14:00:00Z',
          duration_minutes: 45,
          price: 120,
          notes: 'MIT interview preparation',
          created_at: '2024-01-12',
          consultant: {
            id: '102',
            name: 'Michael Zhang',
            profile_image_url: 'https://randomuser.me/api/portraits/men/2.jpg',
            current_college: 'MIT',
            rating: 4.8,
          },
        },
      ]
      
      setBookings(mockBookings)
      
      // Calculate stats
      const upcoming = mockBookings.filter(b => 
        b.status === 'confirmed' && new Date(b.scheduled_at) > new Date()
      ).length
      
      const totalSpent = mockBookings
        .filter(b => b.status === 'completed')
        .reduce((sum, b) => sum + b.price, 0)
      
      setStats({
        totalSessions: mockBookings.filter(b => b.status === 'completed').length,
        upcomingSessions: upcoming,
        totalSpent,
        averageRating: 4.8,
        documentsUploaded: 12,
        collegesTargeted: mockProfile.preferred_colleges.length,
      })
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }
  
  useEffect(() => {
    loadProfile()
  }, [])
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            // Clear AsyncStorage
            await AsyncStorage.clear()
            navigation.reset({
              index: 0,
              routes: [{ name: 'onboarding' }],
            })
          },
        },
      ],
    )
  }
  
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: themedColors.background.default, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={primaryColors.primary} />
      </View>
    )
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: themedColors.background.default }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true)
                loadProfile()
              }}
              tintColor={primaryColors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 12,
              paddingBottom: 24,
              backgroundColor: themedColors.surface.raised,
              borderBottomWidth: 1,
              borderBottomColor: themedColors.border.default,
            }}
          >
            {/* Top Bar */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: themedColors.text.primary }}>
                Profile
              </Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <ThemeSwitcherCompact />
                <TouchableOpacity
                  onPress={() => navigation.navigate('settings')}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: themedColors.surface.raised,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: themedColors.border.default,
                  }}
                >
                  <Feather name="settings" size={20} color={themedColors.text.secondary} />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Profile Info */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{
                  uri: profile?.profile_image_url || `https://ui-avatars.com/api/?name=${profile?.name || 'Student'}&background=047857&color=fff`,
                }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  borderWidth: 3,
                  borderColor: primaryColors.primary,
                }}
              />
              
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: '700', color: themedColors.text.primary }}>
                  {profile?.name || 'Student'}
                </Text>
                <Text style={{ fontSize: 16, color: themedColors.text.secondary, marginTop: 4 }}>
                  {profile?.current_school || 'Add your school'}
                </Text>
                <Text style={{ fontSize: 14, color: primaryColors.primary, marginTop: 2, fontWeight: '600' }}>
                  Class of {profile?.target_application_year || '2025'}
                </Text>
              </View>
              
              <TouchableOpacity
                onPress={() => navigation.navigate('editProfile')}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: isDark ? colors.primary[800] : colors.primary[50],
                  borderWidth: 1,
                  borderColor: primaryColors.primary,
                }}
              >
                <Text style={{ color: primaryColors.primary, fontWeight: '600', fontSize: 14 }}>
                  Edit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Application Progress */}
          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            <View
              style={{
                backgroundColor: themedColors.surface.raised,
                borderRadius: 16,
                padding: 20,
                borderWidth: 1,
                borderColor: themedColors.border.default,
                ...(isDark && {
                  shadowColor: colors.primary[500],
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                }),
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: themedColors.text.primary }}>
                  Application Journey
                </Text>
                <Text style={{ fontSize: 24, fontWeight: '700', color: primaryColors.primary }}>
                  {applicationProgress}%
                </Text>
              </View>
              
              {/* Progress Bar */}
              <View
                style={{
                  height: 8,
                  backgroundColor: isDark ? colors.gray[800] : colors.gray[200],
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{
                    height: '100%',
                    width: `${applicationProgress}%`,
                    backgroundColor: primaryColors.primary,
                    borderRadius: 4,
                    ...(isDark && {
                      shadowColor: colors.primary[500],
                      shadowOffset: { width: 0, height: 0 },
                      shadowOpacity: 0.5,
                      shadowRadius: 4,
                    }),
                  }}
                />
              </View>
              
              <Text style={{ fontSize: 14, color: themedColors.text.secondary, marginTop: 8 }}>
                Keep going! You're making great progress.
              </Text>
            </View>
          </View>
          
          {/* Quick Stats */}
          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20 }}>
              <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20 }}>
                {/* Credits */}
                <View
                  style={{
                    backgroundColor: isDark ? colors.primary[900] : colors.primary[50],
                    borderRadius: 16,
                    padding: 16,
                    minWidth: 140,
                    borderWidth: 1,
                    borderColor: isDark ? colors.primary[700] : colors.primary[200],
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Feather name="dollar-sign" size={20} color={primaryColors.primary} />
                    <Text style={{ fontSize: 12, color: primaryColors.primary, marginLeft: 4, fontWeight: '600' }}>
                      Credits
                    </Text>
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: '700', color: themedColors.text.primary }}>
                    ${profile?.credit_balance || 0}
                  </Text>
                  <TouchableOpacity
                    style={{ marginTop: 8 }}
                    onPress={() => navigation.navigate('addCredits')}
                  >
                    <Text style={{ fontSize: 12, color: primaryColors.primary, fontWeight: '600' }}>
                      Add more →
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {/* Sessions */}
                <View
                  style={{
                    backgroundColor: isDark ? colors.purple[900] : colors.purple[50],
                    borderRadius: 16,
                    padding: 16,
                    minWidth: 140,
                    borderWidth: 1,
                    borderColor: isDark ? colors.purple[700] : colors.purple[200],
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Feather name="calendar" size={20} color={colors.purple[600]} />
                    <Text style={{ fontSize: 12, color: colors.purple[600], marginLeft: 4, fontWeight: '600' }}>
                      Sessions
                    </Text>
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: '700', color: themedColors.text.primary }}>
                    {stats.totalSessions}
                  </Text>
                  <Text style={{ fontSize: 12, color: themedColors.text.secondary, marginTop: 4 }}>
                    {stats.upcomingSessions} upcoming
                  </Text>
                </View>
                
                {/* Colleges */}
                <View
                  style={{
                    backgroundColor: isDark ? colors.teal[900] : colors.teal[50],
                    borderRadius: 16,
                    padding: 16,
                    minWidth: 140,
                    borderWidth: 1,
                    borderColor: isDark ? colors.teal[700] : colors.teal[200],
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Feather name="flag" size={20} color={colors.teal[600]} />
                    <Text style={{ fontSize: 12, color: colors.teal[600], marginLeft: 4, fontWeight: '600' }}>
                      Target Schools
                    </Text>
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: '700', color: themedColors.text.primary }}>
                    {stats.collegesTargeted}
                  </Text>
                  <TouchableOpacity
                    style={{ marginTop: 8 }}
                    onPress={() => navigation.navigate('schools')}
                  >
                    <Text style={{ fontSize: 12, color: colors.teal[600], fontWeight: '600' }}>
                      Manage →
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
          
          {/* Upcoming Milestones */}
          <View style={{ paddingHorizontal: 20, paddingTop: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: '600', color: themedColors.text.primary }}>
                Upcoming Milestones
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('timeline')}>
                <Text style={{ fontSize: 14, color: primaryColors.primary, fontWeight: '600' }}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            
            {milestones.slice(0, 3).map((milestone, index) => (
              <TouchableOpacity
                key={milestone.id}
                style={{
                  backgroundColor: themedColors.surface.raised,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: themedColors.border.default,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onPress={() => navigation.navigate('milestoneDetail', { id: milestone.id })}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: milestone.completed
                      ? isDark ? colors.primary[800] : colors.primary[100]
                      : isDark ? colors.gray[800] : colors.gray[100],
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <Feather
                    name={milestone.completed ? 'check' : (milestone.icon as any || 'circle')}
                    size={20}
                    color={milestone.completed ? primaryColors.primary : themedColors.text.secondary}
                  />
                </View>
                
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: themedColors.text.primary }}>
                      {milestone.title}
                    </Text>
                    {milestone.college && (
                      <View
                        style={{
                          backgroundColor: colors.university[milestone.college.toLowerCase()] || colors.gray[600],
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 10,
                        }}
                      >
                        <Text style={{ fontSize: 11, color: '#FFFFFF', fontWeight: '600' }}>
                          {milestone.college}
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 14, color: themedColors.text.secondary, marginTop: 2 }}>
                    {milestone.description}
                  </Text>
                  {milestone.due_date && (
                    <Text style={{ fontSize: 12, color: colors.warning.main, marginTop: 4, fontWeight: '500' }}>
                      Due {new Date(milestone.due_date).toLocaleDateString()}
                    </Text>
                  )}
                </View>
                
                <Feather name="chevron-right" size={20} color={themedColors.text.secondary} />
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Recent Sessions */}
          {bookings.length > 0 && (
            <View style={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 20, fontWeight: '600', color: themedColors.text.primary }}>
                  Recent Sessions
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('bookings')}>
                  <Text style={{ fontSize: 14, color: primaryColors.primary, fontWeight: '600' }}>
                    View All
                  </Text>
                </TouchableOpacity>
              </View>
              
              {bookings.slice(0, 3).map((booking) => (
                <TouchableOpacity
                  key={booking.id}
                  style={{
                    backgroundColor: themedColors.surface.raised,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: themedColors.border.default,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => navigation.navigate('bookingDetail', { id: booking.id })}
                >
                  <Image
                    source={{
                      uri: booking.consultant?.profile_image_url || 
                        `https://ui-avatars.com/api/?name=${booking.consultant?.name || 'Consultant'}&background=047857&color=fff`,
                    }}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      marginRight: 12,
                    }}
                  />
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: themedColors.text.primary }}>
                      {booking.consultant?.name || 'Consultant'}
                    </Text>
                    <Text style={{ fontSize: 14, color: themedColors.text.secondary }}>
                      {booking.service_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                    <Text style={{ fontSize: 12, color: themedColors.text.tertiary, marginTop: 2 }}>
                      {new Date(booking.scheduled_at).toLocaleDateString()}
                    </Text>
                  </View>
                  
                  <View style={{ alignItems: 'flex-end' }}>
                    <View
                      style={{
                        paddingHorizontal: 12,
                        paddingVertical: 4,
                        borderRadius: 12,
                        backgroundColor:
                          booking.status === 'completed'
                            ? isDark ? colors.primary[800] : colors.primary[100]
                            : booking.status === 'confirmed'
                            ? isDark ? colors.info[800] : colors.info[100]
                            : isDark ? colors.gray[800] : colors.gray[100],
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: '600',
                          color:
                            booking.status === 'completed'
                              ? primaryColors.primary
                              : booking.status === 'confirmed'
                              ? colors.info.main
                              : themedColors.text.secondary,
                          textTransform: 'capitalize',
                        }}
                      >
                        {booking.status}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 14, color: themedColors.text.secondary, marginTop: 4 }}>
                      ${booking.price}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {/* Quick Actions */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 40 }}>
            <Text style={{ fontSize: 20, fontWeight: '600', color: themedColors.text.primary, marginBottom: 16 }}>
              Quick Actions
            </Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  minWidth: '45%',
                  backgroundColor: primaryColors.primary,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                  ...(isDark && {
                    shadowColor: colors.primary[500],
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                  }),
                }}
                onPress={() => navigation.navigate('browse')}
              >
                <Feather name="search" size={24} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontWeight: '600', marginTop: 8 }}>
                  Find Consultants
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flex: 1,
                  minWidth: '45%',
                  backgroundColor: themedColors.surface.raised,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: themedColors.border.default,
                }}
                onPress={() => navigation.navigate('documents')}
              >
                <Feather name="file-text" size={24} color={primaryColors.primary} />
                <Text style={{ color: themedColors.text.primary, fontWeight: '600', marginTop: 8 }}>
                  My Documents
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flex: 1,
                  minWidth: '45%',
                  backgroundColor: themedColors.surface.raised,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: themedColors.border.default,
                }}
                onPress={() => navigation.navigate('messages')}
              >
                <Feather name="message-circle" size={24} color={primaryColors.primary} />
                <Text style={{ color: themedColors.text.primary, fontWeight: '600', marginTop: 8 }}>
                  Messages
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flex: 1,
                  minWidth: '45%',
                  backgroundColor: themedColors.surface.raised,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: colors.accent[600],
                }}
                onPress={handleLogout}
              >
                <Feather name="log-out" size={24} color={colors.accent[600]} />
                <Text style={{ color: colors.accent[600], fontWeight: '600', marginTop: 8 }}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}