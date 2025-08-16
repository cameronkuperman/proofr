const stories = [
  {
    name: 'Sarah Chen',
    school: 'Harvard',
    earnings: '$15,000',
    quote: "I love helping students while earning money. Best side hustle ever!"
  },
  {
    name: 'Michael Rodriguez',
    school: 'Stanford',
    earnings: '$22,000',
    quote: "The flexibility lets me balance consulting with my PhD research."
  },
  {
    name: 'Priya Patel',
    school: 'MIT',
    earnings: '$18,500',
    quote: "Making a real impact on students' lives is incredibly rewarding."
  }
]

export function SuccessStories() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
          Success Stories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <p className="text-lg italic text-gray-600 mb-6">
                "{story.quote}"
              </p>
              <div className="border-t pt-4">
                <p className="font-bold text-gray-900">{story.name}</p>
                <p className="text-gray-600">{story.school}</p>
                <p className="text-primary font-bold mt-2">
                  Earned {story.earnings} last year
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}