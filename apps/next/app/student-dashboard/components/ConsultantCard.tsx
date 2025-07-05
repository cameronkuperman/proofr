'use client'

interface ConsultantCardProps {
  consultant: any
  isSaved: boolean
  onToggleSave: () => void
  onMessage: () => void
  onViewProfile: () => void
}

export default function ConsultantCard({ 
  consultant, 
  isSaved, 
  onToggleSave, 
  onMessage, 
  onViewProfile 
}: ConsultantCardProps) {
  // Calculate price range
  const allPrices = consultant.services?.flatMap((s: any) => s.prices) || []
  const minPrice = Math.min(...allPrices)
  const hasServices = consultant.services?.length > 0

  // Get verification badge color
  const getVerificationBadge = () => {
    if (consultant.verification_status === 'approved') {
      return (
        <div className="flex items-center space-x-1 text-blue-600">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-medium">Verified</span>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group">
      {/* Profile Section */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <img
              src={consultant.users.profile_image_url || '/api/placeholder/48/48'}
              alt={consultant.name}
              className="h-12 w-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors">
                {consultant.name}
              </h3>
              <p className="text-sm text-gray-600">{consultant.school}</p>
              {getVerificationBadge()}
            </div>
          </div>
          
          {/* Save Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleSave()
            }}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg 
              className={`h-5 w-5 ${isSaved ? 'fill-current text-red-500' : ''}`} 
              fill={isSaved ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {consultant.bio || 'Experienced consultant ready to help with your college applications.'}
        </p>

        {/* Stats */}
        <div className="flex items-center space-x-4 text-sm mb-4">
          {consultant.avg_rating > 0 && (
            <div className="flex items-center space-x-1">
              <svg className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">{consultant.avg_rating.toFixed(1)}</span>
              <span className="text-gray-500">({consultant.total_reviews || 0})</span>
            </div>
          )}
          
          {consultant.total_bookings > 0 && (
            <span className="text-gray-500">
              {consultant.total_bookings} students helped
            </span>
          )}

          {consultant.response_time_hours && (
            <span className="text-gray-500">
              Responds in {consultant.response_time_hours}h
            </span>
          )}
        </div>

        {/* Services Preview */}
        {hasServices && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {consultant.services.slice(0, 3).map((service: any, index: number) => (
                <span 
                  key={service.id} 
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                >
                  {service.title}
                </span>
              ))}
              {consultant.services.length > 3 && (
                <span className="px-3 py-1 text-gray-500 text-xs">
                  +{consultant.services.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Section */}
      <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            {hasServices ? (
              <>
                <p className="text-sm text-gray-500">Starting at</p>
                <p className="text-lg font-semibold text-gray-900">${minPrice}</p>
              </>
            ) : (
              <p className="text-sm text-gray-500">No services yet</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMessage()
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Message
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onViewProfile()
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}