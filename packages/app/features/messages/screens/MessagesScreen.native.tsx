import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { useThemedColors } from '../../../contexts/ThemeContext'

interface Message {
  id: string
  user: {
    name: string
    avatar: string
    isVerified?: boolean
  }
  lastMessage: string
  timestamp: string
  unreadCount: number
  isStarred: boolean
}

const mockMessages: Message[] = [
  {
    id: '1',
    user: {
      name: 'stormydaniels',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      isVerified: true,
    },
    lastMessage: 'The first message: Hi. My friend sent me your profile...',
    timestamp: 'Now',
    unreadCount: 1,
    isStarred: true,
  },
  {
    id: '2',
    user: {
      name: 'philippe_cousteau',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    },
    lastMessage: 'OK, thanks. I\'ll send you my availability...',
    timestamp: '5h ago',
    unreadCount: 18,
    isStarred: true,
  },
  {
    id: '3',
    user: {
      name: 'iffi_design',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
    lastMessage: 'Haha, yeah, I will.',
    timestamp: '1d ago',
    unreadCount: 0,
    isStarred: false,
  },
  {
    id: '4',
    user: {
      name: 'monica_clark +5',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    },
    lastMessage: 'I\'ve already sent it. Check again.',
    timestamp: 'Jan 3',
    unreadCount: 0,
    isStarred: false,
  },
  {
    id: '5',
    user: {
      name: 'morgan_prs',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    lastMessage: 'Bonjour, je cherche un illustrateur...',
    timestamp: 'Jan 1',
    unreadCount: 0,
    isStarred: true,
  },
  {
    id: '6',
    user: {
      name: 'dpolevoy',
      avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150',
    },
    lastMessage: 'Greetings from Tel Aviv!',
    timestamp: 'Dec 31',
    unreadCount: 0,
    isStarred: true,
  },
]

export function MessagesScreen() {
  const navigation = useNavigation()
  const colors = useThemedColors()
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [searchQuery, setSearchQuery] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [refreshing, setRefreshing] = useState(false)

  useFocusEffect(
    useCallback(() => {
      // Reset edit mode when screen loses focus
      return () => {
        setIsEditMode(false)
        setSelectedMessages([])
      }
    }, [])
  )

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 2000)
  }, [])

  const formatTimestamp = (timestamp: string) => {
    return timestamp
  }

  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessages((prev) =>
      prev.includes(messageId)
        ? prev.filter((id) => id !== messageId)
        : [...prev, messageId]
    )
  }

  const handleArchive = () => {
    setMessages((prev) => prev.filter((msg) => !selectedMessages.includes(msg.id)))
    setIsEditMode(false)
    setSelectedMessages([])
  }

  const handleMarkAsRead = () => {
    setMessages((prev) =>
      prev.map((msg) =>
        selectedMessages.includes(msg.id) ? { ...msg, unreadCount: 0 } : msg
      )
    )
    setIsEditMode(false)
    setSelectedMessages([])
  }

  const handleDelete = () => {
    setMessages((prev) => prev.filter((msg) => !selectedMessages.includes(msg.id)))
    setIsEditMode(false)
    setSelectedMessages([])
  }

  const filteredMessages = messages.filter((msg) =>
    msg.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderMessage = ({ item }: { item: Message }) => (
    <TouchableOpacity
      onPress={() => {
        if (isEditMode) {
          toggleMessageSelection(item.id)
        } else {
          // Navigate to chat screen
          navigation.navigate('chat', { 
            userId: item.id,
            userName: item.user.name,
            userAvatar: item.user.avatar,
            isVerified: item.user.isVerified
          })
        }
      }}
      style={{
        flexDirection: 'row',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.background,
      }}
    >
      {isEditMode && (
        <TouchableOpacity
          onPress={() => toggleMessageSelection(item.id)}
          style={{ marginRight: 12, justifyContent: 'center' }}
        >
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: selectedMessages.includes(item.id) ? colors.primary : colors.text.tertiary,
              backgroundColor: selectedMessages.includes(item.id) ? colors.primary : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {selectedMessages.includes(item.id) && (
              <Ionicons name="checkmark" size={16} color={colors.surface} />
            )}
          </View>
        </TouchableOpacity>
      )}

      <View style={{ position: 'relative', marginRight: 12 }}>
        <Image
          source={{ uri: item.user.avatar }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colors.border,
          }}
        />
        {item.unreadCount > 0 && (
          <View
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 20,
              height: 20,
              borderRadius: 10,
              backgroundColor: colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: colors.surface, fontSize: 12, fontWeight: '600' }}>
              {item.unreadCount}
            </Text>
          </View>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text.primary }}>
            {item.user.name}
          </Text>
          {item.user.isVerified && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color="#0055FE"
              style={{ marginLeft: 4 }}
            />
          )}
        </View>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 14,
            color: colors.text.secondary,
            marginRight: 8,
          }}
        >
          {item.lastMessage}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        {item.isStarred && (
          <Ionicons name="star" size={16} color="#FFB800" style={{ marginBottom: 4 }} />
        )}
        <Text style={{ fontSize: 12, color: colors.text.tertiary }}>
          {formatTimestamp(item.timestamp)}
        </Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          {isEditMode ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  setIsEditMode(false)
                  setSelectedMessages([])
                }}
              >
                <Text style={{ color: colors.primary, fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text.primary }}>
                {selectedMessages.length} Selected
              </Text>
              <TouchableOpacity onPress={() => setIsEditMode(false)}>
                <Ionicons name="ellipsis-horizontal" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity onPress={() => setIsEditMode(true)}>
                <Text style={{ color: colors.primary, fontSize: 16 }}>Edit</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text.primary }}>Inbox</Text>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={24} color={colors.text.secondary} />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Search Bar */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: colors.isDark ? colors.surface : '#F0E8E0',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          >
            <Ionicons name="search" size={20} color={colors.text.tertiary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Find Chat or User"
              placeholderTextColor={colors.text.tertiary}
              style={{
                flex: 1,
                marginLeft: 8,
                fontSize: 16,
                color: colors.text.primary,
              }}
            />
          </View>
        </View>

        {/* Messages List */}
        <FlatList
          data={filteredMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: colors.text.secondary, fontSize: 16 }}>No messages yet</Text>
            </View>
          }
        />

        {/* Bottom Action Bar for Edit Mode */}
        {isEditMode && selectedMessages.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              paddingVertical: 16,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              backgroundColor: colors.background,
            }}
          >
            <TouchableOpacity onPress={handleArchive} style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '500' }}>Archive</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleMarkAsRead} style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '500' }}>Read</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.error || '#FF5A5F', fontSize: 16, fontWeight: '500' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}