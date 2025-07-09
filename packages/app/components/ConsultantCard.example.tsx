import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { useTheme, useThemedColors, usePrimaryColors } from '../contexts/ThemeContext'
import { colors } from '../constants/colors'
import { Feather } from '@expo/vector-icons'

interface ConsultantCardProps {
  consultant: {
    id: string
    name: string
    university: keyof typeof colors.university
    photo: string
    rating: number
    sessions: number
    price: number
    expertise: string[]
    isOnline: boolean
    isPremium?: boolean
  }
  onPress: () => void
}

export function ConsultantCard({ consultant, onPress }: ConsultantCardProps) {
  const { isDark } = useTheme()
  const themedColors = useThemedColors()
  const primaryColors = usePrimaryColors()
  
  const universityColor = colors.university[consultant.university]
  
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.98}
      style={{
        backgroundColor: themedColors.surface.raised,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: consultant.isPremium && isDark
          ? colors.primary[700]
          : themedColors.border.default,
        overflow: 'hidden',
        marginBottom: 16,
        // Shadow for light mode
        ...(!isDark && {
          shadowColor: consultant.isPremium ? universityColor : '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: consultant.isPremium ? 0.15 : 0.05,
          shadowRadius: 8,
          elevation: 3,
        }),
        // Glow for dark mode premium
        ...(isDark && consultant.isPremium && {
          shadowColor: colors.primary[500],
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 5,
        }),
      }}
    >
      {/* Premium gradient header */}
      {consultant.isPremium && (
        <View
          style={{
            height: 3,
            background: isDark
              ? `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.accent[500]} 50%, ${colors.primary[500]} 100%)`
              : `linear-gradient(135deg, ${colors.primary[700]} 0%, ${colors.accent[600]} 50%, ${colors.primary[700]} 100%)`,
          }}
        />
      )}
      
      <View style={{ padding: 16 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          {/* Photo with online indicator */}
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: consultant.photo }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                borderWidth: 2,
                borderColor: consultant.isPremium ? universityColor : 'transparent',
              }}
            />
            {consultant.isOnline && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: colors.primary[500],
                  borderWidth: 3,
                  borderColor: themedColors.surface.raised,
                }}
              />
            )}
          </View>
          
          {/* Info */}
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: themedColors.text.primary,
                }}
              >
                {consultant.name}
              </Text>
              {consultant.isPremium && (
                <View
                  style={{
                    backgroundColor: isDark
                      ? colors.purple[800]
                      : colors.purple[100],
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 12,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '600',
                      color: isDark ? colors.purple[300] : colors.purple[700],
                    }}
                  >
                    EXPERT
                  </Text>
                </View>
              )}
            </View>
            
            {/* University badge */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <View
                style={{
                  backgroundColor: universityColor,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderRadius: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: '#FFFFFF',
                    textTransform: 'capitalize',
                  }}
                >
                  {consultant.university}
                </Text>
              </View>
            </View>
          </View>
          
          {/* Price */}
          <View style={{ alignItems: 'flex-end' }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: primaryColors.primary,
              }}
            >
              ${consultant.price}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: themedColors.text.secondary,
              }}
            >
              per hour
            </Text>
          </View>
        </View>
        
        {/* Stats */}
        <View
          style={{
            flexDirection: 'row',
            paddingVertical: 12,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: themedColors.border.light,
            marginBottom: 12,
            gap: 24,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Feather
              name="star"
              size={16}
              color={colors.warning.main}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: themedColors.text.primary,
              }}
            >
              {consultant.rating}
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Feather
              name="users"
              size={16}
              color={themedColors.text.secondary}
            />
            <Text
              style={{
                fontSize: 14,
                color: themedColors.text.secondary,
              }}
            >
              {consultant.sessions} sessions
            </Text>
          </View>
          
          {consultant.isOnline && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.primary[500],
                }}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: colors.primary[isDark ? 400 : 700],
                  fontWeight: '500',
                }}
              >
                Available now
              </Text>
            </View>
          )}
        </View>
        
        {/* Expertise tags */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {consultant.expertise.map((skill, index) => (
            <View
              key={index}
              style={{
                backgroundColor: isDark
                  ? colors.primary[900]
                  : colors.primary[50],
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: isDark
                  ? colors.primary[700]
                  : colors.primary[200],
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: isDark
                    ? colors.primary[300]
                    : colors.primary[700],
                  fontWeight: '500',
                }}
              >
                {skill}
              </Text>
            </View>
          ))}
        </View>
        
        {/* CTA Button */}
        <TouchableOpacity
          style={{
            backgroundColor: primaryColors.primary,
            borderRadius: 12,
            paddingVertical: 14,
            marginTop: 16,
            alignItems: 'center',
            // Subtle glow on primary button
            ...(isDark && {
              shadowColor: colors.primary[500],
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }),
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#FFFFFF',
            }}
          >
            Book Session
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}