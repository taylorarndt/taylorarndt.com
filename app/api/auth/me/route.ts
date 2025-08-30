import { NextResponse } from 'next/server'
import { getServerUser } from '../../../../lib/auth0'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const user = await getServerUser()
    return NextResponse.json({ user })
  } catch (err) {
    console.error('Get user error:', err)
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 })
  }
}