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
      <body>
        <header className="site-header">
          <div className="container">
            <a className="brand" href="/">taylorarndt.com</a>
            <input id="nav-toggle" type="checkbox" hidden />
            <label htmlFor="nav-toggle" className="nav-toggle-label">☰</label>
            <nav className="site-nav">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/media">Media</a>
              <a href="/resources" className="cta">Resources</a>
            </nav>
          </div>
        </header>

        <main className="container">{children}</main>

        <footer className="site-footer">
          <div className="container">© Taylor Arndt — taylorarndt.com</div>
        </footer>
      </body>
    </html>
  )
}
