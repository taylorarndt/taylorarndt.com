import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Media',
  description: 'Podcast appearances, speaking engagements, interviews, and media coverage featuring Taylor Arndt.',
}

// Sample media items - in a real implementation, this could come from a JSON file or CMS
const mediaItems = [
  {
    id: 'podcast-tech-talks',
    title: 'Tech Innovation and Future Trends',
    type: 'Podcast',
    platform: 'Tech Talks Podcast',
    date: '2024-01-15',
    summary: 'Discussion on emerging technologies, innovation strategies, and the future of the tech industry.',
    url: '#',
    duration: '45 mins',
    featured: true
  },
  {
    id: 'conference-2024',
    title: 'Building Scalable Technology Teams',
    type: 'Speaking',
    platform: 'Tech Conference 2024',
    date: '2024-01-10',
    summary: 'Keynote presentation on effective strategies for building and leading high-performing technology teams.',
    url: '#',
    duration: '30 mins',
    featured: true
  },
  {
    id: 'interview-industry',
    title: 'Leadership in Technology',
    type: 'Interview',
    platform: 'Industry Magazine',
    date: '2024-01-05',
    summary: 'In-depth interview discussing leadership principles, technology strategy, and career development.',
    url: '#',
    duration: '20 mins',
    featured: false
  },
  {
    id: 'panel-discussion',
    title: 'Digital Transformation Panel',
    type: 'Panel',
    platform: 'Business Summit',
    date: '2023-12-20',
    summary: 'Panel discussion on digital transformation strategies and implementation best practices.',
    url: '#',
    duration: '60 mins',
    featured: false
  },
  {
    id: 'podcast-startup',
    title: 'Innovation and Entrepreneurship',
    type: 'Podcast',
    platform: 'Startup Stories',
    date: '2023-12-15',
    summary: 'Exploring the intersection of technology innovation and entrepreneurial success.',
    url: '#',
    duration: '35 mins',
    featured: false
  }
]

export default function MediaPage() {
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
      case 'podcast':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )
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

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'podcast':
        return 'bg-purple-100 text-purple-600'
      case 'speaking':
        return 'bg-sky-100 text-sky-600'
      case 'interview':
        return 'bg-teal-100 text-teal-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          <span className="text-sky-600">Media</span> & Appearances
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Podcast appearances, speaking engagements, interviews, and media coverage showcasing insights on technology, leadership, and innovation.
        </p>
      </section>

      {/* Featured Media */}
      {featuredItems.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
            <span className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1L7.5 4H3v12h14V4h-4.5L10 1zM8.414 6l1-1h1.172l1 1H14v8H6V6h2.414z" />
              </svg>
            </span>
            Featured Appearances
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredItems.map((item) => (
              <div key={item.id} className="card p-6 hover:scale-105 transition-transform">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <span className="text-sm text-gray-500">{item.duration}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <div className="flex items-center space-x-2 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-600">{item.platform}</span>
                </div>
                <p className="text-gray-600 mb-4">
                  {item.summary}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {formatDate(item.date)}
                  </span>
                  <a
                    href={item.url}
                    className="link font-medium"
                    target={item.url.startsWith('#') ? '_self' : '_blank'}
                    rel={item.url.startsWith('#') ? undefined : 'noopener noreferrer'}
                  >
                    View →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Media */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-8 flex items-center">
          <span className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
            <div className="w-3 h-3 bg-teal-600 rounded-full"></div>
          </span>
          Recent Appearances
        </h2>
        <div className="grid gap-6">
          {otherItems.map((item) => (
            <div key={item.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    {item.summary}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{item.platform}</span>
                    <span>•</span>
                    <span>{formatDate(item.date)}</span>
                    <span>•</span>
                    <span>{item.duration}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6">
                  <a
                    href={item.url}
                    className="btn btn-outline text-sm"
                    target={item.url.startsWith('#') ? '_self' : '_blank'}
                    rel={item.url.startsWith('#') ? undefined : 'noopener noreferrer'}
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-sky-50 to-teal-50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Speaking Opportunities</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Interested in having me speak at your event, appear on your podcast, or participate in an interview? 
          I'd love to share insights on technology, leadership, and innovation.
        </p>
        <a href="/contact" className="btn btn-secondary">
          Book a Speaking Engagement
        </a>
      </section>
    </div>
  )
}
