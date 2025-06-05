import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Hero } from '../components/Hero/Hero.native'

export function LandingScreen() {
  const universities = ['Harvard', 'Stanford', 'MIT', 'Yale', 'Princeton', 'Columbia']
  const consultants = [
    { name: 'Sarah C.', school: 'Harvard', service: 'Essays', price: 25, rating: '4.9' },
    { name: 'Marcus K.', school: 'Stanford', service: 'Interviews', price: 40, rating: '4.8' },
    { name: 'Emily R.', school: 'MIT', service: 'Strategy', price: 35, rating: '5.0' },
  ]

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroContainer}>
        <Hero />
      </View>

      {/* Trust Bar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Universities</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.universityScroll}
        >
          {universities.map((university, index) => (
            <View key={university} style={styles.universityChip}>
              <View style={styles.universityLogo}>
                <Text style={styles.universityInitial}>
                  {university.substring(0, 1)}
                </Text>
              </View>
              <Text style={styles.universityName}>{university}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Quick How It Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <Text style={styles.stepEmoji}>🔍</Text>
            <Text style={styles.stepText}>Browse consultants by school & service</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepEmoji}>📅</Text>
            <Text style={styles.stepText}>Book & pay securely through our platform</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepEmoji}>✨</Text>
            <Text style={styles.stepText}>Get personalized guidance & feedback</Text>
          </View>
        </View>
      </View>

      {/* Sample Consultants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Consultants</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.consultantScroll}
        >
          {consultants.map((consultant, index) => (
            <View key={index} style={styles.consultantCard}>
              <View style={styles.consultantHeader}>
                <View style={styles.consultantAvatar}>
                  <Text style={styles.consultantInitial}>
                    {consultant.name.split(' ')[0][0]}
                  </Text>
                </View>
                <View style={styles.consultantInfo}>
                  <Text style={styles.consultantName}>{consultant.name}</Text>
                  <Text style={styles.consultantSchool}>{consultant.school}</Text>
                </View>
                <View style={styles.ratingBadge}>
                  <Text style={styles.rating}>⭐ {consultant.rating}</Text>
                </View>
              </View>
              <Text style={styles.consultantService}>{consultant.service}</Text>
              <View style={styles.consultantFooter}>
                <Text style={styles.price}>From ${consultant.price}</Text>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Get Started?</Text>
        <Text style={styles.ctaSubtitle}>
          Join thousands of students who've successfully navigated college admissions with Proofr
        </Text>
        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Find Your Consultant</Text>
        </TouchableOpacity>
        <Text style={styles.ctaNote}>
          ⚡ Get started today • 💰 Affordable pricing • 🎯 Proven results
        </Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heroContainer: {
    height: 600, // Fixed height for hero
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  universityScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  universityChip: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 60,
  },
  universityLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  universityInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  universityName: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
  stepsContainer: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepEmoji: {
    fontSize: 24,
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#475569',
    lineHeight: 22,
  },
  consultantScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  consultantCard: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  consultantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  consultantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  consultantInitial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  consultantInfo: {
    flex: 1,
  },
  consultantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  consultantSchool: {
    fontSize: 14,
    color: '#64748b',
  },
  ratingBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '500',
  },
  consultantService: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  consultantFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16a34a',
  },
  viewButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  viewButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  ctaSection: {
    backgroundColor: '#1e293b',
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: '#06b6d4',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  ctaNote: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
  },
})