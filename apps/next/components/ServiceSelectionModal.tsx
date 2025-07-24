'use client'

import React from 'react'
import { X, Clock, DollarSign, Users, FileText, MessageSquare, BookOpen } from 'lucide-react'
import type { Service } from '../../packages/app/features/consultants/types/consultant.types'

interface ServiceSelectionModalProps {
  services: Service[]
  visible: boolean
  onClose: () => void
  onSelectService: (service: Service) => void
  consultantName: string
}

export default function ServiceSelectionModal({ 
  services, 
  visible, 
  onClose, 
  onSelectService,
  consultantName 
}: ServiceSelectionModalProps) {
  if (!visible) return null

  const getServiceIcon = (serviceType: string) => {
    switch (serviceType) {
      case 'essay_review':
        return <FileText className="w-6 h-6" />
      case 'interview_prep':
        return <MessageSquare className="w-6 h-6" />
      case 'sat_tutoring':
      case 'act_tutoring':
      case 'test_prep':
        return <BookOpen className="w-6 h-6" />
      default:
        return <FileText className="w-6 h-6" />
    }
  }

  const getServiceColor = (serviceType: string) => {
    switch (serviceType) {
      case 'essay_review':
        return 'bg-blue-100 text-blue-600'
      case 'interview_prep':
        return 'bg-purple-100 text-purple-600'
      case 'sat_tutoring':
      case 'act_tutoring':
      case 'test_prep':
        return 'bg-green-100 text-green-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Select a Service</h2>
            <p className="text-sm text-gray-600 mt-1">Choose from {consultantName}'s services</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Services List */}
        <div className="overflow-y-auto max-h-[60vh] p-6">
          <div className="space-y-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => onSelectService(service)}
                className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
              >
                <div className="flex items-start">
                  <div className={`p-3 rounded-lg ${getServiceColor(service.service_type)} mr-4`}>
                    {getServiceIcon(service.service_type)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {service.delivery_type === 'scheduled' 
                          ? `${service.duration_minutes} min`
                          : `${service.standard_turnaround_hours}h delivery`
                        }
                      </div>
                      
                      {service.allows_group_sessions && (
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          Group available
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-500">Starting at</p>
                    <p className="text-2xl font-bold text-indigo-600">
                      ${Math.min(...service.prices)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}