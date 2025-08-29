import { NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '')

// Simple in-memory rate limiting (for MVP - in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

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
  } catch (error) {
    console.error('Turnstile verification failed:', error)
    return false
  }
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 5 // 5 requests per 15 minutes
  
  const entry = rateLimitMap.get(ip)
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (entry.count >= maxRequests) {
    return false
  }
  
  entry.count++
  return true
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 320 // RFC 5321 limit
}

function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim()
}

function detectSpam(name: string, email: string, message: string): boolean {
  // Basic spam detection patterns
  const spamPatterns = [
    /bitcoin|cryptocurrency|crypto|investment|loan|casino|gambling/i,
    /click here|visit now|limited time|act now/i,
    /viagra|cialis|pharmacy|pills/i,
    /(http|https):\/\/[^\s]{10,}/g // URLs longer than 10 chars
  ]
  
  const content = `${name} ${email} ${message}`.toLowerCase()
  
  // Check for spam patterns
  for (const pattern of spamPatterns) {
    if (pattern.test(content)) {
      return true
    }
  }
  
  // Check for excessive repetition
  const words = content.split(/\s+/)
  const uniqueWords = new Set(words)
  if (words.length > 10 && uniqueWords.size / words.length < 0.3) {
    return true
  }
  
  return false
}

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown'
    
    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' }, 
        { status: 429 }
      )
    }
    
    const form = await req.formData()
    
    // Honeypot check
    const website = String(form.get('website') || '').trim()
    if (website !== '') {
      console.log(`Honeypot triggered from IP: ${ip}`)
      // Return success to not tip off bots
      return NextResponse.json({ ok: true }, { status: 200 })
    }
    
    // Extract and sanitize form data
    const name = sanitizeInput(String(form.get('name') || ''))
    const email = sanitizeInput(String(form.get('email') || ''))
    const subject = sanitizeInput(String(form.get('subject') || ''))
    const message = sanitizeInput(String(form.get('message') || ''))
    const turnstileToken = String(form.get('cf-turnstile-response') || '')
    
    // Validation
    if (!name || name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters.' }, 
        { status: 400 }
      )
    }
    
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' }, 
        { status: 400 }
      )
    }
    
    if (!message || message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 2000 characters.' }, 
        { status: 400 }
      )
    }
    
    if (subject && subject.length > 200) {
      return NextResponse.json(
        { error: 'Subject must be less than 200 characters.' }, 
        { status: 400 }
      )
    }
    
    // Spam detection
    if (detectSpam(name, email, message)) {
      console.log(`Spam detected from IP: ${ip}, email: ${email}`)
      return NextResponse.json(
        { error: 'Message flagged as spam. Please try a different message.' }, 
        { status: 400 }
      )
    }
    
    // Verify Turnstile if configured
    if (process.env.TURNSTILE_SECRET_KEY && turnstileToken) {
      const turnstileValid = await verifyTurnstile(turnstileToken)
      if (!turnstileValid) {
        return NextResponse.json(
          { error: 'Captcha verification failed. Please try again.' }, 
          { status: 400 }
        )
      }
    }
    
    // Check if email is configured
    if (!process.env.SENDGRID_API_KEY || !process.env.CONTACT_TO_EMAIL) {
      console.error('Email configuration missing')
      return NextResponse.json(
        { error: 'Email service temporarily unavailable. Please try again later.' }, 
        { status: 500 }
      )
    }
    
    const to = process.env.CONTACT_TO_EMAIL!
    const from = process.env.CONTACT_FROM_EMAIL || to
    
    // Prepare email content
    const emailSubject = subject 
      ? `[taylorarndt.com] ${subject}` 
      : `New message from ${name} via taylorarndt.com`
    
    const emailText = `New contact form submission:

From: ${name}
Email: ${email}
Subject: ${subject || 'No subject'}
IP: ${ip}
Timestamp: ${new Date().toISOString()}

Message:
${message}

---
This message was sent via the contact form at taylorarndt.com`
    
    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
      <p><strong>IP:</strong> ${ip}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
      
      <h3>Message:</h3>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
        ${message.replace(/\n/g, '<br>')}
      </div>
      
      <hr>
      <p style="color: #666; font-size: 12px;">
        This message was sent via the contact form at taylorarndt.com
      </p>
    `
    
    // Send email
    await sgMail.send({
      to,
      from,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
      replyTo: email,
      headers: {
        'X-Contact-Form': 'taylorarndt.com',
        'X-Client-IP': ip
      }
    })
    
    console.log(`Contact form submitted successfully from ${email} (IP: ${ip})`)
    
    return NextResponse.json({ 
      ok: true, 
      message: 'Message sent successfully!' 
    })
    
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' }, 
      { status: 500 }
    )
  }
}
