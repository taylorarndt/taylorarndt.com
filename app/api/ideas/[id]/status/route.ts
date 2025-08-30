import { NextResponse } from 'next/server'
import fs from 'fs/promises'

function requireAdmin(req: Request) {
  const key = req.headers.get('x-admin-key') || ''
  return key && process.env.ADMIN_KEY && key === process.env.ADMIN_KEY
}

const VALID_STATUSES = ['Pending', 'Approved', 'Rejected', 'Scheduled', 'Live', 'Completed', 'Cancelled']

// PUT /api/ideas/[id]/status - Admin updates status
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    const ideasPath = './data/ideas.json'
    const ideas = JSON.parse(await fs.readFile(ideasPath, 'utf8').catch(() => '[]'))
    
    const ideaIndex = ideas.findIndex((idea: any) => idea.id === ideaId)
    if (ideaIndex === -1) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    const idea = ideas[ideaIndex]

    // Update idea status
    ideas[ideaIndex] = {
      ...idea,
      status,
      updatedAt: new Date().toISOString()
    }

    // Add specific timestamps for certain status changes
    if (status === 'Live') {
      ideas[ideaIndex].liveAt = new Date().toISOString()
    } else if (status === 'Completed') {
      ideas[ideaIndex].completedAt = new Date().toISOString()
    } else if (status === 'Rejected') {
      ideas[ideaIndex].rejectedAt = new Date().toISOString()
    }

    await fs.writeFile(ideasPath, JSON.stringify(ideas, null, 2), 'utf8')

    return NextResponse.json({ ok: true, idea: ideas[ideaIndex] })
  } catch (err) {
    console.error('Update status error', err)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}