import { NextResponse } from 'next/server'
import { query } from '../../../../lib/db'
import { getServerUser } from '../../../../lib/auth0'
export const dynamic = 'force-dynamic'

// GET /api/user/votes - Get current user's votes
export async function GET(req: Request) {
  try {
    const user = await getServerUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userEmail = user.email
    const { rows } = await query<{ ideaId: string }>(
      'SELECT idea_id as "ideaId" FROM votes WHERE user_email = $1',
      [userEmail]
    )
  return NextResponse.json({ votes: rows.map((r: { ideaId: string }) => r.ideaId) })
  } catch (err) {
    console.error('Get user votes error', err)
    
    // If database is not configured, return empty votes
    if (err instanceof Error && err.message.includes('DATABASE_URL is not set')) {
      return NextResponse.json({ votes: [] })
    }
    
    return NextResponse.json({ error: 'Failed to get votes' }, { status: 500 })
  }
}