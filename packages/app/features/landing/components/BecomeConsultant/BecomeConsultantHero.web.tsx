import { useRouter } from 'next/navigation'

export function BecomeConsultantHero() {
  const { push } = useRouter()

  const handleGetStarted = () => {
    push('/sign-up?userType=consultant')
  }

  const scrollToCalculator = () => {
    document.getElementById('earnings-calculator')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Earn Money Helping Students
          <br />
          Get Into Their Dream Schools
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Join elite consultants from Harvard, Stanford, MIT and more. 
          Set your own rates, work on your schedule, and make a real impact.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Start Earning Today
          </button>
          <button
            onClick={scrollToCalculator}
            className="px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            Calculate Earnings
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">$120+</div>
            <p className="text-gray-600">Avg hourly rate</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <p className="text-gray-600">Active consultants</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">95%</div>
            <p className="text-gray-600">5-star reviews</p>
          </div>
        </div>
      </div>
    </section>
  )
}