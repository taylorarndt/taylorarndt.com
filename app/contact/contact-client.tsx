"use client"
import { useState } from 'react'

// Note: Metadata export must be in a server component, but this is a client component
// The metadata will be handled in a separate server component wrapper or layout

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)
    setStatusType(null)
    const form = e.currentTarget
    const data = new FormData(form)
    
    // Basic client-side validation
    const formData = {
      name: data.get('name') as string,
      email: data.get('email') as string,
      message: data.get('message') as string,
      website: data.get('website') as string, // honeypot
    }

    // Honeypot check
    if (formData.website) {
      setStatus('Invalid submission detected.')
      setStatusType('error')
      setSubmitting(false)
      return
    }

    // Validation
    if (!formData.name.trim() || formData.name.length < 2) {
      setStatus('Please enter a valid name (at least 2 characters).')
      setStatusType('error')
      setSubmitting(false)
      return
    }

    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatus('Please enter a valid email address.')
      setStatusType('error')
      setSubmitting(false)
      return
    }

    if (!formData.message.trim() || formData.message.length < 10) {
      setStatus('Please enter a message (at least 10 characters).')
      setStatusType('error')
      setSubmitting(false)
      return
    }

    if (formData.message.length > 2000) {
      setStatus('Message is too long (maximum 2000 characters).')
      setStatusType('error')
      setSubmitting(false)
      return
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to send')
      setStatus('Thanks! Your message has been sent successfully. I\'ll get back to you soon.')
      setStatusType('success')
      form.reset()
    } catch (err: any) {
      setStatus(err.message || 'Something went wrong. Please try again or email me directly.')
      setStatusType('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          <span className="text-sky-600">Get</span> In Touch
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Have a question, collaboration idea, or just want to say hello? I'd love to hear from you. 
          Choose your preferred way to connect below.
        </p>
      </section>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <a href="mailto:hello@taylorarndt.com" className="link">
                    hello@taylorarndt.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Response Time</h3>
                  <p className="text-gray-600">Usually within 24-48 hours</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <p className="text-gray-600">Remote / Available Worldwide</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Expect</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Quick response within 24-48 hours</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Personalized and thoughtful replies</span>
              </li>
              <li className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Confidential and professional handling</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send a Message</h2>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Honeypot field */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Do not fill this out</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="name">
                Name *
              </label>
              <input 
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors" 
                id="name" 
                name="name" 
                type="text"
                required 
                minLength={2}
                maxLength={100}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="email">
                Email Address *
              </label>
              <input 
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors" 
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="subject">
                Subject (Optional)
              </label>
              <input 
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors" 
                id="subject" 
                name="subject" 
                type="text"
                maxLength={200}
                placeholder="Brief description of your inquiry"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2" htmlFor="message">
                Message *
              </label>
              <textarea 
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors" 
                id="message" 
                name="message" 
                rows={6} 
                required 
                minLength={10}
                maxLength={2000}
                placeholder="Tell me about your project, question, or how I can help you..."
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 10 characters, maximum 2000 characters</p>
            </div>

            {/* Turnstile placeholder */}
            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
              <div>
                <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}></div>
              </div>
            )}

            <button 
              disabled={submitting} 
              className="btn btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed" 
              type="submit"
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Message...
                </span>
              ) : (
                'Send Message'
              )}
            </button>

            {status && (
              <div className={`p-4 rounded-lg ${
                statusType === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {statusType === 'success' ? (
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{status}</p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
