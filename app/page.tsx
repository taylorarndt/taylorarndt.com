export default function HomePage() {
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
        <h2 className="text-2xl font-semibold text-white mb-8 flex items-center justify-center">
          <span className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 1L7.5 4H3v12h14V4h-4.5L10 1zM8.414 6l1-1h1.172l1 1H14v8H6V6h2.414z" />
            </svg>
          </span>
          Latest Content
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="card p-6 hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-600">
                Profile
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              About Taylor
            </h3>
            <p className="text-gray-600 mb-4">
              Learn about Taylor's background, expertise, and professional journey in detail.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Professional Background
              </span>
              <a
                href="/about"
                className="link font-medium"
              >
                Learn More →
              </a>
            </div>
          </div>
          
          <div className="card p-6 hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                Media
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Media & Appearances
            </h3>
            <p className="text-gray-600 mb-4">
              Check out podcasts, interviews, and media appearances featuring Taylor.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Podcasts & Interviews
              </span>
              <a
                href="/media"
                className="link font-medium"
              >
                View All →
              </a>
            </div>
          </div>
          
          <div className="card p-6 hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                Resources
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Resources
            </h3>
            <p className="text-gray-600 mb-4">
              Access curated resources, tools, and helpful links from Taylor.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Tools & Links
              </span>
              <a
                href="/resources"
                className="link font-medium"
              >
                Explore →
              </a>
            </div>
          </div>
          
          <div className="card p-6 hover:scale-105 transition-transform">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-600">
                Contact
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Get In Touch
            </h3>
            <p className="text-gray-600 mb-4">
              Connect with Taylor for collaborations, speaking opportunities, or general inquiries.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Collaboration & Inquiries
              </span>
              <a
                href="/contact"
                className="link font-medium"
              >
                Contact →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}