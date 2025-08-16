import { View, Text } from '@my/ui'

const stories = [
  {
    name: 'Sarah Chen',
    school: 'Harvard',
    earnings: '$15,000',
    quote: "I love helping students while earning money. Best side hustle ever!"
  },
  {
    name: 'Michael Rodriguez',
    school: 'Stanford',
    earnings: '$22,000',
    quote: "The flexibility lets me balance consulting with my PhD research."
  },
  {
    name: 'Priya Patel',
    school: 'MIT',
    earnings: '$18,500',
    quote: "Making a real impact on students' lives is incredibly rewarding."
  }
]

export function SuccessStories() {
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
        Success Stories
      </Text>

      <View sx={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 30,
        maxWidth: 1000,
        alignSelf: 'center'
      }}>
        {stories.map((story, index) => (
          <View 
            key={index}
            sx={{
              backgroundColor: 'white',
              padding: 30,
              borderRadius: 12,
              width: 300,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8
            }}
          >
            <Text sx={{ 
              fontSize: 18,
              fontStyle: 'italic',
              marginBottom: 20,
              color: '$textSecondary'
            }}>
              "{story.quote}"
            </Text>
            <View sx={{ borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 20 }}>
              <Text sx={{ fontWeight: 'bold', fontSize: 16 }}>{story.name}</Text>
              <Text sx={{ color: '$textSecondary' }}>{story.school}</Text>
              <Text sx={{ color: '$primary', fontWeight: 'bold', marginTop: 8 }}>
                Earned {story.earnings} last year
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}