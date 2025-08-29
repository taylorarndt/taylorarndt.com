import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Taylor Arndt\'s personal website. Explore my professional background, resources, media appearances, and get in touch.',
}

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
          Hi, I'm <span className="text-sky-600">Taylor Arndt</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Welcome to my personal website. Explore my professional background, discover curated resources, 
          and learn about my media appearances and speaking engagements.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <a href="/about" className="btn btn-primary">
            Learn About Me
          </a>
          <a href="/contact" className="btn btn-outline">
            Get In Touch
          </a>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="card p-6 text-center hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">About Me</h3>
          <p className="text-gray-600 mb-4">Learn about my professional background, expertise, and journey in technology.</p>
          <a href="/about" className="link">Discover more →</a>
        </div>

        <div className="card p-6 text-center hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Resources</h3>
          <p className="text-gray-600 mb-4">Curated collection of links, profiles, and resources about my work and interests.</p>
          <a href="/resources" className="link">Explore resources →</a>
        </div>

        <div className="card p-6 text-center hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Media</h3>
          <p className="text-gray-600 mb-4">Podcast appearances, speaking engagements, and media coverage.</p>
          <a href="/media" className="link">View appearances →</a>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-sky-50 to-teal-50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Connect</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Interested in collaborating, have a question, or just want to say hello? 
          I'd love to hear from you.
        </p>
        <a href="/contact" className="btn btn-secondary">
          Send Me a Message
        </a>
      </section>
    </div>
  )
}