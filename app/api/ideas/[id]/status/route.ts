import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { query } from '../../../../../lib/db'
import { getServerUser } from '../../../../../lib/auth0'

const VALID_STATUSES = ['Pending', 'Approved', 'Rejected', 'Scheduled', 'Live', 'Completed', 'Cancelled']

// POST /api/ideas/[id]/status - Admin updates status
export async function POST(req: Request, { params }: { params: { id: string } }) {
  return await updateStatus(req, { params });
}

// PUT /api/ideas/[id]/status - Admin updates status (same functionality as POST)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return await updateStatus(req, { params });
}

async function updateStatus(req: Request, { params }: { params: { id: string } }) {
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
    const { status } = body

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ 
        error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` 
      }, { status: 400 })
    }

    const now = new Date().toISOString()
    const tsField = status === 'Live' ? 'live_at'
                   : status === 'Completed' ? 'completed_at'
                   : status === 'Rejected' ? 'rejected_at'
                   : null

    // Ensure exists
    const { rows: exists } = await query('SELECT id FROM ideas WHERE id = $1', [ideaId])
    if (exists.length === 0) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    // Build dynamic update
    const updates = ['status = $2', 'updated_at = $3']
    const sqlParams: any[] = [ideaId, status, now]
    if (tsField) {
      updates.push(`${tsField} = $4`)
      sqlParams.push(now)
    }

    const { rows } = await query(
      `UPDATE ideas SET ${updates.join(', ')} WHERE id = $1
       RETURNING id, title, description, category, status,
                 submitted_by as "submittedBy",
                 submitted_at as "submittedAt",
                 created_at as "createdAt",
                 updated_at as "updatedAt",
                 scheduled_date as "scheduledDate",
                 youtube_link as "youtubeLink",
                 live_at as "liveAt",
                 completed_at as "completedAt",
                 rejected_at as "rejectedAt"`,
  sqlParams
    )

    return NextResponse.json({ ok: true, idea: rows[0] })
  } catch (err) {
    console.error('Update status error', err)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}