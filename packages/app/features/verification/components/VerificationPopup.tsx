import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { MotiView } from 'moti'
import { Ionicons } from '@expo/vector-icons'

interface VerificationPopupProps {
  visible: boolean
  onDismiss: () => void
  onVerify: (email: string) => void
}

export function VerificationPopup({ visible, onDismiss, onVerify }: VerificationPopupProps) {
  const [email, setEmail] = useState('')
  const [detectedUniversity, setDetectedUniversity] = useState('')

  const detectUniversity = (email: string) => {
    const domain = email.split('@')[1]
    const universities: Record<string, string> = {
      'harvard.edu': 'Harvard University',
      'stanford.edu': 'Stanford University',
      'mit.edu': 'MIT',
      'yale.edu': 'Yale University',
      'princeton.edu': 'Princeton University',
      'columbia.edu': 'Columbia University',
      'upenn.edu': 'University of Pennsylvania',
      'brown.edu': 'Brown University',
      'dartmouth.edu': 'Dartmouth College',
      'cornell.edu': 'Cornell University',
    }
    return universities[domain] || ''
  }

  const handleEmailChange = (text: string) => {
    setEmail(text)
    if (text.includes('@')) {
      const university = detectUniversity(text)
      setDetectedUniversity(university)
    }
  }

  const handleVerify = () => {
    if (email && detectedUniversity) {
      onVerify(email)
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ width: '100%', maxWidth: 400 }}
        >
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 300 }}
          >
            <View style={{
              backgroundColor: '#1a1a1a',
              borderRadius: 20,
              padding: 24,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
            }}>
              {/* Dismiss button */}
              <TouchableOpacity
                onPress={onDismiss}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="close" size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>

              {/* Header */}
              <View style={{ alignItems: 'center', marginBottom: 24 }}>
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: 'rgba(147, 51, 234, 0.2)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 16,
                }}>
                  <Ionicons name="shield-checkmark" size={30} color="#9333ea" />
                </View>
                
                <Text style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: 8,
                }}>
                  Get Verified
                </Text>
                
                <Text style={{
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.7)',
                  textAlign: 'center',
                }}>
                  Verified consultants earn 2x more
                </Text>
              </View>

              {/* Benefits */}
              <View style={{
                backgroundColor: 'rgba(147, 51, 234, 0.1)',
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name="checkmark-circle" size={16} color="#9333ea" />
                  <Text style={{ color: '#fff', marginLeft: 8, fontSize: 14 }}>
                    Blue verification badge
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Ionicons name="trending-up" size={16} color="#9333ea" />
                  <Text style={{ color: '#fff', marginLeft: 8, fontSize: 14 }}>
                    Priority in search results
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="cash" size={16} color="#9333ea" />
                  <Text style={{ color: '#fff', marginLeft: 8, fontSize: 14 }}>
                    Higher earning potential
                  </Text>
                </View>
              </View>

              {/* Email input */}
              <View style={{ marginBottom: 16 }}>
                <Text style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: 8,
                }}>
                  University Email
                </Text>
                <TextInput
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="your.name@university.edu"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 16,
                    color: '#fff',
                  }}
                />
                {detectedUniversity ? (
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 8,
                  }}>
                    <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                    <Text style={{
                      color: '#4CAF50',
                      marginLeft: 4,
                      fontSize: 14,
                    }}>
                      {detectedUniversity} detected
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Buttons */}
              <TouchableOpacity
                onPress={handleVerify}
                disabled={!email || !detectedUniversity}
                style={{ marginBottom: 12 }}
              >
                <LinearGradient
                  colors={email && detectedUniversity ? ['#9333ea', '#7c3aed'] : ['#333', '#222']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    paddingVertical: 16,
                    borderRadius: 30,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#fff',
                  }}>
                    Verify Now
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onDismiss}
                style={{
                  paddingVertical: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.6)',
                }}>
                  Maybe Later
                </Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  )
}