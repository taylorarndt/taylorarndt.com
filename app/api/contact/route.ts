import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

async function verifyTurnstile(token: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return false
  const body = new URLSearchParams({ secret, response: token })
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body
  })
  const data = await res.json().catch(() => ({}))
  return !!data.success
}

export async function POST(req: Request) {
  const form = await req.formData()

  // Honeypot
  if (typeof form.get('website') === 'string' && (form.get('website') as string).trim() !== '') {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const name = String(form.get('name') || '').trim()
  const email = String(form.get('email') || '').trim()
  const message = String(form.get('message') || '').trim()
  const turnstileToken = String(form.get('cf-turnstile-response') || '')

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Verify Turnstile if configured
  if (process.env.TURNSTILE_SECRET_KEY) {
    const ok = await verifyTurnstile(turnstileToken)
    if (!ok) return NextResponse.json({ error: 'Captcha failed' }, { status: 400 })
  }

  if (!process.env.SENDGRID_API_KEY || !process.env.CONTACT_TO_EMAIL) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 500 })
  }

  const to = process.env.CONTACT_TO_EMAIL!
  const from = process.env.CONTACT_FROM_EMAIL || to

  try {
    await sgMail.send({
      to,
      from,
      subject: `New message from ${name} via taylorarndt.com`,
      text: `From: ${name} <${email}>
\n${message}`,
      replyTo: email
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
