import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native'
import { MotiView } from 'moti'
import { LinearGradient } from 'expo-linear-gradient'

interface EarningsPreviewScreenProps {
  services: any[]
  onContinue: () => void
}

export function EarningsPreviewScreen({ services, onContinue }: EarningsPreviewScreenProps) {
  const countAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    // Animate earnings counter
    Animated.timing(countAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start()
  }, [])

  const monthlyEarnings = services.reduce(
    (sum, service) => sum + service.popularPrice * 10,
    0
  )
  const yearlyEarnings = monthlyEarnings * 12

  const animatedMonthly = countAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, monthlyEarnings],
  })

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
            <Text style={styles.title}>Your earning potential</Text>
            <Text style={styles.subtitle}>
              Based on similar consultants at your school
            </Text>
          </MotiView>

          {/* Main Earnings Display */}
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 300 }}
            style={styles.earningsCard}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.earningsGradient}
            >
              <Text style={styles.earningsLabel}>Monthly Average</Text>
              <Animated.Text style={styles.earningsAmount}>
                ${animatedMonthly.interpolate({
                  inputRange: [0, monthlyEarnings],
                  outputRange: ['0', monthlyEarnings.toLocaleString()],
                })}
              </Animated.Text>
              <Text style={styles.yearlyAmount}>
                ${yearlyEarnings.toLocaleString()}/year
              </Text>
            </LinearGradient>
          </MotiView>

          {/* Success Story */}
          <MotiView
            from={{ opacity: 0, translateX: -30 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 600 }}
            style={styles.successStory}
          >
            <Text style={styles.storyQuote}>
              "I started with just essay reviews. Now I help 20+ students per month 
              and earn enough to cover my tuition and living expenses."
            </Text>
            <Text style={styles.storyAuthor}>- Jake M., Stanford '25</Text>
          </MotiView>

          {/* Earnings Breakdown */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 800 }}
            style={styles.breakdownCard}
          >
            <Text style={styles.breakdownTitle}>How consultants earn</Text>
            
            {[
              { label: 'Average clients/month', value: '10-15' },
              { label: 'Top consultants', value: '25+' },
              { label: 'Repeat client rate', value: '68%' },
              { label: 'Average rating', value: '4.9/5.0' },
            ].map((stat, index) => (
              <MotiView
                key={stat.label}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 900 + index * 100 }}
                style={styles.statRow}
              >
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
              </MotiView>
            ))}
          </MotiView>

          {/* Growth Timeline */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1200 }}
            style={styles.timelineCard}
          >
            <Text style={styles.timelineTitle}>Your growth journey</Text>
            
            {[
              { month: 'Month 1', earnings: '$500-800', desc: 'Build your profile' },
              { month: 'Month 3', earnings: '$1,200-1,800', desc: 'Regular clients' },
              { month: 'Month 6', earnings: '$2,000+', desc: 'Top consultant status' },
            ].map((milestone, index) => (
              <MotiView
                key={milestone.month}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: 1300 + index * 100 }}
                style={styles.milestone}
              >
                <View style={styles.milestoneLeft}>
                  <Text style={styles.milestoneMonth}>{milestone.month}</Text>
                  <Text style={styles.milestoneDesc}>{milestone.desc}</Text>
                </View>
                <Text style={styles.milestoneEarnings}>{milestone.earnings}</Text>
              </MotiView>
            ))}
          </MotiView>

          {/* Platform Benefits */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1500 }}
            style={styles.benefitsCard}
          >
            <Text style={styles.benefitsTitle}>We've got your back</Text>
            <View style={styles.benefitsList}>
              {[
                '🛡️ Secure payments, always on time',
                '📈 Marketing support to grow your client base',
                '🤝 24/7 support team',
                '💰 No hidden fees - keep 85% of earnings',
              ].map((benefit, index) => (
                <MotiView
                  key={index}
                  from={{ opacity: 0, translateX: -20 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ delay: 1600 + index * 100 }}
                >
                  <Text style={styles.benefitItem}>{benefit}</Text>
                </MotiView>
              ))}
            </View>
          </MotiView>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity onPress={onContinue} style={styles.continueButton}>
            <LinearGradient
              colors={['#FFB800', '#FFA000']}
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>Start Earning Today</Text>
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
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
  },
  earningsGradient: {
    padding: 32,
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  earningsAmount: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  yearlyAmount: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
  },
  successStory: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
  },
  storyQuote: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#fff',
    lineHeight: 28,
    marginBottom: 16,
  },
  storyAuthor: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'right',
  },
  breakdownCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  breakdownTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  statLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFB800',
  },
  timelineCard: {
    marginBottom: 24,
  },
  timelineTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  milestone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  milestoneLeft: {
    flex: 1,
  },
  milestoneMonth: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  milestoneDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  milestoneEarnings: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10b981',
  },
  benefitsCard: {
    backgroundColor: 'rgba(0,85,254,0.1)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(0,85,254,0.3)',
  },
  benefitsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    fontSize: 16,
    color: '#fff',
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
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  continueGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  continueText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#001f3f',
  },
})