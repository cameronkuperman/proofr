import { View, Text } from '@my/ui'
import { useRouter } from 'solito/router'
import { TouchableOpacity } from 'react-native'

export function BecomeConsultantHero() {
  const { push } = useRouter()

  const handleGetStarted = () => {
    push('/sign-up?userType=consultant')
  }

  return (
    <View sx={{ 
      paddingTop: 100,
      paddingBottom: 60,
      paddingHorizontal: 20,
      alignItems: 'center'
    }}>
      <Text 
        sx={{ 
          fontSize: 48,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 20,
          color: '$primaryDark'
        }}
      >
        Earn Money Helping Students Get Into Their Dream Schools
      </Text>
      
      <Text 
        sx={{
          fontSize: 20,
          textAlign: 'center',
          marginBottom: 30,
          maxWidth: 600,
          color: '$textSecondary'
        }}
      >
        Join elite consultants from Harvard, Stanford, MIT and more. 
        Set your own rates, work on your schedule, and make a real impact.
      </Text>

      <View sx={{ flexDirection: 'row', gap: 16 }}>
        <TouchableOpacity
          onPress={handleGetStarted}
          style={{
            backgroundColor: '#3B82F6',
            paddingHorizontal: 32,
            paddingVertical: 16,
            borderRadius: 8
          }}
        >
          <Text sx={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            Start Earning Today
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {/* scroll to calculator */}}
          style={{
            borderWidth: 2,
            borderColor: '#3B82F6',
            paddingHorizontal: 32,
            paddingVertical: 16,
            borderRadius: 8
          }}
        >
          <Text sx={{ color: '#3B82F6', fontSize: 18, fontWeight: 'bold' }}>
            Calculate Earnings
          </Text>
        </TouchableOpacity>
      </View>

      <View sx={{ 
        marginTop: 40,
        flexDirection: 'row',
        gap: 40,
        alignItems: 'center'
      }}>
        <View sx={{ alignItems: 'center' }}>
          <Text sx={{ fontSize: 36, fontWeight: 'bold', color: '$primary' }}>$120+</Text>
          <Text sx={{ color: '$textSecondary' }}>Avg hourly rate</Text>
        </View>
        <View sx={{ alignItems: 'center' }}>
          <Text sx={{ fontSize: 36, fontWeight: 'bold', color: '$primary' }}>500+</Text>
          <Text sx={{ color: '$textSecondary' }}>Active consultants</Text>
        </View>
        <View sx={{ alignItems: 'center' }}>
          <Text sx={{ fontSize: 36, fontWeight: 'bold', color: '$primary' }}>95%</Text>
          <Text sx={{ color: '$textSecondary' }}>5-star reviews</Text>
        </View>
      </View>
    </View>
  )
}