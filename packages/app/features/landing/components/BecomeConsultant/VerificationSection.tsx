import { View, Text } from '@my/ui'

export function VerificationSection() {
  return (
    <View sx={{ 
      paddingVertical: 60,
      paddingHorizontal: 20
    }}>
      <View sx={{
        maxWidth: 800,
        alignSelf: 'center',
        alignItems: 'center'
      }}>
        <Text sx={{ 
          fontSize: 36,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 20,
          color: '$primaryDark'
        }}>
          Get Verified, Earn More
        </Text>
        
        <Text sx={{
          fontSize: 18,
          textAlign: 'center',
          marginBottom: 40,
          color: '$textSecondary'
        }}>
          Verified consultants earn 73% more on average and get 2.5x more inquiries
        </Text>

        <View sx={{
          flexDirection: 'row',
          gap: 40,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <View sx={{ alignItems: 'center', maxWidth: 200 }}>
            <Text sx={{ fontSize: 48, marginBottom: 8 }}>🎓</Text>
            <Text sx={{ fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>University Email</Text>
            <Text sx={{ textAlign: 'center', color: '$textSecondary' }}>
              Use your .edu email to verify your enrollment
            </Text>
          </View>
          
          <View sx={{ alignItems: 'center', maxWidth: 200 }}>
            <Text sx={{ fontSize: 48, marginBottom: 8 }}>📄</Text>
            <Text sx={{ fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>Transcript</Text>
            <Text sx={{ textAlign: 'center', color: '$textSecondary' }}>
              Upload your transcript to show your achievements
            </Text>
          </View>
          
          <View sx={{ alignItems: 'center', maxWidth: 200 }}>
            <Text sx={{ fontSize: 48, marginBottom: 8 }}>✅</Text>
            <Text sx={{ fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>Quick Review</Text>
            <Text sx={{ textAlign: 'center', color: '$textSecondary' }}>
              Get verified within 24 hours
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}