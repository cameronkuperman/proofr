import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native'
import { MotiView } from 'moti'
import { LinearGradient } from 'expo-linear-gradient'

interface ProfileData {
  university: string
  year: string
  major: string
  gpa: string
  satScore: string
  actScore: string
  successStory: string
}

interface ProfileSetupScreenProps {
  universityEmail: string
  onContinue: (data: ProfileData) => void
}

export function ProfileSetupScreen({ universityEmail, onContinue }: ProfileSetupScreenProps) {
  const [profileData, setProfileData] = useState<ProfileData>({
    university: detectUniversityFromEmail(universityEmail),
    year: '',
    major: '',
    gpa: '',
    satScore: '',
    actScore: '',
    successStory: '',
  })

  const [selectedYear, setSelectedYear] = useState<string>('')

  function detectUniversityFromEmail(email: string): string {
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
      'cornell.edu': 'Cornell University',
      'dartmouth.edu': 'Dartmouth College',
    }
    return universities[domain] || 'University'
  }

  const years = ['2025', '2026', '2027', '2028', 'Graduate Student', 'Alumni']

  const handleContinue = () => {
    onContinue({
      ...profileData,
      year: selectedYear,
    })
  }

  const isFormValid = selectedYear && profileData.major && profileData.gpa && profileData.successStory

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
          <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600 }}
            style={styles.header}
          >
            <Text style={styles.title}>Share your journey</Text>
            <Text style={styles.subtitle}>
              Help students see themselves in your story
            </Text>
          </MotiView>

          {/* University Badge */}
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 200 }}
            style={styles.universityBadge}
          >
            <LinearGradient
              colors={['#FFB800', '#FFA000']}
              style={styles.badgeGradient}
            >
              <Text style={styles.universityName}>{profileData.university}</Text>
              <Text style={styles.verifiedLabel}>✓ Verified</Text>
            </LinearGradient>
          </MotiView>

          {/* Year Selection */}
          <MotiView
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 400 }}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Class Year</Text>
            <View style={styles.yearGrid}>
              {years.map((year, index) => (
                <MotiView
                  key={year}
                  from={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    delay: 500 + index * 50,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedYear(year)}
                    style={[
                      styles.yearButton,
                      selectedYear === year && styles.yearButtonSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.yearText,
                        selectedYear === year && styles.yearTextSelected,
                      ]}
                    >
                      {year}
                    </Text>
                  </TouchableOpacity>
                </MotiView>
              ))}
            </View>
          </MotiView>

          {/* Major Input */}
          <MotiView
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 600 }}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Major</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Computer Science"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={profileData.major}
              onChangeText={(text) => setProfileData({ ...profileData, major: text })}
            />
          </MotiView>

          {/* GPA Slider */}
          <MotiView
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 700 }}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>GPA</Text>
            <View style={styles.gpaContainer}>
              <TextInput
                style={[styles.input, styles.gpaInput]}
                placeholder="3.9"
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={profileData.gpa}
                onChangeText={(text) => setProfileData({ ...profileData, gpa: text })}
                keyboardType="decimal-pad"
                maxLength={3}
              />
              <Text style={styles.gpaScale}>/ 4.0</Text>
            </View>
          </MotiView>

          {/* Test Scores */}
          <MotiView
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 800 }}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Test Scores (Optional)</Text>
            <View style={styles.testScoresContainer}>
              <View style={styles.testScoreItem}>
                <Text style={styles.testLabel}>SAT</Text>
                <TextInput
                  style={[styles.input, styles.testInput]}
                  placeholder="1520"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={profileData.satScore}
                  onChangeText={(text) => setProfileData({ ...profileData, satScore: text })}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              </View>
              <View style={styles.testScoreItem}>
                <Text style={styles.testLabel}>ACT</Text>
                <TextInput
                  style={[styles.input, styles.testInput]}
                  placeholder="35"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={profileData.actScore}
                  onChangeText={(text) => setProfileData({ ...profileData, actScore: text })}
                  keyboardType="number-pad"
                  maxLength={2}
                />
              </View>
            </View>
          </MotiView>

          {/* Success Story */}
          <MotiView
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 900 }}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>How I Got In (280 characters)</Text>
            <TextInput
              style={[styles.input, styles.storyInput]}
              placeholder="Share your secret sauce... What made your application stand out?"
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={profileData.successStory}
              onChangeText={(text) => setProfileData({ ...profileData, successStory: text })}
              multiline
              maxLength={280}
            />
            <Text style={styles.charCount}>
              {profileData.successStory.length}/280
            </Text>
          </MotiView>

          {/* Preview Card */}
          {profileData.successStory && (
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring' }}
              style={styles.previewCard}
            >
              <Text style={styles.previewTitle}>Profile Preview</Text>
              <View style={styles.previewContent}>
                <Text style={styles.previewName}>
                  {profileData.university} '{selectedYear?.substring(2)}
                </Text>
                <Text style={styles.previewMajor}>{profileData.major}</Text>
                <Text style={styles.previewStats}>
                  GPA: {profileData.gpa} {profileData.satScore && `• SAT: ${profileData.satScore}`}
                </Text>
                <Text style={styles.previewStory}>"{profileData.successStory}"</Text>
              </View>
            </MotiView>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!isFormValid}
            style={[
              styles.continueButton,
              !isFormValid && styles.continueButtonDisabled,
            ]}
          >
            <LinearGradient
              colors={isFormValid ? ['#FFB800', '#FFA000'] : ['#666', '#555']}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>
                {isFormValid ? 'Continue' : 'Complete all fields'}
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
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
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
  universityBadge: {
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
  },
  badgeGradient: {
    padding: 20,
    alignItems: 'center',
  },
  universityName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#001f3f',
    marginBottom: 4,
  },
  verifiedLabel: {
    fontSize: 14,
    color: '#001f3f',
    opacity: 0.8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  yearGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  yearButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  yearButtonSelected: {
    backgroundColor: '#FFB800',
    borderColor: '#FFB800',
  },
  yearText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  yearTextSelected: {
    color: '#001f3f',
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
  gpaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  gpaInput: {
    width: 80,
    textAlign: 'center',
  },
  gpaScale: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
  },
  testScoresContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  testScoreItem: {
    flex: 1,
  },
  testLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  testInput: {
    textAlign: 'center',
  },
  storyInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 16,
  },
  charCount: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'right',
    marginTop: 8,
  },
  previewCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 24,
    marginTop: 20,
  },
  previewTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
  },
  previewContent: {
    gap: 8,
  },
  previewName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFB800',
  },
  previewMajor: {
    fontSize: 16,
    color: '#fff',
  },
  previewStats: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  previewStory: {
    fontSize: 16,
    color: '#fff',
    fontStyle: 'italic',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'rgba(0,31,63,0.9)',
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