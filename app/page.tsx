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

export default function HomePage() {
  const [latestItems, setLatestItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLatestContent() {
      try {
        const response = await fetch('/api/media/rss?limit=6')
        if (response.ok) {
          const data = await response.json()
          setLatestItems(data.items.slice(0, 6) || [])
        }
      } catch (err) {
        console.error('Failed to fetch latest content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestContent()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-8">
      {/* Welcome Section */}
      <div className="text-center mb-20 py-16">
        <h1 className="text-6xl font-bold mb-8 text-white">Welcome to Taylor Arndt</h1>
        <p className="text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12">
          Taylor Arndt, a community for users to share insights, resources, and connect. 
          If you have not already done so, please explore the site to learn more about Taylor, 
          access valuable resources, and get in touch. Our content is regularly updated with 
          fresh insights and information.
        </p>
        <div className="flex justify-center gap-6">
          <a 
            href="/about" 
            className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium transition-colors text-lg"
          >
            Learn More About Taylor
            <span>→</span>
          </a>
          <a 
            href="/contact" 
            className="inline-flex items-center gap-3 border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-lg font-medium transition-colors text-lg hover:bg-gray-900"
          >
            Get In Touch
          </a>
        </div>
      </div>

      {/* Latest Content Section */}
      <div className="mt-24 mb-16">
        <h2 className="text-4xl font-bold mb-12 text-center text-white">Latest Content</h2>
        
        {loading ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-8 animate-pulse">
                <div className="w-16 h-16 bg-gray-800 rounded-xl mb-6 mx-auto"></div>
                <div className="h-4 bg-gray-800 rounded mb-4"></div>
                <div className="h-3 bg-gray-800 rounded mb-2"></div>
                <div className="h-3 bg-gray-800 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : latestItems.length > 0 ? (
          <div className="space-y-8 max-w-5xl mx-auto">
            {/* Featured Latest Item */}
            {latestItems[0] && (
              <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors">
                <div className="md:flex">
                  {latestItems[0].image && (
                    <div className="md:w-1/3">
                      <div className="relative h-48 md:h-full">
                        <Image
                          src={latestItems[0].image}
                          alt={latestItems[0].title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    </div>
                  )}
                  <div className="p-8 md:w-2/3">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        latestItems[0].source === 'youtube' 
                          ? 'bg-red-900 text-red-400 border border-red-800' 
                          : 'bg-orange-900 text-orange-400 border border-orange-800'
                      }`}>
                        {latestItems[0].source === 'youtube' ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a1 1 0 011-1h4a1 1 0 011 1v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        latestItems[0].source === 'youtube' 
                          ? 'bg-red-900 text-red-400 border border-red-800' 
                          : 'bg-orange-900 text-orange-400 border border-orange-800'
                      }`}>
                        {latestItems[0].type}
                      </span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-400">{formatDate(latestItems[0].date)}</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-white line-clamp-2">
                      {latestItems[0].title}
                    </h3>
                    <p className="text-gray-400 mb-6 line-clamp-3">
                      {latestItems[0].summary}
                    </p>
                    <a
                      href={latestItems[0].url}
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on {latestItems[0].platform} →
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Grid of Other Recent Items */}
            {latestItems.slice(1).length > 0 && (
              <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
                {latestItems.slice(1).map((item) => (
                  <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors">
                    {item.image && (
                      <div className="relative h-32 w-full">
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
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-6 h-6 rounded flex items-center justify-center ${
                          item.source === 'youtube' 
                            ? 'bg-red-900 text-red-400 border border-red-800' 
                            : 'bg-orange-900 text-orange-400 border border-orange-800'
                        }`}>
                          {item.source === 'youtube' ? (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10V9a1 1 0 011-1h4a1 1 0 011 1v1M9 10v5a2 2 0 002 2h2a2 2 0 002-2v-5" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(item.date)}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-white line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {item.summary}
                      </p>
                      <a
                        href={item.url}
                        className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View All Link */}
            <div className="text-center mt-8">
              <a 
                href="/media" 
                className="inline-flex items-center gap-3 border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-lg font-medium transition-colors text-lg hover:bg-gray-900"
              >
                View All Media & Appearances
                <span>→</span>
              </a>
            </div>
          </div>
        ) : (
          // Fallback static content when no RSS items are available
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:bg-gray-800 transition-colors text-center">
              <div className="w-16 h-16 bg-green-600 rounded-xl mb-6 flex items-center justify-center mx-auto">
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">About Taylor</h3>
              <p className="text-gray-400 leading-relaxed">Learn about Taylor's background, expertise, and professional journey in detail.</p>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:bg-gray-800 transition-colors text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-xl mb-6 flex items-center justify-center mx-auto">
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Media & Appearances</h3>
              <p className="text-gray-400 leading-relaxed">Check out podcasts, interviews, and media appearances featuring Taylor.</p>
            </div>
            
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:bg-gray-800 transition-colors text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-xl mb-6 flex items-center justify-center mx-auto">
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Resources</h3>
              <p className="text-gray-400 leading-relaxed">Access curated resources, tools, and helpful links from Taylor.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}