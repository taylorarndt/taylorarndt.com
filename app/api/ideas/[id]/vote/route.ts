import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { query } from '../../../../../lib/db'
import { getServerUser } from '../../../../../lib/auth0'
import { checkRateLimit, getClientIp, RATE_LIMITS } from '../../../../../lib/rate-limit'
import { broadcastVoteUpdate } from '../../../../../lib/sse-vote-updates'

// POST /api/ideas/[id]/vote - Cast vote
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // Rate limiting
    const clientIp = getClientIp(req)
    if (!checkRateLimit(clientIp, RATE_LIMITS.VOTING)) {
      return NextResponse.json({ error: 'Too many voting requests. Please try again later.' }, { status: 429 })
    }

    const user = await getServerUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const ideaId = params.id
    const userEmail = user.email

    if (!ideaId) {
      return NextResponse.json({ error: 'Missing idea ID' }, { status: 400 })
    }

    // Check if idea exists and is approved
    const { rows: ideaRows } = await query('SELECT status FROM ideas WHERE id = $1', [ideaId])
    if (ideaRows.length === 0) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }
    if (ideaRows[0].status !== 'Approved') {
      return NextResponse.json({ error: 'Can only vote on approved ideas' }, { status: 400 })
    }

    // Check if user has already voted - make this truly idempotent
    const { rows: existingVote } = await query(
      'SELECT id FROM votes WHERE idea_id = $1 AND user_email = $2',
      [ideaId, userEmail]
    )

    // If vote already exists, just return current count (idempotent behavior)
    if (existingVote.length > 0) {
      const { rows } = await query<{ count: string }>('SELECT COUNT(*)::int as count FROM votes WHERE idea_id = $1', [ideaId])
      const voteCount = Number(rows[0].count)
      
      // Broadcast the update to connected SSE clients
      broadcastVoteUpdate(ideaId, voteCount)
      
      return NextResponse.json({ ok: true, voteCount, alreadyVoted: true })
    }

    // Insert new vote
    const id = `vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    await query(
      'INSERT INTO votes (id, idea_id, user_email, created_at) VALUES ($1,$2,$3,$4)',
      [id, ideaId, userEmail, now]
    )

    const { rows } = await query<{ count: string }>('SELECT COUNT(*)::int as count FROM votes WHERE idea_id = $1', [ideaId])
    const voteCount = Number(rows[0].count)
    
    // Broadcast the update to connected SSE clients
    broadcastVoteUpdate(ideaId, voteCount)
    
    return NextResponse.json({ ok: true, voteCount })
  } catch (err) {
    console.error('Vote error', err)
    
    // If database is not configured, return disabled message
    if (err instanceof Error && err.message.includes('DATABASE_URL is not set')) {
      return NextResponse.json({ 
        error: 'Database not configured - voting is currently disabled'
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 })
  }
}

// DELETE /api/ideas/[id]/vote - Remove vote
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Rate limiting
    const clientIp = getClientIp(req)
    if (!checkRateLimit(clientIp, RATE_LIMITS.VOTING)) {
      return NextResponse.json({ error: 'Too many voting requests. Please try again later.' }, { status: 429 })
    }

    const user = await getServerUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const ideaId = params.id
    const userEmail = user.email

    if (!ideaId) {
      return NextResponse.json({ error: 'Missing idea ID' }, { status: 400 })
    }

    const { rowCount } = await query('DELETE FROM votes WHERE idea_id = $1 AND user_email = $2', [ideaId, userEmail])
    if (rowCount === 0) {
      return NextResponse.json({ error: 'Vote not found' }, { status: 404 })
    }
    const { rows } = await query<{ count: string }>('SELECT COUNT(*)::int as count FROM votes WHERE idea_id = $1', [ideaId])
    const voteCount = Number(rows[0].count)
    
    // Broadcast the update to connected SSE clients
    broadcastVoteUpdate(ideaId, voteCount)
    
    return NextResponse.json({ ok: true, voteCount })
  } catch (err) {
    console.error('Remove vote error', err)
    
    // If database is not configured, return disabled message
    if (err instanceof Error && err.message.includes('DATABASE_URL is not set')) {
      return NextResponse.json({ 
        error: 'Database not configured - voting is currently disabled'
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: 'Failed to remove vote' }, { status: 500 })
  }
}