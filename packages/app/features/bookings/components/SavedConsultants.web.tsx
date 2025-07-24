import React from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark, Clock, Star, DollarSign, ChevronRight, Bell, BellOff, TrendingDown, TrendingUp } from 'lucide-react'
import type { SavedConsultant, ConsultantWaitlist } from '../types/bookings.types'

interface SavedConsultantsWebProps {
  savedConsultants: SavedConsultant[]
  waitlists: ConsultantWaitlist[]
  onToggleSave: (consultantId: string) => Promise<{ success: boolean; error?: string }>
  onJoinWaitlist: (consultantId: string, serviceId?: string) => Promise<{ success: boolean; error?: string }>
  onLeaveWaitlist: (waitlistId: string) => Promise<{ success: boolean; error?: string }>
}

// University colors
const UNIVERSITY_COLORS = {
  harvard: '#A51C30',
  yale: '#00356B',
  princeton: '#FF6900',
  stanford: '#8C1515',
  mit: '#A31F34',
}

export function SavedConsultantsWeb({
  savedConsultants,
  waitlists,
  onToggleSave,
  onJoinWaitlist,
  onLeaveWaitlist,
}: SavedConsultantsWebProps) {
  const router = useRouter()

  const handleToggleSave = async (consultantId: string) => {
    const result = await onToggleSave(consultantId)
    if (!result.success) {
      alert(result.error || 'Failed to update saved status')
    }
  }

  const handleLeaveWaitlist = async (waitlistId: string) => {
    if (confirm('Are you sure you want to leave this waitlist?')) {
      const result = await onLeaveWaitlist(waitlistId)
      if (!result.success) {
        alert(result.error || 'Failed to leave waitlist')
      }
    }
  }

  const checkPriceChange = (consultant: SavedConsultant['consultant']) => {
    // Mock price change detection - in real app, compare with saved price
    const randomChange = Math.random()
    if (randomChange < 0.2) return { changed: true, direction: 'down', percentage: -10 }
    if (randomChange < 0.3) return { changed: true, direction: 'up', percentage: 5 }
    return { changed: false }
  }

  const renderSavedConsultantCard = (saved: SavedConsultant) => {
    const priceChange = checkPriceChange(saved.consultant)
    const hasNewServices = Math.random() < 0.3 // Mock new services

    return (
      <div
        key={saved.id}
        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => router.push(`/consultants/${saved.consultant.id}`)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <img
              src={saved.consultant.avatar_url || `https://ui-avatars.com/api/?name=${saved.consultant.name}&background=6366F1&color=fff&size=200`}
              alt={saved.consultant.name}
              className="w-16 h-16 rounded-full"
            />
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {saved.consultant.name}
                </h3>
                {saved.consultant.university && (
                  <span
                    className="px-2 py-1 text-xs font-semibold text-white rounded"
                    style={{ backgroundColor: UNIVERSITY_COLORS[saved.consultant.university.toLowerCase()] || '#6B7280' }}
                  >
                    {saved.consultant.university}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-4 mt-2">
                {saved.consultant.rating && (
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{saved.consultant.rating.toFixed(1)}</span>
                    <span className="text-sm text-gray-500">({saved.consultant.total_reviews})</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">${saved.consultant.hourly_rate}/hr</span>
                  {priceChange.changed && (
                    <span className={`flex items-center text-xs font-medium ${
                      priceChange.direction === 'down' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {priceChange.direction === 'down' ? (
                        <><TrendingDown className="w-3 h-3" /> {priceChange.percentage}%</>
                      ) : (
                        <><TrendingUp className="w-3 h-3" /> +{priceChange.percentage}%</>
                      )}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mt-3">
                {saved.consultant.is_available ? (
                  <span className="inline-flex items-center text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5"></span>
                    Available Now
                  </span>
                ) : (
                  <span className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3 mr-1" />
                    Last active {saved.consultant.last_active ? new Date(saved.consultant.last_active).toLocaleDateString() : 'recently'}
                  </span>
                )}
                
                {hasNewServices && (
                  <span className="inline-flex items-center text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                    New services added!
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleToggleSave(saved.consultant.id)
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bookmark className="w-5 h-5 fill-indigo-600 text-indigo-600" />
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/consultants/${saved.consultant.id}`)
            }}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <span>View Profile</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/consultants/${saved.consultant.id}?book=true`)
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Book Now
          </button>
        </div>
      </div>
    )
  }

  const renderWaitlistCard = (waitlist: ConsultantWaitlist) => {
    return (
      <div
        key={waitlist.id}
        className="bg-white border border-gray-200 rounded-lg p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <Bell className="w-6 h-6 text-indigo-600" />
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">
                {waitlist.consultant.name}
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Position #{waitlist.position} in waitlist
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Joined {new Date(waitlist.joined_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <button
              onClick={() => handleLeaveWaitlist(waitlist.id)}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Leave Waitlist
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Saved Consultants */}
      {savedConsultants.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Saved Consultants</h2>
            <span className="text-sm text-gray-500">{savedConsultants.length} saved</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {savedConsultants.map(saved => renderSavedConsultantCard(saved))}
          </div>
        </div>
      )}

      {/* Waitlists */}
      {waitlists.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Waitlist Positions</h2>
            <span className="text-sm text-gray-500">{waitlists.length} active</span>
          </div>
          <div className="space-y-4">
            {waitlists.map(waitlist => renderWaitlistCard(waitlist))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended for You</h2>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
          <h3 className="font-medium text-indigo-900 mb-2">
            Students targeting your schools also saved...
          </h3>
          <p className="text-sm text-indigo-700 mb-4">
            Based on your saved consultants and target schools, we recommend these consultants.
          </p>
          <button
            onClick={() => router.push('/browse?filter=recommended')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View Recommendations
          </button>
        </div>
      </div>

      {/* Empty State */}
      {savedConsultants.length === 0 && waitlists.length === 0 && (
        <div className="text-center py-12">
          <Bookmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No saved consultants yet</h3>
          <p className="text-gray-600 mb-6">Save consultants to quickly book them later</p>
          <button
            onClick={() => router.push('/browse')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Consultants
          </button>
        </div>
      )}
    </div>
  )
}