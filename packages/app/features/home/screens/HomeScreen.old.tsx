import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { MotiView, AnimatePresence } from 'moti'
import { VerificationPopup } from '../../verification/components/VerificationPopup'

// AsyncStorage might not be available in all environments
let AsyncStorage: any
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default
} catch (error) {
  AsyncStorage = {
    getItem: async () => null,
    setItem: async () => {},
  }
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

// Mock consultant data
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
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    acceptanceRate: '94%',
    specialties: ['Essays', 'CS Applications', 'Interview Prep'],
    responseTime: '< 2 hours',
    nextAvailable: 'Today',
    instantBooking: true,
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
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    acceptanceRate: '91%',
    specialties: ['Essays', 'Business School', 'Scholarships'],
    responseTime: '< 4 hours',
    nextAvailable: 'Tomorrow',
    instantBooking: false,
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
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    acceptanceRate: '97%',
    specialties: ['STEM Essays', 'Research Papers', 'MIT Specific'],
    responseTime: '< 1 hour',
    nextAvailable: 'Now',
    instantBooking: true,
  },
]

export function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [consultants] = useState(mockConsultants)
  const [showVerificationPopup, setShowVerificationPopup] = useState(false)
  const [isConsultant, setIsConsultant] = useState(false)

  useEffect(() => {
    checkUserRoleAndVerification()
  }, [])

  const checkUserRoleAndVerification = async () => {
    try {
      // Check if user is consultant and hasn't dismissed verification
      const onboardingState = await AsyncStorage.getItem('onboardingState')
      const verificationDismissed = await AsyncStorage.getItem('verificationDismissed')
      
      if (onboardingState) {
        const state = JSON.parse(onboardingState)
        if (state.role === 'consultant' && !state.consultantData.isVerified && verificationDismissed !== 'true') {
          setIsConsultant(true)
          setShowVerificationPopup(true)
        }
      }
    } catch (error) {
      console.error('Error checking verification status:', error)
    }
  }

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    const consultant = consultants[currentIndex]
    
    if (direction === 'right') {
      // Add to requests
      console.log(`Added ${consultant.name} to requests`)
      // TODO: Add to requests/cart
    } else if (direction === 'up') {
      // Super like - premium rate
      console.log(`Super liked ${consultant.name} - premium rate`)
      // TODO: Add to requests with premium flag
    }
    
    // Move to next consultant
    if (currentIndex < consultants.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleVerificationDismiss = async () => {
    setShowVerificationPopup(false)
    await AsyncStorage.setItem('verificationDismissed', 'true')
  }

  const handleVerificationComplete = async (email: string) => {
    // TODO: Send verification email to backend
    console.log('Verification email:', email)
    setShowVerificationPopup(false)
    // Update user's verification status
    const onboardingState = await AsyncStorage.getItem('onboardingState')
    if (onboardingState) {
      const state = JSON.parse(onboardingState)
      state.consultantData.isVerified = true
      state.consultantData.universityEmail = email
      await AsyncStorage.setItem('onboardingState', JSON.stringify(state))
    }
  }

  const currentConsultant = consultants[currentIndex]

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}>
          <TouchableOpacity>
            <Ionicons name="school" size={28} color="#9333ea" />
          </TouchableOpacity>
          
          <Text style={{
            fontSize: 24,
            fontWeight: '700',
            color: '#fff',
          }}>
            Proofr
          </Text>
          
          <TouchableOpacity>
            <Ionicons name="notifications" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Success Banner */}
        <View style={{
          marginHorizontal: 20,
          marginBottom: 10,
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          borderRadius: 12,
          padding: 12,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Ionicons name="sparkles" size={20} color="#9333ea" />
          <Text style={{
            color: '#9333ea',
            fontSize: 14,
            fontWeight: '600',
            marginLeft: 8,
          }}>
            Join 15K+ students who got accepted
          </Text>
        </View>

        {/* Swipe Cards Container */}
        <View style={{
          flex: 1,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}>
          {currentConsultant && (
            <View style={{ flex: 1 }}>
              {/* Main Card */}
              <AnimatePresence>
                <MotiView
                  key={currentConsultant.id}
                  from={{
                    opacity: 0,
                    translateY: 50,
                  }}
                  animate={{
                    opacity: 1,
                    translateY: 0,
                  }}
                  exit={{
                    opacity: 0,
                    translateX: -screenWidth,
                  }}
                  transition={{
                    type: 'timing',
                    duration: 300,
                  }}
                  style={{
                    flex: 1,
                    marginBottom: 80, // Space for next card preview
                  }}
                >
                  <View style={{
                    flex: 1,
                    backgroundColor: '#1a1a1a',
                    borderRadius: 20,
                    padding: 20,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.1)',
                  }}>
                    {/* Header with photo and basic info */}
                    <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                      {/* Small profile photo */}
                      <View style={{
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: '#2a2a2a',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 16,
                      }}>
                        <Ionicons name="person-circle" size={70} color="rgba(255,255,255,0.3)" />
                      </View>
                      
                      {/* Basic info */}
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                          <Text style={{
                            fontSize: 22,
                            fontWeight: '700',
                            color: '#fff',
                          }}>
                            {currentConsultant.name}
                          </Text>
                          {currentConsultant.instantBooking && (
                            <View style={{
                              backgroundColor: '#4CAF50',
                              paddingHorizontal: 8,
                              paddingVertical: 2,
                              borderRadius: 10,
                              marginLeft: 8,
                            }}>
                              <Text style={{
                                color: '#fff',
                                fontSize: 10,
                                fontWeight: '600',
                              }}>
                                INSTANT
                              </Text>
                            </View>
                          )}
                        </View>
                        
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                          <View style={{
                            backgroundColor: '#9333ea',
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 12,
                            marginRight: 8,
                          }}>
                            <Text style={{
                              color: '#fff',
                              fontSize: 12,
                              fontWeight: '600',
                            }}>
                              {currentConsultant.university}
                            </Text>
                          </View>
                          <Text style={{
                            fontSize: 14,
                            color: 'rgba(255,255,255,0.6)',
                          }}>
                            {currentConsultant.major}
                          </Text>
                        </View>
                        
                        {/* Quick stats */}
                        <View style={{ flexDirection: 'row' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text style={{ color: '#fff', marginLeft: 4, fontSize: 12 }}>
                              {currentConsultant.rating}
                            </Text>
                          </View>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                            <Text style={{ color: '#fff', marginLeft: 4, fontSize: 12 }}>
                              {currentConsultant.acceptanceRate}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Bio */}
                    <Text style={{
                      fontSize: 16,
                      color: 'rgba(255,255,255,0.9)',
                      marginBottom: 16,
                      lineHeight: 22,
                    }}>
                      {currentConsultant.bio}
                    </Text>

                    {/* Specialties */}
                    <View style={{ marginBottom: 16 }}>
                      <Text style={{
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.5)',
                        marginBottom: 8,
                      }}>
                        Specializes in
                      </Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        {currentConsultant.specialties.map((specialty, index) => (
                          <View key={index} style={{
                            backgroundColor: 'rgba(147, 51, 234, 0.2)',
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 16,
                            marginRight: 8,
                            marginBottom: 8,
                            borderWidth: 1,
                            borderColor: 'rgba(147, 51, 234, 0.3)',
                          }}>
                            <Text style={{
                              color: '#9333ea',
                              fontSize: 14,
                              fontWeight: '500',
                            }}>
                              {specialty}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>

                    {/* Availability and Response */}
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: 16,
                    }}>
                      <View>
                        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                          Response time
                        </Text>
                        <Text style={{ fontSize: 14, color: '#fff', fontWeight: '600' }}>
                          {currentConsultant.responseTime}
                        </Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                          Next available
                        </Text>
                        <Text style={{ fontSize: 14, color: '#fff', fontWeight: '600' }}>
                          {currentConsultant.nextAvailable}
                        </Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                          Students helped
                        </Text>
                        <Text style={{ fontSize: 14, color: '#fff', fontWeight: '600' }}>
                          {currentConsultant.studentsHelped}
                        </Text>
                      </View>
                    </View>

                    {/* Price */}
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: 16,
                      borderTopWidth: 1,
                      borderTopColor: 'rgba(255,255,255,0.1)',
                    }}>
                      <View>
                        <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                          Service rate
                        </Text>
                        <Text style={{
                          fontSize: 20,
                          fontWeight: '700',
                          color: '#fff',
                        }}>
                          {currentConsultant.price}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="flash" size={16} color="#FFD700" />
                        <Text style={{
                          color: '#FFD700',
                          fontSize: 12,
                          marginLeft: 4,
                        }}>
                          Super like for priority
                        </Text>
                      </View>
                    </View>
                  </View>
                </MotiView>
              </AnimatePresence>

              {/* Next Card Preview */}
              {currentIndex < consultants.length - 1 && (
                <View style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 70,
                  backgroundColor: 'rgba(26,26,26,0.95)',
                  borderRadius: 20,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.05)',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                      width: 46,
                      height: 46,
                      borderRadius: 23,
                      backgroundColor: '#2a2a2a',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}>
                      <Ionicons name="person-circle" size={40} color="rgba(255,255,255,0.3)" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: '#fff',
                      }}>
                        {consultants[currentIndex + 1].name}
                      </Text>
                      <Text style={{
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.5)',
                      }}>
                        {consultants[currentIndex + 1].university} • {consultants[currentIndex + 1].price}
                      </Text>
                    </View>
                    <Text style={{
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.4)',
                    }}>
                      Up next
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          paddingBottom: 20,
          gap: 20,
        }}>
          {/* Pass Button */}
          <TouchableOpacity
            onPress={() => handleSwipe('left')}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: 'rgba(255,255,255,0.1)',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <Ionicons name="close" size={30} color="#FF4458" />
          </TouchableOpacity>

          {/* Super Like Button */}
          <TouchableOpacity
            onPress={() => handleSwipe('up')}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: 'rgba(255,255,255,0.1)',
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: 'rgba(255,255,255,0.2)',
            }}
          >
            <Ionicons name="star" size={24} color="#44D3FF" />
          </TouchableOpacity>

          {/* Like Button */}
          <TouchableOpacity
            onPress={() => handleSwipe('right')}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#9333ea',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Ionicons name="heart" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      {/* Verification Popup for Consultants */}
      <VerificationPopup
        visible={showVerificationPopup}
        onDismiss={handleVerificationDismiss}
        onVerify={handleVerificationComplete}
      />
    </View>
  )
}