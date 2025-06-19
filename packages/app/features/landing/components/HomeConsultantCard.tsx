import * as React from 'react'

interface Consultant {
  initials: string
  name: string
  university: string
  year: string
  specialty: string
  bio: string
  price: string
  avatar: string
  verified: boolean
  responseTime: string
  badge: string
  rating: number
  reviews: number
}

interface HomeConsultantCardProps {
  consultant: Consultant
  index: number
  isBlurred?: boolean
  onCardClick?: () => void
}

export function HomeConsultantCard({ 
  consultant, 
  index, 
  isBlurred = false,
  onCardClick 
}: HomeConsultantCardProps) {
  return (
    <div 
      style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #F3F4F6',
        height: '320px',
        width: '300px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06)',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        animation: `slideUp 0.6s ease-out ${index * 0.1}s both`,
        filter: isBlurred ? 'blur(3px)' : 'none',
        opacity: isBlurred ? 0.3 : 1,
        transform: isBlurred ? 'scale(0.9)' : 'scale(1)'
      }}
      onMouseEnter={(e) => {
        if (!isBlurred) {
          e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.12)'
          e.currentTarget.style.filter = 'none'
          e.currentTarget.style.opacity = '1'
        }
      }}
      onMouseLeave={(e) => {
        if (!isBlurred) {
          e.currentTarget.style.transform = 'translateY(0) scale(1)'
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.06)'
          e.currentTarget.style.filter = 'none'
          e.currentTarget.style.opacity = '1'
        } else {
          e.currentTarget.style.filter = 'blur(3px)'
          e.currentTarget.style.opacity = '0.3'
          e.currentTarget.style.transform = 'scale(0.9)'
        }
      }}
      onClick={onCardClick}
    >
      {/* Badge */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: consultant.badge === 'Top Rated' ? '#EF4444' : 
                    consultant.badge === 'Rising Star' ? '#10B981' :
                    consultant.badge === 'Pro' ? '#8B5CF6' : '#F59E0B',
        color: 'white',
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '10px',
        fontWeight: '700',
        letterSpacing: '0.3px',
        textTransform: 'uppercase'
      }}>
        {consultant.badge}
      </div>

      {/* Avatar & Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '18px'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '14px',
          background: consultant.avatar,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '14px',
          position: 'relative',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
        }}>
          <span style={{
            color: 'white',
            fontSize: '18px',
            fontWeight: '700'
          }}>
            {consultant.initials}
          </span>
          <div style={{
            position: 'absolute',
            bottom: '-3px',
            right: '-3px',
            width: '16px',
            height: '16px',
            background: '#10B981',
            borderRadius: '50%',
            border: '3px solid white'
          }} />
        </div>
        <div>
          <h3 style={{
            fontSize: '17px',
            fontWeight: '700',
            color: '#18181B',
            margin: '0 0 4px 0'
          }}>
            {consultant.name}
          </h3>
          <p style={{
            fontSize: '13px',
            color: '#6B7280',
            margin: '0 0 6px 0',
            fontWeight: '500'
          }}>
            {consultant.university} {consultant.year}
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span style={{ color: '#FCD34D', fontSize: '11px' }}>★</span>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#18181B'
            }}>
              {consultant.rating}
            </span>
            <span style={{
              fontSize: '11px',
              color: '#9CA3AF'
            }}>
              ({consultant.reviews})
            </span>
          </div>
        </div>
      </div>

      {/* Specialty */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#E5E7EB',
        color: '#374151',
        padding: '6px 12px',
        borderRadius: '16px',
        fontSize: '11px',
        fontWeight: '600',
        marginBottom: '14px',
        alignSelf: 'flex-start'
      }}>
        {consultant.specialty}
      </div>

      {/* Bio */}
      <p style={{
        fontSize: '14px',
        color: '#6B7280',
        lineHeight: '1.5',
        margin: '0 0 auto 0',
        fontWeight: '400'
      }}>
        {consultant.bio}
      </p>

      {/* Footer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '16px',
        borderTop: '1px solid #F3F4F6',
        marginTop: '16px'
      }}>
        <div>
          <span style={{
            fontSize: '11px',
            color: '#9CA3AF',
            display: 'block',
            fontWeight: '500',
            marginBottom: '2px'
          }}>FROM</span>
          <span style={{
            fontSize: '20px',
            fontWeight: '800',
            color: '#18181B'
          }}>
            {consultant.price}
          </span>
        </div>
        
        <button style={{
          background: '#18181B',
          color: 'white',
          border: 'none',
          padding: '10px 18px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '700',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.background = '#374151'
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.background = '#18181B'
        }}
        onClick={(e) => e.stopPropagation()}>
          View
        </button>
      </div>
    </div>
  )
}