import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'taylorarndt.com — Home',
  description: 'Taylor Arndt — personal site with links, resources, and media.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
        ) : null}
      </head>
      <body className="min-h-screen bg-black text-white">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-900 p-6 border-r border-gray-800">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold">TA</span>
              </div>
            </div>
            <nav className="space-y-2">
              <a href="/" className="flex items-center gap-3 px-3 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors">
                <span>Home</span>
              </a>
              <a href="/about" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                <span>About</span>
              </a>
              <a href="/contact" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                <span>Contact</span>
              </a>
              <a href="/media" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                <span>Media</span>
              </a>
              <a href="/resources" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                <span>Resources</span>
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-12 flex items-center justify-center min-h-screen bg-black">
            <div className="w-full">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
