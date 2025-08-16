import { View, Text } from '@my/ui'
import { useState } from 'react'
import { TouchableOpacity } from 'react-native'

const faqs = [
  {
    question: "How much can I charge?",
    answer: "You set your own rates! Our consultants charge anywhere from free (to build portfolio) to $500+ per hour for specialized services."
  },
  {
    question: "What's the time commitment?",
    answer: "Completely flexible. Work as little as 1 hour per week or as much as full-time. You control your schedule."
  },
  {
    question: "How do I get paid?",
    answer: "We handle all payments securely. You get paid instantly after each session. We take a 20% platform fee."
  },
  {
    question: "Do I need to be a current student?",
    answer: "No! We welcome current students, recent grads, and alumni. Verification just requires proof of attendance."
  },
  {
    question: "What services can I offer?",
    answer: "Essay reviews, interview prep, test tutoring, application strategy, school selection help, and more. You choose!"
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
        Frequently Asked Questions
      </Text>

      <View sx={{
        maxWidth: 700,
        alignSelf: 'center'
      }}>
        {faqs.map((faq, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <View sx={{
              backgroundColor: 'white',
              padding: 24,
              marginBottom: 16,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#e5e7eb'
            }}>
              <View sx={{ 
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Text sx={{ 
                  fontSize: 18,
                  fontWeight: '600',
                  flex: 1,
                  color: '$primaryDark'
                }}>
                  {faq.question}
                </Text>
                <Text sx={{ fontSize: 20, marginLeft: 16 }}>
                  {openIndex === index ? '−' : '+'}
                </Text>
              </View>
              
              {openIndex === index && (
                <Text sx={{ 
                  marginTop: 16,
                  fontSize: 16,
                  color: '$textSecondary',
                  lineHeight: 24
                }}>
                  {faq.answer}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}