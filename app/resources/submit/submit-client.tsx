"use client"
import { useState } from 'react'

export default function ResourceSubmitClient() {
  const [status, setStatus] = useState<string | null>(null)
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const inputClass = "w-full rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-500 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-colors"

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)
    setStatusType(null)
    const form = e.currentTarget
    const data = new FormData(form)

    // Honeypot
    if (String(data.get('website') || '').trim()) {
      setStatus('Invalid submission detected.')
      setStatusType('error')
      setSubmitting(false)
      return
    }

    // Basic validation
    const title = String(data.get('title') || '').trim()
    const url = String(data.get('url') || '').trim()
    const summary = String(data.get('summary') || '').trim()

    if (title.length < 3) { setStatus('Title too short'); setStatusType('error'); setSubmitting(false); return }
    if (!url) { setStatus('URL required'); setStatusType('error'); setSubmitting(false); return }
    if (summary.length < 10) { setStatus('Summary too short'); setStatusType('error'); setSubmitting(false); return }

    try {
      const res = await fetch('/api/resources/submit', { method: 'POST', body: data })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Submission failed')
      setStatus('Thanks — your resource has been submitted for review.')
      setStatusType('success')
      form.reset()
    } catch (err: any) {
      setStatus(err.message || 'Something went wrong')
      setStatusType('error')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8 bg-gray-900 border border-gray-800 rounded-xl">
        <h2 className="text-2xl font-semibold text-white mb-6">Suggest a Resource</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="hidden" aria-hidden>
            <label htmlFor="website">Do not fill</label>
            <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2" htmlFor="title">Title *</label>
            <input className={inputClass} id="title" name="title" required minLength={3} maxLength={200} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2" htmlFor="url">URL *</label>
            <input className={inputClass} id="url" name="url" type="url" required placeholder="https://example.com" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2" htmlFor="summary">Summary *</label>
            <textarea className={inputClass} id="summary" name="summary" rows={4} required minLength={10} maxLength={1000} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-2" htmlFor="tags">Tags (comma separated)</label>
            <input className={inputClass} id="tags" name="tags" placeholder="development, writing" />
          </div>

          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
            <div>
              <div className="cf-turnstile" data-sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}></div>
            </div>
          )}

          <button disabled={submitting} className="btn btn-primary w-full" type="submit">
            {submitting ? 'Submitting…' : 'Submit Resource'}
          </button>

          {status && (
            <div role="status" className={`p-4 rounded-lg ${statusType === 'success' ? 'bg-green-900/30 border border-green-700 text-green-300' : 'bg-red-900/30 border border-red-700 text-red-300'}`}>
              <p className="text-sm font-medium">{status}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
