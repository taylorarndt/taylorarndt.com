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
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          About <span className="text-sky-400">Taylor Arndt</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Accessibility leader and technologist focused on AI, inclusive design, and building practical digital solutions that work for real people.
        </p>
      </section>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-12">
        {/* Bio Section */}
        <div className="lg:col-span-2 space-y-8">
          <section className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-white mb-4">Early life & learning</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              I was born blind in a small town in Michigan where accessibility wasn’t always a priority. Growing up, I had to find my own way, and I quickly learned that determination and creativity could open doors that weren’t built for me.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              At 14, I discovered coding, starting with HTML and CSS. For me, these weren’t just programming languages — they were tools of independence. Later, Python became another key that helped me build solutions to make technology more inclusive.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Independence & resilience</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              At 17, I moved out on my own while still in high school, juggling college classes and independence in a rural area where I couldn’t drive and public transportation didn’t exist. Those years taught me grit and resilience — lessons I carry into every part of my work today.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">From job loss to entrepreneurship</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              When the pandemic arrived in 2020 and I lost my role as an accessibility tester at a university, I refused to see it as the end of the road. Instead, I started my own business, working with governments, nonprofits, and companies to make their digital spaces more accessible. What began as survival quickly grew into a calling.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Career highlights</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Since then, I’ve worked at Accessible360, where I expanded my skills and guided organizations through accessibility challenges. Later, I stepped back into self-employment, building accessible WordPress plugins and exploring how AI could become a powerful tool for accessibility.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              Today, I am the Chief Accessibility Officer at Techopolis Online Solutions, where I lead accessibility efforts, audit digital platforms, and design inclusive apps. Along the way, I’ve learned Swift to create accessible iOS apps and taken on projects that blend AI and accessibility in meaningful ways.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Why I do this work</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              Accessibility isn’t just my career. It’s my life. As someone who is blind and neurodivergent, I know firsthand the frustrations of being excluded by design choices. My work is about making sure no one else has to face those barriers.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
              I believe in building practical solutions that work for real people. I believe in designing technology so that everyone, regardless of ability, can participate fully. And I believe in sharing knowledge, because when we teach and mentor, we lift entire communities.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">A little about me</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              I now call Austin, Texas home. Outside of work, I love bowling with friends, swimming, and experiencing the city’s music scene. These things keep me grounded and remind me that accessibility is about more than standards or checklists — it’s about giving people the chance to live fully and enjoy everyday life.
            </p>

            <h2 className="text-2xl font-semibold text-white mb-4">Looking ahead</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              I am excited about the future of accessibility. AI and other emerging technologies are creating opportunities to make the world more adaptive and responsive. My role is to make sure those tools are built in a way that truly serves everyone.
            </p>

            <p className="text-gray-400 leading-relaxed">
              If you’re looking for someone who combines technical expertise with lived experience, and who will always put people first, I’d love to work with you.
            </p>
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
            <h3 className="text-lg font-semibold text-white mb-2">Taylor Arndt</h3>
            <p className="text-gray-400 text-sm mb-4">Chief Accessibility Officer & Consultant</p>
            <div className="flex justify-center space-x-3">
              <a href="/contact" className="btn btn-primary text-sm">
                Get In Touch
              </a>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Facts</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Location</span>
                <span className="font-medium text-white">Austin, TX</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Focus</span>
                <span className="font-medium text-white">Accessibility, AI, Inclusive Design</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Interests</span>
                <span className="font-medium text-white">Bowling, Swimming, Music</span>
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
