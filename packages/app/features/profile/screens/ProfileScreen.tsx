import React, { useState } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

// AsyncStorage
let AsyncStorage: any
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default
} catch (error) {
  AsyncStorage = {
    getItem: async () => null,
    setItem: async () => {},
    clear: async () => {},
  }
}

export function ProfileScreen() {
  const navigation = useNavigation<any>()
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear all storage
              await AsyncStorage.clear()
              
              // Navigate back to onboarding
              navigation.reset({
                index: 0,
                routes: [{ name: 'onboarding' }],
              })
            } catch (error) {
              console.error('Error logging out:', error)
            }
          },
        },
      ],
    )
  }

  const toggleDarkMode = async (value: boolean) => {
    setIsDarkMode(value)
    await AsyncStorage.setItem('darkMode', value ? 'true' : 'false')
  }

  // Colors based on theme
  const colors = isDarkMode ? {
    background: '#0D0D0D',
    card: '#1A1A1A',
    primary: '#00D4FF',
    accent: '#FF6B35',
    success: '#1DBF73',
    text: '#FFFFFF',
    textSecondary: '#999999',
    border: '#2A2A2A',
  } : {
    background: '#FFF8F0',
    card: '#FFFFFF',
    primary: '#1DBF73',
    accent: '#FF6B35',
    text: '#1a1f36',
    textSecondary: '#62646A',
    border: '#E0E0E0',
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}>
          <Text style={{
            fontSize: 32,
            fontWeight: '700',
            color: colors.text,
          }}>
            Profile
          </Text>
        </View>

        {/* Content */}
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 24 }}>
          {/* Dark Mode Toggle */}
          <TouchableOpacity
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: isDarkMode ? colors.primary : colors.background,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 16,
              }}>
                <Ionicons
                  name={isDarkMode ? 'moon' : 'sunny'}
                  size={24}
                  color={isDarkMode ? colors.background : colors.primary}
                />
              </View>
              <View>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: colors.text,
                }}>
                  Dark Mode
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: colors.textSecondary,
                  marginTop: 2,
                }}>
                  {isDarkMode ? 'Currently enabled' : 'Currently disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ 
                false: colors.border, 
                true: isDarkMode ? colors.primary : colors.primary 
              }}
              thumbColor={colors.card}
              ios_backgroundColor={colors.border}
            />
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            style={{
              backgroundColor: colors.card,
              borderRadius: 16,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: isDarkMode ? '#FF453A' : '#FFE5E5',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 16,
            }}>
              <Ionicons
                name="log-out-outline"
                size={24}
                color={isDarkMode ? '#FFFFFF' : '#FF453A'}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: colors.text,
              }}>
                Logout
              </Text>
              <Text style={{
                fontSize: 14,
                color: colors.textSecondary,
                marginTop: 2,
              }}>
                Sign out and restart onboarding
              </Text>
            </View>
          </TouchableOpacity>

          {/* Theme Preview */}
          <View style={{
            marginTop: 32,
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: colors.text,
              marginBottom: 16,
            }}>
              Theme Preview
            </Text>
            
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: colors.primary,
              }} />
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: colors.accent,
              }} />
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                backgroundColor: colors.success,
              }} />
            </View>
            
            <Text style={{
              fontSize: 14,
              color: colors.textSecondary,
            }}>
              {isDarkMode 
                ? 'Dark theme with light blue, orange, and green accents'
                : 'Light cream theme with Fiverr-inspired green'
              }
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}