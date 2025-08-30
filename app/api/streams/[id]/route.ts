import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { query } from '../../../../lib/db'
import { getServerUser } from '../../../../lib/auth0'

// PUT /api/streams/[id] - Admin updates stream details (reschedule, YouTube link, status)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getServerUser()
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 })
    }

    const streamId = params.id
    if (!streamId) {
      return NextResponse.json({ error: 'Missing stream ID' }, { status: 400 })
    }

    const body = await req.json()
    const { scheduledDate, youtubeLink, status } = body

    // Ensure stream exists
    const { rows: existing } = await query(
      'SELECT id, status FROM ideas WHERE id = $1',
      [streamId]
    )
    if (existing.length === 0) {
      return NextResponse.json({ error: 'Stream not found' }, { status: 404 })
    }

    const now = new Date().toISOString()
    const updates: string[] = ['updated_at = $1']
    const sqlParams: any[] = [now]
    
    // Handle scheduled date update
    if (scheduledDate !== undefined) {
      if (scheduledDate) {
        const date = new Date(scheduledDate)
        if (isNaN(date.getTime())) {
          return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
        }
        sqlParams.push(date.toISOString())
        updates.push(`scheduled_date = $${sqlParams.length}`)
      } else {
        updates.push('scheduled_date = NULL')
      }
    }

    // Handle YouTube link update
    if (youtubeLink !== undefined) {
      sqlParams.push(youtubeLink || null)
      updates.push(`youtube_link = $${sqlParams.length}`)
    }

    // Handle status update
    if (status !== undefined) {
      const validStatuses = ['Scheduled', 'Live', 'Completed', 'Cancelled']
      if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
      }
      
      sqlParams.push(status)
      updates.push(`status = $${sqlParams.length}`)
      
      // Add timestamp for status changes
      if (status === 'Live') {
        updates.push(`live_at = $1`)
      } else if (status === 'Completed') {
        updates.push(`completed_at = $1`)
      }
    }

    sqlParams.unshift(streamId) // Add streamId as first parameter

    const sql = `
      UPDATE ideas 
      SET ${updates.join(', ')}
      WHERE id = $1
      RETURNING id, title, description, category, status,
                submitted_by as "submittedBy",
                submitted_at as "submittedAt",
                created_at as "createdAt",
                updated_at as "updatedAt",
                scheduled_date as "scheduledDate",
                youtube_link as "youtubeLink",
                live_at as "liveAt",
                completed_at as "completedAt"
    `

    const { rows } = await query(sql, sqlParams)

    // Log audit trail
    const changes = []
    if (scheduledDate !== undefined) changes.push(`scheduledDate: ${scheduledDate}`)
    if (youtubeLink !== undefined) changes.push(`youtubeLink: ${youtubeLink || 'removed'}`)
    if (status !== undefined) changes.push(`status: ${status}`)
    
    console.log(`[AUDIT] Admin ${user.email} updated stream ${streamId}: ${changes.join(', ')}`)

    return NextResponse.json({ ok: true, stream: rows[0] })
  } catch (err) {
    console.error('Update stream error', err)
    return NextResponse.json({ error: 'Failed to update stream' }, { status: 500 })
  }
}