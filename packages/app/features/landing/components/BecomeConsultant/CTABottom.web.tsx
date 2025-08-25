import { useRouter } from 'next/navigation'

export function CTABottom() {
  const { push } = useRouter()

  const handleGetStarted = () => {
    push('/sign-up?userType=consultant')
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: '#0055FE' }}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Ready to Start Earning?
        </h2>
        
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join hundreds of consultants helping students achieve their dreams
        </p>

        <button
          onClick={handleGetStarted}
          style={{
            background: 'white',
            color: '#0055FE',
            padding: '16px 40px',
            fontWeight: 'bold',
            fontSize: '18px',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f3f4f6'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          Become a Consultant
        </button>
      </div>
    </section>
  )
}