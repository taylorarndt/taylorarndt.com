'use client'

import { useState, useEffect } from 'react'

interface Stream {
  id: string
  title: string
  description: string
  category: string
  status: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled'
  submittedBy: string
  submittedAt: string
  scheduledDate?: string
  youtubeLink?: string
  completedAt?: string
}

interface QuickEditModalProps {
  stream: Stream | null
  isOpen: boolean
  onClose: () => void
  onSave: (streamId: string, updates: Partial<Stream>) => Promise<void>
}

export default function QuickEditModal({ stream, isOpen, onClose, onSave }: QuickEditModalProps) {
  const [formData, setFormData] = useState({
    status: '',
    scheduledDate: '',
    youtubeLink: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (stream) {
      setFormData({
        status: stream.status,
        scheduledDate: stream.scheduledDate ? new Date(stream.scheduledDate).toISOString().slice(0, 16) : '',
        youtubeLink: stream.youtubeLink || ''
      })
    }
  }, [stream])

  const handleSave = async () => {
    if (!stream) return
    
    setSaving(true)
    try {
      const updates: Partial<Stream> = {}
      
      if (formData.status !== stream.status) {
        updates.status = formData.status as Stream['status']
      }
      
      if (formData.scheduledDate && formData.scheduledDate !== (stream.scheduledDate ? new Date(stream.scheduledDate).toISOString().slice(0, 16) : '')) {
        updates.scheduledDate = new Date(formData.scheduledDate).toISOString()
      }
      
      if (formData.youtubeLink !== (stream.youtubeLink || '')) {
        updates.youtubeLink = formData.youtubeLink
      }
      
      await onSave(stream.id, updates)
      onClose()
    } catch (error) {
      console.error('Failed to save stream updates:', error)
      alert('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen || !stream) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Quick Edit Stream</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-white mb-2">{stream.title}</h3>
            <p className="text-gray-400 text-sm">{stream.description}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Live">Live</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Scheduled Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledDate}
              onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              YouTube Link
            </label>
            <input
              type="url"
              value={formData.youtubeLink}
              onChange={(e) => setFormData(prev => ({ ...prev, youtubeLink: e.target.value }))}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 border border-gray-600 text-gray-300 hover:bg-gray-800 rounded transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}