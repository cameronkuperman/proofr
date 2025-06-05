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
      <StatusBar barStyle="light-content" backgroundColor="#1a1f3a" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>🎓</Text>
          </View>
          <Text style={styles.logoText}>proofr</Text>
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
              <Text style={styles.cardTitle}>Find Help</Text>
              <Text style={styles.cardSubtitle}>Browse consultants & services</Text>
            </View>
            <Text style={styles.cardArrow}>→</Text>
          </TouchableOpacity>
        </TextLink>

        <TextLink href="/become-consultant">
          <TouchableOpacity style={[styles.actionCard, styles.secondaryCard]}>
            <View style={styles.cardIcon}>
              <Text style={styles.cardEmoji}>💼</Text>
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Offer Services</Text>
              <Text style={styles.cardSubtitle}>Help students & earn money</Text>
            </View>
            <Text style={styles.cardArrow}>→</Text>
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
    backgroundColor: '#1a1f3a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#06b6d4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 20,
  },
  logoText: {
    fontSize: 24,
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
    paddingVertical: 24,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  actionCards: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  primaryCard: {
    backgroundColor: 'white',
  },
  secondaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardEmoji: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1f3a',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  cardArrow: {
    fontSize: 20,
    color: '#06b6d4',
    fontWeight: '600',
  },
  servicesSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
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
    marginBottom: 32,
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
    paddingVertical: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
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