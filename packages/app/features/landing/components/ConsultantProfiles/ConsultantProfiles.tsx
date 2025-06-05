import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { styled } from 'nativewind'

const StyledView = styled(View)
const StyledText = styled(Text)
const StyledScrollView = styled(ScrollView)

interface ConsultantProfilesProps {
  variant?: 'web' | 'mobile'
}

export function ConsultantProfiles({ variant = 'web' }: ConsultantProfilesProps) {
  const isWeb = variant === 'web'
  
  const consultants = [
    {
      name: 'Sarah Chen',
      university: 'Harvard University',
      year: "'26",
      major: 'Economics',
      services: ['Essay Reviews', 'Application Strategy'],
      rating: 4.9,
      reviews: 47,
      price: 25,
      avatar: 'SC',
      color: 'red',
      stats: '1580 SAT • 4.0 GPA',
      bio: 'Helped 40+ students get into Ivy League schools. Specialized in economics and business applications.'
    },
    {
      name: 'Marcus Kim',
      university: 'Stanford University', 
      year: "'25",
      major: 'Computer Science',
      services: ['Mock Interviews', 'Resume Review'],
      rating: 4.8,
      reviews: 32,
      price: 40,
      avatar: 'MK',
      color: 'red',
      stats: '1560 SAT • 4.0 GPA',
      bio: 'Former Google intern. Expert in tech industry applications and STEM essays.'
    },
    {
      name: 'Emily Rodriguez',
      university: 'MIT',
      year: "'27",
      major: 'Bioengineering',
      services: ['STEM Essays', 'Research Guidance'],
      rating: 5.0,
      reviews: 28,
      price: 35,
      avatar: 'ER',
      color: 'red',
      stats: '1590 SAT • Research Published',
      bio: 'Research experience at MIT Lincoln Lab. Specializes in engineering and research applications.'
    },
    {
      name: 'Alex Thompson', 
      university: 'Duke University',
      year: "'26",
      major: 'Public Policy',
      services: ['All Services', 'Scholarship Apps'],
      rating: 4.9,
      reviews: 55,
      price: 30,
      avatar: 'AT',
      color: 'blue',
      stats: 'Full Scholarship • Student Gov',
      bio: 'Student body president. Expert in leadership essays and scholarship applications.'
    }
  ]

  const colorClasses = {
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600'
  }

  const ConsultantCard = ({ consultant }) => (
    <StyledView className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 min-w-80">
      {/* Header */}
      <StyledView className="flex flex-row items-center space-x-4 mb-4">
        <StyledView className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClasses[consultant.color]}`}>
          <StyledText className="font-bold text-lg">
            {consultant.avatar}
          </StyledText>
        </StyledView>
        <StyledView className="flex-1">
          <StyledText className="text-lg font-semibold text-slate-900">
            {consultant.name}
          </StyledText>
          <StyledText className="text-slate-600">
            {consultant.university} {consultant.year}
          </StyledText>
          <StyledText className="text-sm text-slate-500">
            {consultant.major}
          </StyledText>
        </StyledView>
        <StyledView className="items-end">
          <StyledView className="flex flex-row items-center space-x-1">
            <StyledText className="text-yellow-500">⭐</StyledText>
            <StyledText className="font-semibold text-slate-900">
              {consultant.rating}
            </StyledText>
          </StyledView>
          <StyledText className="text-xs text-slate-500">
            ({consultant.reviews} reviews)
          </StyledText>
        </StyledView>
      </StyledView>

      {/* Stats */}
      <StyledView className="bg-slate-50 rounded-lg p-3 mb-4">
        <StyledText className="text-sm font-medium text-slate-700">
          {consultant.stats}
        </StyledText>
      </StyledView>

      {/* Bio */}
      <StyledText className="text-sm text-slate-600 mb-4 leading-relaxed">
        {consultant.bio}
      </StyledText>

      {/* Services */}
      <StyledView className="mb-4">
        <StyledText className="text-sm font-medium text-slate-700 mb-2">
          Specializes in:
        </StyledText>
        <StyledView className="flex flex-row flex-wrap gap-2">
          {consultant.services.map((service) => (
            <StyledView 
              key={service}
              className="bg-blue-100 px-3 py-1 rounded-full"
            >
              <StyledText className="text-xs text-blue-700 font-medium">
                {service}
              </StyledText>
            </StyledView>
          ))}
        </StyledView>
      </StyledView>

      {/* Price & CTA */}
      <StyledView className="flex flex-row items-center justify-between pt-4 border-t border-slate-200">
        <StyledView>
          <StyledText className="text-sm text-slate-500">Starting at</StyledText>
          <StyledText className="text-2xl font-bold text-green-600">
            ${consultant.price}
          </StyledText>
        </StyledView>
        <StyledView className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 rounded-xl">
          <StyledText className="text-white font-semibold">
            View Profile
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  )

  return (
    <StyledView className="bg-white py-16">
      <StyledView className={isWeb ? 'max-w-7xl mx-auto px-4' : 'px-4'}>
        {/* Header */}
        <StyledView className="text-center mb-12">
          <StyledText className={`
            ${isWeb ? 'text-4xl lg:text-5xl' : 'text-3xl'} 
            font-bold text-slate-900 mb-4
          `}>
            Featured Consultants
          </StyledText>
          <StyledText className={`
            ${isWeb ? 'text-xl max-w-3xl mx-auto' : 'text-lg'} 
            text-slate-600 leading-relaxed
          `}>
            Get personalized guidance from verified students at top universities
          </StyledText>
        </StyledView>

        {/* Consultant Cards */}
        {isWeb ? (
          <StyledView className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {consultants.map((consultant) => (
              <ConsultantCard key={consultant.name} consultant={consultant} />
            ))}
          </StyledView>
        ) : (
          <StyledScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="flex-1"
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            <StyledView className="flex flex-row space-x-6">
              {consultants.map((consultant) => (
                <ConsultantCard key={consultant.name} consultant={consultant} />
              ))}
            </StyledView>
          </StyledScrollView>
        )}

        {/* Bottom CTA */}
        <StyledView className="text-center mt-12">
          <StyledView className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-4 rounded-xl inline-block">
            <StyledText className="text-white font-semibold text-lg">
              View All Consultants
            </StyledText>
          </StyledView>
          <StyledText className="text-slate-500 mt-4">
            Over 500+ verified consultants from top universities
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  )
}