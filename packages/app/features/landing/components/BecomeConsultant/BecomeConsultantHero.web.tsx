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
          <span style={{ background: '#0055FE', color: 'white', padding: '0.2em 0.4em', borderRadius: '8px', display: 'inline-block', marginBottom: '0.2em' }}>
            Earn Money
          </span>
          {' '}Helping Students
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
            style={{ 
              background: '#0055FE', 
              color: 'white',
              padding: '16px 32px',
              fontWeight: '600',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0040BE'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#0055FE'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            Start Earning Today
          </button>
          <button
            onClick={scrollToCalculator}
            style={{ 
              background: 'transparent',
              color: '#0055FE',
              border: '2px solid #0055FE',
              padding: '14px 32px',
              fontWeight: '600',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#0055FE'
              e.currentTarget.style.color = 'white'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#0055FE'
            }}
          >
            Calculate Earnings
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-4xl font-bold mb-2" style={{ color: '#0055FE' }}>$120+</div>
            <p className="text-gray-600">Avg hourly rate</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2" style={{ color: '#0055FE' }}>500+</div>
            <p className="text-gray-600">Active consultants</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2" style={{ color: '#0055FE' }}>95%</div>
            <p className="text-gray-600">5-star reviews</p>
          </div>
        </div>
      </div>
    </section>
  )
}