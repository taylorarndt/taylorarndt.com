'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

interface MediaItem {
  id: string
  title: string
  url: string
  summary: string
  date: string
  image?: string
  source: 'youtube' | 'substack'
  type: string
  platform: string
  featured: boolean
  duration?: string
}

export default function MediaPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMediaItems() {
      try {
        const response = await fetch('/api/media/rss?limit=20')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setMediaItems(data.items || [])
      } catch (err) {
        console.error('Failed to fetch media items:', err)
        setError('Failed to load media content')
      } finally {
        setLoading(false)
      }
    }

    fetchMediaItems()
  }, [])

  const featuredItems = mediaItems.filter(item => item.featured)
  const otherItems = mediaItems.filter(item => !item.featured)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'video':
      case 'podcast':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a1 1 0 011-1h4a1 1 0 011 1v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5" />
          </svg>
        )
      case 'article':
      case 'speaking':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )
      case 'interview':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )
    }
  }

  const getTypeColor = (type: string, source?: string) => {
    if (source === 'youtube') {
      return 'bg-red-900 text-red-400 border border-red-800'
    }
    if (source === 'substack') {
      return 'bg-orange-900 text-orange-400 border border-orange-800'
    }
    
    switch (type.toLowerCase()) {
      case 'video':
      case 'podcast':
        return 'bg-purple-900 text-purple-400 border border-purple-800'
      case 'article':
      case 'speaking':
        return 'bg-blue-900 text-blue-400 border border-blue-800'
      case 'interview':
        return 'bg-teal-900 text-teal-400 border border-teal-800'
      default:
        return 'bg-gray-800 text-gray-400 border border-gray-700'
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-12">
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            <span className="text-blue-500">Media</span> & Appearances
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Latest content from YouTube videos and Substack articles showcasing insights on technology, leadership, and innovation.
          </p>
        </section>
        
        <section className="text-center py-12">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Loading content...</h3>
          <p className="text-gray-400">Fetching latest content from RSS feeds.</p>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto space-y-12">
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            <span className="text-blue-500">Media</span> & Appearances
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Latest content from YouTube videos and Substack articles showcasing insights on technology, leadership, and innovation.
          </p>
        </section>
        
        <section className="text-center py-12">
          <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Error loading content</h3>
          <p className="text-gray-400">{error}</p>
        </section>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          <span className="text-blue-500">Media</span> & Appearances
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Latest content from YouTube videos and Substack articles showcasing insights on technology, leadership, and innovation.
        </p>
      </section>

      {/* Featured Media */}
      {featuredItems.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-white mb-8 flex items-center">
            <span className="w-8 h-8 bg-blue-900 border border-blue-800 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1L7.5 4H3v12h14V4h-4.5L10 1zM8.414 6l1-1h1.172l1 1H14v8H6V6h2.414z" />
              </svg>
            </span>
            Featured Content
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredItems.map((item) => (
              <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:bg-gray-800 transition-all hover:border-gray-700">
                {/* Image */}
                {item.image && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(item.type, item.source)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <span className="text-sm text-gray-400">{item.duration}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type, item.source)}`}>
                      {item.type}
                    </span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-400">{item.platform}</span>
                  </div>
                  <p className="text-gray-400 mb-4 line-clamp-3">
                    {item.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {formatDate(item.date)}
                    </span>
                    <a
                      href={item.url}
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      target={item.url.startsWith('#') ? '_self' : '_blank'}
                      rel={item.url.startsWith('#') ? undefined : 'noopener noreferrer'}
                    >
                      View →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Media */}
      <section>
        <h2 className="text-2xl font-semibold text-white mb-8 flex items-center">
          <span className="w-8 h-8 bg-teal-900 border border-teal-800 rounded-lg flex items-center justify-center mr-3">
            <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
          </span>
          Recent Content
        </h2>
        
        {/* Grid Layout for All Items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherItems.map((item) => (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:bg-gray-800 transition-all hover:border-gray-700">
              {/* Image */}
              {item.image && (
                <div className="relative h-40 w-full">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-6 h-6 rounded flex items-center justify-center ${getTypeColor(item.type, item.source)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type, item.source)}`}>
                    {item.type}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-gray-400 mb-3 text-sm line-clamp-3">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-gray-500">{item.platform}</span>
                  <span className="text-gray-500">{formatDate(item.date)}</span>
                </div>
                <div className="mt-3">
                  <a
                    href={item.url}
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 hover:border-gray-600 rounded-lg font-medium transition-colors text-sm"
                    target={item.url.startsWith('#') ? '_self' : '_blank'}
                    rel={item.url.startsWith('#') ? undefined : 'noopener noreferrer'}
                  >
                    View {item.type}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show message if no items */}
        {mediaItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No content available</h3>
            <p className="text-gray-400">Content from RSS feeds will appear here when available.</p>
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Speaking Opportunities</h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          Interested in having me speak at your event, appear on your podcast, or participate in an interview? 
          I'd love to share insights on technology, leadership, and innovation.
        </p>
        <a href="/contact" className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-colors text-lg">
          Book a Speaking Engagement
        </a>
      </section>
    </div>
  )
}
