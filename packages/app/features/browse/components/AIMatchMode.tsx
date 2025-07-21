import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useThemedColors } from '../../../contexts/ThemeContext'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

interface AIMatchModeProps {
  consultants: Array<{
    id: string
    name: string
    university: string
    universityColor: string
    major: string
    rating: number
    reviews: number
    price: number
    isOnline: boolean
    isVerified: boolean
    bio: string
    services: string[]
    imageUrl: string | null
    badge?: string
  }>
  onConsultantPress?: (consultantId: string) => void
  onBack: () => void
}

interface Message {
  id: string
  text: string
  isUser: boolean
  options?: string[]
  consultants?: any[]
  showMessageButtons?: boolean
}

const initialMessages: Message[] = [
  {
    id: '1',
    text: "Hey! I'm here to help you find the perfect consultant for your college journey. What's most important for you right now?",
    isUser: false,
    options: ['Essay Help', 'Interview Prep', 'Test Prep', 'Application Strategy', 'Just Exploring'],
  },
]

export const AIMatchMode: React.FC<AIMatchModeProps> = ({ consultants = [], onConsultantPress, onBack }) => {
  const colors = useThemedColors()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const typingAnimation = useRef(new Animated.Value(0)).current
  
  // Handle empty consultants
  if (consultants.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <LinearGradient
          colors={['#667EEA', '#764BA2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
          }}
        >
          <Ionicons name="sparkles" size={40} color="#FFFFFF" />
        </LinearGradient>
        <Text style={{ fontSize: 20, fontWeight: '600', color: colors.text, marginBottom: 8 }}>No Consultants Available</Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', paddingHorizontal: 40, marginBottom: 24 }}>
          Our AI assistant needs consultants to recommend. Check back soon!
        </Text>
        <TouchableOpacity onPress={onBack} style={{ padding: 12 }}>
          <Text style={{ fontSize: 16, color: colors.primary, fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    )
  }

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [])

  useEffect(() => {
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(typingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(typingAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start()
    }
  }, [isTyping])

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
    }
    setMessages([...messages, newMessage])
    setInputText('')
    
    // Check if user wants to message a consultant
    if (text.includes('message') && text.includes('directly')) {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        const consultantName = text.match(/message (\w+ \w+)/)?.[1] || 'the consultant'
        const response: Message = {
          id: Date.now().toString(),
          text: `Great! I've opened a direct message thread with ${consultantName}. They typically respond within 2 hours. While you wait, would you like to explore more consultants or learn about their services?`,
          isUser: false,
          options: ['Browse More Consultants', 'Learn About Services', 'View My Messages'],
        }
        setMessages(prev => [...prev, response])
      }, 1000)
    } else {
      // Normal AI response
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        generateAIResponse(text)
      }, 1500)
    }
  }

  const generateAIResponse = (userMessage: string) => {
    let response: Message = {
      id: Date.now().toString(),
      text: '',
      isUser: false,
    }

    // Track conversation depth
    const messageCount = messages.filter(m => m.isUser).length

    // Helper function to create consultant recommendation with extra fields
    const enhanceConsultant = (consultant: typeof consultants[0]) => {
      const specialties = {
        'Essay Review': 'Essay Excellence',
        'Interview Prep': 'Interview Master',
        'Test Prep': 'Test Score Expert',
        'Application Strategy': 'Strategy & Planning',
      }
      
      const specialty = consultant.services[0] ? specialties[consultant.services[0]] || consultant.services[0] : 'College Admissions'
      const successRate = Math.min(95, 80 + (consultant.rating * 3))
      
      const highlights = []
      if (consultant.badge) highlights.push(consultant.badge)
      if (consultant.rating >= 4.8) highlights.push('Top Rated')
      if (consultant.isOnline) highlights.push('Available Now')
      if (consultant.reviews >= 100) highlights.push(`${consultant.reviews}+ Reviews`)
      if (highlights.length === 0) highlights.push(consultant.university, consultant.major)
      
      return {
        ...consultant,
        specialty,
        successRate: `${successRate.toFixed(0)}% admit rate`,
        highlights: highlights.slice(0, 3),
      }
    }

    if (userMessage.toLowerCase().includes('essay')) {
      response.text = "Great choice! Essay help is crucial for standing out. Tell me, which schools are you targeting? This helps me match you with consultants who've successfully helped students get into similar programs."
      response.options = ['Ivy League', 'Top 20', 'UC Schools', 'Liberal Arts', 'Not Sure Yet']
    } else if (userMessage.toLowerCase().includes('interview')) {
      response.text = "Interview prep can make all the difference! Are you preparing for undergraduate or graduate program interviews?"
      response.options = ['Undergraduate', 'MBA', 'Medical School', 'Law School', 'Other Graduate']
    } else if (userMessage.toLowerCase().includes('ivy') || userMessage.toLowerCase().includes('top')) {
      // Filter consultants from top universities with high ratings
      const topConsultants = consultants
        .filter(c => c.rating >= 4.7 && ['Harvard', 'Yale', 'Princeton', 'Stanford', 'MIT', 'Columbia'].some(uni => c.university.includes(uni)))
        .slice(0, 3)
      
      if (topConsultants.length > 0) {
        response.text = "Perfect! I've analyzed our network and found consultants with exceptional track records for Ivy League admissions. Here are your matches:"
        response.consultants = topConsultants.map(enhanceConsultant)
      } else {
        response.text = "I'm looking for the best consultants for Ivy League admissions. Let me show you our highest-rated experts:"
        response.consultants = consultants
          .filter(c => c.rating >= 4.5)
          .slice(0, 3)
          .map(enhanceConsultant)
      }
      response.showMessageButtons = true
    } else if (userMessage.toLowerCase().includes('budget') || userMessage.toLowerCase().includes('afford')) {
      // Filter consultants with lower prices
      const budgetConsultants = consultants
        .filter(c => c.price <= 100)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
      
      if (budgetConsultants.length > 0) {
        response.text = "I understand budget is important. Here are highly-rated consultants offering excellent value:"
        response.consultants = budgetConsultants.map(enhanceConsultant)
      } else {
        response.text = "Let me show you our most affordable consultants:"
        response.consultants = consultants
          .sort((a, b) => a.price - b.price)
          .slice(0, 3)
          .map(enhanceConsultant)
      }
      response.showMessageButtons = true
    } else if (messageCount > 3 && !messages.some(m => m.consultants)) {
      // After several messages, proactively suggest consultants
      const diverseConsultants = consultants
        .sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews))
        .slice(0, 2)
      
      if (diverseConsultants.length > 0) {
        response.text = "Based on everything we've discussed, these consultants align perfectly with your goals:"
        response.consultants = diverseConsultants.map(enhanceConsultant)
        response.showMessageButtons = true
      } else {
        response.text = "I'd love to learn more about your specific needs. What's your biggest challenge with the application process right now?"
      }
    } else {
      response.text = "I'd love to learn more about your specific needs. What's your biggest challenge with the application process right now?"
    }

    setMessages(prev => [...prev, response])
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100)
  }

  const renderMessage = (message: Message) => {
    if (message.isUser) {
      return (
        <View
          key={message.id}
          style={{
            alignSelf: 'flex-end',
            backgroundColor: colors.primary,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 20,
            borderBottomRightRadius: 4,
            maxWidth: '80%',
            marginBottom: 8,
          }}
        >
          <Text style={{
            fontSize: 16,
            color: '#FFFFFF',
          }}>
            {message.text}
          </Text>
        </View>
      )
    }

    return (
      <View key={message.id} style={{ marginBottom: 16 }}>
        <View
          style={{
            alignSelf: 'flex-start',
            backgroundColor: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 20,
            borderBottomLeftRadius: 4,
            maxWidth: '80%',
            marginBottom: 8,
          }}
        >
          <Text style={{
            fontSize: 16,
            color: colors.text,
            lineHeight: 22,
          }}>
            {message.text}
          </Text>
        </View>

        {/* Options */}
        {message.options && (
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginLeft: 8,
          }}>
            {message.options.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => handleSendMessage(option)}
                style={{
                  backgroundColor: colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: colors.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                }}
              >
                <Text style={{
                  fontSize: 15,
                  color: colors.primary,
                  fontWeight: '500',
                }}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Consultant Recommendations */}
        {message.consultants && (
          <View style={{ marginTop: 16 }}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 8, paddingRight: 16, gap: 12 }}
            >
              {message.consultants.map((consultant, index) => (
                <View
                  key={consultant.id}
                >
                  <TouchableOpacity
                    style={{
                      width: SCREEN_WIDTH * 0.75,
                      backgroundColor: colors.isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                      borderRadius: 20,
                      overflow: 'hidden',
                      borderWidth: 1,
                      borderColor: colors.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: colors.isDark ? 0.3 : 0.08,
                      shadowRadius: 12,
                      elevation: 5,
                    }}
                  >
                    {/* Header with gradient */}
                    <LinearGradient
                      colors={[consultant.universityColor, colors.isDark ? '#000' : '#FFF']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        padding: 16,
                        paddingBottom: 20,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                        {/* Avatar */}
                        <View
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: 28,
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 12,
                            borderWidth: 2,
                            borderColor: 'rgba(255,255,255,0.3)',
                          }}
                        >
                          <Text style={{
                            fontSize: 20,
                            fontWeight: '700',
                            color: consultant.universityColor,
                          }}>
                            {consultant.name.split(' ').map(n => n[0]).join('')}
                          </Text>
                          {consultant.isOnline && (
                            <View style={{
                              position: 'absolute',
                              bottom: 0,
                              right: 0,
                              width: 16,
                              height: 16,
                              borderRadius: 8,
                              backgroundColor: '#4CAF50',
                              borderWidth: 2,
                              borderColor: '#FFF',
                            }} />
                          )}
                        </View>
                        
                        {/* Name and University */}
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={{
                              fontSize: 18,
                              fontWeight: '700',
                              color: '#FFFFFF',
                            }}>
                              {consultant.name}
                            </Text>
                            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
                          </View>
                          <Text style={{
                            fontSize: 15,
                            color: 'rgba(255,255,255,0.9)',
                            fontWeight: '600',
                          }}>
                            {consultant.university} • {consultant.major}
                          </Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                            <Ionicons name="star" size={14} color="#FFF" />
                            <Text style={{
                              fontSize: 13,
                              color: 'rgba(255,255,255,0.9)',
                              marginLeft: 4,
                            }}>
                              {consultant.rating} ({consultant.reviews} reviews)
                            </Text>
                          </View>
                        </View>
                      </View>
                    </LinearGradient>

                    {/* Content */}
                    <View style={{ padding: 16 }}>
                      {/* Bio */}
                      <Text style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                        lineHeight: 20,
                        marginBottom: 12,
                      }}>
                        {consultant.bio}
                      </Text>

                      {/* Highlights */}
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                        {consultant.highlights.map((highlight, idx) => (
                          <View
                            key={idx}
                            style={{
                              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.05)' : consultant.universityColor + '15',
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                              borderRadius: 12,
                            }}
                          >
                            <Text style={{
                              fontSize: 12,
                              color: colors.isDark ? colors.text : consultant.universityColor,
                              fontWeight: '600',
                            }}>
                              {highlight}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {/* Success Rate and Price */}
                      <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 16,
                        paddingTop: 12,
                        borderTopWidth: 1,
                        borderTopColor: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                      }}>
                        <View>
                          <Text style={{
                            fontSize: 12,
                            color: colors.textSecondary,
                          }}>
                            Success Rate
                          </Text>
                          <Text style={{
                            fontSize: 16,
                            fontWeight: '700',
                            color: '#4CAF50',
                          }}>
                            {consultant.successRate}
                          </Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Text style={{
                            fontSize: 12,
                            color: colors.textSecondary,
                          }}>
                            Starting at
                          </Text>
                          <Text style={{
                            fontSize: 20,
                            fontWeight: '700',
                            color: colors.primary,
                          }}>
                            ${consultant.price}<Text style={{ fontSize: 14, fontWeight: '400' }}>/hr</Text>
                          </Text>
                        </View>
                      </View>

                      {/* Action Buttons */}
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        <TouchableOpacity
                          onPress={() => onConsultantPress && onConsultantPress(consultant.id)}
                          style={{
                            flex: 1,
                            backgroundColor: colors.primary,
                            paddingVertical: 14,
                            borderRadius: 14,
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: '#FFFFFF',
                          }}>
                            Book Now
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            paddingHorizontal: 16,
                            paddingVertical: 14,
                            borderRadius: 14,
                            alignItems: 'center',
                            backgroundColor: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            borderWidth: 1,
                            borderColor: colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                          }}
                          onPress={() => {
                            handleSendMessage(`I'd like to message ${consultant.name} directly`)
                          }}
                        >
                          <Ionicons name="chatbubble-ellipses" size={20} color={colors.primary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    )
  }

  const renderTypingIndicator = () => (
    <View style={{
      alignSelf: 'flex-start',
      flexDirection: 'row',
      backgroundColor: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 20,
      borderBottomLeftRadius: 4,
      gap: 4,
    }}>
      {[0, 1, 2].map((index) => (
        <Animated.View
          key={index}
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.textSecondary,
            opacity: typingAnimation.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: index === 0 ? [0.3, 1, 0.3] : index === 1 ? [0.3, 0.3, 1] : [1, 0.3, 0.3],
            }),
          }}
        />
      ))}
    </View>
  )

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        }}>
          <TouchableOpacity
            onPress={onBack}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="sparkles" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={{
                fontSize: 14,
                fontWeight: '600',
                color: '#FFFFFF',
              }}>
                AI Match Assistant
              </Text>
            </LinearGradient>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 100,
          }}
        >
          {messages.map(renderMessage)}
          {isTyping && renderTypingIndicator()}
        </ScrollView>

        {/* Input */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={{
            flexDirection: 'row',
            padding: 16,
            paddingBottom: Platform.OS === 'ios' ? 34 : 16,
            gap: 12,
            borderTopWidth: 1,
            borderTopColor: colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            backgroundColor: colors.background,
          }}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              borderRadius: 24,
              paddingHorizontal: 16,
              minHeight: 48,
              borderWidth: 1,
              borderColor: colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            }}>
              <TextInput
                placeholder="Type your message..."
                placeholderTextColor={colors.textSecondary}
                value={inputText}
                onChangeText={setInputText}
                multiline
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: colors.text,
                  paddingVertical: 12,
                  maxHeight: 120,
                }}
              />
            </View>
            <TouchableOpacity
              onPress={() => inputText.trim() && handleSendMessage(inputText.trim())}
              disabled={!inputText.trim()}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: inputText.trim() ? colors.primary : colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="send"
                size={20}
                color={inputText.trim() ? '#FFFFFF' : colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </View>
  )
}