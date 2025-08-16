import { View } from '@my/ui'
import { NavigationBar } from '../components/NavigationBar/NavigationBar.web'
import { BecomeConsultantHero } from '../components/BecomeConsultant/BecomeConsultantHero'
import { BenefitsSection } from '../components/BecomeConsultant/BenefitsSection'
import { HowItWorksConsultant } from '../components/BecomeConsultant/HowItWorksConsultant'
import { EarningsCalculator } from '../components/BecomeConsultant/EarningsCalculator'
import { VerificationSection } from '../components/BecomeConsultant/VerificationSection'
import { SuccessStories } from '../components/BecomeConsultant/SuccessStories'
import { FAQSection } from '../components/BecomeConsultant/FAQSection'
import { CTABottom } from '../components/BecomeConsultant/CTABottom'

export function BecomeConsultantScreen() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <main>
        <BecomeConsultantHero />
        <BenefitsSection />
        <HowItWorksConsultant />
        <EarningsCalculator />
        <VerificationSection />
        <SuccessStories />
        <FAQSection />
        <CTABottom />
      </main>
    </div>
  )
}