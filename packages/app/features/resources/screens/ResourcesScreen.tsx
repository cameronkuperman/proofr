import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native'
import { useTheme, useThemedColors, usePrimaryColors } from '../../../contexts/ThemeContext'
import { colors } from '../../../constants/colors'

type RouteParams = {
  Resources: {
    selectedResource?: string
  }
}

interface Resource {
  title: string
  icon: string
  color: any
  description: string
  sections: {
    title: string
    content: string
  }[]
  estimatedTime: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
}

const resources: Resource[] = [
  {
    title: 'Complete Essay Guide',
    icon: 'book',
    color: colors.primary,
    description: 'Master the art of writing compelling college application essays',
    estimatedTime: '2-3 hours',
    difficulty: 'Beginner',
    sections: [
      {
        title: 'Understanding the Prompt',
        content: 'Learn how to decode essay prompts and understand what admissions officers are really looking for.'
      },
      {
        title: 'Brainstorming Your Story',
        content: 'Discover techniques to find your unique narrative and make your essay stand out.'
      },
      {
        title: 'Structure and Flow',
        content: 'Build a compelling essay structure that keeps readers engaged from start to finish.'
      },
      {
        title: 'Editing and Polishing',
        content: 'Master the revision process to make your essay shine.'
      }
    ]
  },
  {
    title: 'Interview Prep Checklist',
    icon: 'list',
    color: colors.purple,
    description: 'Prepare for college interviews with confidence',
    estimatedTime: '1-2 hours',
    difficulty: 'Intermediate',
    sections: [
      {
        title: 'Common Questions',
        content: 'Review the most frequently asked interview questions and how to approach them.'
      },
      {
        title: 'STAR Method',
        content: 'Learn the STAR technique for answering behavioral questions effectively.'
      },
      {
        title: 'Body Language',
        content: 'Master non-verbal communication to make a great impression.'
      },
      {
        title: 'Mock Interview Practice',
        content: 'Tips for practicing with friends, family, or consultants.'
      }
    ]
  },
  {
    title: 'Timeline Builder',
    icon: 'calendar',
    color: colors.teal,
    description: 'Create your personalized college application timeline',
    estimatedTime: '30-45 minutes',
    difficulty: 'Beginner',
    sections: [
      {
        title: 'Junior Year Planning',
        content: 'Key milestones and activities for your junior year.'
      },
      {
        title: 'Summer Before Senior Year',
        content: 'Make the most of your summer with strategic planning.'
      },
      {
        title: 'Senior Year Deadlines',
        content: 'Track all important dates and deadlines for applications.'
      },
      {
        title: 'Decision Timeline',
        content: 'Navigate the decision process from acceptance to enrollment.'
      }
    ]
  },
  {
    title: 'Financial Aid 101',
    icon: 'cash',
    color: colors.warning,
    description: 'Navigate the financial aid process with ease',
    estimatedTime: '1-2 hours',
    difficulty: 'Intermediate',
    sections: [
      {
        title: 'FAFSA Basics',
        content: 'Understanding the Free Application for Federal Student Aid.'
      },
      {
        title: 'CSS Profile',
        content: 'When and how to complete the CSS Profile for additional aid.'
      },
      {
        title: 'Scholarships Search',
        content: 'Strategies for finding and winning scholarships.'
      },
      {
        title: 'Understanding Aid Letters',
        content: 'How to compare and negotiate financial aid offers.'
      }
    ]
  },
  {
    title: 'SAT/ACT Strategy Guide',
    icon: 'school',
    color: colors.indigo,
    description: 'Maximize your standardized test scores',
    estimatedTime: '2-3 hours',
    difficulty: 'Advanced',
    sections: [
      {
        title: 'Test Selection',
        content: 'Choosing between SAT and ACT based on your strengths.'
      },
      {
        title: 'Study Planning',
        content: 'Create an effective study schedule and stick to it.'
      },
      {
        title: 'Test-Taking Strategies',
        content: 'Time management and question approach techniques.'
      },
      {
        title: 'Score Improvement',
        content: 'Analyzing practice tests and targeting weak areas.'
      }
    ]
  },
  {
    title: 'Extracurricular Excellence',
    icon: 'trophy',
    color: colors.pink,
    description: 'Build a standout extracurricular profile',
    estimatedTime: '1 hour',
    difficulty: 'Intermediate',
    sections: [
      {
        title: 'Quality over Quantity',
        content: 'How to choose and commit to meaningful activities.'
      },
      {
        title: 'Leadership Development',
        content: 'Ways to demonstrate leadership in your activities.'
      },
      {
        title: 'Community Impact',
        content: 'Creating projects that make a difference.'
      },
      {
        title: 'Activity Descriptions',
        content: 'Writing compelling descriptions for your application.'
      }
    ]
  }
]

