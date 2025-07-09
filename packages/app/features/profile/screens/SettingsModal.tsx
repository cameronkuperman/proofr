import React, { useState } from 'react'
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { useTheme, useThemedColors, usePrimaryColors } from '../../../contexts/ThemeContext'
import { colors } from '../../../constants/colors'
import { ThemeSwitcher } from '../../../components/ThemeSwitcher'

interface SettingsModalProps {
  visible: boolean
  onClose: () => void
}

interface SettingSection {
  title: string
  icon: string
  items: SettingItem[]
}

interface SettingItem {
  id: string
  label: string
  description?: string
  type: 'toggle' | 'navigation' | 'action'
  value?: boolean
  onPress?: () => void
  onChange?: (value: boolean) => void
  destructive?: boolean
  iconColor?: string
}

export function SettingsModal({ visible, onClose }: SettingsModalProps) {
  const { isDark } = useTheme()
  const themedColors = useThemedColors()
  const primaryColors = usePrimaryColors()
  
  // Settings state
  const [notifications, setNotifications] = useState(true)
  const [emailUpdates, setEmailUpdates] = useState(true)
  const [autoSave, setAutoSave] = useState(true)
  const [biometrics, setBiometrics] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  
  const settingSections: SettingSection[] = [
    {
      title: 'Appearance',
      icon: 'eye',
      items: [
        {
          id: 'theme',
          label: 'Theme',
          description: 'Choose your preferred color scheme',
          type: 'navigation',
        },
        {
          id: 'highContrast',
          label: 'High Contrast',
          description: 'Increase color contrast for better visibility',
          type: 'toggle',
          value: highContrast,
          onChange: setHighContrast,
        },
        {
          id: 'reducedMotion',
          label: 'Reduce Motion',
          description: 'Minimize animations and transitions',
          type: 'toggle',
          value: reducedMotion,
          onChange: setReducedMotion,
        },
      ],
    },
    {
      title: 'Notifications',
      icon: 'bell',
      items: [
        {
          id: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive alerts for messages and bookings',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications,
        },
        {
          id: 'emailUpdates',
          label: 'Email Updates',
          description: 'Weekly progress reports and tips',
          type: 'toggle',
          value: emailUpdates,
          onChange: setEmailUpdates,
        },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: 'shield',
      items: [
        {
          id: 'biometrics',
          label: 'Biometric Login',
          description: 'Use Face ID or Touch ID to sign in',
          type: 'toggle',
          value: biometrics,
          onChange: setBiometrics,
        },
        {
          id: 'privacy',
          label: 'Privacy Policy',
          type: 'navigation',
          onPress: () => Alert.alert('Privacy Policy', 'Opens privacy policy in browser'),
        },
        {
          id: 'terms',
          label: 'Terms of Service',
          type: 'navigation',
          onPress: () => Alert.alert('Terms', 'Opens terms in browser'),
        },
      ],
    },
    {
      title: 'Data',
      icon: 'database',
      items: [
        {
          id: 'autoSave',
          label: 'Auto-save Drafts',
          description: 'Automatically save your essay drafts',
          type: 'toggle',
          value: autoSave,
          onChange: setAutoSave,
        },
        {
          id: 'exportData',
          label: 'Export My Data',
          type: 'action',
          onPress: () => Alert.alert('Export Data', 'Your data will be emailed to you'),
        },
        {
          id: 'clearCache',
          label: 'Clear Cache',
          type: 'action',
          onPress: () => Alert.alert('Cache Cleared', 'App cache has been cleared'),
          destructive: true,
        },
      ],
    },
    {
      title: 'Account',
      icon: 'user',
      items: [
        {
          id: 'changePassword',
          label: 'Change Password',
          type: 'navigation',
          onPress: () => Alert.alert('Change Password', 'Opens password change flow'),
        },
        {
          id: 'deactivate',
          label: 'Deactivate Account',
          type: 'action',
          onPress: () => Alert.alert('Deactivate Account', 'Are you sure?'),
          destructive: true,
        },
      ],
    },
  ]
  
  const renderSettingItem = (item: SettingItem, isLast: boolean) => {
    switch (item.type) {
      case 'toggle':
        return (
          <View
            key={item.id}
            style={{
              flexDirection: 'row',
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderBottomWidth: isLast ? 0 : 1,
              borderBottomColor: themedColors.border.light,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: themedColors.text.primary,
                  marginBottom: item.description ? 4 : 0,
                }}
              >
                {item.label}
              </Text>
              {item.description && (
                <Text
                  style={{
                    fontSize: 14,
                    color: themedColors.text.secondary,
                  }}
                >
                  {item.description}
                </Text>
              )}
            </View>
            <Switch
              value={item.value}
              onValueChange={item.onChange}
              trackColor={{
                false: themedColors.border.default,
                true: primaryColors.primary,
              }}
              thumbColor={isDark ? themedColors.surface.raised : '#FFFFFF'}
              ios_backgroundColor={themedColors.border.default}
            />
          </View>
        )
        
      case 'navigation':
      case 'action':
        return (
          <TouchableOpacity
            key={item.id}
            onPress={item.onPress}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
              paddingHorizontal: 20,
              borderBottomWidth: isLast ? 0 : 1,
              borderBottomColor: themedColors.border.light,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '500',
                  color: item.destructive ? colors.accent[600] : themedColors.text.primary,
                  marginBottom: item.description ? 4 : 0,
                }}
              >
                {item.label}
              </Text>
              {item.description && (
                <Text
                  style={{
                    fontSize: 14,
                    color: themedColors.text.secondary,
                  }}
                >
                  {item.description}
                </Text>
              )}
            </View>
            {item.type === 'navigation' && (
              <Feather
                name="chevron-right"
                size={20}
                color={themedColors.text.secondary}
              />
            )}
          </TouchableOpacity>
        )
    }
  }
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: themedColors.background.default }}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: themedColors.border.default,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: '700',
                color: themedColors.text.primary,
              }}
            >
              Settings
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: themedColors.surface.raised,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: themedColors.border.default,
              }}
            >
              <Feather name="x" size={20} color={themedColors.text.secondary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Theme Section - Special Treatment */}
            <View style={{ paddingTop: 24 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: themedColors.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  paddingHorizontal: 20,
                  marginBottom: 12,
                }}
              >
                Appearance
              </Text>
              <View
                style={{
                  backgroundColor: themedColors.surface.raised,
                  marginHorizontal: 20,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: themedColors.border.default,
                  overflow: 'hidden',
                }}
              >
                <View style={{ padding: 16 }}>
                  <ThemeSwitcher />
                </View>
              </View>
            </View>
            
            {/* Other Settings Sections */}
            {settingSections.slice(1).map((section, sectionIndex) => (
              <View key={section.title} style={{ paddingTop: 32 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                    marginBottom: 12,
                  }}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: isDark ? colors.primary[800] : colors.primary[100],
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Feather
                      name={section.icon as any}
                      size={16}
                      color={primaryColors.primary}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: themedColors.text.secondary,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                    }}
                  >
                    {section.title}
                  </Text>
                </View>
                
                <View
                  style={{
                    backgroundColor: themedColors.surface.raised,
                    marginHorizontal: 20,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: themedColors.border.default,
                    overflow: 'hidden',
                  }}
                >
                  {section.items.map((item, index) =>
                    renderSettingItem(item, index === section.items.length - 1)
                  )}
                </View>
              </View>
            ))}
            
            {/* App Info */}
            <View style={{ paddingTop: 48, paddingBottom: 32, alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: primaryColors.primary,
                  marginBottom: 4,
                }}
              >
                Proofr v1.0.0
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: themedColors.text.secondary,
                }}
              >
                Made with 💚 for students
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  )
}