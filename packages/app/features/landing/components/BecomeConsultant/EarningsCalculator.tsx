import { View, Text } from '@my/ui'
import { useState } from 'react'
import { TextInput } from 'react-native'

export function EarningsCalculator() {
  const [hourlyRate, setHourlyRate] = useState('120')
  const [hoursPerWeek, setHoursPerWeek] = useState('10')
  
  const weeklyEarnings = (parseFloat(hourlyRate) || 0) * (parseFloat(hoursPerWeek) || 0) * 0.8
  const monthlyEarnings = weeklyEarnings * 4
  const yearlyEarnings = weeklyEarnings * 52

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
        Calculate Your Potential Earnings
      </Text>

      <View sx={{
        maxWidth: 600,
        alignSelf: 'center',
        backgroundColor: 'white',
        padding: 40,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8
      }}>
        <View sx={{ marginBottom: 30 }}>
          <Text sx={{ 
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 12,
            color: '$primaryDark'
          }}>
            Your Hourly Rate ($)
          </Text>
          <TextInput
            value={hourlyRate}
            onChangeText={setHourlyRate}
            placeholder="120"
            keyboardType="numeric"
            style={{
              fontSize: 20,
              padding: 16,
              borderWidth: 2,
              borderColor: '#e5e7eb',
              borderRadius: 8
            }}
          />
        </View>

        <View sx={{ marginBottom: 40 }}>
          <Text sx={{ 
            fontSize: 18,
            fontWeight: '600',
            marginBottom: 12,
            color: '$primaryDark'
          }}>
            Hours Per Week
          </Text>
          <TextInput
            value={hoursPerWeek}
            onChangeText={setHoursPerWeek}
            placeholder="10"
            keyboardType="numeric"
            style={{
              fontSize: 20,
              padding: 16,
              borderWidth: 2,
              borderColor: '#e5e7eb',
              borderRadius: 8
            }}
          />
        </View>

        <View sx={{ 
          borderTopWidth: 2,
          borderTopColor: '#e5e7eb',
          paddingTop: 30
        }}>
          <Text sx={{ 
            fontSize: 16,
            color: '$textSecondary',
            marginBottom: 20
          }}>
            After Proofr's 20% platform fee:
          </Text>

          <View sx={{ gap: 16 }}>
            <View sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text sx={{ fontSize: 18, color: '$textSecondary' }}>Weekly:</Text>
              <Text sx={{ fontSize: 24, fontWeight: 'bold', color: '$primary' }}>
                ${weeklyEarnings.toFixed(0)}
              </Text>
            </View>
            <View sx={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text sx={{ fontSize: 18, color: '$textSecondary' }}>Monthly:</Text>
              <Text sx={{ fontSize: 24, fontWeight: 'bold', color: '$primary' }}>
                ${monthlyEarnings.toFixed(0)}
              </Text>
            </View>
            <View sx={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: '#e5e7eb'
            }}>
              <Text sx={{ fontSize: 20, fontWeight: '600', color: '$primaryDark' }}>Yearly:</Text>
              <Text sx={{ fontSize: 28, fontWeight: 'bold', color: '$primary' }}>
                ${yearlyEarnings.toFixed(0)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}