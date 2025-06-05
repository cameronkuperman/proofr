import React from 'react'
import { View, Text, ScrollView } from 'react-native'
import { styled } from 'nativewind'

const StyledView = styled(View)
const StyledText = styled(Text) 
const StyledScrollView = styled(ScrollView)

interface TestimonialsProps {
  variant?: 'web' | 'mobile'
}

export function Testimonials({ variant = 'web' }: TestimonialsProps) {
  const isWeb = variant === 'web'
  
  const testimonials = [
    {
      name: 'Jessica Wang',
      school: 'Now at Yale University',
      quote: "Sarah's essay feedback was incredible. She helped me find my authentic voice and structure my personal statement perfectly. I got into 4 Ivy League schools!",
      consultant: 'Sarah Chen (Harvard)',
      service: 'Essay Review Package',
      rating: 5,
      avatar: 'JW',
      result: 'Accepted to Yale, Harvard, Princeton, Columbia'
    },
    {
      name: 'David Martinez',
      school: 'Now at Stanford University', 
      quote: "Marcus's mock interviews prepared me so well for my Stanford interview. His insider knowledge about what they're looking for was invaluable.",
      consultant: 'Marcus Kim (Stanford)',
      service: 'Mock Interview Prep',
      rating: 5,
      avatar: 'DM',
      result: 'Accepted to Stanford REA'
    },
    {
      name: 'Priya Patel',
      school: 'Now at MIT',
      quote: "Emily helped me showcase my research experience perfectly. Her guidance on the MIT essays was spot-on and authentic to the school culture.",
      consultant: 'Emily Rodriguez (MIT)',
      service: 'Application Strategy',
      rating: 5,
      avatar: 'PP', 
      result: 'Accepted to MIT, Caltech, Carnegie Mellon'
    },
    {
      name: 'Michael Chen',
      school: 'Now at Duke University',
      quote: "Alex's scholarship application guidance was amazing. Not only did I get into Duke, but I also received a full merit scholarship!",
      consultant: 'Alex Thompson (Duke)',
      service: 'Scholarship Applications',
      rating: 5,
      avatar: 'MC',
      result: 'Duke Merit Scholar - Full Tuition'
    }
  ]

  const TestimonialCard = ({ testimonial }) => (
    <StyledView className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 min-w-96">
      {/* Quote */}
      <StyledView className="mb-6">
        <StyledText className="text-3xl text-blue-500 mb-4">"</StyledText>
        <StyledText className="text-slate-700 text-lg leading-relaxed mb-4">
          {testimonial.quote}
        </StyledText>
      </StyledView>

      {/* Result Badge */}
      <StyledView className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
        <StyledText className="text-green-800 font-semibold text-sm">
          🎉 Result: {testimonial.result}
        </StyledText>
      </StyledView>

      {/* Student Info */}
      <StyledView className="flex flex-row items-center space-x-4 mb-4">
        <StyledView className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <StyledText className="font-bold text-blue-600">
            {testimonial.avatar}
          </StyledText>
        </StyledView>
        <StyledView className="flex-1">
          <StyledText className="font-semibold text-slate-900">
            {testimonial.name}
          </StyledText>
          <StyledText className="text-slate-600 text-sm">
            {testimonial.school}
          </StyledText>
        </StyledView>
        <StyledView className="flex flex-row">
          {[...Array(testimonial.rating)].map((_, i) => (
            <StyledText key={i} className="text-yellow-500 text-lg">⭐</StyledText>
          ))}
        </StyledView>
      </StyledView>

      {/* Service Info */}
      <StyledView className="border-t border-slate-200 pt-4">
        <StyledText className="text-sm text-slate-500 mb-1">
          Worked with: {testimonial.consultant}
        </StyledText>
        <StyledText className="text-sm font-medium text-blue-600">
          Service: {testimonial.service}
        </StyledText>
      </StyledView>
    </StyledView>
  )

  return (
    <StyledView className="bg-slate-50 py-16">
      <StyledView className={isWeb ? 'max-w-7xl mx-auto px-4' : 'px-4'}>
        {/* Header */}
        <StyledView className="text-center mb-12">
          <StyledText className={`
            ${isWeb ? 'text-4xl lg:text-5xl' : 'text-3xl'} 
            font-bold text-slate-900 mb-4
          `}>
            Success Stories
          </StyledText>
          <StyledText className={`
            ${isWeb ? 'text-xl max-w-3xl mx-auto' : 'text-lg'} 
            text-slate-600 leading-relaxed
          `}>
            Real students, real results. See how Proofr helped them get into their dream schools.
          </StyledText>
        </StyledView>

        {/* Testimonial Cards */}
        {isWeb ? (
          <StyledView className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} />
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
              {testimonials.map((testimonial) => (
                <TestimonialCard key={testimonial.name} testimonial={testimonial} />
              ))}
            </StyledView>
          </StyledScrollView>
        )}

        {/* Stats Section */}
        <StyledView className={`
          ${isWeb ? 'grid grid-cols-3 gap-8' : 'grid grid-cols-3 gap-4'} 
          mt-16 pt-12 border-t border-slate-300
        `}>
          <StyledView className="text-center">
            <StyledText className={`
              ${isWeb ? 'text-4xl lg:text-5xl' : 'text-3xl'} 
              font-bold text-blue-600 mb-2
            `}>
              94%
            </StyledText>
            <StyledText className={`
              ${isWeb ? 'text-lg' : 'text-sm'} 
              text-slate-600 font-medium
            `}>
              Acceptance Rate
            </StyledText>
          </StyledView>
          <StyledView className="text-center">
            <StyledText className={`
              ${isWeb ? 'text-4xl lg:text-5xl' : 'text-3xl'} 
              font-bold text-green-600 mb-2
            `}>
              10K+
            </StyledText>
            <StyledText className={`
              ${isWeb ? 'text-lg' : 'text-sm'} 
              text-slate-600 font-medium
            `}>
              Students Helped
            </StyledText>
          </StyledView>
          <StyledView className="text-center">
            <StyledText className={`
              ${isWeb ? 'text-4xl lg:text-5xl' : 'text-3xl'} 
              font-bold text-purple-600 mb-2
            `}>
              4.9
            </StyledText>
            <StyledText className={`
              ${isWeb ? 'text-lg' : 'text-sm'} 
              text-slate-600 font-medium
            `}>
              Average Rating
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledView>
  )
}