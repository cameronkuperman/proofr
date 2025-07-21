import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useThemedColors } from '../../../contexts/ThemeContext'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = (SCREEN_WIDTH - 52) / 2 // 20px padding on each side + 12px gap

interface ConsultantGridCardProps {
  consultant: {
    id: string
    name: string
    university: string
    universityColor: string
    major: string
    rating: number
    reviews: number
    price: number
    isOnline: boolean
    isVerified: boolean
    bio: string
    services: string[]
    imageUrl: string | null
    badge?: string
  }
  onPress?: () => void
}

export const ConsultantGridCard: React.FC<ConsultantGridCardProps> = ({ consultant, onPress }) => {
  const colors = useThemedColors()
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: CARD_WIDTH,
        backgroundColor: colors.isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        overflow: 'hidden',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: colors.isDark ? 0.3 : 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
      activeOpacity={0.9}
    >
      {/* Header with Avatar and Badge */}
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {/* Avatar */}
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: consultant.universityColor,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            <Text style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#FFFFFF',
            }}>
              {getInitials(consultant.name)}
            </Text>
            {consultant.isOnline && (
              <View style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: '#4CAF50',
                borderWidth: 2,
                borderColor: colors.background,
              }} />
            )}
          </View>

          {/* Name and University */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: colors.text,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {consultant.name.split(' ')[0]}
              </Text>
              {consultant.isVerified && (
                <Ionicons name="checkmark-circle" size={16} color="#1DA1F2" />
              )}
            </View>
            <Text
              style={{
                fontSize: 13,
                color: consultant.universityColor,
                fontWeight: '600',
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {consultant.university}
            </Text>
          </View>
        </View>

        {/* Badge */}
        {consultant.badge && (
          <View style={{
            alignSelf: 'flex-start',
            marginTop: 12,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            backgroundColor: consultant.badge === 'Top Rated' 
              ? 'rgba(255, 193, 7, 0.15)'
              : consultant.badge === 'Rising Star'
              ? 'rgba(156, 39, 176, 0.15)'
              : consultant.badge === 'Expert'
              ? 'rgba(33, 150, 243, 0.15)'
              : 'rgba(76, 175, 80, 0.15)',
          }}>
            <Text style={{
              fontSize: 11,
              fontWeight: '600',
              color: consultant.badge === 'Top Rated' 
                ? '#FFC107'
                : consultant.badge === 'Rising Star'
                ? '#9C27B0'
                : consultant.badge === 'Expert'
                ? '#2196F3'
                : '#4CAF50',
            }}>
              {consultant.badge}
            </Text>
          </View>
        )}

        {/* Bio */}
        <Text
          style={{
            fontSize: 13,
            color: colors.textSecondary,
            marginTop: 12,
            lineHeight: 18,
          }}
          numberOfLines={3}
        >
          {consultant.bio}
        </Text>

        {/* Services */}
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          marginTop: 12,
          marginHorizontal: -2,
        }}>
          {consultant.services.slice(0, 2).map((service, index) => (
            <View
              key={index}
              style={{
                backgroundColor: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                margin: 2,
              }}
            >
              <Text style={{
                fontSize: 11,
                color: colors.textSecondary,
              }}>
                {service}
              </Text>
            </View>
          ))}
          {consultant.services.length > 2 && (
            <View
              style={{
                backgroundColor: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                margin: 2,
              }}
            >
              <Text style={{
                fontSize: 11,
                color: colors.textSecondary,
              }}>
                +{consultant.services.length - 2}
              </Text>
            </View>
          )}
        </View>

        {/* Stats Row */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 16,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
        }}>
          {/* Rating */}
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons name="star" size={14} color="#FFC107" />
            <Text style={{
              fontSize: 13,
              fontWeight: '600',
              color: colors.text,
              marginLeft: 4,
            }}>
              {consultant.rating}
            </Text>
            <Text style={{
              fontSize: 12,
              color: colors.textSecondary,
              marginLeft: 4,
            }}>
              ({consultant.reviews})
            </Text>
          </View>

          {/* Price */}
          <Text style={{
            fontSize: 16,
            fontWeight: '700',
            color: colors.primary,
          }}>
            ${consultant.price}
            <Text style={{
              fontSize: 12,
              fontWeight: '400',
              color: colors.textSecondary,
            }}>
              /hr
            </Text>
          </Text>
        </View>
      </View>

      {/* Quick Action Button */}
      <TouchableOpacity
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 14,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <Ionicons name="chatbubble-ellipses" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
        <Text style={{
          fontSize: 15,
          fontWeight: '600',
          color: '#FFFFFF',
        }}>
          Message
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}