import * as React from 'react'
import { View, ScrollView } from 'react-native'
import { styled } from 'nativewind'
import { Hero } from '../components/Hero'
import { TrustBar } from '../components/TrustBar'
import { TrustSignals } from '../components/TrustSignals'
import { HowItWorks } from '../components/HowItWorks'
import { ConsultantProfiles } from '../components/ConsultantProfiles'
import { Testimonials } from '../components/Testimonials'
import { CTASection } from '../components/CTASection'

const StyledView = styled(View)
const StyledScrollView = styled(ScrollView)

interface LandingScreenProps {
  variant?: 'web' | 'mobile'
}

export function LandingScreen({ variant = 'web' }: LandingScreenProps) {
  const isWeb = variant === 'web'
  
  const content = (
    <>
      <Hero variant={variant} />
      {isWeb ? <TrustSignals /> : <TrustBar variant={variant} />}
      <HowItWorks variant={variant} />
      <ConsultantProfiles variant={variant} />
      <Testimonials variant={variant} />
      <CTASection variant={variant} />
    </>
  )

  if (isWeb) {
    return (
      <StyledView className="min-h-screen bg-white">
        {content}
      </StyledView>
    )
  }

  return (
    <StyledScrollView 
      className="flex-1 bg-white"
      showsVerticalScrollIndicator={false}
    >
      {content}
    </StyledScrollView>
  )
}