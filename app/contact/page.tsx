"use client"
import { useState } from 'react'

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Failed to send')
      setStatus('Thanks! Your message has been sent.')
      form.reset()
    } catch (err: any) {
      setStatus(err.message || 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Contact</h1>
      <p className="mb-6">Email <a className="text-teal-700" href="mailto:hello@taylorarndt.com">hello@taylorarndt.com</a> or use the form below.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="website">Do not fill this out</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="name">Name</label>
          <input className="mt-1 w-full rounded border px-3 py-2" id="name" name="name" required />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="email">Email</label>
          <input className="mt-1 w-full rounded border px-3 py-2" id="email" name="email" type="email" required />
        </div>
        <div>
          <label className="block text-sm font-medium" htmlFor="message">Message</label>
          <textarea className="mt-1 w-full rounded border px-3 py-2" id="message" name="message" rows={5} required />
        </div>
        <div>
          {/* Cloudflare Turnstile placeholder; script is loaded in head via next/script in future step */}
          <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}></div>
        </div>
        <button disabled={submitting} className="rounded bg-teal-600 px-4 py-2 text-white disabled:opacity-60" type="submit">
          {submitting ? 'Sending…' : 'Send'}
        </button>
        {status && <p className="text-sm text-slate-600">{status}</p>}
      </form>
    </section>
  )
}
