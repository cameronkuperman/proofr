"use client"

import { useState, useEffect } from 'react'
import ServiceChatRoom from './ServiceChatRoom'
import ConversationsList from './ConversationsList'

interface Consultant {
  id: number
  name: string
  college: string
  verified: boolean
  services: Record<string, string[]>
  rating: number
  review_count: number
}

interface MessagingModalProps {
  isOpen: boolean
  onClose: () => void
  consultant?: Consultant | null
  currentUserId: string
  currentUserType: 'student' | 'consultant'
  mode: 'new_conversation' | 'existing_conversations'
}

export default function MessagingModal({
  isOpen,
  onClose,
  consultant,
  currentUserId,
  currentUserType,
  mode
}: MessagingModalProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [isCreatingService, setIsCreatingService] = useState(false)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedService(null)
      setServiceId(null)
      setShowChat(false)
      setIsCreatingService(false)
    }
  }, [isOpen])

  const handleServiceSelect = async (serviceType: string) => {
    setSelectedService(serviceType)
    setIsCreatingService(true)
    
    // SUPABASE TODO: Create a new service record
    // const { data, error } = await supabase
    //   .from('services')
    //   .insert({
    //     student_id: currentUserId,
    //     consultant_id: consultant?.id,
    //     service_type: serviceType,
    //     title: `${serviceType.replace('_', ' ')} with ${consultant?.name}`,
    //     status: 'initiated',
    //     price: extractPriceFromService(consultant?.services[serviceType])
    //   })
    //   .select()
    //   .single()
    
    // if (data) {
    //   setServiceId(data.id)
    //   setShowChat(true)
    // }
    
    // Simulate service creation for now
    setTimeout(() => {
      setServiceId(`service_${Date.now()}`)
      setShowChat(true)
      setIsCreatingService(false)
    }, 1000)
  }

  const handleExistingConversationClick = (conversationId: string) => {
    setServiceId(conversationId)
    setShowChat(true)
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: showChat ? '900px' : '600px',
        height: '80vh',
        maxHeight: '700px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        transition: 'all 0.3s ease'
      }}>
        
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f3f4f6',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            fontSize: '16px',
            color: '#6b7280',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#e5e7eb'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f3f4f6'
          }}
        >
          ✕
        </button>

        {/* Chat View - Full messaging interface */}
        {showChat && serviceId ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Back button */}
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <button
                onClick={() => setShowChat(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '14px',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f3f4f6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none'
                }}
              >
                ← Back to Services
              </button>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827'
              }}>
                {consultant?.name} • {selectedService?.replace('_', ' ')}
              </div>
            </div>
            
            <div style={{ flex: 1 }}>
              <ServiceChatRoom
                serviceId={serviceId}
                currentUserId={currentUserId}
                currentUserType={currentUserType}
              />
            </div>
          </div>
        ) : mode === 'existing_conversations' ? (
          /* Existing Conversations View */
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{
              padding: '24px 24px 16px 24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '600',
                color: '#111827'
              }}>
                Your Messages
              </h2>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Continue your conversations with consultants
              </p>
            </div>
            
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <ConversationsList
                currentUserId={currentUserId}
                currentUserType={currentUserType}
                onConversationClick={handleExistingConversationClick}
              />
            </div>
          </div>
        ) : (
          /* New Conversation - Service Selection View */
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{
              padding: '24px 24px 16px 24px',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: '600'
                }}>
                  {consultant?.name.charAt(0)}
                </div>
                <div>
                  <h2 style={{
                    margin: 0,
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#111827'
                  }}>
                    Start working with {consultant?.name}
                  </h2>
                  <p style={{
                    margin: '2px 0 0 0',
                    fontSize: '14px',
                    color: '#6b7280'
                  }}>
                    {consultant?.college} • ⭐ {consultant?.rating} ({consultant?.review_count} reviews)
                  </p>
                </div>
              </div>
            </div>

            {/* Service Selection */}
            <div style={{
              flex: 1,
              padding: '24px',
              overflowY: 'auto'
            }}>
              <h3 style={{
                margin: '0 0 16px 0',
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827'
              }}>
                Choose a service to get started:
              </h3>

              <div style={{
                display: 'grid',
                gap: '12px'
              }}>
                {consultant && Object.entries(consultant.services).map(([serviceType, details]) => (
                  <button
                    key={serviceType}
                    onClick={() => handleServiceSelect(serviceType)}
                    disabled={isCreatingService}
                    style={{
                      background: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '16px',
                      textAlign: 'left',
                      cursor: isCreatingService ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: isCreatingService ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!isCreatingService) {
                        e.currentTarget.style.borderColor = '#3b82f6'
                        e.currentTarget.style.background = '#fafbff'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isCreatingService) {
                        e.currentTarget.style.borderColor = '#e5e7eb'
                        e.currentTarget.style.background = 'white'
                      }
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px'
                    }}>
                      <div style={{
                        fontSize: '20px',
                        marginTop: '2px'
                      }}>
                        {serviceType === 'essay_review' ? '📝' :
                         serviceType === 'college_counseling' ? '🎓' :
                         serviceType === 'interview_prep' ? '🗣️' :
                         serviceType === 'scholarship_help' ? '💰' : '💬'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          margin: '0 0 4px 0',
                          fontSize: '15px',
                          fontWeight: '600',
                          color: '#111827',
                          textTransform: 'capitalize'
                        }}>
                          {serviceType.replace('_', ' ')}
                        </h4>
                        <div style={{
                          fontSize: '13px',
                          color: '#6b7280',
                          marginBottom: '8px'
                        }}>
                          {details.join(' • ')}
                        </div>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#3b82f6'
                        }}>
                          {details.find(d => d.includes('$')) || 'Contact for pricing'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {isCreatingService && (
                <div style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: '#f0f9ff',
                  borderRadius: '8px',
                  border: '1px solid #bae6fd',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '16px',
                    marginBottom: '4px'
                  }}>
                    ⚡
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    color: '#0369a1',
                    fontWeight: '500'
                  }}>
                    Setting up your conversation with {consultant?.name}...
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// SUPABASE TODO: Service creation helper
/*
const extractPriceFromService = (serviceDetails: string[]): number => {
  const priceString = serviceDetails.find(detail => detail.includes('$'))
  if (priceString) {
    const match = priceString.match(/\$(\d+)/)
    return match ? parseInt(match[1]) : 0
  }
  return 0
}

const createServiceAndInitiateChat = async (
  studentId: string,
  consultantId: number,
  serviceType: string,
  consultant: Consultant
) => {
  const { data, error } = await supabase
    .from('services')
    .insert({
      student_id: studentId,
      consultant_id: consultantId,
      service_type: serviceType,
      title: `${serviceType.replace('_', ' ')} with ${consultant.name}`,
      description: `Professional ${serviceType.replace('_', ' ')} service`,
      price: extractPriceFromService(consultant.services[serviceType]),
      status: 'initiated'
    })
    .select()
    .single()

  if (data) {
    // Send initial system message
    await supabase
      .from('messages')
      .insert({
        service_id: data.id,
        sender_id: 'system',
        sender_type: 'system',
        content: `Welcome! Your ${serviceType.replace('_', ' ')} service with ${consultant.name} has been initiated. Feel free to share your requirements and ask any questions.`,
        message_type: 'system'
      })
  }

  return { data, error }
}
*/ 