"use client"

import { useState } from 'react'
import MessagingModal from './MessagingModal'

interface Consultant {
  id: number
  name: string
  college: string
  verified: boolean
  major?: string
  rating: number
  review_count: number
  about_me: string
  working: boolean
  services: Record<string, string[]>
  years_experience: number
  location: string
}

interface ConsultantCardProps {
  consultant: Consultant
  onClick?: () => void
  currentUserId?: string
  currentUserType?: 'student' | 'consultant'
}

export default function ConsultantCard({ 
  consultant, 
  onClick, 
  currentUserId, 
  currentUserType 
}: ConsultantCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [showMessagingModal, setShowMessagingModal] = useState(false)

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 8,
        border: '1px solid #e4e7ec',
        boxShadow: isHovered 
          ? '0 8px 25px rgba(0, 0, 0, 0.12)' 
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        height: 360,
        display: 'flex',
        flexDirection: 'column'
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsFavorited(!isFavorited)
        }}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'white',
          border: '1px solid #e4e7ec',
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 2,
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)',
        }}
      >
        <span style={{ 
          fontSize: 14, 
          color: isFavorited ? '#ef4444' : '#9ca3af',
          transition: 'color 0.2s ease'
        }}>
          {isFavorited ? '♥' : '♡'}
        </span>
      </button>

      {/* Profile image */}
      <div style={{ 
        padding: '20px 20px 0 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            border: '2px solid #f9fafb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 18,
            fontWeight: 600
          }}
        >
          {consultant.name.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            marginBottom: 2
          }}>
            <h3 style={{ 
              fontSize: 16, 
              fontWeight: 600, 
              color: '#111827',
              margin: 0,
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {consultant.name}
            </h3>
            {consultant.verified && (
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#1d9bf0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: 9,
                  fontWeight: 700,
                  flexShrink: 0
                }}
              >
                ✓
              </div>
            )}
          </div>
          
          <p style={{ 
            color: '#6b7280', 
            fontSize: 13,
            fontWeight: 500,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {consultant.college}
          </p>
        </div>
        
        {/* Online status */}
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: consultant.working ? '#10b981' : '#d1d5db',
            border: '2px solid white',
            boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.05)',
            flexShrink: 0
          }}
        />
      </div>

      {/* Service description */}
      <div style={{ 
        padding: '0 20px',
        marginTop: 12
      }}>
        <p style={{ 
          color: '#374151', 
          fontSize: 14,
          lineHeight: 1.4,
          margin: 0,
          fontWeight: 400,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          height: '2.8em'
        }}>
          {consultant.about_me}
        </p>
      </div>

      {/* Service tags */}
      <div style={{ 
        padding: '0 20px',
        marginTop: 12,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6
      }}>
        {Object.keys(consultant.services).slice(0, 2).map((service) => (
          <span 
            key={service}
            style={{
              background: '#f3f4f6',
              color: '#6b7280',
              fontSize: 11,
              fontWeight: 500,
              borderRadius: 4,
              padding: '4px 8px',
              textTransform: 'capitalize',
            }}
          >
            {service.replace('_', ' ')}
          </span>
        ))}
        {Object.keys(consultant.services).length > 2 && (
          <span style={{
            color: '#9ca3af',
            fontSize: 11,
            fontWeight: 500,
          }}>
            +{Object.keys(consultant.services).length - 2} more
          </span>
        )}
      </div>

      {/* Rating and reviews */}
      <div style={{ 
        padding: '0 20px',
        marginTop: 12,
        display: 'flex', 
        alignItems: 'center', 
        gap: 6
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <span style={{ color: '#fbbf24', fontSize: 14 }}>★</span>
          <span style={{ 
            fontWeight: 600, 
            color: '#111827', 
            fontSize: 14
          }}>
            {consultant.rating}
          </span>
        </div>
        <span style={{ 
          color: '#9ca3af', 
          fontSize: 13,
          fontWeight: 500
        }}>
          ({consultant.review_count} reviews)
        </span>
      </div>

      {/* Bottom section with price and CTA */}
      <div style={{ 
        padding: '16px 20px',
        borderTop: '1px solid #f3f4f6',
        marginTop: 'auto',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        <div>
          <span style={{ 
            color: '#111827', 
            fontWeight: 700, 
            fontSize: 18,
            lineHeight: 1
          }}>
            Starting ${(() => {
              const prices = Object.values(consultant.services).flat()
                .map(item => {
                  const match = item.match(/\$(\d+)/)
                  return match ? parseInt(match[1]) : null
                })
                .filter(price => price !== null)
              return prices.length > 0 ? Math.min(...prices) : 0
            })()}
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}></span>
          </span>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            if (consultant.working && currentUserId && currentUserType) {
              setShowMessagingModal(true)
            }
          }}
          style={{
            background: consultant.working ? '#1f2937' : '#d1d5db',
            color: consultant.working ? 'white' : '#9ca3af',
            border: 'none',
            borderRadius: 4,
            padding: '8px 16px',
            fontWeight: 600,
            fontSize: 13,
            cursor: consultant.working ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease',
          }}
          disabled={!consultant.working}
          onMouseEnter={(e) => {
            if (consultant.working) {
              e.currentTarget.style.background = '#111827'
            }
          }}
          onMouseLeave={(e) => {
            if (consultant.working) {
              e.currentTarget.style.background = '#1f2937'
            }
          }}
        >
          {consultant.working ? 'Contact' : 'Unavailable'}
        </button>
      </div>

      {/* Messaging Modal */}
      {currentUserId && currentUserType && (
        <MessagingModal
          isOpen={showMessagingModal}
          onClose={() => setShowMessagingModal(false)}
          consultant={consultant}
          currentUserId={currentUserId}
          currentUserType={currentUserType}
          mode="new_conversation"
        />
      )}
    </div>
  )
}