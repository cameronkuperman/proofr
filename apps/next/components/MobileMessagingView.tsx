// MobileMessagingView.tsx - Thoughtful mobile messaging experience
"use client"

import { useState, useRef, useEffect } from 'react'
import ServiceChatRoom from './ServiceChatRoom'
import ConversationsList from './ConversationsList'

interface MobileMessagingViewProps {
  currentUserId: string
  currentUserType: 'student' | 'consultant'
}

export default function MobileMessagingView({ 
  currentUserId, 
  currentUserType 
}: MobileMessagingViewProps) {
  const [activeView, setActiveView] = useState<'conversations' | 'chat'>('conversations')
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [showStatusBar, setShowStatusBar] = useState(true)
  const lastScrollY = useRef(0)

  // Hide status bar when scrolling down (like modern mobile apps)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowStatusBar(false)
      } else {
        setShowStatusBar(true)
      }
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleConversationClick = (serviceId: string) => {
    setSelectedServiceId(serviceId)
    setActiveView('chat')
  }

  const handleBackToConversations = () => {
    setActiveView('conversations')
    setSelectedServiceId(null)
  }

  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      background: '#f9fafb',
      overflow: 'hidden'
    }}>
      
      {/* Mobile Status Bar - Shows current context */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
        zIndex: 10,
        transform: showStatusBar ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.3s ease',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        
        {activeView === 'conversations' ? (
          <>
            <h1 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827'
            }}>
              Messages
            </h1>
          </>
        ) : (
          <>
            <button
              onClick={handleBackToConversations}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '16px',
                padding: '8px',
                cursor: 'pointer',
                borderRadius: '6px',
                transition: 'background 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none'
              }}
            >
              ← Back
            </button>
            <div style={{
              flex: 1,
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: '500',
              color: '#374151'
            }}>
              Service Chat
            </div>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{
        paddingTop: '60px',
        height: '100%',
        position: 'relative'
      }}>
        
        {/* Conversations List View */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: activeView === 'conversations' ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease',
          background: '#f9fafb'
        }}>
          <div style={{
            padding: '16px',
            height: '100%',
            overflowY: 'auto'
          }}>
            <ConversationsList
              currentUserId={currentUserId}
              currentUserType={currentUserType}
              onConversationClick={handleConversationClick}
            />
          </div>
        </div>

        {/* Chat Room View */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          transform: activeView === 'chat' ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          background: '#f9fafb'
        }}>
          {selectedServiceId && (
            <div style={{
              padding: '8px',
              height: '100%'
            }}>
              <ServiceChatRoom
                serviceId={selectedServiceId}
                currentUserId={currentUserId}
                currentUserType={currentUserType}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile-specific floating action button for quick actions */}
      {activeView === 'conversations' && (
        <button
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '56px',
            height: '56px',
            borderRadius: '28px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.2s ease',
            zIndex: 9
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          ✨
        </button>
      )}
    </div>
  )
}

// SUPABASE TODO: Push notifications for mobile
/*
-- Add push notification tokens to users table
ALTER TABLE users ADD COLUMN push_token TEXT;

-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger for sending push notifications on new messages
CREATE OR REPLACE FUNCTION notify_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert notification record
  INSERT INTO notifications (user_id, type, title, message, data)
  SELECT 
    CASE 
      WHEN NEW.sender_type = 'student' THEN s.consultant_id
      ELSE s.student_id
    END,
    'new_message',
    'New message from ' || u.name,
    NEW.content,
    jsonb_build_object('service_id', NEW.service_id, 'message_id', NEW.id)
  FROM services s
  JOIN users u ON u.id = NEW.sender_id
  WHERE s.id = NEW.service_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER notify_new_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_message();
*/ 