import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native'
import { TextLink } from 'solito/link'

export function LandingScreen() {
  const services = [
    { title: 'Essay Reviews', icon: '📝', color: '#4f46e5', count: '200+' },
    { title: 'Mock Interviews', icon: '🎤', color: '#059669', count: '150+' },
    { title: 'App Strategy', icon: '🎯', color: '#dc2626', count: '100+' },
    { title: 'Resume Help', icon: '📄', color: '#7c3aed', count: '80+' },
  ]

  const topConsultants = [
    { initial: 'A', name: 'Ashley H.', school: 'Stanford', rating: '5.0', color: '#ef4444' },
    { initial: 'I', name: 'Imane A.', school: 'MIT', rating: '4.9', color: '#8b5cf6' },
    { initial: 'C', name: 'Cameron K.', school: 'Duke', rating: '4.8', color: '#3b82f6' },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      {/* Header with Massive Logo */}
      <View style={styles.header}>
        <View style={styles.massiveLogoSection}>
          <View style={styles.massiveLogoCircle}>
            <Text style={styles.massiveLogoIcon}>🎓</Text>
          </View>
          <Text style={styles.massiveLogoText}>proofr</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>What can we help you with?</Text>
        <Text style={styles.subtitle}>Connect with top university students</Text>
      </View>

      {/* Main Action Cards */}
      <View style={styles.actionCards}>
        <TextLink href="/browse">
          <TouchableOpacity style={[styles.actionCard, styles.primaryCard]}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardEmoji}>🔍</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, styles.primaryCardTitle]}>Find a Consultant</Text>
              <Text style={[styles.cardSubtitle, styles.primaryCardSubtitle]}>Browse top students from Harvard, MIT & more</Text>
            </View>
            <Text style={styles.cardArrow}>→</Text>
          </TouchableOpacity>
        </TextLink>

        <TextLink href="/become-consultant">
          <TouchableOpacity style={[styles.actionCard, styles.secondaryCard]}>
            <View style={[styles.cardIcon, styles.secondaryCardIcon]}>
              <Text style={styles.cardEmoji}>💼</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, styles.secondaryCardTitle]}>Earn as Consultant</Text>
              <Text style={[styles.cardSubtitle, styles.secondaryCardSubtitle]}>Help students & earn $50+ per session</Text>
            </View>
            <Text style={[styles.cardArrow, styles.secondaryCardArrow]}>→</Text>
          </TouchableOpacity>
        </TextLink>
      </View>

      {/* Services Grid */}
      <View style={styles.servicesSection}>
        <Text style={styles.sectionTitle}>Popular Services</Text>
        <View style={styles.servicesGrid}>
          {services.map((service, index) => (
            <TouchableOpacity key={index} style={[styles.serviceCard, { borderLeftColor: service.color }]}>
              <Text style={styles.serviceIcon}>{service.icon}</Text>
              <Text style={styles.serviceTitle}>{service.title}</Text>
              <Text style={styles.serviceCount}>{service.count} experts</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Top Consultants */}
      <View style={styles.consultantsSection}>
        <Text style={styles.sectionTitle}>Top Rated</Text>
        <View style={styles.consultantsList}>
          {topConsultants.map((consultant, index) => (
            <TouchableOpacity key={index} style={styles.consultantItem}>
              <View style={[styles.consultantAvatar, { backgroundColor: consultant.color + '20' }]}>
                <Text style={[styles.consultantInitial, { color: consultant.color }]}>
                  {consultant.initial}
                </Text>
              </View>
              <View style={styles.consultantInfo}>
                <Text style={styles.consultantName}>{consultant.name}</Text>
                <Text style={styles.consultantSchool}>{consultant.school}</Text>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.star}>⭐</Text>
                <Text style={styles.ratingText}>{consultant.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>10K+</Text>
          <Text style={styles.statLabel}>Students Helped</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>500+</Text>
          <Text style={styles.statLabel}>Expert Consultants</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>94%</Text>
          <Text style={styles.statLabel}>Success Rate</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a', // Much darker
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  massiveLogoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  massiveLogoCircle: {
    width: 72, // Slightly smaller to fit better
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0891b2', // Darker shade
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 12,
  },
  massiveLogoIcon: {
    fontSize: 34, // Adjusted to fit the smaller circle
  },
  massiveLogoText: {
    fontSize: 42, // Slightly smaller to fit better
    fontWeight: '700',
    color: 'white',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionCards: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  primaryCard: {
    backgroundColor: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    backgroundColor: '#06b6d4', // Fallback for React Native
    shadowColor: '#06b6d4',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  secondaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cardIcon: {
    width: 56, // Larger icons
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryCardIcon: {
    backgroundColor: 'rgba(6, 182, 212, 0.2)',
  },
  cardEmoji: {
    fontSize: 28, // Larger emojis
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20, // Larger title
    fontWeight: '700', // Bolder
    marginBottom: 6,
  },
  primaryCardTitle: {
    color: 'white',
  },
  secondaryCardTitle: {
    color: 'white',
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  primaryCardSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  secondaryCardSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  cardArrow: {
    fontSize: 24, // Larger arrow
    fontWeight: '700',
  },
  secondaryCardArrow: {
    color: '#06b6d4',
  },
  servicesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  serviceIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  serviceCount: {
    fontSize: 12,
    color: '#94a3b8',
  },
  consultantsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  consultantsList: {
    gap: 12,
  },
  consultantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  consultantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  consultantInitial: {
    fontSize: 16,
    fontWeight: '600',
  },
  consultantInfo: {
    flex: 1,
  },
  consultantName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  consultantSchool: {
    fontSize: 14,
    color: '#94a3b8',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  star: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fbbf24',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#06b6d4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
})