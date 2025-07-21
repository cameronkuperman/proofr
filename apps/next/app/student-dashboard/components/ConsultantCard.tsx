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
  // Calculate min price
  const minPrice = consultant.services?.length 
    ? Math.min(...consultant.services.flatMap((s: any) => s.prices))
    : 0

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Get university color
  const getUniversityColor = (college: string) => {
    const colors: Record<string, string> = {
      'Stanford University': '#8C1515',
      'Harvard University': '#A51C30',
      'MIT': '#A31F34',
      'Yale University': '#00356B',
      'Princeton University': '#FF6600',
      'Columbia University': '#003DA5',
      'Cornell University': '#B31B1B',
      'Brown University': '#4E3629',
      'University of Pennsylvania': '#990000',
      'Northwestern University': '#4E2A84',
      'Dartmouth College': '#00693E',
      'Duke University': '#00356B',
      'Vanderbilt University': '#866D4B',
      'Rice University': '#002D72',
      'Emory University': '#012169'
    }
    return colors[college] || '#6B7280'
  }

  // Format response time
  const formatResponseTime = (hours?: number) => {
    if (!hours) return 'Usually responds quickly'
    if (hours < 1) return 'Responds in < 1 hour'
    if (hours < 24) return `Responds in ${Math.round(hours)}h`
    return `Responds in ${Math.round(hours / 24)}d`
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100 group cursor-pointer"
         onClick={() => onViewProfile()}>
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {consultant.profile_image_url ? (
              <img 
                src={consultant.profile_image_url}
                alt={consultant.name}
                className="w-14 h-14 rounded-lg object-cover"
              />
            ) : (
              <div 
                className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: getUniversityColor(consultant.current_college || consultant.school) }}
              >
                {getInitials(consultant.name)}
              </div>
            )}
            {consultant.verification_status === 'approved' && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <div className="bg-blue-500 rounded-full p-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-cyan-600 transition-colors">
                  {consultant.name}
                </h3>
                <p className="text-sm text-gray-600">{consultant.current_college || consultant.school}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleSave()
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 mt-1 text-sm">
              {consultant.rating && consultant.rating > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">★</span>
                  <span className="font-medium">{consultant.rating.toFixed(1)}</span>
                  <span className="text-gray-500">({consultant.total_reviews || 0})</span>
                </div>
              )}
              {consultant.is_available && (
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-green-600 text-xs">Online</span>
                </div>
              )}
              {consultant.response_time_hours && (
                <span className="text-gray-500 text-xs">
                  {formatResponseTime(consultant.response_time_hours)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-700 line-clamp-2 mb-4 text-center">
          {consultant.bio || 'Experienced consultant ready to help with your college applications.'}
        </p>

        {/* Services Tags */}
        {consultant.services && consultant.services.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {consultant.services.slice(0, 3).map((service: any, index: number) => (
              <span 
                key={service.id || index}
                className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
              >
                {service.title.split(' ').slice(0, 2).join(' ')}
              </span>
            ))}
            {consultant.services.length > 3 && (
              <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                +{consultant.services.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatResponseTime(consultant.response_time_hours)}</span>
          </div>
          {consultant.total_bookings && consultant.total_bookings > 0 && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>{consultant.total_bookings} students</span>
            </div>
          )}
        </div>
      </div>

      {/* Price and Actions */}
      <div className="px-6 pb-5">
        <div className="border-t pt-4">
          <div className="flex items-end justify-between mb-3">
            <span className="text-sm text-gray-600">Starting at</span>
            <span className="text-2xl font-bold text-gray-900">${minPrice || 0}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMessage()
              }}
              className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
            >
              Message
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onViewProfile()
              }}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm group"
            >
              <span className="group-hover:hidden">View Profile</span>
              <span className="hidden group-hover:inline">View Now →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}