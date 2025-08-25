'use client'

import React, { useState } from 'react'
import type { BookingRequestFormData, InputType } from '../types/booking-request.types'

interface BookingRequestFormProps {
  formData: BookingRequestFormData
  consultant: any
  service: any
  onChange: (updates: Partial<BookingRequestFormData>) => void
  onFileUpload: (files: File[]) => void
  onSubmit: () => void
  saving: boolean
}

export function BookingRequestForm({
  formData,
  consultant,
  service,
  onChange,
  onFileUpload,
  onSubmit,
  saving
}: BookingRequestFormProps) {
  const [activeInputMethod, setActiveInputMethod] = useState<'text' | 'file' | 'link'>('text')
  const [newTextInput, setNewTextInput] = useState({
    input_type: 'essay' as InputType,
    title: '',
    content: '',
    display_order: 0
  })
  const [newDocLink, setNewDocLink] = useState({
    doc_url: '',
    doc_title: '',
    doc_type: 'google_doc' as const,
    description: '',
    display_order: 0
  })

  const handleAddTextInput = () => {
    if (newTextInput.title && newTextInput.content) {
      onChange({
        text_inputs: [
          ...formData.text_inputs,
          { ...newTextInput, display_order: formData.text_inputs.length }
        ]
      })
      setNewTextInput({
        input_type: 'essay',
        title: '',
        content: '',
        display_order: 0
      })
    }
  }

  const handleAddDocLink = () => {
    if (newDocLink.doc_url) {
      onChange({
        doc_links: [
          ...formData.doc_links,
          { ...newDocLink, display_order: formData.doc_links.length }
        ]
      })
      setNewDocLink({
        doc_url: '',
        doc_title: '',
        doc_type: 'google_doc',
        description: '',
        display_order: 0
      })
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onFileUpload(files)
      onChange({
        file_uploads: [...formData.file_uploads, ...files]
      })
    }
  }

  const removeTextInput = (index: number) => {
    onChange({
      text_inputs: formData.text_inputs.filter((_, i) => i !== index)
    })
  }

  const removeDocLink = (index: number) => {
    onChange({
      doc_links: formData.doc_links.filter((_, i) => i !== index)
    })
  }

  const isFormValid = () => {
    // Check required fields
    if (!formData.purpose_of_service?.trim()) {
      return false
    }
    
    // Ensure purpose is at least 20 characters
    if (formData.purpose_of_service.trim().length < 20) {
      return false
    }
    
    // Check that at least one material is provided
    const hasMaterials = (
      formData.text_inputs.length > 0 || 
      formData.file_uploads.length > 0 || 
      formData.doc_links.length > 0
    )
    
    return hasMaterials
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6" id="request-details-heading">Request Details</h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="purpose-of-service" className="block text-sm font-medium text-gray-700 mb-2">
            Purpose of Service <span className="text-red-500" aria-label="required">*</span>
          </label>
          <textarea
            id="purpose-of-service"
            value={formData.purpose_of_service}
            onChange={(e) => onChange({ purpose_of_service: e.target.value })}
            placeholder="Describe what you need help with in detail (minimum 20 characters)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="additional-requirements" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Requirements
          </label>
          <textarea
            id="additional-requirements"
            value={formData.additional_requirements}
            onChange={(e) => onChange({ additional_requirements: e.target.value })}
            placeholder="Any specific requirements or preferences"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="deadline-date" className="block text-sm font-medium text-gray-700 mb-2">
              Deadline Date
            </label>
            <input
              id="deadline-date"
              type="date"
              value={formData.deadline_date}
              onChange={(e) => onChange({ deadline_date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="urgency-level" className="block text-sm font-medium text-gray-700 mb-2">
              Urgency Level
            </label>
            <select
              id="urgency-level"
              value={formData.urgency_level}
              onChange={(e) => onChange({ urgency_level: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="low">Low - Flexible timeline</option>
              <option value="medium">Medium - Within a week</option>
              <option value="high">High - Within 2-3 days</option>
              <option value="urgent">Urgent - ASAP</option>
            </select>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Add Your Materials</h3>
          
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setActiveInputMethod('text')}
              className={`px-4 py-2 rounded-lg ${
                activeInputMethod === 'text'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paste Text
            </button>
            <button
              onClick={() => setActiveInputMethod('file')}
              className={`px-4 py-2 rounded-lg ${
                activeInputMethod === 'file'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upload File
            </button>
            <button
              onClick={() => setActiveInputMethod('link')}
              className={`px-4 py-2 rounded-lg ${
                activeInputMethod === 'link'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Add Link
            </button>
          </div>

          {activeInputMethod === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={newTextInput.input_type}
                  onChange={(e) => setNewTextInput({ ...newTextInput, input_type: e.target.value as InputType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="essay">Essay</option>
                  <option value="prompt">Prompt</option>
                  <option value="notes">Notes</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newTextInput.title}
                  onChange={(e) => setNewTextInput({ ...newTextInput, title: e.target.value })}
                  placeholder="e.g., 'Common App Essay'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={newTextInput.content}
                  onChange={(e) => setNewTextInput({ ...newTextInput, content: e.target.value })}
                  placeholder="Paste your text here..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={8}
                />
              </div>
              <button
                onClick={handleAddTextInput}
                disabled={!newTextInput.title || !newTextInput.content}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
              >
                Add Text
              </button>
              {newTextInput.title && newTextInput.content && newTextInput.content.length < 50 && (
                <p className="text-sm text-orange-500 mt-1">Content should be at least 50 characters</p>
              )}
            </div>
          )}

          {activeInputMethod === 'file' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt"
                  multiple
                  onChange={handleFileSelect}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer"
                >
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-green-600 hover:underline">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, TXT up to 250MB</p>
                </label>
              </div>
              <p className="text-sm text-yellow-600">
                ⚠️ Files will be automatically deleted after 30 days
              </p>
            </div>
          )}

          {activeInputMethod === 'link' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document URL
                </label>
                <input
                  type="url"
                  value={newDocLink.doc_url}
                  onChange={(e) => setNewDocLink({ ...newDocLink, doc_url: e.target.value })}
                  placeholder="https://docs.google.com/document/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title
                </label>
                <input
                  type="text"
                  value={newDocLink.doc_title}
                  onChange={(e) => setNewDocLink({ ...newDocLink, doc_title: e.target.value })}
                  placeholder="e.g., 'Stanford Supplemental Essay'"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={newDocLink.description}
                  onChange={(e) => setNewDocLink({ ...newDocLink, description: e.target.value })}
                  placeholder="Brief description of the document"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleAddDocLink}
                disabled={!newDocLink.doc_url}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
              >
                Add Link
              </button>
            </div>
          )}
        </div>

        <div className="space-y-2">
          {formData.text_inputs.map((input, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">{input.title} ({input.input_type})</span>
              <button
                onClick={() => removeTextInput(index)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
          {formData.doc_links.map((link, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">{link.doc_title || link.doc_url}</span>
              <button
                onClick={() => removeDocLink(index)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
          <div className="text-sm text-gray-500">
            {saving && <span>Saving draft...</span>}
          </div>
          <button
            onClick={onSubmit}
            disabled={!isFormValid()}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 font-medium"
          >
            Review & Submit
          </button>
        </div>
      </div>
    </div>
  )
}