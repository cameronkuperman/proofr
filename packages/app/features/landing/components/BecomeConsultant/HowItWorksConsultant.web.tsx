const steps = [
  {
    number: '1',
    title: 'Sign Up & Create Profile',
    description: 'Share your background, achievements, and what makes you unique. Upload your transcript for verification.'
  },
  {
    number: '2',
    title: 'Set Your Services & Rates',
    description: 'Choose what you offer - essay reviews, interview prep, test prep, etc. Set your own prices.'
  },
  {
    number: '3',
    title: 'Get Discovered',
    description: 'Students find you through search, AI matching, or browsing. Your profile works 24/7.'
  },
  {
    number: '4',
    title: 'Help Students Succeed',
    description: 'Connect with students, deliver great service, and build your reputation with reviews.'
  },
  {
    number: '5',
    title: 'Get Paid Instantly',
    description: 'We handle all payments securely. Get paid after each session with our 80/20 split.'
  }
]

export function HowItWorksConsultant() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {step.number}
                </span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}