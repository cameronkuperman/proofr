'use client'

import React, { useState } from 'react'
import type { BookingRequest } from '../types/booking-request.types'

interface ConsultantRequestModalProps {
  isOpen: boolean
  onClose: () => void
  request: BookingRequest & {
    students?: any
    services?: any
    booking_text_inputs?: any[]
    booking_file_uploads?: any[]
    booking_doc_links?: any[]
  }
  onAccept: (requestId: string, quotedPrice: number, estimatedDelivery: string) => void
  onReject: (requestId: string, reason: string) => void
  onStartDiscussion: (requestId: string) => void
}

export function ConsultantRequestModal({
  isOpen,
  onClose,
  request,
  onAccept,
  onReject,
  onStartDiscussion
}: ConsultantRequestModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'materials' | 'chat'>('details')
  const [quotedPrice, setQuotedPrice] = useState('')
  const [estimatedDelivery, setEstimatedDelivery] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showAcceptForm, setShowAcceptForm] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)

  if (!isOpen) return null

  const handleAccept = () => {
    if (quotedPrice && estimatedDelivery) {
      onAccept(request.id, parseFloat(quotedPrice), estimatedDelivery)
    }
  }

  const handleReject = () => {
    if (rejectionReason) {
      onReject(request.id, rejectionReason)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Review Request</h2>
              <p className="text-gray-600 mt-1">
                from {request.students?.name} • {request.students?.school}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="border-b">
            <div className="flex space-x-1 p-2">
              {['details', 'materials', 'chat'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    activeTab === tab
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Service Requested</h3>
                  <p className="text-gray-700">{request.services?.title}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Purpose of Service</h3>
                  <p className="text-gray-700">{request.purpose_of_service}</p>
                </div>

                {request.additional_requirements && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Additional Requirements</h3>
                    <p className="text-gray-700">{request.additional_requirements}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {request.deadline_date && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Deadline</h3>
                      <p className="text-gray-700">
                        {new Date(request.deadline_date).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Urgency</h3>
                    <p className="text-gray-700 capitalize">{request.urgency_level || 'medium'}</p>
                  </div>
                </div>

                {request.status === 'in_discussion' && !showAcceptForm && !showRejectForm && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowAcceptForm(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Accept Request
                    </button>
                    <button
                      onClick={() => setShowRejectForm(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reject Request
                    </button>
                  </div>
                )}

                {showAcceptForm && (
                  <div className="border-t pt-4 space-y-4">
                    <h3 className="text-lg font-semibold">Accept Request</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quote Price ($)
                      </label>
                      <input
                        type="number"
                        value={quotedPrice}
                        onChange={(e) => setQuotedPrice(e.target.value)}
                        placeholder="Enter your price"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Delivery Time
                      </label>
                      <input
                        type="text"
                        value={estimatedDelivery}
                        onChange={(e) => setEstimatedDelivery(e.target.value)}
                        placeholder="e.g., '48 hours', '3-5 days'"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleAccept}
                        disabled={!quotedPrice || !estimatedDelivery}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
                      >
                        Confirm Acceptance
                      </button>
                      <button
                        onClick={() => setShowAcceptForm(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {showRejectForm && (
                  <div className="border-t pt-4 space-y-4">
                    <h3 className="text-lg font-semibold">Reject Request</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Rejection
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Please provide a reason for rejecting this request"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleReject}
                        disabled={!rejectionReason}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300"
                      >
                        Confirm Rejection
                      </button>
                      <button
                        onClick={() => setShowRejectForm(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="space-y-6">
                {request.booking_text_inputs && request.booking_text_inputs.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Text Materials</h3>
                    <div className="space-y-3">
                      {request.booking_text_inputs.map((input: any) => (
                        <div key={input.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{input.title}</h4>
                            <span className="text-sm text-gray-500 capitalize">{input.input_type}</span>
                          </div>
                          <div className="text-gray-700 whitespace-pre-wrap max-h-64 overflow-y-auto">
                            {input.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {request.booking_file_uploads && request.booking_file_uploads.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">File Uploads</h3>
                    <div className="space-y-2">
                      {request.booking_file_uploads.map((file: any) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <p className="font-medium">{file.file_name}</p>
                              <p className="text-sm text-gray-500">
                                {(file.file_size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                          </div>
                          <button className="text-green-600 hover:text-green-700 text-sm">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {request.booking_doc_links && request.booking_doc_links.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Document Links</h3>
                    <div className="space-y-2">
                      {request.booking_doc_links.map((link: any) => (
                        <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                            <div>
                              <p className="font-medium">{link.doc_title || 'Document'}</p>
                              <p className="text-sm text-gray-500">{link.description}</p>
                            </div>
                          </div>
                          <a
                            href={link.doc_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700 text-sm"
                          >
                            Open Link
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'chat' && (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="mt-2">Chat interface coming soon</p>
              </div>
            )}
          </div>
        </div>

        {request.status === 'pending_review' && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => onStartDiscussion(request.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start Discussion
              </button>
              <button
                onClick={() => setShowRejectForm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}