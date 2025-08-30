import { NextResponse } from 'next/server'
import { createSession } from '../../../../lib/auth'

// Simple login - in production would validate against database
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const user = {
      email: email.toLowerCase().trim(),
      name: name?.trim() || email.split('@')[0],
      isAdmin: email === process.env.ADMIN_EMAIL
    }

    const sessionValue = createSession(user)
    
    const response = NextResponse.json({ user })
    response.cookies.set('session', sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return response
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}