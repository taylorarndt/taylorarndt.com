"use client"
import { useState } from 'react'

// Note: Metadata export must be in a server component, but this is a client component
// The metadata will be handled in a separate server component wrapper or layout

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null)
  const inputClass = "w-full rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"

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
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          <span className="text-sky-400">Get</span> In Touch
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Have a question, collaboration idea, or just want to say hello? I'd love to hear from you.
          Choose your preferred way to connect below.
        </p>
      </section>

      <div className="max-w-2xl mx-auto">
        {/* Contact Form */}
        <div className="card p-8 bg-gray-900 border border-gray-800 rounded-xl">
          <h2 className="text-2xl font-semibold text-white mb-6">Send a Message</h2>
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Honeypot field */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Do not fill this out</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2" htmlFor="name">
                Name *
              </label>
              <input 
                className={inputClass}
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
              <label className="block text-sm font-semibold text-white mb-2" htmlFor="email">
                Email Address *
              </label>
              <input 
                className={inputClass}
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2" htmlFor="subject">
                Subject (Optional)
              </label>
              <input 
                className={inputClass}
                id="subject" 
                name="subject" 
                type="text"
                maxLength={200}
                placeholder="Brief description of your inquiry"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2" htmlFor="message">
                Message *
              </label>
              <textarea 
                className={inputClass}
                id="message" 
                name="message" 
                rows={6} 
                required 
                minLength={10}
                maxLength={2000}
                aria-describedby="messageHelp"
                placeholder="Tell me about your project, question, or how I can help you..."
              />
              <p id="messageHelp" className="text-xs text-gray-400 mt-1">Minimum 10 characters, maximum 2000 characters</p>
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
              <div role="status" aria-live="polite" className={`p-4 rounded-lg ${
                statusType === 'success'
                  ? 'bg-green-900/30 border border-green-700 text-green-300'
                  : 'bg-red-900/30 border border-red-700 text-red-300'
              }`}>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {statusType === 'success' ? (
                      <svg className="h-5 w-5 text-green-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-red-300" viewBox="0 0 20 20" fill="currentColor">
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
