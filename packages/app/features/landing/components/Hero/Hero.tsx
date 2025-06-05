import React from 'react'
import { View, Text, Image } from 'react-native'
import { SolitoImage } from 'solito/image'
import { TextLink } from 'solito/link'
import { styled } from 'nativewind'

const StyledView = styled(View)
const StyledText = styled(Text)

interface HeroProps {
  variant?: 'web' | 'mobile'
}

export function Hero({ variant = 'web' }: HeroProps) {
  const isWeb = variant === 'web'
  
  return (
    <StyledView className={`
      ${isWeb ? 'min-h-screen flex flex-col justify-center' : 'h-screen flex flex-col justify-center'} 
      bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-12
    `}>
      <StyledView className={`
        ${isWeb ? 'max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center' : 'items-center text-center'}
      `}>
        {/* Content Column */}
        <StyledView className={`${isWeb ? 'space-y-8' : 'space-y-6 px-6'}`}>
          {/* Logo */}
          <StyledView className="flex flex-row items-center space-x-3">
            <Image 
              source={{ uri: '/images/proofr-logo.png' }}
              style={{ width: 40, height: 40 }}
              className="w-10 h-10"
            />
            <StyledText className="text-2xl font-bold text-slate-800">proofr</StyledText>
          </StyledView>

          {/* Main Headline */}
          <StyledView>
            <StyledText className={`
              ${isWeb ? 'text-5xl lg:text-6xl' : 'text-4xl'} 
              font-bold text-slate-900 leading-tight
            `}>
              Get Into Your 
              <StyledText className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                {' '}Dream School
              </StyledText>
            </StyledText>
            <StyledText className={`
              ${isWeb ? 'text-xl' : 'text-lg'} 
              text-slate-600 mt-4 leading-relaxed
            `}>
              Connect with current students at Harvard, Stanford, MIT & top universities. 
              Get personalized admissions guidance at affordable prices.
            </StyledText>
          </StyledView>

          {/* Value Props */}
          <StyledView className={`${isWeb ? 'flex flex-row space-x-8' : 'space-y-3'}`}>
            <StyledView className="flex flex-row items-center space-x-2">
              <StyledText className="text-2xl">📝</StyledText>
              <StyledText className="text-slate-700 font-medium">Essay Reviews</StyledText>
            </StyledView>
            <StyledView className="flex flex-row items-center space-x-2">
              <StyledText className="text-2xl">💬</StyledText>
              <StyledText className="text-slate-700 font-medium">Mock Interviews</StyledText>
            </StyledView>
            <StyledView className="flex flex-row items-center space-x-2">
              <StyledText className="text-2xl">🎯</StyledText>
              <StyledText className="text-slate-700 font-medium">Strategy Sessions</StyledText>
            </StyledView>
          </StyledView>

          {/* CTAs */}
          <StyledView className={`${isWeb ? 'flex flex-row space-x-4' : 'space-y-3'}`}>
            <TextLink href="/browse">
              <StyledView className={`
                bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 rounded-xl
                ${isWeb ? 'hover:shadow-xl transform hover:scale-105' : ''} transition-all duration-200
              `}>
                <StyledText className="text-white font-semibold text-lg text-center">
                  Find a Consultant
                </StyledText>
              </StyledView>
            </TextLink>
            
            <TextLink href="/become-consultant">
              <StyledView className={`
                border-2 border-slate-300 px-8 py-4 rounded-xl
                ${isWeb ? 'hover:border-slate-400 hover:bg-slate-50' : ''} transition-all duration-200
              `}>
                <StyledText className="text-slate-700 font-semibold text-lg text-center">
                  Become a Consultant
                </StyledText>
              </StyledView>
            </TextLink>
          </StyledView>

          {/* Trust Signal */}
          <StyledText className="text-sm text-slate-500">
            Trusted by 10,000+ students • Featured consultants from 50+ top universities
          </StyledText>
        </StyledView>

        {/* Visual Column - Web Only */}
        {isWeb && (
          <StyledView className="relative">
            <StyledView className="grid grid-cols-2 gap-4">
              {/* Sample Consultant Cards */}
              <StyledView className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <StyledView className="w-12 h-12 bg-red-100 rounded-full mb-4 flex items-center justify-center">
                  <StyledText className="text-red-600 font-bold">H</StyledText>
                </StyledView>
                <StyledText className="font-semibold text-slate-900">Sarah Chen</StyledText>
                <StyledText className="text-sm text-slate-600">Harvard '26</StyledText>
                <StyledText className="text-sm text-slate-600 mt-2">Essay Reviews</StyledText>
                <StyledText className="text-lg font-bold text-green-600 mt-2">$25</StyledText>
              </StyledView>

              <StyledView className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mt-8">
                <StyledView className="w-12 h-12 bg-blue-100 rounded-full mb-4 flex items-center justify-center">
                  <StyledText className="text-blue-600 font-bold">S</StyledText>
                </StyledView>
                <StyledText className="font-semibold text-slate-900">Marcus Kim</StyledText>
                <StyledText className="text-sm text-slate-600">Stanford '25</StyledText>
                <StyledText className="text-sm text-slate-600 mt-2">Mock Interviews</StyledText>
                <StyledText className="text-lg font-bold text-green-600 mt-2">$40</StyledText>
              </StyledView>

              <StyledView className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <StyledView className="w-12 h-12 bg-purple-100 rounded-full mb-4 flex items-center justify-center">
                  <StyledText className="text-purple-600 font-bold">M</StyledText>
                </StyledView>
                <StyledText className="font-semibold text-slate-900">Emily Rodriguez</StyledText>
                <StyledText className="text-sm text-slate-600">MIT '27</StyledText>
                <StyledText className="text-sm text-slate-600 mt-2">App Strategy</StyledText>
                <StyledText className="text-lg font-bold text-green-600 mt-2">$60</StyledText>
              </StyledView>

              <StyledView className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mt-8">
                <StyledView className="w-12 h-12 bg-green-100 rounded-full mb-4 flex items-center justify-center">
                  <StyledText className="text-green-600 font-bold">D</StyledText>
                </StyledView>
                <StyledText className="font-semibold text-slate-900">Alex Thompson</StyledText>
                <StyledText className="text-sm text-slate-600">Duke '26</StyledText>
                <StyledText className="text-sm text-slate-600 mt-2">All Services</StyledText>
                <StyledText className="text-lg font-bold text-green-600 mt-2">$35</StyledText>
              </StyledView>
            </StyledView>
          </StyledView>
        )}
      </StyledView>
    </StyledView>
  )
}