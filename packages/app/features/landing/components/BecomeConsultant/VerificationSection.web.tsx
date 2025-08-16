export function VerificationSection() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          Get Verified, Earn More
        </h2>
        
        <p className="text-xl text-gray-600 mb-12">
          Verified consultants earn 73% more on average and get 2.5x more inquiries
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="font-bold text-lg mb-2">University Email</h3>
            <p className="text-gray-600">
              Use your .edu email to verify your enrollment
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="font-bold text-lg mb-2">Transcript</h3>
            <p className="text-gray-600">
              Upload your transcript to show your achievements
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-bold text-lg mb-2">Quick Review</h3>
            <p className="text-gray-600">
              Get verified within 24 hours
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}