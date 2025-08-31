import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { query } from '../../../../lib/db'
import { getServerUser } from '../../../../lib/auth0'

const VALID_STATUSES = ['Live', 'Completed', 'Cancelled']

// POST /api/streams/bulk - Admin bulk updates stream statuses
export async function POST(req: Request) {
  try {
    const user = await getServerUser()
    if (!user?.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 })
    }

    const body = await req.json()
    const { streamIds, status } = body

    if (!streamIds || !Array.isArray(streamIds) || streamIds.length === 0) {
      return NextResponse.json({ error: 'Stream IDs are required' }, { status: 400 })
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Valid status is required' }, { status: 400 })
    }

    const now = new Date().toISOString()
    
    // Build timestamp field based on status
    let tsField = null
    if (status === 'Live') tsField = 'live_at'
    else if (status === 'Completed') tsField = 'completed_at'

    // Build dynamic update query
    const updates = ['status = $1', 'updated_at = $2']
    const params = [status, now]
    
    if (tsField) {
      updates.push(`${tsField} = $3`)
      params.push(now)
    }

    // Create placeholders for the IN clause
    const idPlaceholders = streamIds.map((_, index) => `$${params.length + index + 1}`).join(',')
    params.push(...streamIds)

    const sql = `
      UPDATE ideas 
      SET ${updates.join(', ')} 
      WHERE id IN (${idPlaceholders}) 
        AND status IN ('Scheduled', 'Live', 'Completed')
      RETURNING id, title, status
    `

    const { rows } = await query(sql, params)

    // Log audit trail
    console.log(`[AUDIT] Admin ${user.email} bulk updated ${rows.length} streams to ${status}:`, rows.map(r => r.id))

    return NextResponse.json({ 
      ok: true, 
      updated: rows.length,
      streams: rows 
    })
  } catch (err) {
    console.error('Bulk update streams error', err)
    return NextResponse.json({ error: 'Failed to bulk update streams' }, { status: 500 })
  }
}