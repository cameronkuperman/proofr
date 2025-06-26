import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native'
import { MotiView, AnimatePresence } from 'moti'
import { LinearGradient } from 'expo-linear-gradient'

interface Service {
  id: string
  name: string
  icon: string
  description: string
  priceRange: { min: number; max: number }
  popularPrice: number
  isActive: boolean
}

interface ServicesScreenProps {
  onContinue: (services: Service[]) => void
}

export function ServicesScreen({ onContinue }: ServicesScreenProps) {
  const [services, setServices] = useState<Service[]>([
    {
      id: 'essay_review',
      name: 'Essay Review',
      icon: '📝',
      description: 'Review & edit application essays',
      priceRange: { min: 35, max: 75 },
      popularPrice: 50,
      isActive: false,
    },
    {
      id: 'full_application',
      name: 'Full Application Review',
      icon: '📋',
      description: 'Complete application package review',
      priceRange: { min: 200, max: 500 },
      popularPrice: 350,
      isActive: false,
    },
    {
      id: 'interview_prep',
      name: 'Interview Prep',
      icon: '🎤',
      description: '1-hour mock interview session',
      priceRange: { min: 50, max: 100 },
      popularPrice: 75,
      isActive: false,
    },
    {
      id: 'strategy_session',
      name: 'Strategy Session',
      icon: '🎯',
      description: 'Personalized admission strategy',
      priceRange: { min: 75, max: 150 },
      popularPrice: 100,
      isActive: false,
    },
    {
      id: 'activity_list',
      name: 'Activity List Review',
      icon: '📊',
      description: 'Optimize extracurricular presentation',
      priceRange: { min: 40, max: 80 },
      popularPrice: 60,
      isActive: false,
    },
    {
      id: 'scholarship_help',
      name: 'Scholarship Applications',
      icon: '💰',
      description: 'Help with scholarship essays',
      priceRange: { min: 45, max: 90 },
      popularPrice: 65,
      isActive: false,
    },
  ])

  const toggleService = (serviceId: string) => {
    setServices(prev =>
      prev.map(service =>
        service.id === serviceId
          ? { ...service, isActive: !service.isActive }
          : service
      )
    )
  }

  const activeServices = services.filter(s => s.isActive)
  const potentialEarnings = activeServices.reduce(
    (sum, service) => sum + service.popularPrice * 10, // Assume 10 clients/month
    0
  )

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
            <Text style={styles.title}>What's your superpower?</Text>
            <Text style={styles.subtitle}>
              Choose services you're excited to offer
            </Text>
          </MotiView>

          {/* Earnings Preview */}
          {activeServices.length > 0 && (
            <MotiView
              from={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ type: 'timing', duration: 400 }}
              style={styles.earningsCard}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.earningsGradient}
              >
                <Text style={styles.earningsLabel}>Potential Monthly Earnings</Text>
                <Text style={styles.earningsAmount}>
                  ${potentialEarnings.toLocaleString()}
                </Text>
                <Text style={styles.earningsSubtext}>
                  Based on {activeServices.length} services
                </Text>
              </LinearGradient>
            </MotiView>
          )}

          {/* Services Grid */}
          <View style={styles.servicesGrid}>
            {services.map((service, index) => (
              <MotiView
                key={service.id}
                from={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  delay: index * 100,
                }}
                style={styles.serviceCardContainer}
              >
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => toggleService(service.id)}
                  style={[
                    styles.serviceCard,
                    service.isActive && styles.serviceCardActive,
                  ]}
                >
                  <LinearGradient
                    colors={
                      service.isActive
                        ? ['#0055FE', '#0040BE']
                        : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']
                    }
                    style={styles.cardGradient}
                  >
                    {/* Active indicator */}
                    <AnimatePresence>
                      {service.isActive && (
                        <MotiView
                          from={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: 'spring' }}
                          style={styles.activeIndicator}
                        >
                          <Text style={styles.checkmark}>✓</Text>
                        </MotiView>
                      )}
                    </AnimatePresence>

                    <Text style={styles.serviceIcon}>{service.icon}</Text>
                    <Text
                      style={[
                        styles.serviceName,
                        service.isActive && styles.serviceNameActive,
                      ]}
                    >
                      {service.name}
                    </Text>
                    <Text
                      style={[
                        styles.serviceDescription,
                        service.isActive && styles.serviceDescriptionActive,
                      ]}
                    >
                      {service.description}
                    </Text>
                    
                    <View style={styles.priceContainer}>
                      <Text
                        style={[
                          styles.priceRange,
                          service.isActive && styles.priceRangeActive,
                        ]}
                      >
                        ${service.priceRange.min}-${service.priceRange.max}
                      </Text>
                      <Text
                        style={[
                          styles.popularPrice,
                          service.isActive && styles.popularPriceActive,
                        ]}
                      >
                        Most charge ${service.popularPrice}
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>

          {/* Tips Section */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 800 }}
            style={styles.tipsCard}
          >
            <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>• Start with 2-3 services</Text>
              <Text style={styles.tipItem}>• Essay reviews are most popular</Text>
              <Text style={styles.tipItem}>• You can always add more later</Text>
            </View>
          </MotiView>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => onContinue(activeServices)}
            disabled={activeServices.length === 0}
            style={[
              styles.continueButton,
              activeServices.length === 0 && styles.continueButtonDisabled,
            ]}
          >
            <LinearGradient
              colors={activeServices.length > 0 ? ['#FFB800', '#FFA000'] : ['#666', '#555']}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>
                {activeServices.length > 0
                  ? `Continue with ${activeServices.length} services`
                  : 'Select at least one service'}
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
  earningsCard: {
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
  },
  earningsGradient: {
    padding: 24,
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  earningsAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  earningsSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  servicesGrid: {
    gap: 16,
  },
  serviceCardContainer: {
    marginBottom: 16,
  },
  serviceCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  serviceCardActive: {
    borderColor: '#0055FE',
  },
  cardGradient: {
    padding: 24,
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  serviceIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  serviceName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  serviceNameActive: {
    color: '#fff',
  },
  serviceDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
  },
  serviceDescriptionActive: {
    color: 'rgba(255,255,255,0.9)',
  },
  priceContainer: {
    marginTop: 12,
  },
  priceRange: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFB800',
    marginBottom: 4,
  },
  priceRangeActive: {
    color: '#fff',
  },
  popularPrice: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  popularPriceActive: {
    color: 'rgba(255,255,255,0.8)',
  },
  tipsCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 24,
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