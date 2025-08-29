import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'taylorarndt.com',
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
      <body className="min-h-dvh bg-white text-slate-900">
        <div className="mx-auto max-w-5xl px-4">
          <header className="flex items-center justify-between py-4 border-b">
            <a className="font-bold" href="/">taylorarndt.com</a>
            <nav className="flex gap-4 text-slate-600">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/media">Media</a>
              <a href="/resources" className="text-teal-600 font-medium">Resources</a>
            </nav>
          </header>
          <main className="py-8">{children}</main>
          <footer className="py-6 border-t text-sm text-slate-500">© Taylor Arndt — taylorarndt.com</footer>
        </div>
      </body>
    </html>
  )
}
