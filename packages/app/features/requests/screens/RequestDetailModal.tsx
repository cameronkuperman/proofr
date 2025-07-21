import React, { useRef, useState, useEffect } from 'react'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
  StatusBar,
  Image,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useTheme, useThemedColors, usePrimaryColors } from 'app/contexts/ThemeContext'
import { colors } from 'app/constants/colors'
import { ServiceRequest } from '../types'
import { useNavigation } from '@react-navigation/native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

interface RequestDetailModalProps {
  visible: boolean
  request: ServiceRequest | null
  onClose: () => void
  onRequestRevision: (description: string) => void
  onRequestAdditionalWork: (description: string, price: number) => void
}

export function RequestDetailModal({
  visible,
  request,
  onClose,
  onRequestRevision,
  onRequestAdditionalWork,
}: RequestDetailModalProps) {
  const insets = useSafeAreaInsets()
  const { isDark } = useTheme()
  const themedColors = useThemedColors()
  const primaryColors = usePrimaryColors()
  const navigation = useNavigation()
  
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current
  const backdropOpacity = useRef(new Animated.Value(0)).current
  const [showRevisionForm, setShowRevisionForm] = useState(false)
  const [showAdditionalWorkForm, setShowAdditionalWorkForm] = useState(false)
  const [revisionText, setRevisionText] = useState('')
  const [additionalWorkText, setAdditionalWorkText] = useState('')
  const [additionalWorkPrice, setAdditionalWorkPrice] = useState('')

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible])

  if (!request) return null

  const handleMessage = () => {
    onClose()
    navigation.navigate('chat' as never, {
      userId: request.consultant.id,
      userName: request.consultant.name,
      userAvatar: request.consultant.profileImage,
      isVerified: request.consultant.isVerified,
    } as never)
  }

  const handleViewDocument = (deliverable: any) => {
    Alert.alert('Opening Document', `Viewing ${deliverable.title}`)
  }

  const submitRevision = () => {
    if (!revisionText.trim()) {
      Alert.alert('Please describe what needs to be revised')
      return
    }
    onRequestRevision(revisionText)
    setRevisionText('')
    setShowRevisionForm(false)
  }

  const submitAdditionalWork = () => {
    if (!additionalWorkText.trim() || !additionalWorkPrice) {
      Alert.alert('Please fill in all fields')
      return
    }
    onRequestAdditionalWork(additionalWorkText, parseFloat(additionalWorkPrice))
    setAdditionalWorkText('')
    setAdditionalWorkPrice('')
    setShowAdditionalWorkForm(false)
  }

  const statusConfig = {
    active: { color: colors.primary[500], label: 'In Progress', icon: 'time' },
    completed: { color: colors.success.main, label: 'Completed', icon: 'checkmark-circle' },
    in_review: { color: colors.warning.main, label: 'Your Turn', icon: 'eye' },
    pending: { color: colors.purple[500], label: 'Pending', icon: 'hourglass' },
  }

  const status = statusConfig[request.status] || statusConfig.active

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Backdrop */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          opacity: backdropOpacity,
        }}
      >
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={onClose} />
      </Animated.View>

      {/* Content */}
      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: SCREEN_HEIGHT * 0.9,
          backgroundColor: themedColors.surface.raised,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          transform: [{ translateY: slideAnim }],
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
          elevation: 30,
        }}
      >
        {/* Header Gradient */}
        <LinearGradient
          colors={isDark ? ['#141414', '#0A0A0A'] : ['#FFFFFF', '#FAF7F0']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 200,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
          }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
          >
            {/* Handle */}
            <View style={{ alignItems: 'center', paddingTop: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 4,
                  backgroundColor: themedColors.border.default,
                  borderRadius: 2,
                }}
              />
            </View>

            {/* Header Info */}
            <View style={{ paddingHorizontal: 24, paddingTop: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: status.color,
                    marginRight: 8,
                  }}
                />
                <Text style={{ color: status.color, fontWeight: '600', fontSize: 16 }}>
                  {status.label}
                  {request.isConsultantWorking && ' • Consultant is working'}
                </Text>
              </View>

              <Text style={{ fontSize: 28, fontWeight: '700', color: themedColors.text.primary, marginBottom: 8 }}>
                {request.title}
              </Text>

              <Text style={{ fontSize: 16, color: themedColors.text.secondary, marginBottom: 24 }}>
                {request.description}
              </Text>

              {/* Consultant Card */}
              <TouchableOpacity
                onPress={() => {
                  onClose()
                  navigation.navigate('user-detail' as never, { id: request.consultant.id } as never)
                }}
                style={{
                  backgroundColor: isDark ? colors.gray[900] : colors.light.background.subtle,
                  borderRadius: 20,
                  padding: 16,
                  marginBottom: 24,
                  borderWidth: 1,
                  borderColor: themedColors.border.default,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={{ uri: request.consultant.profileImage }}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      marginRight: 16,
                      borderWidth: 3,
                      borderColor: request.consultant.isVerified ? colors.info.main : 'transparent',
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontSize: 20, fontWeight: '700', color: themedColors.text.primary }}>
                        {request.consultant.name}
                      </Text>
                      {request.consultant.isVerified && (
                        <Ionicons
                          name="checkmark-circle"
                          size={20}
                          color={colors.info.main}
                          style={{ marginLeft: 6 }}
                        />
                      )}
                      {request.consultant.isOnline && (
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: colors.success.main,
                            marginLeft: 6,
                          }}
                        />
                      )}
                    </View>
                    <Text style={{ fontSize: 16, color: themedColors.text.secondary }}>
                      {request.consultant.university} '{request.consultant.graduationYear}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <Ionicons name="star" size={16} color={colors.warning.main} />
                      <Text style={{ marginLeft: 4, color: themedColors.text.secondary }}>
                        {request.consultant.rating} ({request.consultant.totalReviews} reviews)
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color={themedColors.text.tertiary} />
                </View>
              </TouchableOpacity>

              {/* Progress Section */}
              {request.progress < 100 && (
                <View style={{ marginBottom: 24 }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: themedColors.text.primary, marginBottom: 12 }}>
                    Progress
                  </Text>
                  <View
                    style={{
                      height: 12,
                      backgroundColor: themedColors.border.light,
                      borderRadius: 6,
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
                        backgroundColor: primaryColors.primary,
                        borderRadius: 6,
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <Text style={{ color: themedColors.text.secondary }}>
                      {request.progress}% Complete
                    </Text>
                    {request.estimatedCompletionTime && (
                      <Text style={{ color: themedColors.text.secondary }}>
                        {request.estimatedCompletionTime} remaining
                      </Text>
                    )}
                  </View>
                </View>
              )}

              {/* Deliverables */}
              {request.deliverables.length > 0 && (
                <View style={{ marginBottom: 24 }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: themedColors.text.primary, marginBottom: 12 }}>
                    Deliverables
                  </Text>
                  {request.deliverables.map((deliverable) => (
                    <TouchableOpacity
                      key={deliverable.id}
                      onPress={() => handleViewDocument(deliverable)}
                      style={{
                        backgroundColor: isDark ? colors.gray[900] : '#F8E5D3',
                        borderRadius: 16,
                        padding: 16,
                        marginBottom: 12,
                        borderWidth: 1,
                        borderColor: isDark ? colors.gray[800] : '#E8D5C4',
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 16, fontWeight: '600', color: themedColors.text.primary }}>
                            {deliverable.title}
                          </Text>
                          {deliverable.commentsCount !== undefined && (
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 12 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="chatbubble-outline" size={14} color={themedColors.text.secondary} />
                                <Text style={{ marginLeft: 4, color: themedColors.text.secondary }}>
                                  {deliverable.commentsCount} comments
                                </Text>
                              </View>
                              {deliverable.trackedChangesCount !== undefined && (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Ionicons name="create-outline" size={14} color={themedColors.text.secondary} />
                                  <Text style={{ marginLeft: 4, color: themedColors.text.secondary }}>
                                    {deliverable.trackedChangesCount} changes
                                  </Text>
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                        <View
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: primaryColors.primary,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Ionicons name="document-text" size={24} color="#FFFFFF" />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Revision History */}
              {request.revisions.length > 0 && (
                <View style={{ marginBottom: 24 }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', color: themedColors.text.primary, marginBottom: 12 }}>
                    Revision History
                  </Text>
                  {request.revisions.map((revision, index) => (
                    <View
                      key={revision.id}
                      style={{
                        backgroundColor: themedColors.background.subtle,
                        borderRadius: 16,
                        padding: 16,
                        marginBottom: 12,
                        borderLeftWidth: 3,
                        borderLeftColor: revision.status === 'completed' ? colors.success.main : colors.warning.main,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <View
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: 12,
                            backgroundColor: themedColors.border.default,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 8,
                          }}
                        >
                          <Text style={{ fontSize: 12, fontWeight: '600', color: themedColors.text.secondary }}>
                            {index + 1}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 14, color: themedColors.text.secondary }}>
                          {new Date(revision.requestedAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text style={{ fontSize: 16, color: themedColors.text.primary, marginBottom: 4 }}>
                        {revision.description}
                      </Text>
                      <Text style={{ fontSize: 14, color: revision.status === 'completed' ? colors.success.main : colors.warning.main }}>
                        {revision.status === 'completed' ? 'Completed' : 'In Progress'}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Action Buttons */}
              <View style={{ gap: 12 }}>
                <TouchableOpacity
                  onPress={handleMessage}
                  style={{
                    backgroundColor: primaryColors.primary,
                    paddingVertical: 16,
                    borderRadius: 16,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="chatbubbles" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>
                    Message {request.consultant.name.split(' ')[0]}
                  </Text>
                </TouchableOpacity>

                {request.status === 'completed' && request.revisionsRemaining > 0 && !showRevisionForm && (
                  <TouchableOpacity
                    onPress={() => setShowRevisionForm(true)}
                    style={{
                      backgroundColor: colors.warning.light,
                      paddingVertical: 16,
                      borderRadius: 16,
                      alignItems: 'center',
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="refresh" size={20} color={colors.warning.dark} style={{ marginRight: 8 }} />
                    <Text style={{ color: colors.warning.dark, fontSize: 16, fontWeight: '600' }}>
                      Request Revision ({request.revisionsRemaining} left)
                    </Text>
                  </TouchableOpacity>
                )}

                {request.status === 'completed' && !showAdditionalWorkForm && (
                  <TouchableOpacity
                    onPress={() => setShowAdditionalWorkForm(true)}
                    style={{
                      backgroundColor: themedColors.background.subtle,
                      paddingVertical: 16,
                      borderRadius: 16,
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: themedColors.border.default,
                    }}
                  >
                    <Text style={{ color: themedColors.text.primary, fontSize: 16, fontWeight: '600' }}>
                      Need More Help?
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Revision Form */}
              {showRevisionForm && (
                <View
                  style={{
                    backgroundColor: themedColors.background.subtle,
                    borderRadius: 16,
                    padding: 16,
                    marginTop: 12,
                    borderWidth: 1,
                    borderColor: themedColors.border.default,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: themedColors.text.primary, marginBottom: 12 }}>
                    What needs to be revised?
                  </Text>
                  <TextInput
                    value={revisionText}
                    onChangeText={setRevisionText}
                    placeholder="Describe the changes you'd like..."
                    placeholderTextColor={themedColors.text.tertiary}
                    multiline
                    numberOfLines={4}
                    style={{
                      backgroundColor: themedColors.surface.raised,
                      borderRadius: 12,
                      padding: 12,
                      color: themedColors.text.primary,
                      fontSize: 16,
                      marginBottom: 12,
                      minHeight: 100,
                      borderWidth: 1,
                      borderColor: themedColors.border.default,
                    }}
                  />
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={submitRevision}
                      style={{
                        flex: 1,
                        backgroundColor: colors.warning.main,
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Submit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setShowRevisionForm(false)
                        setRevisionText('')
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: themedColors.surface.raised,
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: themedColors.border.default,
                      }}
                    >
                      <Text style={{ color: themedColors.text.primary, fontWeight: '600' }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Additional Work Form */}
              {showAdditionalWorkForm && (
                <View
                  style={{
                    backgroundColor: themedColors.background.subtle,
                    borderRadius: 16,
                    padding: 16,
                    marginTop: 12,
                    borderWidth: 1,
                    borderColor: themedColors.border.default,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: themedColors.text.primary, marginBottom: 12 }}>
                    Request Additional Work
                  </Text>
                  <TextInput
                    value={additionalWorkText}
                    onChangeText={setAdditionalWorkText}
                    placeholder="Describe what additional help you need..."
                    placeholderTextColor={themedColors.text.tertiary}
                    multiline
                    numberOfLines={4}
                    style={{
                      backgroundColor: themedColors.surface.raised,
                      borderRadius: 12,
                      padding: 12,
                      color: themedColors.text.primary,
                      fontSize: 16,
                      marginBottom: 12,
                      minHeight: 100,
                      borderWidth: 1,
                      borderColor: themedColors.border.default,
                    }}
                  />
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                    <Text style={{ fontSize: 16, color: themedColors.text.primary, marginRight: 8 }}>
                      Suggested price: $
                    </Text>
                    <TextInput
                      value={additionalWorkPrice}
                      onChangeText={setAdditionalWorkPrice}
                      placeholder="0.00"
                      placeholderTextColor={themedColors.text.tertiary}
                      keyboardType="numeric"
                      style={{
                        flex: 1,
                        backgroundColor: themedColors.surface.raised,
                        borderRadius: 8,
                        padding: 8,
                        color: themedColors.text.primary,
                        fontSize: 16,
                        borderWidth: 1,
                        borderColor: themedColors.border.default,
                      }}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity
                      onPress={submitAdditionalWork}
                      style={{
                        flex: 1,
                        backgroundColor: primaryColors.primary,
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Submit Request</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setShowAdditionalWorkForm(false)
                        setAdditionalWorkText('')
                        setAdditionalWorkPrice('')
                      }}
                      style={{
                        flex: 1,
                        backgroundColor: themedColors.surface.raised,
                        paddingVertical: 12,
                        borderRadius: 8,
                        alignItems: 'center',
                        borderWidth: 1,
                        borderColor: themedColors.border.default,
                      }}
                    >
                      <Text style={{ color: themedColors.text.primary, fontWeight: '600' }}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Service Details */}
              <View style={{ marginTop: 24, paddingTop: 24, borderTopWidth: 1, borderTopColor: themedColors.border.default }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                  <View>
                    <Text style={{ fontSize: 14, color: themedColors.text.secondary, marginBottom: 4 }}>
                      Service Type
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: themedColors.text.primary }}>
                      {request.serviceType.replace('_', ' ').charAt(0).toUpperCase() + request.serviceType.slice(1).replace('_', ' ')}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 14, color: themedColors.text.secondary, marginBottom: 4 }}>
                      Total Cost
                    </Text>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: primaryColors.primary }}>
                      ${request.price}
                    </Text>
                  </View>
                </View>

                {request.deadline && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                      <Text style={{ fontSize: 14, color: themedColors.text.secondary, marginBottom: 4 }}>
                        Started
                      </Text>
                      <Text style={{ fontSize: 16, color: themedColors.text.primary }}>
                        {new Date(request.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ fontSize: 14, color: themedColors.text.secondary, marginBottom: 4 }}>
                        Deadline
                      </Text>
                      <Text style={{ fontSize: 16, color: themedColors.text.primary }}>
                        {new Date(request.deadline).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  )
}