import React, { useState, useEffect } from 'react'
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
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { MotiView, AnimatePresence } from 'moti'
import { LinearGradient } from 'expo-linear-gradient'
import { VerificationPopup } from '../../verification/components/VerificationPopup'
import { SwipeableCard } from '../components/SwipeableCard'

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

// Mock data
const mockConsultants = [
  {
    id: 1,
    name: 'Sarah Chen',
    university: 'Harvard',
    year: '2024',
    major: 'Computer Science',
    rating: 4.9,
    studentsHelped: 127,
    price: '$50-150/hr',
    bio: 'Helped 127 students get into Ivy League schools',
    acceptanceRate: '94%',
    specialties: ['Essays', 'CS Applications', 'Interview Prep'],
    responseTime: '< 2 hours',
    nextAvailable: 'Today',
    instantBooking: true,
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 2,
    name: 'Michael Park',
    university: 'Stanford',
    year: '2023',
    major: 'Economics',
    rating: 4.8,
    studentsHelped: 89,
    price: '$75-200/hr',
    bio: 'Essay specialist with 89 success stories',
    acceptanceRate: '91%',
    specialties: ['Essays', 'Business School', 'Scholarships'],
    responseTime: '< 4 hours',
    nextAvailable: 'Tomorrow',
    instantBooking: false,
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    university: 'MIT',
    year: '2024',
    major: 'Engineering',
    rating: 5.0,
    studentsHelped: 156,
    price: '$100-250/hr',
    bio: 'Perfect track record for STEM applicants',
    acceptanceRate: '97%',
    specialties: ['STEM Essays', 'Research Papers', 'MIT Specific'],
    responseTime: '< 1 hour',
    nextAvailable: 'Now',
    instantBooking: true,
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
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
  const [showQuickMatch, setShowQuickMatch] = useState(true)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const [swipeCount, setSwipeCount] = useState(0)
  const [showVerificationPopup, setShowVerificationPopup] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    checkUserRoleAndVerification()
  }, [])

  const checkUserRoleAndVerification = async () => {
    try {
      const onboardingState = await AsyncStorage.getItem('onboardingState')
      const verificationDismissed = await AsyncStorage.getItem('verificationDismissed')
      
      if (onboardingState) {
        const state = JSON.parse(onboardingState)
        if (state.role === 'consultant' && !state.consultantData.isVerified && verificationDismissed !== 'true') {
          setShowVerificationPopup(true)
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error)
    }
  }

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    const consultant = mockConsultants[currentMatchIndex]
    
    if (direction === 'right') {
      console.log(`Added ${consultant.name} to requests`)
    } else if (direction === 'up') {
      console.log(`Super liked ${consultant.name} - premium rate`)
    }
    
    setSwipeCount(swipeCount + 1)
    
    // Check if this is the last card or 5th swipe
    if (currentMatchIndex >= mockConsultants.length - 1 || swipeCount >= 4) {
      // Delay closing to allow swipe animation to complete
      setTimeout(() => {
        setShowQuickMatch(false)
        setCurrentMatchIndex(0) // Reset for next time
        setSwipeCount(0)
      }, 300)
      return
    }
    
    // Move to next consultant
    setCurrentMatchIndex(currentMatchIndex + 1)
  }

  const handleVerificationDismiss = async () => {
    setShowVerificationPopup(false)
    await AsyncStorage.setItem('verificationDismissed', 'true')
  }

  const handleVerificationComplete = async (email: string) => {
    console.log('Verification email:', email)
    setShowVerificationPopup(false)
  }

  const handleViewProfile = () => {
    console.log('View profile:', mockConsultants[currentMatchIndex].name)
    // TODO: Navigate to profile or show modal
  }

  const handleSkipAll = () => {
    setShowQuickMatch(false)
    setCurrentMatchIndex(0)
    setSwipeCount(0)
  }

  const handleAddAll = () => {
    // Add remaining consultants to requests
    const remaining = mockConsultants.slice(currentMatchIndex)
    console.log('Adding all remaining consultants:', remaining.length)
    setShowQuickMatch(false)
    setCurrentMatchIndex(0)
    setSwipeCount(0)
  }

  const currentConsultant = mockConsultants[currentMatchIndex]

  return (
    <View style={{ flex: 1, backgroundColor: '#FAF7F0' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={{
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#F5E6D3',
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
                color: '#2C2825',
              }}>
                Proofr
              </Text>
              
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                  onPress={() => setShowQuickMatch(true)}
                  style={{
                    backgroundColor: '#D4A574',
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    flexDirection: 'row',
                    alignItems: 'center',
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
                  <Ionicons name="notifications-outline" size={24} color="#2C2825" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Search Bar */}
            <View style={{
              backgroundColor: '#F7F7F7',
              borderRadius: 30,
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <Ionicons name="search" size={20} color="#666" />
              <TextInput
                placeholder="Search consultants, schools, or services"
                placeholderTextColor="#999"
                style={{
                  flex: 1,
                  marginLeft: 8,
                  fontSize: 16,
                  color: '#1a1f36',
                }}
              />
              <TouchableOpacity>
                <Ionicons name="options-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              backgroundColor: '#fff',
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
                  alignItems: 'center',
                  marginRight: 16,
                }}
              >
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: selectedCategory === category.id ? '#1DBF73' : '#F7F7F7',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 8,
                }}>
                  <Ionicons
                    name={category.icon as any}
                    size={24}
                    color={selectedCategory === category.id ? '#fff' : '#666'}
                  />
                </View>
                <Text style={{
                  fontSize: 12,
                  color: selectedCategory === category.id ? '#1DBF73' : '#666',
                  fontWeight: selectedCategory === category.id ? '600' : '400',
                }}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Urgent Help Banner */}
          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            <LinearGradient
              colors={['#1DBF73', '#00A86B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                borderRadius: 16,
                padding: 20,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '700',
                    color: '#fff',
                    marginBottom: 4,
                  }}>
                    Essay Due Soon? 📝
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.9)',
                  }}>
                    Get instant help from verified consultants
                  </Text>
                </View>
                <TouchableOpacity style={{
                  backgroundColor: '#fff',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                }}>
                  <Text style={{
                    color: '#1DBF73',
                    fontWeight: '600',
                  }}>
                    Get Help
                  </Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>

          {/* Featured Consultants */}
          <View style={{ marginTop: 32, paddingHorizontal: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{
                fontSize: 22,
                fontWeight: '700',
                color: '#1a1f36',
              }}>
                Featured Consultants
              </Text>
              <TouchableOpacity>
                <Text style={{
                  fontSize: 14,
                  color: '#1DBF73',
                  fontWeight: '600',
                }}>
                  See all
                </Text>
              </TouchableOpacity>
            </View>

            {/* Consultant Cards Grid */}
            {mockConsultants.map((consultant) => (
              <TouchableOpacity
                key={consultant.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 16,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  {/* Profile Image */}
                  <View style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    backgroundColor: '#F0F0F0',
                    marginRight: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Ionicons name="person-circle" size={70} color="#DDD" />
                    <View style={{
                      position: 'absolute',
                      bottom: -4,
                      right: -4,
                      backgroundColor: '#1DBF73',
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
                          color: '#1a1f36',
                        }}>
                          {consultant.name}
                        </Text>
                        <Text style={{
                          fontSize: 14,
                          color: '#666',
                        }}>
                          {consultant.major}
                        </Text>
                      </View>
                      {consultant.instantBooking && (
                        <View style={{
                          backgroundColor: '#E8F5E9',
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 8,
                        }}>
                          <Text style={{
                            color: '#2E7D32',
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
                        <Ionicons name="star" size={14} color="#FFB800" />
                        <Text style={{ marginLeft: 4, fontSize: 14, color: '#1a1f36', fontWeight: '600' }}>
                          {consultant.rating}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 14, color: '#666' }}>
                        {consultant.studentsHelped} students
                      </Text>
                      <Text style={{ fontSize: 14, color: '#666' }}>
                        {consultant.acceptanceRate} success
                      </Text>
                    </View>

                    {/* Price */}
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#1a1f36',
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
              color: '#1a1f36',
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
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  padding: 16,
                  width: screenWidth * 0.8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: '#F0F0F0',
                      marginRight: 12,
                    }} />
                    <View>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: '#1a1f36' }}>
                        Alex Thompson
                      </Text>
                      <Text style={{ fontSize: 14, color: '#666' }}>
                        Got into Harvard
                      </Text>
                    </View>
                  </View>
                  <Text style={{
                    fontSize: 14,
                    color: '#666',
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
              color: '#1a1f36',
              marginBottom: 16,
            }}>
              Group Sessions
            </Text>
            <View style={{
              backgroundColor: '#E8F5E9',
              borderRadius: 16,
              padding: 16,
            }}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#2E7D32',
                marginBottom: 4,
              }}>
                Save 50% with group sessions
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#388E3C',
              }}>
                Join 3-5 students for essay workshops
              </Text>
            </View>
          </View>

          {/* Application Deadlines */}
          <View style={{ marginTop: 32, paddingHorizontal: 20 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: '#1a1f36',
              marginBottom: 16,
            }}>
              Upcoming Deadlines
            </Text>
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}>
              {[
                { school: 'Harvard', date: 'Jan 1', days: 38 },
                { school: 'Stanford', date: 'Jan 5', days: 42 },
                { school: 'MIT', date: 'Jan 15', days: 52 },
              ].map((deadline, index) => (
                <View key={index} style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 12,
                  borderBottomWidth: index < 2 ? 1 : 0,
                  borderBottomColor: '#F0F0F0',
                }}>
                  <View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#1a1f36' }}>
                      {deadline.school}
                    </Text>
                    <Text style={{ fontSize: 14, color: '#666' }}>
                      {deadline.date}
                    </Text>
                  </View>
                  <View style={{
                    backgroundColor: deadline.days < 40 ? '#FFE5E5' : '#E8F5E9',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                  }}>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: deadline.days < 40 ? '#D32F2F' : '#2E7D32',
                    }}>
                      {deadline.days} days
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Popular Services */}
          <View style={{ marginTop: 32, paddingHorizontal: 20, marginBottom: 100 }}>
            <Text style={{
              fontSize: 22,
              fontWeight: '700',
              color: '#1a1f36',
              marginBottom: 16,
            }}>
              Popular Services
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {[
                { name: 'Essay Review', price: '$50', icon: 'document-text' },
                { name: 'Mock Interview', price: '$75', icon: 'mic' },
                { name: 'Application Strategy', price: '$100', icon: 'compass' },
                { name: 'Resume Polish', price: '$40', icon: 'briefcase' },
              ].map((service, index) => (
                <TouchableOpacity key={index} style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 16,
                  width: (screenWidth - 52) / 2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}>
                  <Ionicons name={service.icon as any} size={24} color="#1DBF73" />
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#1a1f36',
                    marginTop: 8,
                  }}>
                    {service.name}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#1DBF73',
                    fontWeight: '600',
                    marginTop: 4,
                  }}>
                    Starting at {service.price}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Quick Match Overlay */}
      <Modal
        visible={showQuickMatch}
        transparent
        animationType="slide"
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{
              flex: 1,
              backgroundColor: '#FFFFFF',
              marginTop: 50,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              borderWidth: 1,
              borderColor: '#F5E6D3',
              borderBottomWidth: 0,
            }}>
              {/* Header */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 20,
                borderBottomWidth: 1,
                borderBottomColor: '#F5E6D3',
              }}>
                <View>
                  <Text style={{
                    fontSize: 24,
                    fontWeight: '700',
                    color: '#2C2825',
                  }}>
                    Quick Matches
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: '#8B7355',
                    marginTop: 4,
                  }}>
                    Swipe right to add to requests • {5 - swipeCount} left
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setShowQuickMatch(false)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: '#FAF7F0',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Ionicons name="close" size={24} color="#8B7355" />
                </TouchableOpacity>
              </View>

              {/* Swipe Card Stack */}
              <View style={{
                flex: 1,
                position: 'relative',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* Show stack of cards */}
                {mockConsultants.slice(currentMatchIndex, currentMatchIndex + 3).reverse().map((consultant, index, array) => {
                  const isFirst = index === array.length - 1
                  const cardIndex = array.length - 1 - index
                  
                  return (
                    <SwipeableCard
                      key={consultant.id}
                      consultant={consultant}
                      onSwipeLeft={() => handleSwipe('left')}
                      onSwipeRight={() => handleSwipe('right')}
                      onSwipeUp={() => handleSwipe('up')}
                      onViewProfile={handleViewProfile}
                      isFirst={isFirst}
                      cardIndex={cardIndex}
                    />
                  )
                })}
              </View>

              {/* Bottom Actions */}
              <View style={{
                paddingBottom: 30,
                paddingHorizontal: 20,
              }}>
                {/* Instructions */}
                <Text style={{
                  fontSize: 14,
                  color: '#8B7355',
                  textAlign: 'center',
                  marginBottom: 16,
                }}>
                  Swipe right to request • Left to pass • Up for priority
                </Text>
                
                {/* Buttons */}
                <View style={{
                  flexDirection: 'row',
                  gap: 12,
                }}>
                  <TouchableOpacity
                    onPress={handleSkipAll}
                    style={{
                      flex: 1,
                      backgroundColor: '#F5E6D3',
                      paddingVertical: 14,
                      borderRadius: 25,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#8B7355',
                    }}>
                      Skip All
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={handleAddAll}
                    style={{
                      flex: 1,
                      backgroundColor: '#68A357',
                      paddingVertical: 14,
                      borderRadius: 25,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      fontSize: 16,
                      fontWeight: '600',
                      color: '#fff',
                    }}>
                      Request All ({mockConsultants.length - currentMatchIndex})
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      {/* Verification Popup */}
      <VerificationPopup
        visible={showVerificationPopup}
        onDismiss={handleVerificationDismiss}
        onVerify={handleVerificationComplete}
      />
    </View>
  )
}