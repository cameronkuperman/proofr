import React, { useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native'
import { MotiView } from 'moti'
import { LinearGradient } from 'expo-linear-gradient'

interface SuccessStoryScreenProps {
  onContinue: () => void
}

export function SuccessStoryScreen({ onContinue }: SuccessStoryScreenProps) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#001f3f', '#0055FE']}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Image with Ken Burns effect */}
          <MotiView
            from={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ type: 'timing', duration: 8000 }}
            style={styles.heroContainer}
          >
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1' }}
              style={styles.heroImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.heroOverlay}
            />
            
            <View style={styles.heroContent}>
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 500 }}
              >
                <Text style={styles.heroTitle}>How Maria went from waitlisted to accepted</Text>
              </MotiView>
            </View>
          </MotiView>

          {/* Stats that animate */}
          <View style={styles.statsContainer}>
            <MotiView
              from={{ opacity: 0, translateX: -30 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 800 }}
              style={styles.statCard}
            >
              <Text style={styles.statNumber}>3.6</Text>
              <Text style={styles.statLabel}>GPA</Text>
            </MotiView>

            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 1000 }}
              style={styles.arrow}
            >
              <Text style={styles.arrowText}>→</Text>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateX: 30 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 1200 }}
              style={styles.statCard}
            >
              <LinearGradient
                colors={['#8B0000', '#DC143C']}
                style={styles.statGradient}
              >
                <Text style={[styles.statNumber, styles.statNumberWhite]}>Harvard '28</Text>
                <Text style={[styles.statLabel, styles.statLabelWhite]}>Accepted</Text>
              </LinearGradient>
            </MotiView>
          </View>

          {/* Story content */}
          <MotiView
            from={{ opacity: 0, translateY: 30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 1400 }}
            style={styles.storyContent}
          >
            <Text style={styles.storyQuote}>
              "I thought being waitlisted was the end. Then I found Sarah, a Harvard senior who'd been 
              in my exact situation."
            </Text>

            <View style={styles.consultantInfo}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330' }}
                style={styles.consultantAvatar}
              />
              <View style={styles.consultantDetails}>
                <Text style={styles.consultantName}>Sarah Chen • Harvard '25</Text>
                <Text style={styles.consultantStats}>Helped 47 students • 4.9 ★</Text>
              </View>
            </View>

            <Text style={styles.storyText}>
              Sarah helped me craft a letter of continued interest that highlighted my growth. 
              She knew exactly what the admissions committee wanted to see. Two weeks later, 
              I got the call that changed my life.
            </Text>

            <View style={styles.testimonialCard}>
              <Text style={styles.testimonialText}>
                "Sarah didn't just edit my essays - she helped me find my voice. 
                Worth every penny."
              </Text>
              <Text style={styles.testimonialAuthor}>- Maria Rodriguez, Harvard '28</Text>
            </View>
          </MotiView>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onContinue} style={styles.continueButton}>
            <LinearGradient
              colors={['#FFB800', '#FFA000']}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>Find Your Sarah</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.moreStoriesButton}>
            <Text style={styles.moreStoriesText}>Read more success stories</Text>
          </TouchableOpacity>
        </View>
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
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroContainer: {
    height: 300,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 36,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    gap: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  statGradient: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statNumberWhite: {
    color: '#fff',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statLabelWhite: {
    color: 'rgba(255,255,255,0.9)',
  },
  arrow: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 24,
    color: '#FFB800',
  },
  storyContent: {
    paddingHorizontal: 24,
  },
  storyQuote: {
    fontSize: 20,
    fontStyle: 'italic',
    color: '#fff',
    lineHeight: 30,
    marginBottom: 24,
  },
  consultantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 16,
  },
  consultantAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  consultantDetails: {
    flex: 1,
  },
  consultantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  consultantStats: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  storyText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 26,
    marginBottom: 24,
  },
  testimonialCard: {
    backgroundColor: 'rgba(255,184,0,0.1)',
    borderLeftWidth: 4,
    borderLeftColor: '#FFB800',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  testimonialText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#fff',
    lineHeight: 24,
    marginBottom: 12,
  },
  testimonialAuthor: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'rgba(0,31,63,0.9)',
  },
  continueButton: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
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
  moreStoriesButton: {
    paddingVertical: 12,
  },
  moreStoriesText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
})