import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import { getSession } from '../../../lib/auth'

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

function requireAdmin(req: Request) {
  const key = req.headers.get('x-admin-key') || ''
  return key && process.env.ADMIN_KEY && key === process.env.ADMIN_KEY
}

// GET /api/ideas - List all ideas with filtering
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    const sortBy = url.searchParams.get('sort') || 'created'
    
    const ideasPath = './data/ideas.json'
    const votesPath = './data/votes.json'
    
    const ideas = JSON.parse(await fs.readFile(ideasPath, 'utf8').catch(() => '[]'))
    const votes = JSON.parse(await fs.readFile(votesPath, 'utf8').catch(() => '[]'))
    
    // Add vote counts to ideas
    const ideasWithVotes = ideas.map((idea: any) => ({
      ...idea,
      voteCount: votes.filter((vote: any) => vote.ideaId === idea.id).length
    }))
    
    // Filter by status if provided
    let filteredIdeas = status 
      ? ideasWithVotes.filter((idea: any) => idea.status === status)
      : ideasWithVotes
    
    // Sort ideas
    if (sortBy === 'votes') {
      filteredIdeas.sort((a: any, b: any) => b.voteCount - a.voteCount)
    } else if (sortBy === 'updated') {
      filteredIdeas.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    } else {
      filteredIdeas.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
    
    return NextResponse.json({ ideas: filteredIdeas })
  } catch (err) {
    console.error('List ideas error', err)
    return NextResponse.json({ error: 'Failed to list ideas' }, { status: 500 })
  }
}

// POST /api/ideas - Submit new idea (auth required)
export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session?.user) {
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

    const idea = {
      id,
      title,
      description,
      category: category || 'General',
      status: 'Pending',
      submittedBy: session.user.email,
      submittedAt: now,
      createdAt: now,
      updatedAt: now,
      scheduledDate: null,
      youtubeLink: null
    }

    const ideasPath = './data/ideas.json'
    const ideas = JSON.parse(await fs.readFile(ideasPath, 'utf8').catch(() => '[]'))
    ideas.push(idea)
    await fs.writeFile(ideasPath, JSON.stringify(ideas, null, 2), 'utf8')

    return NextResponse.json({ ok: true, idea })
  } catch (err) {
    console.error('Submit idea error', err)
    return NextResponse.json({ error: 'Failed to submit idea' }, { status: 500 })
  }
}