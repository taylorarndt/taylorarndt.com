import { NextResponse } from 'next/server'
import { query } from '../../../lib/db'
import { getServerUser } from '../../../lib/auth0'
export const dynamic = 'force-dynamic'

// Simple in-memory rate limiting (for MVP - in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 10

  const record = rateLimitMap.get(ip)
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '')
}

// GET /api/ideas - List ideas with user-based filtering
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const sortBy = url.searchParams.get('sort') || 'created'
    
    // Get current user to determine what they can see
    const user = await getServerUser()
    const userEmail = user?.email
    const isAdmin = user?.isAdmin || false
    
    // Build SQL with user-based filtering
    const where: string[] = []
    const params: any[] = []
    
    if (!isAdmin) {
      // Regular users can only see:
      // 1. Approved ideas (all)
      // 2. Their own submissions (any status)
      if (userEmail) {
        where.push(`(i.status = 'Approved' OR i.submitted_by = $${params.length + 1})`)
        params.push(userEmail)
      } else {
        // Not logged in - only approved ideas
        where.push(`i.status = 'Approved'`)
      }
    }
    
    // Additional status filter for admins or when specifically requested
    if (status && isAdmin) {
      params.push(status)
      where.push(`i.status = $${params.length}`)
    }
    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''

    let orderBy = 'i.created_at DESC'
    if (sortBy === 'votes') orderBy = 'vote_count DESC, i.created_at DESC'
    else if (sortBy === 'updated') orderBy = 'i.updated_at DESC'

    const sql = `
      SELECT i.id, i.title, i.description, i.category, i.status,
             i.submitted_by as "submittedBy",
             i.submitted_at as "submittedAt",
             i.created_at as "createdAt",
             i.updated_at as "updatedAt",
             i.scheduled_date as "scheduledDate",
             i.youtube_link as "youtubeLink",
             COALESCE(v.cnt, 0) AS "voteCount"
      FROM ideas i
      LEFT JOIN (
        SELECT idea_id, COUNT(*)::int AS cnt
        FROM votes
        GROUP BY idea_id
      ) v ON v.idea_id = i.id
      ${whereSql}
      ORDER BY ${orderBy}
    `

    const { rows } = await query(sql, params)
    return NextResponse.json({ ideas: rows })
  } catch (err) {
    console.error('List ideas error', err)
    
    // If database is not configured, return empty list instead of error
    if (err instanceof Error && err.message.includes('DATABASE_URL is not set')) {
      return NextResponse.json({ 
        ideas: [],
        message: 'Database not configured - displaying empty list'
      })
    }
    
    return NextResponse.json({ error: 'Failed to list ideas' }, { status: 500 })
  }
}

// POST /api/ideas - Submit new idea (auth required)
export async function POST(req: Request) {
  try {
  const user = await getServerUser()
  if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown'
    
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const body = await req.json()
    const title = sanitizeInput(String(body.title || ''))
    const description = sanitizeInput(String(body.description || ''))
    const category = sanitizeInput(String(body.category || ''))

    // Validation
    if (!title || title.length < 3 || title.length > 200) {
      return NextResponse.json({ error: 'Title must be between 3 and 200 characters' }, { status: 400 })
    }
    
    if (!description || description.length < 10 || description.length > 2000) {
      return NextResponse.json({ error: 'Description must be between 10 and 2000 characters' }, { status: 400 })
    }

    const id = `idea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()

    await query(
      `INSERT INTO ideas (
        id, title, description, category, status,
        submitted_by, submitted_at, created_at, updated_at,
        scheduled_date, youtube_link
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        id,
        title,
        description,
        category || 'General',
        'Pending',
  user.email,
        now,
        now,
        now,
        null,
        null,
      ]
    )

    return NextResponse.json({ ok: true, idea: {
      id, title, description, category: category || 'General', status: 'Pending',
  submittedBy: user.email, submittedAt: now, createdAt: now, updatedAt: now,
      scheduledDate: null, youtubeLink: null, voteCount: 0
    } })
  } catch (err) {
    console.error('Submit idea error', err)
    
    // If database is not configured, return a helpful message instead of error
    if (err instanceof Error && err.message.includes('DATABASE_URL is not set')) {
      return NextResponse.json({ 
        error: 'Database not configured - idea submission is currently disabled',
        message: 'Please configure DATABASE_URL to enable idea submissions'
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: 'Failed to submit idea' }, { status: 500 })
  }
}