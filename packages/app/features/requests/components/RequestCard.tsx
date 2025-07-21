import React, { useRef, useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  Image,
  Platform,
  Modal,
  Pressable,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import { Ionicons } from '@expo/vector-icons'
import { useTheme, useThemedColors, usePrimaryColors } from 'app/contexts/ThemeContext'
import { colors, withOpacity } from 'app/constants/colors'
import { ServiceRequest } from '../types'
import { useNavigation } from '@react-navigation/native'
import { RequestDetailModal } from '../screens/RequestDetailModal'
import { PulsingDot } from './PulsingDot'
import { UrgentPulse } from './UrgentPulse'


interface RequestCardProps {
  request: ServiceRequest
  onDismiss?: (requestId: string) => void
  index?: number
}

const statusConfig = {
  active: {
    color: colors.primary[500],
    bgColor: withOpacity(colors.primary[500], 0.1),
    icon: 'time' as keyof typeof Ionicons.glyphMap,
    label: 'Active',
  },
  pending: {
    color: colors.purple[500],
    bgColor: withOpacity(colors.purple[500], 0.1),
    icon: 'hourglass' as keyof typeof Ionicons.glyphMap,
    label: 'Pending',
  },
  in_review: {
    color: colors.warning.main,
    bgColor: withOpacity(colors.warning.main, 0.1),
    icon: 'eye' as keyof typeof Ionicons.glyphMap,
    label: 'Your Turn',
  },
  completed: {
    color: colors.success.main,
    bgColor: withOpacity(colors.success.main, 0.1),
    icon: 'checkmark-circle' as keyof typeof Ionicons.glyphMap,
    label: 'Ready',
  },
  revision_requested: {
    color: colors.error.main,
    bgColor: withOpacity(colors.error.main, 0.1),
    icon: 'refresh' as keyof typeof Ionicons.glyphMap,
    label: 'Revision',
  },
}

export function RequestCard({ request, onDismiss, index = 0 }: RequestCardProps) {
  const { isDark } = useTheme()
  const themedColors = useThemedColors()
  const primaryColors = usePrimaryColors()
  const navigation = useNavigation()
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showActionMenu, setShowActionMenu] = useState(false)
  const scaleAnim = useRef(new Animated.Value(1)).current
  const cardOpacity = useRef(new Animated.Value(0)).current
  
  const status = statusConfig[request.status]
  const isUrgent = request.deadline && new Date(request.deadline).getTime() - Date.now() < 48 * 60 * 60 * 1000

  // Entrance animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start()

  }, [])

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handleActionPress = (action: 'bookmark' | 'archive' | 'done') => {
    setShowActionMenu(false)
    
    switch (action) {
      case 'bookmark':
        Alert.alert('Bookmarked', `${request.title} has been bookmarked!`)
        break
      case 'archive':
        Alert.alert('Archived', `${request.title} has been archived`)
        if (onDismiss) onDismiss(request.id)
        break
      case 'done':
        Alert.alert('Marked as Done', `${request.title} has been marked as done!`)
        if (onDismiss) onDismiss(request.id)
        break
    }
  }


  const handlePress = () => {
    animatePress()
    setShowDetailModal(true)
  }

  const handleViewFeedback = () => {
    animatePress()
    setShowDetailModal(true)
  }

  const handleMessage = () => {
    navigation.navigate('chat' as never, {
      userId: request.consultant.id,
      userName: request.consultant.name,
      userAvatar: request.consultant.profileImage,
      isVerified: request.consultant.isVerified,
    } as never)
  }

  const handleRequestRevision = () => {
    setShowDetailModal(true)
  }

  const handleRequestAdditionalWork = (description: string, price: number) => {
    Alert.alert('Additional Work Requested', `${description} for $${price}`)
  }

  const ActionMenu = () => (
    <Modal
      visible={showActionMenu}
      transparent
      animationType="fade"
      onRequestClose={() => setShowActionMenu(false)}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => setShowActionMenu(false)}
      >
        <View
          style={{
            backgroundColor: themedColors.surface.raised,
            borderRadius: 16,
            padding: 8,
            minWidth: 200,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <TouchableOpacity
            onPress={() => handleActionPress('bookmark')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              paddingHorizontal: 16,
              gap: 12,
            }}
          >
            <Ionicons name="bookmark-outline" size={20} color={themedColors.text.primary} />
            <Text style={{ fontSize: 16, color: themedColors.text.primary }}>Bookmark</Text>
          </TouchableOpacity>
          
          <View style={{ height: 1, backgroundColor: themedColors.border.light }} />
          
          <TouchableOpacity
            onPress={() => handleActionPress('archive')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              paddingHorizontal: 16,
              gap: 12,
            }}
          >
            <Ionicons name="archive-outline" size={20} color={themedColors.text.primary} />
            <Text style={{ fontSize: 16, color: themedColors.text.primary }}>Archive</Text>
          </TouchableOpacity>
          
          <View style={{ height: 1, backgroundColor: themedColors.border.light }} />
          
          <TouchableOpacity
            onPress={() => handleActionPress('done')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              paddingHorizontal: 16,
              gap: 12,
            }}
          >
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.success.main} />
            <Text style={{ fontSize: 16, color: colors.success.main }}>Mark as Done</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  )

  return (
    <>
      <ActionMenu />
      <Animated.View
        style={{
          opacity: cardOpacity,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <TouchableOpacity
          activeOpacity={0.98}
          onPress={handlePress}
          style={{
            backgroundColor: themedColors.surface.raised,
            borderRadius: 20,
            overflow: 'hidden',
            shadowColor: isDark ? colors.primary[500] : '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0.3 : 0.15,
            shadowRadius: 12,
            elevation: 5,
            borderWidth: isUrgent ? 2 : 1,
            borderColor: isUrgent ? colors.error.main : themedColors.border.default,
          }}
        >
          {/* Urgent Pulse Effect */}
          {isUrgent && (
            <UrgentPulse />
          )}
          
          {/* Gradient Overlay */}
          <LinearGradient
            colors={[
              withOpacity(status.color, 0.05),
              withOpacity(status.color, 0),
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 100,
            }}
          />
          
          <View style={{ padding: 16 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <View
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 4,
                      borderRadius: 12,
                      backgroundColor: status.bgColor,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Ionicons name={status.icon} size={14} color={status.color} />
                    <Text style={{ fontSize: 12, color: status.color, fontWeight: '600' }}>
                      {status.label}
                    </Text>
                  </View>
                  {request.isConsultantWorking && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <PulsingDot color={colors.success.main} size={6} />
                      <Text style={{ fontSize: 11, color: themedColors.text.secondary }}>
                        Working now
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={{ fontSize: 20, fontWeight: '700', color: themedColors.text.primary }}>
                  {request.title}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowActionMenu(true)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="ellipsis-horizontal" size={20} color={themedColors.text.secondary} />
              </TouchableOpacity>
            </View>

            {/* Consultant Info */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Image
                source={{ uri: request.consultant.profileImage }}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 24,
                  marginRight: 12,
                  borderWidth: 2,
                  borderColor: request.consultant.isVerified ? colors.info.main : themedColors.border.default,
                }}
              />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: themedColors.text.primary }}>
                    {request.consultant.name}
                  </Text>
                  {request.consultant.isVerified && (
                    <Ionicons name="checkmark-circle" size={16} color={colors.info.main} />
                  )}
                  {request.consultant.isOnline && (
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: colors.success.main,
                      }}
                    />
                  )}
                </View>
                <Text style={{ fontSize: 14, color: themedColors.text.secondary }}>
                  {request.consultant.university} '{request.consultant.graduationYear}
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            {request.progress < 100 && (
              <View style={{ marginBottom: 12 }}>
                <View
                  style={{
                    height: 8,
                    backgroundColor: themedColors.border.light,
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <Animated.View
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: `${request.progress}%`,
                      backgroundColor: status.color,
                      borderRadius: 4,
                    }}
                  >
                    {/* Animated gradient effect */}
                    <LinearGradient
                      colors={[withOpacity(status.color, 0.8), status.color]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                      }}
                    />
                  </Animated.View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                  <Text style={{ fontSize: 12, color: themedColors.text.secondary, fontWeight: '600' }}>
                    {request.progress}% Complete
                  </Text>
                  {request.estimatedCompletionTime && (
                    <Text style={{ fontSize: 12, color: themedColors.text.secondary }}>
                      {request.estimatedCompletionTime} remaining
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* Key Info */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
              {request.deliverables.length > 0 && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: themedColors.background.subtle,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 12,
                  }}
                >
                  <Ionicons name="document-text" size={14} color={primaryColors.primary} />
                  <Text style={{ fontSize: 13, color: themedColors.text.primary, fontWeight: '500' }}>
                    {request.deliverables[0].commentsCount || 0} comments
                  </Text>
                </View>
              )}
              {request.revisionDeadline && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: withOpacity(colors.warning.main, 0.1),
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 12,
                  }}
                >
                  <Ionicons name="time-outline" size={14} color={colors.warning.main} />
                  <Text style={{ fontSize: 13, color: colors.warning.dark, fontWeight: '500' }}>
                    {Math.ceil((new Date(request.revisionDeadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d to revise
                  </Text>
                </View>
              )}
              {request.urgencyLevel !== 'standard' && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                    backgroundColor: withOpacity(colors.accent[600], 0.1),
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 12,
                  }}
                >
                  <Ionicons name="flash" size={14} color={colors.accent[600]} />
                  <Text style={{ fontSize: 13, color: colors.accent[600], fontWeight: '500' }}>
                    {request.urgencyLevel === 'express' ? 'Express' : 'Priority'}
                  </Text>
                </View>
              )}
            </View>

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {request.status === 'completed' && request.deliverables.length > 0 && (
                <TouchableOpacity
                  onPress={handleViewFeedback}
                  style={{
                    flex: 1,
                    backgroundColor: primaryColors.primary,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Ionicons name="document-text" size={16} color="#FFFFFF" />
                  <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 15 }}>View Work</Text>
                </TouchableOpacity>
              )}
              {request.status !== 'completed' && (
                <TouchableOpacity
                  onPress={handleMessage}
                  style={{
                    flex: 1,
                    backgroundColor: themedColors.background.subtle,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: themedColors.border.default,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Ionicons name="chatbubbles-outline" size={16} color={themedColors.text.primary} />
                  <Text style={{ color: themedColors.text.primary, fontWeight: '600', fontSize: 15 }}>Message</Text>
                </TouchableOpacity>
              )}
              {request.status === 'completed' && request.revisionsRemaining > 0 && (
                <TouchableOpacity
                  onPress={handleRequestRevision}
                  style={{
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    borderRadius: 12,
                    alignItems: 'center',
                    backgroundColor: withOpacity(colors.warning.main, 0.1),
                  }}
                >
                  <Text style={{ color: colors.warning.dark, fontWeight: '600', fontSize: 15 }}>
                    {request.revisionsRemaining}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Price and Time Info */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 12,
                paddingTop: 12,
                borderTopWidth: 1,
                borderTopColor: themedColors.border.light,
              }}
            >
              <View>
                <Text style={{ fontSize: 12, color: themedColors.text.secondary, marginBottom: 2 }}>
                  Service Price
                </Text>
                <Text style={{ fontSize: 20, fontWeight: '700', color: themedColors.text.primary }}>
                  ${request.price}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 12, color: themedColors.text.secondary, marginBottom: 2 }}>
                  Response Time
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="time-outline" size={14} color={themedColors.text.secondary} />
                  <Text style={{ fontSize: 14, fontWeight: '600', color: themedColors.text.primary }}>
                    {request.consultant.responseTime}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
      
      <RequestDetailModal
        visible={showDetailModal}
        request={request}
        onClose={() => setShowDetailModal(false)}
        onRequestRevision={(description) => {
          Alert.alert('Revision Requested', description)
          setShowDetailModal(false)
        }}
        onRequestAdditionalWork={handleRequestAdditionalWork}
      />
    </>
  )
}