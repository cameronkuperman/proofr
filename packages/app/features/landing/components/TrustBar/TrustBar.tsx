import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { styled } from 'nativewind'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledScrollView = styled(ScrollView)

interface TrustBarProps {
  variant?: 'web' | 'mobile'
}

export function TrustBar({ variant = 'web' }: TrustBarProps) {
  const isWeb = variant === 'web'
  
  const universities = [
    'Harvard', 'Stanford', 'MIT', 'Yale', 'Princeton', 
    'Columbia', 'Duke', 'UPenn', 'Brown', 'Cornell',
    'Northwestern', 'Georgetown', 'UCLA'
  ]

  const content = (
    <StyledView className={`
      ${isWeb ? 'flex flex-row justify-center items-center space-x-8' : 'flex flex-row space-x-6'}
    `}>
      {universities.map((university, index) => (
        <StyledView 
          key={university}
          className="flex flex-col items-center space-y-2"
        >
          {/* University Logo Placeholder */}
          <StyledView className={`
            w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full 
            flex items-center justify-center border border-slate-300
          `}>
            <StyledText className="text-slate-600 font-bold text-sm">
              {university.substring(0, 2).toUpperCase()}
            </StyledText>
          </StyledView>
          
          {/* University Name */}
          <StyledText className="text-xs text-slate-600 font-medium text-center">
            {university}
          </StyledText>
        </StyledView>
      ))}
    </StyledView>
  )

  return (
    <StyledView className="bg-white border-t border-b border-slate-200 py-8">
      <StyledView className={isWeb ? 'max-w-7xl mx-auto px-4' : 'px-4'}>
        <StyledText className="text-center text-sm text-slate-500 mb-6">
          Current students and recent graduates from top universities
        </StyledText>
        
        {isWeb ? (
          content
        ) : (
          <StyledScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {content}
          </StyledScrollView>
        )}
      </StyledView>
    </StyledView>
  )
}