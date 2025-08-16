import { View, Text } from '@my/ui'

const steps = [
  {
    number: '1',
    title: 'Sign Up & Create Profile',
    description: 'Share your background, achievements, and what makes you unique. Upload your transcript for verification.'
  },
  {
    number: '2',
    title: 'Set Your Services & Rates',
    description: 'Choose what you offer - essay reviews, interview prep, test prep, etc. Set your own prices.'
  },
  {
    number: '3',
    title: 'Get Discovered',
    description: 'Students find you through search, AI matching, or browsing. Your profile works 24/7.'
  },
  {
    number: '4',
    title: 'Help Students Succeed',
    description: 'Connect with students, deliver great service, and build your reputation with reviews.'
  },
  {
    number: '5',
    title: 'Get Paid Instantly',
    description: 'We handle all payments securely. Get paid after each session with our 80/20 split.'
  }
]

export function HowItWorksConsultant() {
  return (
    <View sx={{ 
      paddingVertical: 60,
      paddingHorizontal: 20
    }}>
      <Text sx={{ 
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
        color: '$primaryDark'
      }}>
        How It Works
      </Text>

      <View sx={{
        maxWidth: 800,
        alignSelf: 'center'
      }}>
        {steps.map((step, index) => (
          <View 
            key={index}
            sx={{
              flexDirection: 'row',
              marginBottom: 40,
              alignItems: 'flex-start'
            }}
          >
            <View sx={{
              width: 50,
              height: 50,
              borderRadius: 25,
              backgroundColor: '$primary',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 20
            }}>
              <Text sx={{ 
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold'
              }}>
                {step.number}
              </Text>
            </View>
            
            <View sx={{ flex: 1 }}>
              <Text sx={{ 
                fontSize: 22,
                fontWeight: 'bold',
                marginBottom: 8,
                color: '$primaryDark'
              }}>
                {step.title}
              </Text>
              <Text sx={{ 
                fontSize: 16,
                color: '$textSecondary',
                lineHeight: 24
              }}>
                {step.description}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}