"use client"

import { useUser } from '@auth0/nextjs-auth0/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SubmitIdeaPage() {
  const { user, isLoading: authLoading } = useUser()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General'
  })

  const categories = [
    'General',
    'Programming/Development',
    'AI/Machine Learning',
    'Accessibility',
    'Web Development',
    'Mobile Development',
    'Career/Business',
    'Technology Trends',
    'Open Source',
    'Other'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push('/streams')
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        alert('Idea submitted successfully! It will be reviewed before appearing in the voting list.')
        router.push('/streams')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to submit idea')
      }
    } catch (err) {
      console.error('Submit error:', err)
      alert('Failed to submit idea')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto px-8">
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-8">
        <div className="text-center py-16">
          <h1 className="text-4xl font-bold mb-6 text-white">Authentication Required</h1>
          <p className="text-xl text-gray-400 mb-8">
            You need to be logged in to submit stream ideas.
          </p>
          <a href="/streams" className="btn btn-primary">
            Go to Stream Ideas
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-6 text-white">Submit Stream Idea</h1>
        <p className="text-lg text-gray-400 leading-relaxed">
          Share your idea for a live stream topic. All submissions are reviewed before being made available for voting.
        </p>
      </div>

      {/* Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
              Stream Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              minLength={3}
              maxLength={200}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter a compelling title for your stream idea"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.title.length}/200 characters
            </p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-white mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              minLength={10}
              maxLength={2000}
              rows={6}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              placeholder="Describe your stream idea in detail. What topics would be covered? What would viewers learn or gain from this stream?"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/2000 characters
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Idea'}
            </button>
            <a 
              href="/streams" 
              className="px-6 py-3 border border-gray-600 text-white hover:bg-gray-800 rounded-lg font-medium transition-colors text-center"
            >
              Cancel
            </a>
          </div>
        </form>

        {/* Info */}
        <div className="mt-8 p-4 bg-gray-800 border border-gray-700 rounded-lg">
          <h3 className="text-sm font-medium text-white mb-2">What happens next?</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Your idea will be reviewed by the admin</li>
            <li>• If approved, it will appear in the voting list</li>
            <li>• Community members can vote on approved ideas</li>
            <li>• Popular ideas may be scheduled for live streaming</li>
            <li>• You'll be notified when your idea is approved or scheduled</li>
          </ul>
        </div>
      </div>
    </div>
  )
}