import { useRouter } from 'next/navigation'

export function CTABottom() {
  const { push } = useRouter()

  const handleGetStarted = () => {
    push('/sign-up?userType=consultant')
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Ready to Start Earning?
        </h2>
        
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join hundreds of consultants helping students achieve their dreams
        </p>

        <button
          onClick={handleGetStarted}
          className="px-10 py-4 bg-white text-primary font-bold text-lg rounded-lg hover:bg-gray-100 transition-colors"
        >
          Become a Consultant
        </button>
      </div>
    </section>
  )
}