import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { query } from '../../../../../lib/db'
import { getServerUser } from '../../../../../lib/auth0'

// PUT /api/ideas/[id]/schedule - Admin schedules an idea
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getServerUser()
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 })
    }

    const ideaId = params.id
    if (!ideaId) {
      return NextResponse.json({ error: 'Missing idea ID' }, { status: 400 })
    }

    const body = await req.json()
    const { scheduledDate, youtubeLink } = body

    if (!scheduledDate) {
      return NextResponse.json({ error: 'Scheduled date is required' }, { status: 400 })
    }

    // Validate date format
    const date = new Date(scheduledDate)
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    // Ensure idea exists and is approved
    const { rows: existing } = await query(
      'SELECT status FROM ideas WHERE id = $1',
      [ideaId]
    )
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }
    if (existing[0].status !== 'Approved') {
      return NextResponse.json({ error: 'Can only schedule approved ideas' }, { status: 400 })
    }

    const now = new Date().toISOString()
    const { rows } = await query(
      `UPDATE ideas
       SET status = 'Scheduled', scheduled_date = $2, youtube_link = $3,
           updated_at = $4, scheduled_at = $4
       WHERE id = $1
       RETURNING id, title, description, category, status,
                 submitted_by as "submittedBy",
                 submitted_at as "submittedAt",
                 created_at as "createdAt",
                 updated_at as "updatedAt",
                 scheduled_date as "scheduledDate",
                 youtube_link as "youtubeLink"`,
      [ideaId, date.toISOString(), youtubeLink || null, now]
    )
    
    return NextResponse.json({ ok: true, idea: rows[0] })
  } catch (err) {
    console.error('Schedule idea error', err)
    return NextResponse.json({ error: 'Failed to schedule idea' }, { status: 500 })
  }
}