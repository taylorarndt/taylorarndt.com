"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

interface MediaItem {
  id: string
  title: string
  url: string
  summary?: string
  description?: string
  date: string
  image?: string
  source: "youtube" | "substack"
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
        const response = await fetch("/api/media/rss?limit=6")
        if (response.ok) {
          const data = await response.json()
          setLatestItems((data.items || []).slice(0, 6))
        }
      } catch (err) {
        console.error("Failed to fetch latest content:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestContent()
  }, [])

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return isNaN(d.getTime())
      ? ""
      : d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="max-w-6xl mx-auto px-8">
      {/* Welcome Section */}
      <div className="text-center mb-20 py-16">
        <h1 className="text-6xl font-bold mb-8 text-white">Welcome to Taylor Arndt</h1>
        <p className="text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12">
          I'm Taylor Arndt, and I help people and organizations harness the power of technology in ways that are accessible, practical, and impactful. My work focuses on AI, accessibility, and building digital solutions that make life and business better.
        </p>
        <div className="flex justify-center gap-6">
          <a href="/about" className="btn btn-primary text-lg px-8 py-4">
            Learn More About Taylor <span aria-hidden="true">→</span>
          </a>
          <a href="/contact" className="btn text-lg px-8 py-4 border border-gray-600 text-white hover:bg-gray-900">
            Get In Touch
          </a>
        </div>
      </div>

      {/* Latest Content Section */}
      <div className="mt-24 mb-16">
        <h2 className="text-4xl font-bold mb-12 text-center text-white">Latest Content</h2>

        {loading ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-8 animate-pulse">
                <div className="w-full h-32 bg-gray-800 rounded-lg mb-6" />
                <div className="h-4 bg-gray-800 rounded mb-3 w-3/4" />
                <div className="h-3 bg-gray-800 rounded mb-2 w-full" />
                <div className="h-3 bg-gray-800 rounded w-5/6" />
              </div>
            ))}
          </div>
        ) : latestItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {latestItems.map((item) => (
              <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:bg-gray-800 transition-colors">
                {item.image ? (
                  <div className="relative h-40 w-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                ) : null}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge">
                      {item.platform || (item.source === "youtube" ? "YouTube" : "Substack")}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(item.date)}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white line-clamp-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {item.summary || item.description || ""}
                  </p>
                  <a
                    href={item.url}
                    className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors inline-flex items-center gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${item.title} on ${item.platform || (item.source === 'youtube' ? 'YouTube' : 'Substack')}`}
                  >
                    View <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Fallback static content when no RSS items are available
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:bg-gray-800 transition-colors text-center">
              <div className="w-16 h-16 bg-green-600 rounded-xl mb-6 flex items-center justify-center mx-auto"></div>
              <h3 className="text-xl font-semibold mb-4 text-white">About Taylor</h3>
              <p className="text-gray-400 leading-relaxed">Learn about Taylor's background, expertise, and professional journey in detail.</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:bg-gray-800 transition-colors text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-xl mb-6 flex items-center justify-center mx-auto"></div>
              <h3 className="text-xl font-semibold mb-4 text-white">Media & Appearances</h3>
              <p className="text-gray-400 leading-relaxed">Check out podcasts, interviews, and media appearances featuring Taylor.</p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:bg-gray-800 transition-colors text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-xl mb-6 flex items-center justify-center mx-auto"></div>
              <h3 className="text-xl font-semibold mb-4 text-white">Resources</h3>
              <p className="text-gray-400 leading-relaxed">Access curated resources, tools, and helpful links from Taylor.</p>
            </div>
          </div>
        )}

        {/* View All Link */}
        {latestItems.length > 0 && (
          <div className="text-center mt-10">
            <a href="/media" className="btn text-lg px-8 py-4 border border-gray-600 text-white hover:bg-gray-900 inline-flex items-center gap-2">
              View All Media & Appearances <span aria-hidden="true">→</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
