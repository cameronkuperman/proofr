import { useState } from 'react'

const faqs = [
  {
    question: "How much can I charge?",
    answer: "You set your own rates! Our consultants charge anywhere from free (to build portfolio) to $500+ per hour for specialized services."
  },
  {
    question: "What's the time commitment?",
    answer: "Completely flexible. Work as little as 1 hour per week or as much as full-time. You control your schedule."
  },
  {
    question: "How do I get paid?",
    answer: "We handle all payments securely. You get paid instantly after each session. We take a 20% platform fee."
  },
  {
    question: "Do I need to be a current student?",
    answer: "No! We welcome current students, recent grads, and alumni. Verification just requires proof of attendance."
  },
  {
    question: "What services can I offer?",
    answer: "Essay reviews, interview prep, test tutoring, application strategy, school selection help, and more. You choose!"
  }
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <button
              key={index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full text-left bg-white p-6 rounded-xl border border-gray-200 transition-colors"
              style={{
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#e5e7eb',
                transition: 'border-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0055FE'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb'
              }}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <span className="text-2xl text-gray-400">
                  {openIndex === index ? '−' : '+'}
                </span>
              </div>
              
              {openIndex === index && (
                <p className="mt-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}