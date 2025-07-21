import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import type { University } from '../types/consultant.types'

interface ConsultantBioProps {
  bio: string
  achievements?: University[]
}

export function ConsultantBio({ bio, achievements }: ConsultantBioProps) {
  const [expanded, setExpanded] = useState(false)
  const shouldTruncate = bio.length > 200

  const displayBio = expanded ? bio : bio.slice(0, 200) + (shouldTruncate ? '...' : '')

  return (
    <View className="bg-white dark:bg-gray-900 p-6 border-b border-gray-200 dark:border-gray-800">
      <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        About Me
      </Text>

      <Text className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {displayBio}
      </Text>

      {shouldTruncate && (
        <Pressable 
          onPress={() => setExpanded(!expanded)}
          className="mt-2"
        >
          <Text className="text-blue-600 dark:text-blue-400 font-medium">
            {expanded ? 'Show less' : 'Read more'}
          </Text>
        </Pressable>
      )}

      {/* Achievements/Education */}
      {achievements && achievements.length > 0 && (
        <View className="mt-6">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Education
          </Text>
          {achievements.map((edu, index) => (
            <View key={index} className="flex-row items-start mb-3">
              <View className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg mr-3">
                <Ionicons name="school" size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-900 dark:text-white">
                  {edu.name}
                </Text>
                <Text className="text-gray-600 dark:text-gray-400 text-sm">
                  {edu.degree} • {edu.years}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Highlights */}
      <View className="mt-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Highlights
        </Text>
        <View className="flex-row flex-wrap -mx-1">
          {getHighlights(bio).map((highlight, index) => (
            <View 
              key={index}
              className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg m-1"
            >
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                {highlight}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

function getHighlights(bio: string): string[] {
  const highlights: string[] = []
  
  // Extract GPA if mentioned
  const gpaMatch = bio.match(/(\d\.\d+)\s*GPA/i)
  if (gpaMatch) highlights.push(`${gpaMatch[1]} GPA`)
  
  // Extract test scores
  const satMatch = bio.match(/(\d{3,4})\s*SAT/i)
  if (satMatch) highlights.push(`${satMatch[1]} SAT`)
  
  const actMatch = bio.match(/(\d{2})\s*ACT/i)
  if (actMatch) highlights.push(`${actMatch[1]} ACT`)
  
  // Extract internships/companies
  const companies = ['Google', 'Microsoft', 'Apple', 'Meta', 'Amazon', 'Goldman', 'McKinsey', 'BCG', 'Bain']
  companies.forEach(company => {
    if (bio.toLowerCase().includes(company.toLowerCase())) {
      highlights.push(`${company} Experience`)
    }
  })
  
  // Extract other achievements
  if (bio.toLowerCase().includes('published')) highlights.push('Published Research')
  if (bio.toLowerCase().includes('first gen')) highlights.push('First-Gen Student')
  if (bio.toLowerCase().includes('scholar')) highlights.push('Scholar')
  if (bio.toLowerCase().includes('president') || bio.toLowerCase().includes('founder')) highlights.push('Leadership')
  
  return highlights.slice(0, 6) // Limit to 6 highlights
}