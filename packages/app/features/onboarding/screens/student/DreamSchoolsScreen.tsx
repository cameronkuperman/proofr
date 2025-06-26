import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native'
import { MotiView } from 'moti'
import { LinearGradient } from 'expo-linear-gradient'
import { School } from '../../types'

// Mock data - replace with real data
const SCHOOLS: School[] = [
  { id: '1', name: 'Harvard', logo: '🏛️', consultantCount: 47, isOnline: true },
  { id: '2', name: 'Stanford', logo: '🌲', consultantCount: 38, isOnline: true },
  { id: '3', name: 'MIT', logo: '🔬', consultantCount: 42, isOnline: true },
  { id: '4', name: 'Yale', logo: '🎭', consultantCount: 35, isOnline: true },
  { id: '5', name: 'Princeton', logo: '🐅', consultantCount: 29, isOnline: false },
  { id: '6', name: 'Columbia', logo: '🗽', consultantCount: 44, isOnline: true },
  { id: '7', name: 'UPenn', logo: '🏦', consultantCount: 31, isOnline: true },
  { id: '8', name: 'Brown', logo: '🐻', consultantCount: 26, isOnline: false },
  { id: '9', name: 'Cornell', logo: '🍁', consultantCount: 33, isOnline: true },
  { id: '10', name: 'Dartmouth', logo: '🌲', consultantCount: 22, isOnline: false },
  { id: '11', name: 'Duke', logo: '😈', consultantCount: 28, isOnline: true },
  { id: '12', name: 'Northwestern', logo: '🏔️', consultantCount: 30, isOnline: true },
]

interface DreamSchoolsScreenProps {
  onContinue: (schools: string[]) => void
  onSkip: () => void
}

export function DreamSchoolsScreen({ onContinue, onSkip }: DreamSchoolsScreenProps) {
  const [selectedSchools, setSelectedSchools] = useState<string[]>([])

  const toggleSchool = (schoolId: string) => {
    setSelectedSchools(prev =>
      prev.includes(schoolId)
        ? prev.filter(id => id !== schoolId)
        : prev.length < 5
        ? [...prev, schoolId]
        : prev
    )
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
            <Text style={styles.title}>Where do you dream of going?</Text>
            <Text style={styles.subtitle}>Select up to 5 schools</Text>
          </MotiView>
        </View>

        {/* Selected schools constellation */}
        {selectedSchools.length > 0 && (
          <MotiView
            from={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 80 }}
            transition={{ type: 'timing', duration: 300 }}
            style={styles.constellation}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.constellationContent}
            >
              {selectedSchools.map((schoolId, index) => {
                const school = SCHOOLS.find(s => s.id === schoolId)
                return (
                  <MotiView
                    key={schoolId}
                    from={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                      type: 'spring',
                      delay: index * 100,
                    }}
                    style={styles.constellationItem}
                  >
                    <Text style={styles.constellationEmoji}>{school?.logo}</Text>
                    <Text style={styles.constellationName}>{school?.name}</Text>
                  </MotiView>
                )
              })}
            </ScrollView>
          </MotiView>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.schoolsGrid}
          showsVerticalScrollIndicator={false}
        >
          {SCHOOLS.map((school, index) => {
            const isSelected = selectedSchools.includes(school.id)
            return (
              <MotiView
                key={school.id}
                from={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: 'spring',
                  delay: index * 50,
                }}
                style={styles.schoolCardContainer}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => toggleSchool(school.id)}
                  disabled={!isSelected && selectedSchools.length >= 5}
                  style={[
                    styles.schoolCard,
                    isSelected && styles.schoolCardSelected,
                    !isSelected && selectedSchools.length >= 5 && styles.schoolCardDisabled,
                  ]}
                >
                  <LinearGradient
                    colors={isSelected ? ['#0055FE', '#0040BE'] : ['#fff', '#f8f9fa']}
                    style={styles.cardGradient}
                  >
                    <Text style={styles.schoolEmoji}>{school.logo}</Text>
                    <Text style={[styles.schoolName, isSelected && styles.schoolNameSelected]}>
                      {school.name}
                    </Text>
                    <View style={styles.consultantInfo}>
                      {school.isOnline && (
                        <View style={styles.onlineDot} />
                      )}
                      <Text style={[styles.consultantCount, isSelected && styles.consultantCountSelected]}>
                        {school.consultantCount} consultants
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </MotiView>
            )
          })}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Explore all schools</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => onContinue(selectedSchools)}
            disabled={selectedSchools.length === 0}
            style={[
              styles.continueButton,
              selectedSchools.length === 0 && styles.continueButtonDisabled,
            ]}
          >
            <LinearGradient
              colors={selectedSchools.length > 0 ? ['#FFB800', '#FFA000'] : ['#666', '#555']}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>
                {selectedSchools.length > 0 ? 'Continue' : 'Select at least one school'}
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
    paddingBottom: 20,
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
  constellation: {
    height: 80,
    marginBottom: 20,
  },
  constellationContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  constellationItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  constellationEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  constellationName: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  schoolsGrid: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  schoolCardContainer: {
    width: '47%',
  },
  schoolCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  schoolCardSelected: {
    transform: [{ scale: 0.98 }],
  },
  schoolCardDisabled: {
    opacity: 0.5,
  },
  cardGradient: {
    padding: 20,
    alignItems: 'center',
  },
  schoolEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  schoolNameSelected: {
    color: '#fff',
  },
  consultantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4ade80',
  },
  consultantCount: {
    fontSize: 12,
    color: '#666',
  },
  consultantCountSelected: {
    color: 'rgba(255,255,255,0.9)',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 16,
  },
  skipButton: {
    paddingVertical: 12,
  },
  skipText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    textDecorationLine: 'underline',
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