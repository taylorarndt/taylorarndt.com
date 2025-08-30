import { NextResponse } from 'next/server'
import { getServerUser } from '../../../../lib/auth0'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    console.log('[AUTH API] Getting server user...')
    const user = await getServerUser()
    console.log('[AUTH API] Server user result:', user)
    return NextResponse.json({ user })
  } catch (err) {
    console.error('[AUTH API] Get user error:', err)
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
  }
}