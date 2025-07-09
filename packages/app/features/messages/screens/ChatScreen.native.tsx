import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Image,
  Animated,
  FlatList,
  Keyboard,
  Dimensions,
} from 'react-native'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRoute, useNavigation } from '@react-navigation/native'
import { MotiView } from 'moti'

const { width: screenWidth } = Dimensions.get('window')

interface Message {
  id: string
  text: string
  sender: 'user' | 'consultant'
  timestamp: Date
  status: 'sending' | 'sent' | 'delivered' | 'read'
  replyTo?: {
    id: string
    text: string
    sender: string
  }
  attachments?: {
    type: 'image' | 'document' | 'service'
    url?: string
    name?: string
    serviceDetails?: {
      title: string
      price: string
      duration: string
    }
  }[]
  reactions?: string[]
}

const mockMessages: Message[] = [
  {
    id: '1',
    text: "Hi! I saw your profile and I'm interested in getting help with my Harvard application essay.",
    sender: 'user',
    timestamp: new Date(Date.now() - 3600000),
    status: 'read',
  },
  {
    id: '2',
    text: "Hello! I'd be happy to help you with your Harvard application. I graduated from Harvard last year and have helped 20+ students get accepted.",
    sender: 'consultant',
    timestamp: new Date(Date.now() - 3500000),
    status: 'read',
  },
  {
    id: '3',
    text: "Let me share my essay review service details with you:",
    sender: 'consultant',
    timestamp: new Date(Date.now() - 3400000),
    status: 'read',
  },
  {
    id: '4',
    text: '',
    sender: 'consultant',
    timestamp: new Date(Date.now() - 3300000),
    status: 'read',
    attachments: [{
      type: 'service',
      serviceDetails: {
        title: 'Comprehensive Essay Review',
        price: '$150',
        duration: '3-5 days',
      }
    }],
  },
  {
    id: '5',
    text: "That looks perfect! Can you help me specifically with the 'Why Harvard?' essay?",
    sender: 'user',
    timestamp: new Date(Date.now() - 1800000),
    status: 'read',
    replyTo: {
      id: '4',
      text: 'Comprehensive Essay Review - $150',
      sender: 'consultant',
    },
  },
  {
    id: '6',
    text: "Absolutely! The 'Why Harvard?' essay is one of my specialties. I can help you craft a compelling narrative that showcases your unique fit with Harvard's culture and opportunities.",
    sender: 'consultant',
    timestamp: new Date(Date.now() - 900000),
    status: 'delivered',
  },
]

