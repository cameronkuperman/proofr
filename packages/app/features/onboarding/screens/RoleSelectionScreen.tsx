import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native'
import { MotiView } from 'moti'
import { LinearGradient } from 'expo-linear-gradient'
import { UserRole } from '../types'

const { width } = Dimensions.get('window')

interface RoleSelectionScreenProps {
  onSelectRole: (role: UserRole) => void
  onSignIn: () => void
}

export function RoleSelectionScreen({ onSelectRole, onSignIn }: RoleSelectionScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#001f3f', '#0055FE']}
        style={styles.gradient}
      >
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600 }}
          style={styles.header}
        >
          <Text style={styles.title}>Your journey to dream schools starts here</Text>
        </MotiView>

        <View style={styles.cardsContainer}>
          {/* Student Card */}
          <MotiView
            from={{ opacity: 0, translateY: 50, scale: 0.9 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ type: 'spring', delay: 200 }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onSelectRole('student')}
              style={styles.cardTouchable}
            >
              <LinearGradient
                colors={['#ffffff', '#f8f9fa']}
                style={styles.card}
              >
                <View style={styles.cardImageContainer}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f' }}
                    style={styles.cardImage}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.imageOverlay}
                  />
                  <View style={styles.cardBadge}>
                    <Text style={styles.badgeText}>🎓</Text>
                  </View>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>I'm a Student</Text>
                  <Text style={styles.cardDescription}>
                    Get expert help from students at your dream schools
                  </Text>
                  <View style={styles.cardStats}>
                    <Text style={styles.statText}>15,000+ success stories</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>

          {/* Consultant Card */}
          <MotiView
            from={{ opacity: 0, translateY: 50, scale: 0.9 }}
            animate={{ opacity: 1, translateY: 0, scale: 1 }}
            transition={{ type: 'spring', delay: 400 }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onSelectRole('consultant')}
              style={styles.cardTouchable}
            >
              <LinearGradient
                colors={['#ffffff', '#f8f9fa']}
                style={styles.card}
              >
                <View style={styles.cardImageContainer}>
                  <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf' }}
                    style={styles.cardImage}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.imageOverlay}
                  />
                  <View style={styles.cardBadge}>
                    <Text style={styles.badgeText}>💼</Text>
                  </View>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>I'm a Consultant</Text>
                  <Text style={styles.cardDescription}>
                    Share your success. Earn while you learn.
                  </Text>
                  <View style={styles.cardStats}>
                    <Text style={styles.statText}>Earn $1,847/mo average</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </MotiView>
        </View>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 600 }}
          style={styles.footer}
        >
          <TouchableOpacity onPress={onSignIn} style={styles.signInButton}>
            <Text style={styles.signInText}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </MotiView>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradient: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 40,
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 20,
    justifyContent: 'center',
  },
  cardTouchable: {
    marginVertical: 10,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 30,
    elevation: 10,
  },
  cardImageContainer: {
    height: 160,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  cardBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 24,
  },
  cardContent: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  cardStats: {
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statText: {
    fontSize: 14,
    color: '#0055FE',
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  signInButton: {
    paddingVertical: 16,
  },
  signInText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
})