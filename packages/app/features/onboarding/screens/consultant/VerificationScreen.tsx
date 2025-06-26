import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native'
import { MotiView } from 'moti'
import { LinearGradient } from 'expo-linear-gradient'

interface VerificationScreenProps {
  onContinue: (email: string) => void
}

export function VerificationScreen({ onContinue }: VerificationScreenProps) {
  const [email, setEmail] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [university, setUniversity] = useState('')

  const handleEmailChange = (text: string) => {
    setEmail(text)
    // Auto-detect university from email
    const emailDomain = text.split('@')[1]
    if (emailDomain?.includes('.edu')) {
      const uni = detectUniversity(emailDomain)
      if (uni) {
        setUniversity(uni)
        setIsVerified(true)
      }
    } else {
      setIsVerified(false)
      setUniversity('')
    }
  }

  const detectUniversity = (domain: string): string => {
    const universities: Record<string, string> = {
      'harvard.edu': 'Harvard University',
      'stanford.edu': 'Stanford University',
      'mit.edu': 'MIT',
      'yale.edu': 'Yale University',
      'princeton.edu': 'Princeton University',
      'columbia.edu': 'Columbia University',
      'upenn.edu': 'University of Pennsylvania',
      'brown.edu': 'Brown University',
      'cornell.edu': 'Cornell University',
      'dartmouth.edu': 'Dartmouth College',
    }
    return universities[domain] || ''
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#001f3f', '#0055FE']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600 }}
            style={styles.header}
          >
            <Text style={styles.title}>Let's verify you're the real deal</Text>
            <Text style={styles.subtitle}>
              Use your university email to unlock premium consultant features
            </Text>
          </MotiView>

          {/* Email input with animation */}
          <MotiView
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 300 }}
            style={styles.inputContainer}
          >
            <TextInput
              style={styles.input}
              placeholder="your.name@university.edu"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            {isVerified && (
              <MotiView
                from={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
                style={styles.verifiedBadge}
              >
                <Text style={styles.verifiedText}>✓</Text>
              </MotiView>
            )}
          </MotiView>

          {/* University detection */}
          {university && (
            <MotiView
              from={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ type: 'timing', duration: 400 }}
              style={styles.universityCard}
            >
              <LinearGradient
                colors={['#FFB800', '#FFA000']}
                style={styles.universityGradient}
              >
                <Text style={styles.universityLabel}>Detected University</Text>
                <Text style={styles.universityName}>{university}</Text>
              </LinearGradient>
            </MotiView>
          )}

          {/* Benefits section */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 600 }}
            style={styles.benefitsContainer}
          >
            <Text style={styles.benefitsTitle}>Verified consultants earn:</Text>
            
            <View style={styles.benefitsList}>
              {[
                { amount: '73%', desc: 'more per month' },
                { amount: '2.5x', desc: 'more inquiries' },
                { amount: '✓', desc: 'Trust badge on profile' },
              ].map((benefit, index) => (
                <MotiView
                  key={index}
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ delay: 800 + index * 100 }}
                  style={styles.benefitItem}
                >
                  <Text style={styles.benefitAmount}>{benefit.amount}</Text>
                  <Text style={styles.benefitDesc}>{benefit.desc}</Text>
                </MotiView>
              ))}
            </View>
          </MotiView>

          {/* Stats comparison */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 1100 }}
            style={styles.statsComparison}
          >
            <View style={styles.statColumn}>
              <Text style={styles.statLabel}>Unverified</Text>
              <Text style={styles.statAmount}>$847/mo</Text>
              <Text style={styles.statSubtext}>average</Text>
            </View>
            
            <View style={styles.vsContainer}>
              <Text style={styles.vsText}>VS</Text>
            </View>
            
            <View style={[styles.statColumn, styles.verifiedColumn]}>
              <Text style={[styles.statLabel, styles.verifiedText]}>Verified ✓</Text>
              <Text style={[styles.statAmount, styles.verifiedAmount]}>$2,341/mo</Text>
              <Text style={[styles.statSubtext, styles.verifiedSubtext]}>average</Text>
            </View>
          </MotiView>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => onContinue(email)}
            disabled={!isVerified}
            style={[
              styles.continueButton,
              !isVerified && styles.continueButtonDisabled,
            ]}
          >
            <LinearGradient
              colors={isVerified ? ['#FFB800', '#FFA000'] : ['#666', '#555']}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>
                {isVerified ? 'Continue as Verified' : 'Enter your .edu email'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.skipButton}>
            <Text style={styles.skipText}>Continue without verification</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 26,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 18,
    color: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  universityCard: {
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
  },
  universityGradient: {
    padding: 24,
    alignItems: 'center',
  },
  universityLabel: {
    fontSize: 14,
    color: '#001f3f',
    opacity: 0.8,
    marginBottom: 4,
  },
  universityName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#001f3f',
  },
  benefitsContainer: {
    marginBottom: 32,
  },
  benefitsTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  benefitsList: {
    gap: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  benefitAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFB800',
    width: 60,
  },
  benefitDesc: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  statsComparison: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 20,
  },
  statColumn: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    minWidth: 120,
  },
  verifiedColumn: {
    backgroundColor: 'rgba(255,184,0,0.1)',
    borderWidth: 2,
    borderColor: '#FFB800',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  statAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  verifiedAmount: {
    color: '#FFB800',
  },
  statSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  verifiedSubtext: {
    color: 'rgba(255,184,0,0.8)',
  },
  vsContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  continueButton: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  continueText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
})