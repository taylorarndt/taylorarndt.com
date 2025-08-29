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
        <h2 className="text-4xl font-bold mb-12 text-center text-white">Latest Content</h2>
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
      </div>
    </div>
  )
}