"use client"

import { useState } from 'react'
import ConsultantCard from './ConsultantCard'
import MessagingTrigger from './MessagingTrigger'

interface DashboardLayoutProps {
  children: React.ReactNode
  currentUserId: string
  currentUserType: 'student' | 'consultant'
  consultants?: any[]
}

export default function DashboardLayout({
  children,
  currentUserId,
  currentUserType,
  consultants = []
}: DashboardLayoutProps) {
  const [activeTab, setActiveTab] = useState('browse')

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb'
    }}>
      {/* Navigation Header */}
      <nav style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 30
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '32px'
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '700',
            color: '#1f2937'
          }}>
            Proofr
          </h1>
          
          <div style={{
            display: 'flex',
            gap: '8px'
          }}>
            {['browse', 'my-services', 'dashboard'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: activeTab === tab ? '#f3f4f6' : 'none',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: activeTab === tab ? '#1f2937' : '#6b7280',
                  fontSize: '14px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Messaging Trigger in Navigation */}
          <MessagingTrigger
            currentUserId={currentUserId}
            currentUserType={currentUserType}
            variant="nav"
          />
          
          {/* User Profile */}
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            U
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {activeTab === 'browse' && (
          <div>
            <div style={{
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1f2937',
                margin: '0 0 8px 0'
              }}>
                Find Your Perfect Consultant
              </h2>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: 0
              }}>
                Connect with top students from elite universities to get personalized guidance
              </p>
            </div>

            {/* Consultant Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
              marginBottom: '40px'
            }}>
              {consultants.map((consultant) => (
                <ConsultantCard
                  key={consultant.id}
                  consultant={consultant}
                  currentUserId={currentUserId}
                  currentUserType={currentUserType}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'my-services' && (
          <div>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: '#1f2937',
              margin: '0 0 16px 0'
            }}>
              Your Active Services
            </h2>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #e5e7eb',
              padding: '48px 24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: 0
              }}>
                Your active services will appear here
              </p>
            </div>
          </div>
        )}

        {/* Generic content area */}
        {children}
      </main>

      {/* Floating Messaging Button for Mobile */}
      <div style={{
        display: 'block'
      }}>
        <MessagingTrigger
          currentUserId={currentUserId}
          currentUserType={currentUserType}
          variant="floating"
        />
      </div>
    </div>
  )
}

// Usage Example:
/*
// In your main page or dashboard
import DashboardLayout from '@/components/DashboardLayout'

export default function DashboardPage() {
  const currentUserId = 'user-123' // From your auth
  const currentUserType = 'student' // From your auth
  const consultants = [] // From your API/database

  return (
    <DashboardLayout
      currentUserId={currentUserId}
      currentUserType={currentUserType}
      consultants={consultants}
    >
      <div>
        Additional dashboard content here
      </div>
    </DashboardLayout>
  )
}
*/ 