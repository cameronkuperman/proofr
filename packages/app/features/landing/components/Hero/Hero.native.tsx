import React from 'react'
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import { TextLink } from 'solito/link'

export function Hero() {
  return (
    <View style={styles.hero}>
      {/* Background overlay */}
      <View style={styles.overlay} />
      
      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoSection}>
          <Image 
            source={require('../../../../assets/images/proofr-logo.png')}
            style={styles.logo}
          />
          <Text style={styles.logoText}>proofr</Text>
        </View>

        {/* Main Headline */}
        <View style={styles.headlineSection}>
          <Text style={styles.title}>
            College Admissions.{'\n'}
            <Text style={styles.highlight}>On Demand.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Get personalized guidance from current students at top universities
          </Text>
        </View>

        {/* CTAs */}
        <View style={styles.ctaSection}>
          <TextLink href="/browse">
            <TouchableOpacity style={[styles.button, styles.primaryButton]}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>🔍</Text>
                <View style={styles.buttonText}>
                  <Text style={styles.primaryButtonTitle}>Find a Service</Text>
                  <Text style={styles.primaryButtonSubtitle}>I'm looking for help with my applications</Text>
                </View>
              </View>
            </TouchableOpacity>
          </TextLink>

          <TextLink href="/become-consultant">
            <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
              <View style={styles.buttonContent}>
                <Text style={styles.buttonIcon}>✏️</Text>
                <View style={styles.buttonText}>
                  <Text style={styles.secondaryButtonTitle}>Offer Services</Text>
                  <Text style={styles.secondaryButtonSubtitle}>I'd like to help other students</Text>
                </View>
              </View>
            </TouchableOpacity>
          </TextLink>
        </View>

        {/* Trust Signal */}
        <Text style={styles.trustSignal}>
          Trusted by 10,000+ students worldwide
        </Text>
      </View>

      {/* Skip/Sign In Navigation */}
      <View style={styles.navigation}>
        <TextLink href="/browse">
          <Text style={styles.navLink}>Skip</Text>
        </TextLink>
        <TextLink href="/sign-in">
          <Text style={styles.navLink}>Sign In</Text>
        </TextLink>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  hero: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 31, 58, 0.9)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
  },
  headlineSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 16,
  },
  highlight: {
    color: '#06b6d4',
  },
  subtitle: {
    fontSize: 16,
    color: '#cbd5e1',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  ctaSection: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  buttonIcon: {
    fontSize: 24,
  },
  buttonText: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: 'white',
  },
  primaryButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1f3a',
    marginBottom: 4,
  },
  primaryButtonSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButtonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  secondaryButtonSubtitle: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  trustSignal: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  navLink: {
    fontSize: 16,
    color: '#06b6d4',
    fontWeight: '500',
  },
})