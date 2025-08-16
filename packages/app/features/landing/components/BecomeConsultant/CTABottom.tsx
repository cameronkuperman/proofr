import { View, Text } from '@my/ui'
import { useRouter } from 'solito/router'
import { TouchableOpacity } from 'react-native'

export function CTABottom() {
  const { push } = useRouter()

  const handleGetStarted = () => {
    push('/sign-up?userType=consultant')
  }

  return (
    <View sx={{ 
      paddingVertical: 80,
      paddingHorizontal: 20,
      backgroundColor: '$primary',
      alignItems: 'center'
    }}>
      <Text sx={{ 
        fontSize: 40,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: 'white'
      }}>
        Ready to Start Earning?
      </Text>
      
      <Text sx={{
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 30,
        maxWidth: 600,
        color: 'white',
        opacity: 0.9
      }}>
        Join hundreds of consultants helping students achieve their dreams
      </Text>

      <TouchableOpacity
        onPress={handleGetStarted}
        style={{
          backgroundColor: 'white',
          paddingHorizontal: 40,
          paddingVertical: 16,
          borderRadius: 8
        }}
      >
        <Text sx={{
          color: '#3B82F6',
          fontSize: 18,
          fontWeight: 'bold'
        }}>
          Become a Consultant
        </Text>
      </TouchableOpacity>
    </View>
  )
}