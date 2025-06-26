import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native'
import { MotiView } from 'moti'
import { LinearGradient } from 'expo-linear-gradient'

type Year = 'senior' | 'junior' | 'sophomore' | 'transfer'

interface YearOption {
  id: Year
  title: string
  subtitle: string
  deadline: string
  icon: string
}

const YEAR_OPTIONS: YearOption[] = [
  {
    id: 'senior',
    title: 'Senior',
    subtitle: 'Applying this year',
    deadline: '147 days until deadlines',
    icon: '🎓',
  },
  {
    id: 'junior',
    title: 'Junior',
    subtitle: 'Preparing for next year',
    deadline: 'Start building your profile',
    icon: '📚',
  },
  {
    id: 'sophomore',
    title: 'Sophomore',
    subtitle: 'Planning ahead',
    deadline: 'Focus on activities & grades',
    icon: '🌱',
  },
  {
    id: 'transfer',
    title: 'Transfer Student',
    subtitle: 'Changing schools',
    deadline: 'Rolling deadlines',
    icon: '🔄',
  },
]

interface YearSelectionScreenProps {
  onContinue: (year: Year) => void
}

export function YearSelectionScreen({ onContinue }: YearSelectionScreenProps) {
  const [selectedYear, setSelectedYear] = useState<Year | null>(null)

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
            <Text style={styles.title}>When's your big moment?</Text>
          </MotiView>
        </View>

        {/* Timeline visualization */}
        <MotiView
          from={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ type: 'timing', duration: 800, delay: 300 }}
          style={styles.timeline}
        >
          <View style={styles.timelineLine} />
          {YEAR_OPTIONS.map((_, index) => (
            <MotiView
              key={index}
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                delay: 400 + index * 100,
              }}
              style={[
                styles.timelineDot,
                { left: `${25 + index * 16.67}%` },
              ]}
            />
          ))}
        </MotiView>

        <View style={styles.optionsContainer}>
          {YEAR_OPTIONS.map((option, index) => (
            <MotiView
              key={option.id}
              from={{ opacity: 0, translateX: -50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{
                type: 'spring',
                delay: 200 + index * 100,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedYear(option.id)}
                style={[
                  styles.optionCard,
                  selectedYear === option.id && styles.optionCardSelected,
                ]}
              >
                <LinearGradient
                  colors={
                    selectedYear === option.id
                      ? ['#0055FE', '#0040BE']
                      : ['#ffffff', '#f8f9fa']
                  }
                  style={styles.optionGradient}
                >
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionIcon}>{option.icon}</Text>
                    <View style={styles.optionTextContainer}>
                      <Text
                        style={[
                          styles.optionTitle,
                          selectedYear === option.id && styles.optionTitleSelected,
                        ]}
                      >
                        {option.title}
                      </Text>
                      <Text
                        style={[
                          styles.optionSubtitle,
                          selectedYear === option.id && styles.optionSubtitleSelected,
                        ]}
                      >
                        {option.subtitle}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.deadlineContainer,
                      selectedYear === option.id && styles.deadlineContainerSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.deadlineText,
                        selectedYear === option.id && styles.deadlineTextSelected,
                      ]}
                    >
                      {option.deadline}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => selectedYear && onContinue(selectedYear)}
            disabled={!selectedYear}
            style={[
              styles.continueButton,
              !selectedYear && styles.continueButtonDisabled,
            ]}
          >
            <LinearGradient
              colors={selectedYear ? ['#FFB800', '#FFA000'] : ['#666', '#555']}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>
                {selectedYear ? 'Continue' : 'Select your year'}
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  timeline: {
    height: 60,
    marginHorizontal: 24,
    marginBottom: 40,
    position: 'relative',
  },
  timelineLine: {
    position: 'absolute',
    top: '50%',
    left: '25%',
    right: '25%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  timelineDot: {
    position: 'absolute',
    top: '50%',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFB800',
    marginTop: -6,
    marginLeft: -6,
  },
  optionsContainer: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 16,
  },
  optionCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  optionCardSelected: {
    transform: [{ scale: 0.98 }],
  },
  optionGradient: {
    padding: 24,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: '#fff',
  },
  optionSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  optionSubtitleSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  deadlineContainer: {
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  deadlineContainerSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  deadlineText: {
    fontSize: 14,
    color: '#0055FE',
    fontWeight: '600',
  },
  deadlineTextSelected: {
    color: '#fff',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
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