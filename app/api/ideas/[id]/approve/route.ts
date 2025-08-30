import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { query } from '../../../../../lib/db'
import { getServerUser } from '../../../../../lib/auth0'

// POST /api/ideas/[id]/approve - Admin approves idea
export async function POST(req: Request, { params }: { params: { id: string } }) {
  return await approveIdea(req, { params });
}

// PUT /api/ideas/[id]/approve - Admin approves idea (same functionality as POST)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return await approveIdea(req, { params });
}

async function approveIdea(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getServerUser()
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 })
    }

    const ideaId = params.id
    if (!ideaId) {
      return NextResponse.json({ error: 'Missing idea ID' }, { status: 400 })
    }

    // Ensure idea exists and is pending
    const { rows: existing } = await query(
      'SELECT status FROM ideas WHERE id = $1',
      [ideaId]
    )
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }
    if (existing[0].status !== 'Pending') {
      return NextResponse.json({ error: 'Can only approve pending ideas' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const { rows } = await query(
      `UPDATE ideas
       SET status = 'Approved', updated_at = $2, approved_at = $2
       WHERE id = $1
       RETURNING id, title, description, category, status,
                 submitted_by as "submittedBy",
                 submitted_at as "submittedAt",
                 created_at as "createdAt",
                 updated_at as "updatedAt",
                 scheduled_date as "scheduledDate",
                 youtube_link as "youtubeLink"`,
      [ideaId, now]
    )

    return NextResponse.json({ ok: true, idea: rows[0] })
  } catch (err) {
    console.error('Approve idea error', err)
    return NextResponse.json({ error: 'Failed to approve idea' }, { status: 500 })
  }
}