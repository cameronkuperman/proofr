'use client'

import React from 'react'
import type { BookingTextInput, BookingDocLink } from '../types/booking-request.types'

interface UploadStatusPanelProps {
  uploads: File[]
  uploadProgress: Record<string, number>
  textInputs: Omit<BookingTextInput, 'id' | 'request_id' | 'created_at' | 'updated_at' | 'word_count'>[]
  docLinks: Omit<BookingDocLink, 'id' | 'request_id' | 'created_at' | 'updated_at' | 'is_accessible' | 'last_verified_at'>[]
}

export function UploadStatusPanel({
  uploads,
  uploadProgress,
  textInputs,
  docLinks
}: UploadStatusPanelProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return (
        <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clipRule="evenodd" />
        </svg>
      )
    }
    if (fileType.includes('word') || fileType.includes('doc')) {
      return (
        <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" clipRule="evenodd" />
        </svg>
      )
    }
    return (
      <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2 1 1 0 100-2 2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
      </svg>
    )
  }

  const totalItems = uploads.length + textInputs.length + docLinks.length

  return (
    <div className="bg-white rounded-lg shadow p-6 sticky top-4">
      <h3 className="text-lg font-semibold mb-4">Materials Summary</h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total Items</span>
          <span className="font-medium">{totalItems}</span>
        </div>
      </div>

      {textInputs.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Text Inputs ({textInputs.length})</h4>
          <div className="space-y-2">
            {textInputs.map((input, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{input.title}</p>
                  <p className="text-xs text-gray-500">{input.input_type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {uploads.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">File Uploads ({uploads.length})</h4>
          <div className="space-y-2">
            {uploads.map((file, index) => {
              const fileId = `${Date.now()}-${file.name}`
              const progress = uploadProgress[fileId] || 0
              const isUploading = progress > 0 && progress < 100
              const isFailed = progress === -1
              
              return (
                <div key={index} className="p-2 bg-gray-50 rounded">
                  <div className="flex items-start space-x-2">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      
                      {isUploading && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-green-600 h-1.5 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{Math.round(progress)}% uploaded</p>
                        </div>
                      )}
                      
                      {progress === 100 && (
                        <p className="text-xs text-green-600 mt-1">✓ Uploaded</p>
                      )}
                      
                      {isFailed && (
                        <p className="text-xs text-red-600 mt-1">✗ Upload failed</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {docLinks.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Document Links ({docLinks.length})</h4>
          <div className="space-y-2">
            {docLinks.map((link, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                <svg className="h-5 w-5 text-blue-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {link.doc_title || 'Google Document'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{link.doc_url}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {totalItems === 0 && (
        <div className="text-center py-8 text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm">No materials added yet</p>
        </div>
      )}

      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <div className="flex">
          <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="ml-3">
            <p className="text-xs text-yellow-700">
              Files will be automatically deleted 30 days after upload
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}