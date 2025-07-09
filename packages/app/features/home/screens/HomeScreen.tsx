import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Dimensions,
  Modal,
  Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { MotiView, AnimatePresence } from 'moti'
import { LinearGradient } from 'expo-linear-gradient'
import { VerificationPopup } from '../../verification/components/VerificationPopup'
import { SwipeableCard } from '../components/SwipeableCard'
import { useTheme, useThemedColors, usePrimaryColors } from '../../../contexts/ThemeContext'
import { colors } from '../../../constants/colors'

// AsyncStorage
let AsyncStorage: any
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default
} catch (error) {
  AsyncStorage = {
    getItem: async () => null,
    setItem: async () => {},
  }
}

const { width: screenWidth } = Dimensions.get('window')

// Mock consultant-service matches for quick match
const mockMatches = [
  {
    id: 1,
    consultant: {
      name: 'Sarah Chen',
      university: 'Harvard',
      year: '2024',
      major: 'Computer Science',
      rating: 4.9,
      studentsHelped: 127,
      acceptanceRate: '94%',
      responseTime: '< 2 hours',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    service: {
      type: 'Common App Essay Review',
      description: 'In-depth review of your main essay with line-by-line feedback',
      price: '$120',
      duration: '48 hour turnaround',
      includes: ['2 rounds of revisions', 'Grammar check', 'Story structure analysis'],
    },
    matchReason: 'Specializes in CS applications like yours',
    availability: 'Available today',
    instantBooking: true,
  },
  {
    id: 2,
    consultant: {
      name: 'Michael Park',
      university: 'Stanford',
      year: '2023',
      major: 'Economics',
      rating: 4.8,
      studentsHelped: 89,
      acceptanceRate: '91%',
      responseTime: '< 4 hours',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    service: {
      type: 'Why Stanford Essay',
      description: 'Stanford-specific essay guidance from a current student',
      price: '$150',
      duration: '60 min video call',
      includes: ['Essay strategy', 'What Stanford looks for', 'Example essays'],
    },
    matchReason: 'You listed Stanford as a target school',
    availability: 'Tomorrow 3pm',
    instantBooking: false,
  },
  {
    id: 3,
    consultant: {
      name: 'Emily Rodriguez',
      university: 'MIT',
      year: '2024',
      major: 'Engineering',
      rating: 5.0,
      studentsHelped: 156,
      acceptanceRate: '97%',
      responseTime: '< 1 hour',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
    },
    service: {
      type: 'STEM Activity List Review',
      description: 'Optimize your activities list to highlight STEM achievements',
      price: '$85',
      duration: '45 min session',
      includes: ['Activity descriptions', 'Impact framing', 'Order optimization'],
    },
    matchReason: 'Perfect for your robotics & coding activities',
    availability: 'Available now',
    instantBooking: true,
  },
  {
    id: 4,
    consultant: {
      name: 'David Kim',
      university: 'Yale',
      year: '2024',
      major: 'Political Science',
      rating: 4.7,
      studentsHelped: 98,
      acceptanceRate: '89%',
      responseTime: '< 3 hours',
      image: 'https://randomuser.me/api/portraits/men/4.jpg',
    },
    service: {
      type: 'Mock Interview Prep',
      description: 'Practice with common Ivy League interview questions',
      price: '$100',
      duration: '45 min mock + 15 min feedback',
      includes: ['Recorded session', 'Detailed feedback', 'Question bank'],
    },
    matchReason: 'Experienced with Yale interviews',
    availability: 'Today 6pm',
    instantBooking: true,
  },
  {
    id: 5,
    consultant: {
      name: 'Jessica Wu',
      university: 'Princeton',
      year: '2023',
      major: 'Molecular Biology',
      rating: 4.9,
      studentsHelped: 112,
      acceptanceRate: '95%',
      responseTime: '< 2 hours',
      image: 'https://randomuser.me/api/portraits/women/5.jpg',
    },
    service: {
      type: 'Pre-Med Essay Package',
      description: 'Complete review of all pre-med related essays',
      price: '$250',
      duration: '1 week support',
      includes: ['All essays', 'BSMD strategy', 'Timeline planning'],
    },
    matchReason: 'You mentioned interest in pre-med track',
    availability: 'Booking for next week',
    instantBooking: false,
  },
]

// Different consultants for featured section
const featuredConsultants = [
  {
    id: 101,
    name: 'Alex Thompson',
    university: 'Columbia',
    year: '2024',
    major: 'Journalism',
    rating: 4.8,
    studentsHelped: 73,
    price: '$55-160/hr',
    bio: 'Storytelling expert for compelling applications',
    acceptanceRate: '92%',
    specialties: ['Personal Statement', 'Creative Writing', 'Journalism'],
    responseTime: '< 6 hours',
    nextAvailable: 'Today',
    instantBooking: true,
    image: 'https://randomuser.me/api/portraits/men/6.jpg',
  },
  {
    id: 102,
    name: 'Rachel Martinez',
    university: 'Brown',
    year: '2024',
    major: 'International Relations',
    rating: 4.9,
    studentsHelped: 94,
    price: '$70-180/hr',
    bio: 'Helped 94 students craft unique narratives',
    acceptanceRate: '93%',
    specialties: ['Liberal Arts', 'Diversity Essays', 'Supplements'],
    responseTime: '< 3 hours',
    nextAvailable: 'Tomorrow',
    instantBooking: true,
    image: 'https://randomuser.me/api/portraits/women/7.jpg',
  },
  {
    id: 103,
    name: 'James Liu',
    university: 'Cornell',
    year: '2023',
    major: 'Architecture',
    rating: 4.7,
    studentsHelped: 65,
    price: '$80-200/hr',
    bio: 'Architecture and design portfolio specialist',
    acceptanceRate: '88%',
    specialties: ['Portfolio Review', 'Art Supplements', 'Architecture'],
    responseTime: '< 12 hours',
    nextAvailable: 'This week',
    instantBooking: false,
    image: 'https://randomuser.me/api/portraits/men/8.jpg',
  },
]

const categories = [
  { id: 'essays', name: 'Essays', icon: 'document-text' },
  { id: 'interviews', name: 'Interviews', icon: 'mic' },
  { id: 'test-prep', name: 'Test Prep', icon: 'school' },
  { id: 'applications', name: 'Applications', icon: 'clipboard' },
  { id: 'strategy', name: 'Strategy', icon: 'compass' },
  { id: 'top-rated', name: 'Top Rated', icon: 'star' },
]

export function HomeScreen() {
  const { isDark } = useTheme()
  const themedColors = useThemedColors()
  const primaryColors = usePrimaryColors()
  
  const [showQuickMatch, setShowQuickMatch] = useState(false)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [swipeCount, setSwipeCount] = useState(0)
  const [showVerificationPopup, setShowVerificationPopup] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showMorePrompt, setShowMorePrompt] = useState(false)

  useEffect(() => {
    console.log('[HomeScreen] Component mounted - showQuickMatch:', showQuickMatch)
    checkUserRoleAndVerification()
  }, [])
  
  useEffect(() => {
    console.log('[HomeScreen] State changed:')
    console.log('  - showQuickMatch:', showQuickMatch)
    console.log('  - currentMatchIndex:', currentMatchIndex)
    console.log('  - showMorePrompt:', showMorePrompt)
    console.log('  - currentMatch:', mockMatches[currentMatchIndex]?.consultant.name)
  }, [showQuickMatch, currentMatchIndex, showMorePrompt])

  const checkUserRoleAndVerification = async () => {
    try {
      const onboardingState = await AsyncStorage.getItem('onboardingState')
      const verificationDismissed = await AsyncStorage.getItem('verificationDismissed')
      
      if (onboardingState) {
        const state = JSON.parse(onboardingState)
        // Only show for consultants, not students
        if (state.role === 'consultant' && state.consultantData && !state.consultantData.isVerified && verificationDismissed !== 'true') {
          setShowVerificationPopup(true)
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error)
    }
  }

  const handleSwipe = useCallback((direction: 'left' | 'right' | 'up') => {
    console.log(`[HomeScreen] handleSwipe START - direction: ${direction}`)
    
    // Get current values
    const currentIndex = currentMatchIndex
    const currentCount = swipeCount
    const currentMatch = mockMatches[currentIndex]
    
    console.log(`[HomeScreen] Current state - index: ${currentIndex}, swipeCount: ${currentCount}, consultant: ${currentMatch.consultant.name}`)
    
    if (direction === 'right') {
      console.log(`Added ${currentMatch.consultant.name} - ${currentMatch.service.type} to requests`)
    } else if (direction === 'up') {
      console.log(`Priority booking for ${currentMatch.consultant.name} - ${currentMatch.service.type}`)
    } else {
      console.log(`Skipped ${currentMatch.consultant.name} - ${currentMatch.service.type}`)
    }
    
    // Update swipe count
    const newSwipeCount = currentCount + 1
    setSwipeCount(newSwipeCount)
    
    // Check if this is the last card or 5th swipe
    if (currentIndex >= mockMatches.length - 1 || newSwipeCount >= 5) {
      console.log('[HomeScreen] Reached end of cards or swipe limit')
      // Show the "want more?" prompt after animation
      setTimeout(() => {
        console.log('[HomeScreen] Setting showMorePrompt to true')
        setShowMorePrompt(true)
      }, 300)
      return
    }
    
    // Move to next consultant
    const nextIndex = currentIndex + 1
    console.log(`[HomeScreen] Moving to next consultant - from index ${currentIndex} to ${nextIndex}`)
    setCurrentMatchIndex(nextIndex)
  }, [currentMatchIndex, swipeCount])

  const handleVerificationDismiss = async () => {
    setShowVerificationPopup(false)
    await AsyncStorage.setItem('verificationDismissed', 'true')
  }

  const handleVerificationComplete = async (email: string) => {
    console.log('Verification email:', email)
    setShowVerificationPopup(false)
  }

  const handleViewProfile = () => {
    console.log('View profile:', mockMatches[currentMatchIndex].consultant.name)
    // TODO: Navigate to profile or show modal
  }

  const handleSkipAll = () => {
    console.log('[HomeScreen] Skip All clicked')
    setShowQuickMatch(false)
    setCurrentMatchIndex(0)
    setSwipeCount(0)
    setShowMorePrompt(false)
  }

  const handleAddAll = () => {
    // Add remaining consultants to requests
    const remaining = mockMatches.slice(currentMatchIndex)
    console.log('[HomeScreen] Add All clicked - adding services:', remaining.map(m => `${m.consultant.name} - ${m.service.type}`).join(', '))
    setShowQuickMatch(false)
    setCurrentMatchIndex(0)
    setSwipeCount(0)
    setShowMorePrompt(false)
  }

  const handleSeeMore = () => {
    // Reset for another round of matches
    setShowMorePrompt(false)
    setCurrentMatchIndex(0)
    setSwipeCount(0)
  }

  const handleThatsEnough = () => {
    // Close everything and reset
    setShowMorePrompt(false)
    setShowQuickMatch(false)
    setCurrentMatchIndex(0)
    setSwipeCount(0)
  }

  const currentMatch = mockMatches[currentMatchIndex]

  return (
    <View style={{ flex: 1, backgroundColor: themedColors.background.default }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          bounces={true}
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
        >
          {/* Header */}
          <View style={{
            backgroundColor: themedColors.surface.raised,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: themedColors.border.default,
            ...(isDark && {
              shadowColor: colors.primary[500],
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
            }),
          }}>
            {/* Logo and Actions */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Text style={{
                fontSize: 28,
                fontWeight: '700',
                color: themedColors.text.primary,
              }}>
                Proofr
              </Text>
              
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={() => {
                    console.log('[HomeScreen] Quick Match button pressed')
                    // Reset state when opening
                    setCurrentMatchIndex(0)
                    setSwipeCount(0)
                    setShowMorePrompt(false)
                    setShowQuickMatch(true)
                  }}
                  style={{
                    backgroundColor: primaryColors.primary,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
                    ...(isDark && {
                      shadowColor: colors.primary[500],
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                    }),
                  }}
                >
                  <Ionicons name="flash" size={16} color="#fff" />
                  <Text style={{
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: '600',
                    marginLeft: 4,
                  }}>
                    Quick Match
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity>
                  <Ionicons name="notifications-outline" size={24} color={themedColors.text.primary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar */}
            <View style={{
              backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
              borderRadius: 30,
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: themedColors.border.light,
            }}>
              <Ionicons name="search" size={20} color={themedColors.text.secondary} />
              <TextInput
                placeholder="Search consultants, schools, or services"
                placeholderTextColor={themedColors.text.tertiary}
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 16,
                  color: themedColors.text.primary,
                }}
              />
              <TouchableOpacity>
                <Ionicons name="options-outline" size={20} color={themedColors.text.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              backgroundColor: themedColors.surface.raised,
              paddingVertical: 16,
            }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              gap: 12,
            }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                onPress={() => setSelectedCategory(category.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selectedCategory === category.id ? primaryColors.primary : themedColors.surface.raised,
                  borderWidth: 1,
                  borderColor: selectedCategory === category.id ? primaryColors.primary : themedColors.border.default,
                }}
              >
                <Ionicons
                  name={category.icon as any}
                  size={16}
                  color={selectedCategory === category.id ? '#FFF' : themedColors.text.secondary}
                />
                <Text style={{
                  marginLeft: 6,
                  fontSize: 14,
                  fontWeight: '500',
                  color: selectedCategory === category.id ? '#FFF' : themedColors.text.secondary,
                }}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Featured Consultants */}
          <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{
                fontSize: 22,
                fontWeight: '700',
                color: themedColors.text.primary,
              }}>
                Featured Consultants
              </Text>
              <TouchableOpacity>
                <Text style={{
                  color: primaryColors.primary,
                  fontSize: 14,
                  fontWeight: '600',
                }}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>

            {/* Consultant Cards - Only show 3 */}
            {featuredConsultants.slice(0, 3).map((consultant) => (
              <TouchableOpacity
                key={consultant.id}
                style={{
                  backgroundColor: themedColors.surface.raised,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: themedColors.border.default,
                  ...(isDark ? {
                    shadowColor: colors.primary[500],
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                  } : {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                  }),
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  {/* Profile Image */}
                  <View style={{ marginRight: 16 }}>
                    <Image
                      source={{ uri: consultant.image }}
                      style={{
                        width: 80,
                        height: 80,
                        borderRadius: 12,
                        backgroundColor: themedColors.surface.sunken,
                      }}
                    />
                    <View style={{
                      position: 'absolute',
                      bottom: -4,
                      right: -4,
                      backgroundColor: colors.university[consultant.university.toLowerCase()] || primaryColors.primary,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 10,
                    }}>
                      <Text style={{
                        color: '#fff',
                        fontSize: 10,
                        fontWeight: '600',
                      }}>
                        {consultant.university}
                      </Text>
                    </View>
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View>
                        <Text style={{
                          fontSize: 18,
                          fontWeight: '600',
                          color: themedColors.text.primary,
                        }}>
                          {consultant.name}
                        </Text>
                        <Text style={{
                          fontSize: 14,
                          color: themedColors.text.secondary,
                        }}>
                          {consultant.major}
                        </Text>
                      </View>
                      {consultant.instantBooking && (
                        <View style={{
                          backgroundColor: isDark ? colors.primary[800] : colors.primary[50],
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: primaryColors.primary,
                        }}>
                          <Text style={{
                            color: primaryColors.primary,
                            fontSize: 12,
                            fontWeight: '600',
                          }}>
                            Instant Book
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Stats */}
                    <View style={{ flexDirection: 'row', marginTop: 8, gap: 16 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="star" size={14} color={colors.warning.main} />
                        <Text style={{ marginLeft: 4, fontSize: 14, color: themedColors.text.primary, fontWeight: '600' }}>
                          {consultant.rating}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 14, color: themedColors.text.secondary }}>
                        {consultant.studentsHelped} students
                      </Text>
                      <Text style={{ fontSize: 14, color: themedColors.text.secondary }}>
                        {consultant.acceptanceRate} success
                      </Text>
                    </View>

                    {/* Price */}
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: primaryColors.primary,
                      marginTop: 8,
                    }}>
                      {consultant.price}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Success Stories */}
          <View style={{ marginTop: 32, paddingHorizontal: 20 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: themedColors.text.primary,
              marginBottom: 16,
            }}>
              Success Stories
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 16 }}
            >
              {[1, 2, 3].map((i) => (
                <View key={i} style={{
                  backgroundColor: themedColors.surface.raised,
                  borderRadius: 16,
                  padding: 16,
                  width: screenWidth * 0.8,
                  borderWidth: 1,
                  borderColor: themedColors.border.default,
                  ...(isDark ? {
                    shadowColor: colors.primary[500],
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                  } : {
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                  }),
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: themedColors.surface.sunken,
                      marginRight: 12,
                    }} />
                    <View>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: themedColors.text.primary }}>
                        Alex Thompson
                      </Text>
                      <Text style={{ fontSize: 14, color: primaryColors.primary }}>
                        Got into Harvard
                      </Text>
                    </View>
                  </View>
                  <Text style={{
                    fontSize: 14,
                    color: themedColors.text.secondary,
                    lineHeight: 20,
                  }}>
                    "Sarah helped me craft the perfect essay that highlighted my unique story. Her insights were invaluable!"
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Group Sessions */}
          <View style={{ marginTop: 32, paddingHorizontal: 20 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: themedColors.text.primary,
              marginBottom: 16,
            }}>
              Group Sessions
            </Text>
            <View style={{
              backgroundColor: isDark ? colors.primary[900] : colors.primary[50],
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: isDark ? colors.primary[700] : colors.primary[200],
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: primaryColors.primary,
                marginBottom: 4,
              }}>
                Save 50% with group sessions
              </Text>
              <Text style={{
                fontSize: 14,
                color: isDark ? colors.primary[300] : colors.primary[700],
              }}>
                Join 3-5 students for essay workshops
              </Text>
            </View>
          </View>

          {/* Recommended for You */}
          <View style={{ marginTop: 32, paddingHorizontal: 20 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: themedColors.text.primary,
              marginBottom: 16,
            }}>
              Recommended for You
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 12 }}
            >
              {[
                { title: 'Essay Review Special', subtitle: '30% off this week', color: colors.primary, icon: 'edit' },
                { title: 'Mock Interviews', subtitle: 'Prep for success', color: colors.purple, icon: 'mic' },
                { title: 'SAT Bootcamp', subtitle: 'Boost your score', color: colors.teal, icon: 'trending-up' },
              ].map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={{
                    backgroundColor: isDark ? item.color[900] : item.color[50],
                    borderRadius: 16,
                    padding: 20,
                    width: 160,
                    borderWidth: 1,
                    borderColor: isDark ? item.color[700] : item.color[200],
                  }}
                >
                  <Ionicons name={item.icon as any} size={28} color={item.color[600]} />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: themedColors.text.primary,
                    marginTop: 12,
                  }}>
                    {item.title}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: themedColors.text.secondary,
                    marginTop: 4,
                  }}>
                    {item.subtitle}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Application Deadlines */}
          <View style={{ marginTop: 32, paddingHorizontal: 20 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: themedColors.text.primary,
              marginBottom: 16,
            }}>
              Upcoming Deadlines
            </Text>
            {[
              { school: 'Harvard', deadline: 'Jan 1', daysLeft: 45 },
              { school: 'Stanford', deadline: 'Jan 2', daysLeft: 46 },
              { school: 'MIT', deadline: 'Jan 1', daysLeft: 45 },
            ].map((item) => (
              <View key={item.school} style={{
                backgroundColor: themedColors.surface.raised,
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: themedColors.border.default,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.university[item.school.toLowerCase()] || primaryColors.primary,
                    marginRight: 12,
                  }} />
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: themedColors.text.primary }}>
                      {item.school}
                    </Text>
                    <Text style={{ fontSize: 14, color: themedColors.text.secondary }}>
                      {item.deadline}
                    </Text>
                  </View>
                </View>
                <View style={{
                  backgroundColor: item.daysLeft < 30 
                    ? isDark ? colors.accent[800] : colors.accent[50]
                    : isDark ? colors.primary[800] : colors.primary[50],
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: item.daysLeft < 30 ? colors.accent[600] : primaryColors.primary,
                  }}>
                    {item.daysLeft} days
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Popular Services */}
          <View style={{ marginTop: 32, paddingHorizontal: 20 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: themedColors.text.primary,
              marginBottom: 16,
            }}>
              Popular Services
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {[
                { name: 'Common App Essay', count: '2.3k sessions', hot: true },
                { name: 'Interview Prep', count: '1.8k sessions' },
                { name: 'School List Building', count: '1.5k sessions' },
                { name: 'Scholarship Essays', count: '1.2k sessions' },
                { name: 'Activities List', count: '987 sessions' },
                { name: 'SAT/ACT Tutoring', count: '856 sessions' },
              ].map((service, i) => (
                <TouchableOpacity
                  key={i}
                  style={{
                    backgroundColor: themedColors.surface.raised,
                    borderRadius: 20,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderWidth: 1,
                    borderColor: themedColors.border.default,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: themedColors.text.primary,
                  }}>
                    {service.name}
                  </Text>
                  {service.hot && (
                    <View style={{
                      backgroundColor: colors.accent[600],
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 8,
                      marginLeft: 8,
                    }}>
                      <Text style={{
                        color: '#FFF',
                        fontSize: 10,
                        fontWeight: '600',
                      }}>
                        HOT
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Recent Reviews */}
          <View style={{ marginTop: 32, paddingHorizontal: 20 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: themedColors.text.primary,
              marginBottom: 16,
            }}>
              Recent Reviews
            </Text>
            {[
              {
                consultant: 'Sarah Chen',
                student: 'Anonymous',
                rating: 5,
                review: 'Sarah\'s essay feedback was incredible! She helped me find my voice.',
                service: 'Essay Review',
                verified: true,
              },
              {
                consultant: 'Michael Zhang',
                student: 'Jake M.',
                rating: 5,
                review: 'Mock interview was so helpful. Feel 100% more confident now!',
                service: 'Interview Prep',
                verified: true,
              },
            ].map((review, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: themedColors.surface.raised,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: themedColors.border.default,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: themedColors.text.primary }}>
                      {review.consultant}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      {[...Array(5)].map((_, j) => (
                        <Ionicons
                          key={j}
                          name="star"
                          size={14}
                          color={j < review.rating ? colors.warning.main : themedColors.border.default}
                        />
                      ))}
                      {review.verified && (
                        <View style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: 8,
                        }}>
                          <Ionicons name="checkmark-circle" size={14} color={primaryColors.primary} />
                          <Text style={{
                            fontSize: 12,
                            color: primaryColors.primary,
                            marginLeft: 4,
                          }}>
                            Verified
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={{
                    backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                  }}>
                    <Text style={{ fontSize: 12, color: themedColors.text.secondary }}>
                      {review.service}
                    </Text>
                  </View>
                </View>
                <Text style={{
                  fontSize: 14,
                  color: themedColors.text.secondary,
                  lineHeight: 20,
                  marginBottom: 8,
                }}>
                  "{review.review}"
                </Text>
                <Text style={{ fontSize: 12, color: themedColors.text.tertiary }}>
                  — {review.student}
                </Text>
              </View>
            ))}
          </View>

          {/* Daily Tips */}
          <View style={{ marginTop: 32, paddingHorizontal: 20 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: themedColors.text.primary,
              marginBottom: 16,
            }}>
              Today's Tips
            </Text>
            <View style={{
              backgroundColor: isDark ? colors.primary[900] : colors.primary[50],
              borderRadius: 16,
              padding: 20,
              borderWidth: 1,
              borderColor: isDark ? colors.primary[700] : colors.primary[200],
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: primaryColors.primary,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <Ionicons name="bulb" size={20} color="#FFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: themedColors.text.primary,
                    marginBottom: 8,
                  }}>
                    Start Your Essays Early
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: themedColors.text.secondary,
                    lineHeight: 20,
                  }}>
                    The best essays go through multiple drafts. Starting early gives you time to reflect, revise, and get feedback from consultants.
                  </Text>
                  <TouchableOpacity style={{ marginTop: 12 }}>
                    <Text style={{
                      fontSize: 14,
                      color: primaryColors.primary,
                      fontWeight: '600',
                    }}>
                      Find Essay Consultants →
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Your Progress */}
          <View style={{ marginTop: 32, paddingHorizontal: 20 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: themedColors.text.primary,
              marginBottom: 16,
            }}>
              Your Progress
            </Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{
                flex: 1,
                backgroundColor: themedColors.surface.raised,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: themedColors.border.default,
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 28, fontWeight: '700', color: primaryColors.primary }}>
                  3/8
                </Text>
                <Text style={{ fontSize: 14, color: themedColors.text.secondary, marginTop: 4 }}>
                  Essays Done
                </Text>
              </View>
              <View style={{
                flex: 1,
                backgroundColor: themedColors.surface.raised,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: themedColors.border.default,
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 28, fontWeight: '700', color: colors.purple[600] }}>
                  12
                </Text>
                <Text style={{ fontSize: 14, color: themedColors.text.secondary, marginTop: 4 }}>
                  Days Until EA
                </Text>
              </View>
              <View style={{
                flex: 1,
                backgroundColor: themedColors.surface.raised,
                borderRadius: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: themedColors.border.default,
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 28, fontWeight: '700', color: colors.teal[600] }}>
                  7
                </Text>
                <Text style={{ fontSize: 14, color: themedColors.text.secondary, marginTop: 4 }}>
                  Schools Ready
                </Text>
              </View>
            </View>
          </View>

          {/* Resources */}
          <View style={{ marginTop: 32, paddingHorizontal: 20, marginBottom: 100 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: themedColors.text.primary,
              marginBottom: 16,
            }}>
              Resources & Guides
            </Text>
            {[
              { title: 'Complete Essay Guide', icon: 'book', color: colors.primary },
              { title: 'Interview Prep Checklist', icon: 'list', color: colors.purple },
              { title: 'Timeline Builder', icon: 'calendar', color: colors.teal },
              { title: 'Financial Aid 101', icon: 'cash', color: colors.warning },
            ].map((resource, i) => (
              <TouchableOpacity
                key={i}
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
              >
                <View style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: isDark ? resource.color[800] : resource.color[100],
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <Ionicons name={resource.icon as any} size={20} color={resource.color[600]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: themedColors.text.primary,
                  }}>
                    {resource.title}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: themedColors.text.secondary,
                    marginTop: 2,
                  }}>
                    Free guide for all students
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={themedColors.text.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Quick Match Modal */}
        <Modal
          visible={showQuickMatch}
          animationType="slide"
          presentationStyle="overFullScreen"
          transparent={true}
          onShow={() => console.log('[HomeScreen] Modal shown')}
          onRequestClose={() => console.log('[HomeScreen] Modal close requested')}
        >
          <View style={{ 
            flex: 1, 
            backgroundColor: isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(0, 0, 0, 0.9)',
          }}>
            <SafeAreaView style={{ flex: 1 }}>
              {/* Header */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingTop: 20,
              }}>
                <TouchableOpacity 
                  onPress={() => {
                    console.log('[HomeScreen] Skip All TouchableOpacity pressed')
                    handleSkipAll()
                  }}
                  style={{ 
                    padding: 15, 
                    marginLeft: -5,
                    borderRadius: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '500' }}>Skip All</Text>
                </TouchableOpacity>
                
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '600' }}>Quick Match</Text>
                  <Text style={{ color: '#FFF', opacity: 0.7, fontSize: 14 }}>
                    {currentMatchIndex + 1} of {mockMatches.length}
                  </Text>
                </View>
                
                <TouchableOpacity 
                  onPress={() => {
                    console.log('[HomeScreen] Add All TouchableOpacity pressed')
                    handleAddAll()
                  }}
                  style={{ 
                    padding: 15, 
                    marginRight: -5,
                    borderRadius: 8,
                    backgroundColor: `${primaryColors.primary}20`
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: primaryColors.primary, fontSize: 16, fontWeight: '600' }}>Add All</Text>
                </TouchableOpacity>
              </View>

              {/* Swipeable Card */}
              {!showMorePrompt && currentMatch && (
                <SwipeableCard
                  key={`${currentMatch.id}-${currentMatchIndex}`}
                  consultant={currentMatch.consultant}
                  service={currentMatch.service}
                  matchReason={currentMatch.matchReason}
                  availability={currentMatch.availability}
                  instantBooking={currentMatch.instantBooking}
                  onSwipeLeft={() => handleSwipe('left')}
                  onSwipeRight={() => handleSwipe('right')}
                  onSwipeUp={() => handleSwipe('up')}
                  onViewProfile={handleViewProfile}
                  isFirst={true}
                  cardIndex={0}
                />
              )}

              {/* Want More Prompt */}
              <AnimatePresence>
                {showMorePrompt && (
                  <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: 40,
                    }}
                  >
                    <View style={{
                      backgroundColor: themedColors.surface.raised,
                      borderRadius: 24,
                      padding: 32,
                      alignItems: 'center',
                      width: '100%',
                      borderWidth: 1,
                      borderColor: themedColors.border.default,
                    }}>
                      <Text style={{
                        fontSize: 24,
                        fontWeight: '700',
                        color: themedColors.text.primary,
                        marginBottom: 12,
                      }}>
                        Want to see more?
                      </Text>
                      <Text style={{
                        fontSize: 16,
                        color: themedColors.text.secondary,
                        textAlign: 'center',
                        marginBottom: 24,
                      }}>
                        We have more amazing consultants ready to help you
                      </Text>
                      
                      <TouchableOpacity
                        onPress={handleSeeMore}
                        style={{
                          backgroundColor: primaryColors.primary,
                          paddingHorizontal: 32,
                          paddingVertical: 16,
                          borderRadius: 24,
                          width: '100%',
                          marginBottom: 12,
                        }}
                      >
                        <Text style={{
                          color: '#FFF',
                          fontSize: 16,
                          fontWeight: '600',
                          textAlign: 'center',
                        }}>
                          Show me more
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        onPress={handleThatsEnough}
                        style={{
                          paddingVertical: 12,
                        }}
                      >
                        <Text style={{
                          color: themedColors.text.secondary,
                          fontSize: 16,
                        }}>
                          That's enough for now
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </MotiView>
                )}
              </AnimatePresence>
            </SafeAreaView>
          </View>
        </Modal>

        {/* Verification Popup - Disabled for now */}
        {/* <VerificationPopup
          isVisible={showVerificationPopup}
          onDismiss={handleVerificationDismiss}
          onComplete={handleVerificationComplete}
        /> */}
      </SafeAreaView>
    </View>
  )
}