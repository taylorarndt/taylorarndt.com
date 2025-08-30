import { cookies } from 'next/headers'

export interface User {
  email: string
  name?: string
  isAdmin?: boolean
}

export async function getSession(): Promise<{ user: User } | null> {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get('session')
    
    if (!sessionCookie?.value) {
      return null
    }

    // Simple base64 decode for demo - in production use proper JWT or encrypted sessions
    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString())
    
    // Check if session is expired (24 hours)
    if (Date.now() > sessionData.expiresAt) {
      return null
    }
    
    return { user: sessionData.user }
  } catch (err) {
    console.error('Session error:', err)
    return null
  }
}

export function createSession(user: User): string {
  const sessionData = {
    user,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  }
  
  return Buffer.from(JSON.stringify(sessionData)).toString('base64')
}