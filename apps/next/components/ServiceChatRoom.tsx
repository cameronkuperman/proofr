"use client"

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  sender_id: string
  sender_type: 'student' | 'consultant'
  content: string
  message_type: 'text' | 'voice' | 'file' | 'system'
  timestamp: string
  // SUPABASE TODO: Add these fields to messages table
  // - service_id (foreign key to services table)
  // - is_read boolean default false
  // - file_url text (for file attachments)
  // - voice_duration integer (for voice messages in seconds)
}

interface ServiceDetails {
  id: string
  title: string
  type: 'essay_review' | 'college_counseling' | 'interview_prep' | 'other'
  status: 'initiated' | 'in_progress' | 'delivered' | 'completed' | 'follow_up'
  price: number
  expected_delivery: string
  consultant_name: string
  student_name: string
}

interface ServiceChatRoomProps {
  serviceId: string
  currentUserId: string
  currentUserType: 'student' | 'consultant'
}

export default function ServiceChatRoom({ 
  serviceId, 
  currentUserId, 
  currentUserType 
}: ServiceChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [serviceDetails, setServiceDetails] = useState<ServiceDetails | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // SUPABASE TODO: Set up real-time subscription
  // useEffect(() => {
  //   const channel = supabase
  //     .channel(`service-chat-${serviceId}`)
  //     .on('postgres_changes', {
  //       event: 'INSERT',
  //       schema: 'public',
  //       table: 'messages',
  //       filter: `service_id=eq.${serviceId}`
  //     }, (payload) => {
  //       setMessages(prev => [...prev, payload.new as Message])
  //     })
  //     .subscribe()
  //   return () => supabase.removeChannel(channel)
  // }, [serviceId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return
    
    // SUPABASE TODO: Insert message into messages table
    // const { data, error } = await supabase
    //   .from('messages')
    //   .insert({
    //     service_id: serviceId,
    //     sender_id: currentUserId,
    //     sender_type: currentUserType,
    //     content: newMessage,
    //     message_type: 'text'
    //   })
    
    setNewMessage('')
  }

  const handleVoiceMessage = () => {
    // SUPABASE TODO: Implement voice message recording
    // 1. Record audio using MediaRecorder API
    // 2. Upload to Supabase Storage
    // 3. Insert message with file_url and voice_duration
    setIsRecording(!isRecording)
  }

  const getServicePhaseInfo = () => {
    if (!serviceDetails) return null
    
    const phaseConfig = {
      initiated: {
        color: '#3b82f6',
        icon: '🎯',
        title: 'Service Initiated',
        description: 'Getting started on your request'
      },
      in_progress: {
        color: '#f59e0b',
        icon: '⚡',
        title: 'In Progress',
        description: 'Working on your submission'
      },
      delivered: {
        color: '#10b981',
        icon: '��',
        title: 'Delivered',
        description: 'Review completed - check your feedback'
      },
      completed: {
        color: '#6b7280',
        icon: '✅',
        title: 'Completed',
        description: 'Service finished successfully'
      },
      follow_up: {
        color: '#8b5cf6',
        icon: '🔄',
        title: 'Follow-up Available',
        description: 'Ready for additional questions or services'
      }
    }

    return phaseConfig[serviceDetails.status]
  }

  const phaseInfo = getServicePhaseInfo()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#f9fafb',
      maxWidth: '800px',
      margin: '0 auto',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      
      {/* Thoughtful Service Header - Shows context, not just "Chat" */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: phaseInfo?.color || '#6b7280',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>
            {phaseInfo?.icon || '💬'}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#111827' 
            }}>
              {serviceDetails?.title || 'Essay Review Service'}
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '13px', 
              color: '#6b7280',
              fontWeight: '500'
            }}>
              with {currentUserType === 'student' ? serviceDetails?.consultant_name : serviceDetails?.student_name}
            </p>
          </div>
          <div style={{
            background: phaseInfo?.color + '15' || '#6b728015',
            color: phaseInfo?.color || '#6b7280',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {phaseInfo?.title || 'Active'}
          </div>
        </div>
        
        {phaseInfo && (
          <p style={{ 
            margin: 0, 
            fontSize: '14px', 
            color: '#374151',
            fontStyle: 'italic'
          }}>
            {phaseInfo.description}
          </p>
        )}
      </div>

      {/* Messages Area - Thoughtfully designed for professional communication */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.sender_type === currentUserType ? 'flex-end' : 'flex-start'
            }}
          >
            <div
              style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '16px',
                background: message.sender_type === currentUserType 
                  ? '#3b82f6' 
                  : 'white',
                color: message.sender_type === currentUserType 
                  ? 'white' 
                  : '#374151',
                fontSize: '14px',
                lineHeight: '1.4',
                boxShadow: message.sender_type === currentUserType 
                  ? '0 2px 8px rgba(59, 130, 246, 0.25)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.08)',
                border: message.sender_type !== currentUserType ? '1px solid #e5e7eb' : 'none'
              }}
            >
              {message.content}
              <div style={{
                fontSize: '11px',
                opacity: 0.7,
                marginTop: '4px',
                textAlign: 'right'
              }}>
                {new Date(message.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              background: '#f3f4f6',
              padding: '12px 16px',
              borderRadius: '16px',
              fontSize: '14px',
              color: '#6b7280',
              fontStyle: 'italic'
            }}>
              typing...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Thoughtful Input Area - Professional but not intimidating */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '12px',
          background: '#f9fafb',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
          padding: '8px'
        }}>
          
          {/* Voice Message Button - Optional feature */}
          <button
            onClick={handleVoiceMessage}
            style={{
              background: isRecording ? '#ef4444' : '#f3f4f6',
              border: 'none',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.2s ease'
            }}
          >
            {isRecording ? '🔴' : '🎤'}
          </button>

          {/* Message Input */}
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder={
              currentUserType === 'consultant' 
                ? "Share guidance, ask questions, or let them know about progress..."
                : "Ask questions, share thoughts, or let them know you're ready for the next step..."
            }
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              resize: 'none',
              outline: 'none',
              fontSize: '14px',
              lineHeight: '1.4',
              padding: '8px 12px',
              minHeight: '24px',
              maxHeight: '120px',
              fontFamily: 'inherit'
            }}
            rows={1}
          />

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            style={{
              background: newMessage.trim() ? '#3b82f6' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: newMessage.trim() ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              transition: 'all 0.2s ease'
            }}
          >
            📤
          </button>
        </div>

        {/* Helpful Context for Current User */}
        <div style={{
          marginTop: '12px',
          fontSize: '12px',
          color: '#6b7280',
          textAlign: 'center'
        }}>
          {currentUserType === 'consultant' ? (
            serviceDetails?.status === 'delivered' ? 
              "Student can ask follow-up questions or request revisions" :
              "Keep the student updated on your progress"
          ) : (
            serviceDetails?.status === 'delivered' ? 
              "Your consultant has delivered your work - check it out and ask any questions!" :
              "Your consultant will keep you updated on progress"
          )}
        </div>
      </div>
    </div>
  )
} 