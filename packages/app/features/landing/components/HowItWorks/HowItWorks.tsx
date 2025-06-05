import React from 'react'
import { View, Text } from 'react-native'
import { styled } from 'nativewind'

const StyledView = styled(View)
const StyledText = styled(Text)

interface HowItWorksProps {
  variant?: 'web' | 'mobile'
}

export function HowItWorks({ variant = 'web' }: HowItWorksProps) {
  const isWeb = variant === 'web'
  
  const steps = [
    {
      number: '1',
      title: 'Browse Consultants',
      description: 'Search by university, service type, rating, and price. View detailed profiles of current students.',
      icon: '🔍',
      color: 'blue'
    },
    {
      number: '2', 
      title: 'Book & Pay Securely',
      description: 'Choose your service, schedule a time, and pay securely through our platform.',
      icon: '📅',
      color: 'green'
    },
    {
      number: '3',
      title: 'Get Expert Guidance',
      description: 'Receive personalized feedback, advice, and support from someone who got into your dream school.',
      icon: '✨',
      color: 'purple'
    }
  ]

  const colorClasses = {
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-100', 
      text: 'text-green-600',
      border: 'border-green-200'
    },
    purple: {
      bg: 'bg-purple-100',
      text: 'text-purple-600', 
      border: 'border-purple-200'
    }
  }

  return (
    <StyledView className="bg-slate-50 py-16">
      <StyledView className={isWeb ? 'max-w-7xl mx-auto px-4' : 'px-4'}>
        {/* Header */}
        <StyledView className="text-center mb-12">
          <StyledText className={`
            ${isWeb ? 'text-4xl lg:text-5xl' : 'text-3xl'} 
            font-bold text-slate-900 mb-4
          `}>
            How Proofr Works
          </StyledText>
          <StyledText className={`
            ${isWeb ? 'text-xl max-w-3xl mx-auto' : 'text-lg'} 
            text-slate-600 leading-relaxed
          `}>
            Get personalized college admissions help from students who've been through the process at your target schools
          </StyledText>
        </StyledView>

        {/* Steps */}
        <StyledView className={`
          ${isWeb ? 'grid grid-cols-1 md:grid-cols-3 gap-8' : 'space-y-8'}
        `}>
          {steps.map((step, index) => (
            <StyledView key={step.number} className="relative">
              {/* Connection Line (Web only) */}
              {isWeb && index < steps.length - 1 && (
                <StyledView className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-slate-300 transform translate-x-4 -translate-y-1/2" />
              )}
              
              <StyledView className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 relative z-10">
                {/* Step Number */}
                <StyledView className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-6
                  ${colorClasses[step.color].bg} ${colorClasses[step.color].border} border-2
                `}>
                  <StyledText className={`font-bold text-lg ${colorClasses[step.color].text}`}>
                    {step.number}
                  </StyledText>
                </StyledView>

                {/* Icon */}
                <StyledText className="text-3xl mb-4">{step.icon}</StyledText>

                {/* Content */}
                <StyledText className="text-xl font-semibold text-slate-900 mb-3">
                  {step.title}
                </StyledText>
                <StyledText className="text-slate-600 leading-relaxed">
                  {step.description}
                </StyledText>
              </StyledView>
            </StyledView>
          ))}
        </StyledView>

        {/* Bottom CTA */}
        <StyledView className="text-center mt-12">
          <StyledText className="text-slate-600 mb-6">
            Ready to get started?
          </StyledText>
          <StyledView className={`${isWeb ? 'flex flex-row justify-center space-x-4' : 'space-y-3'}`}>
            <StyledView className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3 rounded-xl">
              <StyledText className="text-white font-semibold text-center">
                Browse Consultants
              </StyledText>
            </StyledView>
            <StyledView className="border-2 border-slate-300 px-8 py-3 rounded-xl">
              <StyledText className="text-slate-700 font-semibold text-center">
                Learn More
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledView>
  )
}