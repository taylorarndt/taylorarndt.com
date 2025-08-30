import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import fs from 'fs/promises'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000
  const maxRequests = 5
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  if (entry.count >= maxRequests) return false
  entry.count++
  return true
}

function sanitize(input: string) {
  return input.replace(/[<>]/g, '').trim()
}

function validateUrl(u: string) {
  try {
    if (!u) return false
    const parsed = new URL(u)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return false
  try {
    const body = new URLSearchParams({ secret, response: token })
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    const data = await res.json()
    return !!data.success
  } catch (e) {
    console.error('Turnstile verify failed', e)
    return false
  }
}

export async function POST(req: Request) {
  try {
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(ip)) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const form = await req.formData()
    const honeypot = String(form.get('website') || '').trim()
    if (honeypot !== '') return NextResponse.json({ ok: true })

    const title = sanitize(String(form.get('title') || ''))
    const url = String(form.get('url') || '')
    const summary = sanitize(String(form.get('summary') || ''))
    const tagsRaw = String(form.get('tags') || '')
    const turnstile = String(form.get('cf-turnstile-response') || '')

    if (!title || title.length < 3 || title.length > 200) return NextResponse.json({ error: 'Title length invalid' }, { status: 400 })
    if (!validateUrl(url)) return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    if (!summary || summary.length < 10 || summary.length > 1000) return NextResponse.json({ error: 'Summary length invalid' }, { status: 400 })

    const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean).slice(0, 6)

    if (process.env.TURNSTILE_SECRET_KEY && turnstile) {
      const ok = await verifyTurnstile(turnstile)
      if (!ok) return NextResponse.json({ error: 'Captcha failed' }, { status: 400 })
    }

    const id = title.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-')
    const now = new Date().toISOString()

    const item = { id, title, url, summary, tags, submittedAt: now }

    const pendingPath = './data/pending-resources.json'
    const content = JSON.parse(await fs.readFile(pendingPath, 'utf8') || '[]')
    content.push(item)
    await fs.writeFile(pendingPath, JSON.stringify(content, null, 2), 'utf8')

    return NextResponse.json({ ok: true, message: 'Resource submitted for review' })
  } catch (err) {
    console.error('Submit resource error', err)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
