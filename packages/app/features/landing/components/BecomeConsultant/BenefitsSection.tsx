import { View, Text } from '@my/ui'

const benefits = [
  {
    title: 'Set Your Own Rates',
    description: 'You decide what to charge. Whether free for portfolio building or premium for expertise.',
    icon: '💰'
  },
  {
    title: 'Flexible Schedule',
    description: 'Work when you want, where you want. Perfect for students and professionals.',
    icon: '📅'
  },
  {
    title: 'Build Your Brand',
    description: 'Create your profile, showcase your achievements, and grow your reputation.',
    icon: '⭐'
  },
  {
    title: 'Make Real Impact',
    description: 'Help students achieve their dreams and change their lives forever.',
    icon: '🎯'
  },
  {
    title: 'Verified Badge',
    description: 'Get verified with your .edu email for 73% more earnings and credibility.',
    icon: '✅'
  },
  {
    title: 'Full Support',
    description: 'We handle payments, scheduling, and provide resources to help you succeed.',
    icon: '🤝'
  }
]

export function BenefitsSection() {
  return (
    <View sx={{ 
      paddingVertical: 60,
      paddingHorizontal: 20,
      backgroundColor: '$backgroundSecondary'
    }}>
      <Text sx={{ 
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
        color: '$primaryDark'
      }}>
        Why Consultants Love Proofr
      </Text>

      <View sx={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 30,
        maxWidth: 1200,
        alignSelf: 'center'
      }}>
        {benefits.map((benefit, index) => (
          <View 
            key={index}
            sx={{
              backgroundColor: 'white',
              padding: 30,
              borderRadius: 12,
              width: 350,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5
            }}
          >
            <Text sx={{ fontSize: 40, marginBottom: 16 }}>{benefit.icon}</Text>
            <Text sx={{ 
              fontSize: 22,
              fontWeight: 'bold',
              marginBottom: 12,
              color: '$primaryDark'
            }}>
              {benefit.title}
            </Text>
            <Text sx={{ 
              fontSize: 16,
              color: '$textSecondary',
              lineHeight: 24
            }}>
              {benefit.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}