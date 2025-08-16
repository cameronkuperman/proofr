const benefits = [
  {
    title: 'Set Your Own Rates',
    description: 'You decide what to charge. Whether free for portfolio building or premium for expertise.',
    icon: '💰'
  },
  {
    title: 'Flexible Schedule',
    description: 'Work when you want, where you want. Perfect for students and professionals.',
    icon: '📅'
  },
  {
    title: 'Build Your Brand',
    description: 'Create your profile, showcase your achievements, and grow your reputation.',
    icon: '⭐'
  },
  {
    title: 'Make Real Impact',
    description: 'Help students achieve their dreams and change their lives forever.',
    icon: '🎯'
  },
  {
    title: 'Verified Badge',
    description: 'Get verified with your .edu email for 73% more earnings and credibility.',
    icon: '✅'
  },
  {
    title: 'Full Support',
    description: 'We handle payments, scheduling, and provide resources to help you succeed.',
    icon: '🤝'
  }
]

export function BenefitsSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          Why Consultants Love Proofr
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}