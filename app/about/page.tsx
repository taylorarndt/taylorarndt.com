import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Taylor Arndt\'s professional background, expertise, and journey in technology.',
}

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          About <span className="text-sky-600">Taylor Arndt</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Technology professional passionate about innovation, problem-solving, and building meaningful connections in the tech community.
        </p>
      </section>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Bio Section */}
        <div className="lg:col-span-2 space-y-8">
          <section className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Professional Background</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              With a strong foundation in technology and a passion for innovation, I've dedicated my career to 
              solving complex problems and driving meaningful change in the digital landscape. My journey spans 
              various aspects of technology, from development and architecture to strategy and leadership.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              I believe in the power of technology to transform businesses and improve lives. Whether working 
              on cutting-edge projects or mentoring the next generation of tech professionals, I'm committed 
              to making a positive impact in everything I do.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Areas of Expertise</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Technology Strategy</h3>
                <p className="text-gray-600 text-sm">Strategic planning and implementation of technology solutions</p>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Software Development</h3>
                <p className="text-gray-600 text-sm">Full-stack development and system architecture</p>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Team Leadership</h3>
                <p className="text-gray-600 text-sm">Building and leading high-performing technology teams</p>
              </div>
              <div className="card p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600 text-sm">Driving innovation and digital transformation initiatives</p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Profile Card */}
          <div className="card p-6 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-sky-100 to-teal-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-16 h-16 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Taylor Arndt</h3>
            <p className="text-gray-600 text-sm mb-4">Technology Professional</p>
            <div className="flex justify-center space-x-3">
              <a href="/contact" className="btn btn-primary text-sm">
                Get In Touch
              </a>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Facts</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-medium text-gray-900">Remote</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Focus</span>
                <span className="font-medium text-gray-900">Technology</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Interests</span>
                <span className="font-medium text-gray-900">Innovation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-sky-50 to-teal-50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Let's Work Together</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Interested in collaborating on a project or discussing technology trends? 
          I'd love to connect and explore opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/contact" className="btn btn-secondary">
            Start a Conversation
          </a>
          <a href="/media" className="btn btn-outline">
            View Media Appearances
          </a>
        </div>
      </section>
    </div>
  )
}
