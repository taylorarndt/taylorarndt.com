import { NextResponse } from 'next/server'
import { getSession } from '../../../../lib/auth'

export async function GET(req: Request) {
  try {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user: session.user })
  } catch (err) {
    console.error('Get user error:', err)
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
  }
}