export function ResourcesScreen() {
  const { isDark } = useTheme()
  const themedColors = useThemedColors()
  const primaryColors = usePrimaryColors()
  const navigation = useNavigation()
  const route = useRoute<RouteProp<RouteParams, 'Resources'>>()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (route.params?.selectedResource) {
      const resource = resources.find(r => r.title === route.params.selectedResource)
      if (resource) {
        setSelectedResource(resource)
      }
    }
  }, [route.params])

  const filteredResources = resources.filter(resource =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBack = () => {
    if (selectedResource) {
      setSelectedResource(null)
    } else {
      navigation.goBack()
    }
  }

  const difficultyColors = {
    'Beginner': colors.teal,
    'Intermediate': colors.warning,
    'Advanced': colors.accent
  }

  if (selectedResource) {
    return (
      <View style={{ flex: 1, backgroundColor: themedColors.background.default }}>
        <SafeAreaView style={{ flex: 1 }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: themedColors.border.default,
            backgroundColor: themedColors.surface.raised,
          }}>
            <TouchableOpacity onPress={handleBack} style={{ marginRight: 16 }}>
              <Ionicons name="arrow-left" size={24} color={themedColors.text.primary} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: themedColors.text.primary }} numberOfLines={1}>
                {selectedResource.title}
              </Text>
            </View>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Resource Header */}
            <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: themedColors.border.default }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: isDark ? selectedResource.color[800] : selectedResource.color[100],
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Ionicons name={selectedResource.icon as any} size={30} color={selectedResource.color[600]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 24, fontWeight: '700', color: themedColors.text.primary }}>
                    {selectedResource.title}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="time-outline" size={16} color={themedColors.text.secondary} />
                      <Text style={{ fontSize: 14, color: themedColors.text.secondary, marginLeft: 4 }}>
                        {selectedResource.estimatedTime}
                      </Text>
                    </View>
                    <View style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      backgroundColor: difficultyColors[selectedResource.difficulty] + '20',
                      borderRadius: 8,
                    }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: difficultyColors[selectedResource.difficulty] }}>
                        {selectedResource.difficulty}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              
              <Text style={{ fontSize: 16, color: themedColors.text.secondary, lineHeight: 22 }}>
                {selectedResource.description}
              </Text>
            </View>

            {/* Sections */}
            <View style={{ padding: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: themedColors.text.primary, marginBottom: 16 }}>
                What You'll Learn
              </Text>
              
              {selectedResource.sections.map((section, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: themedColors.surface.raised,
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12,
                    borderWidth: 1,
                    borderColor: themedColors.border.default,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: primaryColors.primary,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}>
                      <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600' }}>
                        {index + 1}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: themedColors.text.primary, marginBottom: 4 }}>
                        {section.title}
                      </Text>
                      <Text style={{ fontSize: 14, color: themedColors.text.secondary, lineHeight: 20 }}>
                        {section.content}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}

              {/* Action Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: primaryColors.primary,
                  paddingVertical: 16,
                  borderRadius: 12,
                  alignItems: 'center',
                  marginTop: 24,
                }}
              >
                <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '600' }}>
                  Start Learning
                </Text>
              </TouchableOpacity>

              {/* Related Consultants */}
              <View style={{
                marginTop: 32,
                padding: 16,
                backgroundColor: isDark ? colors.primary[900] : colors.primary[50],
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isDark ? colors.primary[700] : colors.primary[200],
              }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: primaryColors.primary, marginBottom: 4 }}>
                  Need personalized help?
                </Text>
                <Text style={{ fontSize: 14, color: isDark ? colors.primary[300] : colors.primary[700], marginBottom: 12 }}>
                  Connect with expert consultants for one-on-one guidance
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Browse' as any)}
                  style={{
                    backgroundColor: primaryColors.primary,
                    paddingVertical: 12,
                    borderRadius: 8,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '600' }}>
                    Find Consultants
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: themedColors.background.default }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{
          backgroundColor: themedColors.surface.raised,
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: themedColors.border.default,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <TouchableOpacity onPress={handleBack} style={{ marginRight: 16 }}>
              <Ionicons name="arrow-left" size={24} color={themedColors.text.primary} />
            </TouchableOpacity>
            <Text style={{
              fontSize: 24,
              fontWeight: '700',
              color: themedColors.text.primary,
              flex: 1,
            }}>
              Resources
            </Text>
          </View>

          {/* Search Bar */}
          <View style={{
            backgroundColor: isDark ? colors.gray[800] : colors.gray[100],
            borderRadius: 30,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: themedColors.border.light,
          }}>
            <Ionicons name="search" size={20} color={themedColors.text.secondary} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search resources..."
              placeholderTextColor={themedColors.text.tertiary}
              style={{
                flex: 1,
                marginLeft: 8,
                fontSize: 16,
                color: themedColors.text.primary,
              }}
            />
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 20 }}
        >
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 }}>
              <ActivityIndicator size="large" color={primaryColors.primary} />
            </View>
          ) : (
            filteredResources.map((resource, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedResource(resource)}
                style={{
                  backgroundColor: themedColors.surface.raised,
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: themedColors.border.default,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: isDark ? resource.color[800] : resource.color[100],
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 16,
                }}>
                  <Ionicons name={resource.icon as any} size={28} color={resource.color[600]} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: themedColors.text.primary,
                    marginBottom: 4,
                  }}>
                    {resource.title}
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: themedColors.text.secondary,
                    marginBottom: 8,
                  }} numberOfLines={2}>
                    {resource.description}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="time-outline" size={14} color={themedColors.text.tertiary} />
                      <Text style={{ fontSize: 12, color: themedColors.text.tertiary, marginLeft: 4 }}>
                        {resource.estimatedTime}
                      </Text>
                    </View>
                    <View style={{
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      backgroundColor: difficultyColors[resource.difficulty] + '20',
                      borderRadius: 6,
                    }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: difficultyColors[resource.difficulty] }}>
                        {resource.difficulty}
                      </Text>
                    </View>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={themedColors.text.secondary} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}