export function ChatScreen() {
  const navigation = useNavigation()
  const route = useRoute()
  const scrollViewRef = useRef<ScrollView>(null)
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [showActions, setShowActions] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Consultant info (would come from route params)
  const consultant = {
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    isOnline: true,
    university: 'Harvard University',
    verified: true,
  }

  useEffect(() => {
    // Animate typing indicator
    if (isTyping) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start()
    }
  }, [isTyping, fadeAnim])

  const sendMessage = () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
      replyTo: replyingTo ? {
        id: replyingTo.id,
        text: replyingTo.text || 'Service Package',
        sender: replyingTo.sender,
      } : undefined,
    }

    setMessages([...messages, newMessage])
    setInputText('')
    setReplyingTo(null)
    Keyboard.dismiss()

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
      ))
    }, 300)

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      ))
    }, 800)

    // Simulate consultant typing
    setTimeout(() => setIsTyping(true), 2000)
    setTimeout(() => {
      setIsTyping(false)
      // Add consultant response
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'll get back to you on that shortly!",
        sender: 'consultant',
        timestamp: new Date(),
        status: 'read',
      }
      setMessages(prev => [...prev, response])
    }, 4000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === 'user'

    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300 }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onLongPress={() => {
            setReplyingTo(item)
            setShowActions(true)
          }}
          style={{
            flexDirection: 'row',
            justifyContent: isUser ? 'flex-end' : 'flex-start',
            marginBottom: 16,
            paddingHorizontal: 16,
          }}
        >
          {!isUser && (
            <Image
              source={{ uri: consultant.avatar }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                marginRight: 8,
              }}
            />
          )}

          <View
            style={{
              maxWidth: screenWidth * 0.75,
              backgroundColor: isUser ? '#0055FE' : '#F0E8E0',
              borderRadius: 18,
              borderBottomRightRadius: isUser ? 4 : 18,
              borderBottomLeftRadius: isUser ? 18 : 4,
              padding: 12,
              paddingHorizontal: 16,
            }}
          >
            {item.replyTo && (
              <View
                style={{
                  borderLeftWidth: 3,
                  borderLeftColor: isUser ? '#FFFFFF50' : '#0055FE50',
                  paddingLeft: 8,
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: isUser ? '#FFFFFF90' : '#62646A',
                    marginBottom: 2,
                  }}
                >
                  {item.replyTo.sender === 'user' ? 'You' : consultant.name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 13,
                    color: isUser ? '#FFFFFFB0' : '#1a1f36B0',
                  }}
                >
                  {item.replyTo.text}
                </Text>
              </View>
            )}

            {item.attachments?.map((attachment, index) => (
              <View key={index}>
                {attachment.type === 'service' && attachment.serviceDetails && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: isUser ? '#FFFFFF20' : '#FFFFFF',
                      borderRadius: 12,
                      padding: 12,
                      marginBottom: item.text ? 8 : 0,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <MaterialCommunityIcons 
                        name="briefcase-check" 
                        size={20} 
                        color={isUser ? '#FFFFFF' : '#0055FE'} 
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color: isUser ? '#FFFFFF' : '#1a1f36',
                          marginLeft: 8,
                        }}
                      >
                        {attachment.serviceDetails.title}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ color: isUser ? '#FFFFFFB0' : '#62646A', fontSize: 14 }}>
                        {attachment.serviceDetails.price}
                      </Text>
                      <Text style={{ color: isUser ? '#FFFFFFB0' : '#62646A', fontSize: 14 }}>
                        {attachment.serviceDetails.duration}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: isUser ? '#FFFFFF' : '#0055FE',
                        borderRadius: 8,
                        paddingVertical: 8,
                        marginTop: 8,
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: isUser ? '#0055FE' : '#FFFFFF',
                          fontWeight: '600',
                          fontSize: 14,
                        }}
                      >
                        View Details
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
              </View>
            ))}

            {item.text ? (
              <Text
                style={{
                  fontSize: 16,
                  color: isUser ? '#FFFFFF' : '#1a1f36',
                  lineHeight: 22,
                }}
              >
                {item.text}
              </Text>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 4,
                justifyContent: isUser ? 'flex-end' : 'flex-start',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: isUser ? '#FFFFFF80' : '#62646A80',
                }}
              >
                {formatTime(item.timestamp)}
              </Text>
              {isUser && (
                <View style={{ marginLeft: 4 }}>
                  {item.status === 'sending' && (
                    <Ionicons name="time-outline" size={14} color="#FFFFFF80" />
                  )}
                  {item.status === 'sent' && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF80" />
                  )}
                  {item.status === 'delivered' && (
                    <Ionicons name="checkmark-done" size={14} color="#FFFFFF80" />
                  )}
                  {item.status === 'read' && (
                    <Ionicons name="checkmark-done" size={14} color="#FFFFFF" />
                  )}
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </MotiView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF8F0' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#FFFFFF',
            borderBottomWidth: 1,
            borderBottomColor: '#F0F0F0',
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 12 }}
          >
            <Ionicons name="arrow-back" size={24} color="#1a1f36" />
          </TouchableOpacity>

          <Image
            source={{ uri: consultant.avatar }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              marginRight: 12,
            }}
          />

          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#1a1f36' }}>
                {consultant.name}
              </Text>
              {consultant.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color="#0055FE"
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: consultant.isOnline ? '#1DBF73' : '#95979D',
                  marginRight: 4,
                }}
              />
              <Text style={{ fontSize: 13, color: '#62646A' }}>
                {consultant.isOnline ? 'Active now' : 'Offline'} • {consultant.university}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={{ marginLeft: 8 }}>
            <Ionicons name="videocam" size={24} color="#62646A" />
          </TouchableOpacity>

          <TouchableOpacity style={{ marginLeft: 16 }}>
            <Ionicons name="information-circle" size={24} color="#62646A" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <FlatList
          ref={scrollViewRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{
            paddingVertical: 16,
            flexGrow: 1,
          }}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Typing Indicator */}
        {isTyping && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{ uri: consultant.avatar }}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  marginRight: 8,
                }}
              />
              <View
                style={{
                  backgroundColor: '#F0E8E0',
                  borderRadius: 18,
                  padding: 12,
                  paddingHorizontal: 16,
                }}
              >
                <Animated.View
                  style={{
                    flexDirection: 'row',
                    opacity: fadeAnim,
                  }}
                >
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#62646A', marginRight: 4 }} />
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#62646A', marginRight: 4 }} />
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#62646A' }} />
                </Animated.View>
              </View>
            </View>
          </View>
        )}

        {/* Reply Preview */}
        {replyingTo && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: '#F5F5F5',
              borderTopWidth: 1,
              borderTopColor: '#E0E0E0',
            }}
          >
            <View
              style={{
                flex: 1,
                borderLeftWidth: 3,
                borderLeftColor: '#0055FE',
                paddingLeft: 8,
              }}
            >
              <Text style={{ fontSize: 12, color: '#62646A', marginBottom: 2 }}>
                Replying to {replyingTo.sender === 'user' ? 'yourself' : consultant.name}
              </Text>
              <Text numberOfLines={1} style={{ fontSize: 14, color: '#1a1f36' }}>
                {replyingTo.text || 'Service Package'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setReplyingTo(null)}>
              <Ionicons name="close-circle" size={24} color="#62646A" />
            </TouchableOpacity>
          </View>
        )}

        {/* Input Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#F0F0F0',
          }}
        >
          <TouchableOpacity style={{ marginRight: 12, marginBottom: 6 }}>
            <Ionicons name="add-circle" size={28} color="#0055FE" />
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              backgroundColor: '#F5F5F5',
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 8,
              maxHeight: 120,
            }}
          >
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#95979D"
              multiline
              style={{
                fontSize: 16,
                color: '#1a1f36',
                maxHeight: 100,
              }}
            />
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            style={{
              marginLeft: 8,
              marginBottom: 6,
              width: 32,
              height: 32,
              borderRadius: 16,
              backgroundColor: inputText.trim() ? '#0055FE' : '#E0E0E0',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons 
              name="send" 
              size={18} 
              color="#FFFFFF" 
              style={{ marginLeft: 2 }}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}