import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import MobileNavigation from '@/components/MobileNavigation'

export const metadata: Metadata = {
  title: {
    default: 'Taylor Arndt',
    template: '%s | Taylor Arndt'
  },
  description: 'Personal website of Taylor Arndt featuring professional background, resources, media appearances, and contact information.',
  keywords: ['Taylor Arndt', 'personal website', 'professional', 'developer', 'technology'],
  authors: [{ name: 'Taylor Arndt' }],
  creator: 'Taylor Arndt',
  metadataBase: new URL('https://taylorarndt.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://taylorarndt.com',
    title: 'Taylor Arndt',
    description: 'Personal website of Taylor Arndt featuring professional background, resources, media appearances, and contact information.',
    siteName: 'Taylor Arndt',
  },
  twitter: {
    card: 'summary',
    title: 'Taylor Arndt',
    description: 'Personal website of Taylor Arndt featuring professional background, resources, media appearances, and contact information.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
        ) : null}
      </head>
      <body className="min-h-dvh bg-gray-50 text-gray-900 antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        
        <div className="min-h-dvh flex flex-col">
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <a 
                  className="text-xl font-bold text-gray-900 hover:text-sky-600 transition-colors" 
                  href="/"
                  aria-label="Taylor Arndt - Home"
                >
                  Taylor Arndt
                </a>
                <nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
                  <a href="/" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    Home
                  </a>
                  <a href="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    About
                  </a>
                  <a href="/media" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    Media
                  </a>
                  <a href="/resources" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                    Resources
                  </a>
                  <a href="/contact" className="btn btn-primary">
                    Contact
                  </a>
                </nav>
                
                <MobileNavigation />
              </div>
            </div>
          </header>

          <main id="main-content" className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-sm text-gray-500">
                  © {new Date().getFullYear()} Taylor Arndt. All rights reserved.
                </div>
                <div className="flex space-x-6">
                  <a href="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    Contact
                  </a>
                  <a href="/resources" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                    Resources
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
