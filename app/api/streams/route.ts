import { NextResponse } from 'next/server'
import { query } from '../../../lib/db'
export const dynamic = 'force-dynamic'

// GET /api/streams - List scheduled/live/completed streams
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    
    const params: any[] = []
    const where: string[] = ["i.status in ('Scheduled','Live','Completed')"]
    if (status && ['Scheduled','Live','Completed'].includes(status)) {
      params.push(status)
      where.push(`i.status = $${params.length}`)
    }
    const orderBy = status === 'Completed'
      ? 'COALESCE(i.completed_at, i.updated_at) DESC'
      : 'COALESCE(i.scheduled_date, i.updated_at) ASC'

    const sql = `
      SELECT i.id, i.title, i.description, i.category, i.status,
             i.submitted_by as "submittedBy",
             i.submitted_at as "submittedAt",
             i.created_at as "createdAt",
             i.updated_at as "updatedAt",
             i.scheduled_date as "scheduledDate",
             i.youtube_link as "youtubeLink",
             i.completed_at as "completedAt"
      FROM ideas i
      WHERE ${where.join(' AND ')}
      ORDER BY ${orderBy}
    `
    const { rows } = await query(sql, params)
    return NextResponse.json({ streams: rows })
  } catch (err) {
    console.error('List streams error', err)
    return NextResponse.json({ error: 'Failed to list streams' }, { status: 500 })
  }
}