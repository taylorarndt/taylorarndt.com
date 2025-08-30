import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import ServerSidebar from '../components/ServerSidebar'
import Providers from '../components/Providers'

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
        <Providers>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            {/* Server-rendered to avoid client hooks during prerender */}
            <ServerSidebar />

            {/* Main Content */}
            <main className="flex-1 p-12 flex items-center justify-center min-h-screen bg-black">
              <div className="w-full">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
