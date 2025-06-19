"use client"

import { useState, useEffect } from 'react'

interface ServiceConversation {
  id: string
  service_type: 'essay_review' | 'college_counseling' | 'interview_prep' | 'other'
  service_title: string
  status: 'initiated' | 'in_progress' | 'delivered' | 'completed' | 'follow_up'
  other_party_name: string
  other_party_avatar?: string
  last_message: string
  last_message_time: string
  unread_count: number
  price: number
  expected_delivery?: string
  is_urgent: boolean
  
  // SUPABASE TODO: Join query needed from these tables:
  // - services (service info)
  // - messages (last message, unread count)
  // - users (other party name, avatar)
}

interface ConversationsListProps {
  currentUserType: 'student' | 'consultant'
  currentUserId: string
  onConversationClick: (serviceId: string) => void
}

export default function ConversationsList({
  currentUserType,
  currentUserId,
  onConversationClick
}: ConversationsListProps) {
  const [conversations, setConversations] = useState<ServiceConversation[]>([])
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active')
  const [isLoading, setIsLoading] = useState(true)

  // SUPABASE TODO: Fetch conversations with real-time updates
  // useEffect(() => {
  //   const fetchConversations = async () => {
  //     const { data, error } = await supabase
  //       .from('services')
  //       .select(`
  //         *,
  //         messages!inner(content, created_at, sender_type),
  //         users!inner(name, avatar_url)
  //       `)
  //       .eq(currentUserType === 'consultant' ? 'consultant_id' : 'student_id', currentUserId)
  //       .order('updated_at', { ascending: false })
  //     
  //     if (data) setConversations(data)
  //   }
  //   fetchConversations()
  // }, [currentUserId, currentUserType])

  const getStatusConfig = (status: ServiceConversation['status']) => {
    const configs = {
      initiated: { color: '#3b82f6', icon: '🎯', label: 'Starting' },
      in_progress: { color: '#f59e0b', icon: '⚡', label: 'In Progress' },
      delivered: { color: '#10b981', icon: '📋', label: 'Delivered' },
      completed: { color: '#6b7280', icon: '✅', label: 'Completed' },
      follow_up: { color: '#8b5cf6', icon: '🔄', label: 'Follow-up' }
    }
    return configs[status]
  }

  const getServiceIcon = (type: ServiceConversation['service_type']) => {
    const icons = {
      essay_review: '📝',
      college_counseling: '🎓',
      interview_prep: '🗣️',
      other: '💬'
    }
    return icons[type] || '💬'
  }

  const filteredConversations = conversations.filter(conv => {
    if (filter === 'active') return ['initiated', 'in_progress', 'delivered', 'follow_up'].includes(conv.status)
    if (filter === 'completed') return conv.status === 'completed'
    return true
  })

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      
      {/* Header with thoughtful context */}
      <div style={{
        background: '#f9fafb',
        padding: '20px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h2 style={{
          margin: '0 0 12px 0',
          fontSize: '20px',
          fontWeight: '600',
          color: '#111827'
        }}>
          {currentUserType === 'consultant' ? 'Your Students' : 'Your Services'}
        </h2>
        
        {/* Filter tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          background: 'white',
          borderRadius: '8px',
          padding: '4px',
          border: '1px solid #e5e7eb'
        }}>
          {(['active', 'completed', 'all'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              style={{
                background: filter === filterType ? '#3b82f6' : 'transparent',
                color: filter === filterType ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: '500',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease'
              }}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations list */}
      <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {filteredConversations.length === 0 ? (
          <div style={{
            padding: '60px 20px',
            textAlign: 'center',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>
              {filter === 'active' ? '💬' : '✅'}
            </div>
            <p style={{ fontSize: '16px', fontWeight: '500', margin: 0 }}>
              {filter === 'active' 
                ? currentUserType === 'consultant' 
                  ? 'No active students yet'
                  : 'No active services yet'
                : 'No completed services yet'
              }
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => {
            const statusConfig = getStatusConfig(conversation.status)
            
            return (
              <div
                key={conversation.id}
                onClick={() => onConversationClick(conversation.id)}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  background: conversation.unread_count > 0 ? '#fef7ff' : 'white'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f9fafb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = conversation.unread_count > 0 ? '#fef7ff' : 'white'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  
                  {/* Avatar or service icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    color: 'white',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    {conversation.other_party_avatar ? (
                      <img 
                        src={conversation.other_party_avatar} 
                        alt={conversation.other_party_name}
                        style={{ width: '100%', height: '100%', borderRadius: '12px' }}
                      />
                    ) : (
                      conversation.other_party_name.charAt(0)
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Header row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '4px'
                    }}>
                      <h3 style={{
                        margin: 0,
                        fontSize: '15px',
                        fontWeight: '600',
                        color: '#111827',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1
                      }}>
                        {conversation.other_party_name}
                      </h3>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexShrink: 0
                      }}>
                        {conversation.unread_count > 0 && (
                          <div style={{
                            background: '#ef4444',
                            color: 'white',
                            borderRadius: '10px',
                            padding: '2px 6px',
                            fontSize: '11px',
                            fontWeight: '600',
                            minWidth: '18px',
                            textAlign: 'center'
                          }}>
                            {conversation.unread_count}
                          </div>
                        )}
                        
                        <span style={{
                          fontSize: '12px',
                          color: '#9ca3af',
                          fontWeight: '500'
                        }}>
                          {formatTimeAgo(conversation.last_message_time)}
                        </span>
                      </div>
                    </div>

                    {/* Service info row */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '6px'
                    }}>
                      <span style={{ fontSize: '14px' }}>
                        {getServiceIcon(conversation.service_type)}
                      </span>
                      <span style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        fontWeight: '500'
                      }}>
                        {conversation.service_title}
                      </span>
                      <span style={{
                        background: statusConfig.color + '15',
                        color: statusConfig.color,
                        fontSize: '10px',
                        fontWeight: '600',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {statusConfig.label}
                      </span>
                    </div>

                    {/* Last message preview */}
                    <p style={{
                      margin: 0,
                      fontSize: '13px',
                      color: '#6b7280',
                      lineHeight: '1.3',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {conversation.last_message}
                    </p>

                    {/* Urgency indicator or price */}
                    {conversation.is_urgent && (
                      <div style={{
                        marginTop: '6px',
                        fontSize: '11px',
                        color: '#ef4444',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        🔥 Urgent response needed
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// SUPABASE TODO: Database schema needed
/*
-- Messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  sender_type TEXT CHECK (sender_type IN ('student', 'consultant')),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'voice', 'file', 'system')),
  file_url TEXT,
  voice_duration INTEGER,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table (if not exists)
CREATE TABLE services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES users(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  status TEXT DEFAULT 'initiated' CHECK (status IN ('initiated', 'in_progress', 'delivered', 'completed', 'follow_up')),
  expected_delivery TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_messages_service_id ON messages(service_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_services_consultant_id ON services(consultant_id);
CREATE INDEX idx_services_student_id ON services(student_id);
CREATE INDEX idx_services_status ON services(status);

-- RLS Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Messages policies
CREATE POLICY "Users can view messages for their services" ON messages
  FOR SELECT USING (
    service_id IN (
      SELECT id FROM services 
      WHERE consultant_id = auth.uid() OR student_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages for their services" ON messages
  FOR INSERT WITH CHECK (
    service_id IN (
      SELECT id FROM services 
      WHERE consultant_id = auth.uid() OR student_id = auth.uid()
    )
  );
*/ 