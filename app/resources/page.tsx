import type { Metadata } from 'next'
import raw from '@/data/resources.json'

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Curated collection of links, profiles, and resources about Taylor Arndt\'s work and interests.',
}

type Resource = {
  id: string
  title: string
  url: string
  summary: string
  tags: string[]
  updatedAt: string
}

const resources = raw as Resource[]

export default function ResourcesPage() {
  // Group resources by primary tag
  const groupedResources = resources.reduce((acc, resource) => {
    const primaryTag = resource.tags[0] || 'other'
    if (!acc[primaryTag]) {
      acc[primaryTag] = []
    }
    acc[primaryTag].push(resource)
    return acc
  }, {} as Record<string, Resource[]>)

  const tagDisplayNames: Record<string, string> = {
    'development': 'Development',
    'professional': 'Professional',
    'projects': 'Projects',
    'writing': 'Writing & Content',
    'speaking': 'Speaking & Events',
    'media': 'Media & Press',
    'other': 'Other Resources'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          <span className="text-sky-600">Resources</span> & Links
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Curated collection of links, profiles, and resources about my work, projects, and professional presence across various platforms.
        </p>
      </section>

      {/* Resources Grid */}
      <section className="space-y-12">
        {Object.entries(groupedResources).map(([tag, tagResources]) => (
          <div key={tag}>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center mr-3">
                <div className="w-3 h-3 bg-sky-600 rounded-full"></div>
              </span>
              {tagDisplayNames[tag] || tag}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tagResources.map((resource) => (
                <div key={resource.id} className="card p-6 hover:scale-105 transition-transform">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {resource.title}
                    </h3>
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {resource.summary}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <a
                      href={resource.url}
                      target={resource.url.startsWith('#') ? '_self' : '_blank'}
                      rel={resource.url.startsWith('#') ? undefined : 'noopener noreferrer'}
                      className="link font-medium"
                    >
                      Visit Resource →
                    </a>
                    <span className="text-xs text-gray-500">
                      Updated {formatDate(resource.updatedAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Additional Info */}
      <section className="bg-gradient-to-br from-sky-50 to-teal-50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Looking for Something Specific?</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Can't find what you're looking for? Feel free to reach out directly for specific information, 
          collaborations, or to suggest additional resources to include.
        </p>
        <a href="/contact" className="btn btn-secondary">
          Contact Me
        </a>
      </section>
    </div>
  )
}
