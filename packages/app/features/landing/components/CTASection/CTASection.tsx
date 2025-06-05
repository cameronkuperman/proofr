import React from 'react'
import { View, Text } from 'react-native'
import { TextLink } from 'solito/link'
import { styled } from 'nativewind'

const StyledView = styled(View)
const StyledText = styled(Text)

interface CTASectionProps {
  variant?: 'web' | 'mobile'
}

export function CTASection({ variant = 'web' }: CTASectionProps) {
  const isWeb = variant === 'web'
  
  return (
    <StyledView className="bg-gradient-to-br from-blue-600 to-purple-700 py-16">
      <StyledView className={isWeb ? 'max-w-4xl mx-auto px-4 text-center' : 'px-4 text-center'}>
        {/* Main Headline */}
        <StyledText className={`
          ${isWeb ? 'text-4xl lg:text-5xl' : 'text-3xl'} 
          font-bold text-white mb-6 leading-tight
        `}>
          Ready to Get Into Your Dream School?
        </StyledText>
        
        <StyledText className={`
          ${isWeb ? 'text-xl' : 'text-lg'} 
          text-blue-100 mb-8 leading-relaxed max-w-2xl mx-auto
        `}>
          Join thousands of students who've successfully navigated college admissions with personalized guidance from current students at top universities.
        </StyledText>

        {/* Value Props */}
        <StyledView className={`
          ${isWeb ? 'grid grid-cols-3 gap-8 mb-10' : 'space-y-4 mb-8'}
        `}>
          <StyledView className="text-center">
            <StyledText className="text-3xl mb-2">⚡</StyledText>
            <StyledText className="text-white font-semibold mb-1">
              Get Started Today
            </StyledText>
            <StyledText className="text-blue-200 text-sm">
              Browse consultants and book instantly
            </StyledText>
          </StyledView>
          
          <StyledView className="text-center">
            <StyledText className="text-3xl mb-2">💰</StyledText>
            <StyledText className="text-white font-semibold mb-1">
              Affordable Pricing
            </StyledText>
            <StyledText className="text-blue-200 text-sm">
              Starting at just $25 per session
            </StyledText>
          </StyledView>
          
          <StyledView className="text-center">
            <StyledText className="text-3xl mb-2">🎯</StyledText>
            <StyledText className="text-white font-semibold mb-1">
              Proven Results
            </StyledText>
            <StyledText className="text-blue-200 text-sm">
              94% acceptance rate to top schools
            </StyledText>
          </StyledView>
        </StyledView>

        {/* CTAs */}
        <StyledView className={`${isWeb ? 'flex flex-row justify-center space-x-4' : 'space-y-4'}`}>
          <TextLink href="/browse-consultants">
            <StyledView className={`
              bg-white px-8 py-4 rounded-xl shadow-lg
              ${isWeb ? 'hover:shadow-xl transform hover:scale-105' : ''} transition-all duration-200
            `}>
              <StyledText className="text-blue-600 font-bold text-lg text-center">
                Find Your Consultant
              </StyledText>
            </StyledView>
          </TextLink>
          
          <TextLink href="/become-consultant">
            <StyledView className={`
              border-2 border-white px-8 py-4 rounded-xl
              ${isWeb ? 'hover:bg-white hover:bg-opacity-10' : ''} transition-all duration-200
            `}>
              <StyledText className="text-white font-bold text-lg text-center">
                Become a Consultant
              </StyledText>
            </StyledView>
          </TextLink>
        </StyledView>

        {/* Trust Signal */}
        <StyledText className="text-blue-200 text-sm mt-8">
          🔒 Secure payments • 💬 24/7 support • ⭐ Money-back guarantee
        </StyledText>
      </StyledView>
    </StyledView>
  )
}