import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import { MotiView, AnimatePresence } from 'moti'
import { LinearGradient } from 'expo-linear-gradient'

type PainPoint = 'essays' | 'interviews' | 'activities' | 'test_prep'

interface PainPointOption {
  id: PainPoint
  title: string
  icon: string
  description: string
  solution: string
}

const PAIN_POINTS: PainPointOption[] = [
  {
    id: 'essays',
    title: 'Essays',
    icon: '📝',
    description: 'Personal statements & supplementals',
    solution: '127 essay experts ready to help',
  },
  {
    id: 'interviews',
    title: 'Interviews',
    icon: '🎤',
    description: 'Practice with real students',
    solution: 'Mock interviews from your schools',
  },
  {
    id: 'activities',
    title: 'Activities',
    icon: '📊',
    description: 'Building your profile',
    solution: 'Strategy from successful applicants',
  },
  {
    id: 'test_prep',
    title: 'Test Prep',
    icon: '📚',
    description: 'SAT, ACT, and more',
    solution: 'High scorers share their methods',
  },
]

interface PainPointsScreenProps {
  onContinue: (painPoints: PainPoint[]) => void
}

export function PainPointsScreen({ onContinue }: PainPointsScreenProps) {
  const [selectedPoints, setSelectedPoints] = useState<PainPoint[]>([])
  const [flippedCards, setFlippedCards] = useState<PainPoint[]>([])

  const togglePainPoint = (pointId: PainPoint) => {
    // Flip animation
    setFlippedCards(prev => [...prev, pointId])
    setTimeout(() => {
      setSelectedPoints(prev =>
        prev.includes(pointId)
          ? prev.filter(id => id !== pointId)
          : [...prev, pointId]
      )
    }, 150)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#001f3f', '#0055FE']}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600 }}
          >
            <Text style={styles.title}>What keeps you up at night?</Text>
            <Text style={styles.subtitle}>Select all that apply</Text>
          </MotiView>
        </View>

        <View style={styles.cardsContainer}>
          {PAIN_POINTS.map((point, index) => {
            const isSelected = selectedPoints.includes(point.id)
            const isFlipped = flippedCards.includes(point.id)
            
            return (
              <MotiView
                key={point.id}
                from={{ opacity: 0, translateY: 50 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  delay: index * 100,
                }}
                style={styles.cardWrapper}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => togglePainPoint(point.id)}
                  style={styles.cardTouchable}
                >
                  <AnimatePresence>
                    <MotiView
                      animate={{
                        rotateY: isFlipped ? '180deg' : '0deg',
                      }}
                      transition={{
                        type: 'timing',
                        duration: 300,
                      }}
                      style={[styles.card, { backfaceVisibility: 'hidden' }]}
                    >
                      <LinearGradient
                        colors={isSelected ? ['#0055FE', '#0040BE'] : ['#fff', '#f8f9fa']}
                        style={styles.cardGradient}
                      >
                        <Text style={styles.cardIcon}>{point.icon}</Text>
                        <Text style={[styles.cardTitle, isSelected && styles.cardTitleSelected]}>
                          {point.title}
                        </Text>
                        <Text style={[styles.cardDescription, isSelected && styles.cardDescriptionSelected]}>
                          {isSelected ? point.solution : point.description}
                        </Text>
                        {isSelected && (
                          <MotiView
                            from={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring' }}
                            style={styles.checkmark}
                          >
                            <Text style={styles.checkmarkText}>✓</Text>
                          </MotiView>
                        )}
                      </LinearGradient>
                    </MotiView>
                  </AnimatePresence>
                </TouchableOpacity>
              </MotiView>
            )
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {selectedPoints.length > 0
              ? `We'll match you with experts for ${selectedPoints.length} area${selectedPoints.length > 1 ? 's' : ''}`
              : 'Select at least one area where you need help'}
          </Text>
          
          <TouchableOpacity
            onPress={() => onContinue(selectedPoints)}
            disabled={selectedPoints.length === 0}
            style={[
              styles.continueButton,
              selectedPoints.length === 0 && styles.continueButtonDisabled,
            ]}
          >
            <LinearGradient
              colors={selectedPoints.length > 0 ? ['#FFB800', '#FFA000'] : ['#666', '#555']}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>
                {selectedPoints.length > 0 ? 'Continue' : 'Select your challenges'}
              </Text>
            </LinearGradient>
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
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
  },
  cardsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    alignContent: 'center',
  },
  cardWrapper: {
    width: '47%',
    height: 180,
  },
  cardTouchable: {
    flex: 1,
  },
  card: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardGradient: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  cardTitleSelected: {
    color: '#fff',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  cardDescriptionSelected: {
    color: 'rgba(255,255,255,0.9)',
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  footerText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  continueButton: {
    borderRadius: 24,
    overflow: 'hidden',
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
})