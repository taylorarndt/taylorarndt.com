import { NextResponse } from 'next/server'
import fs from 'fs/promises'

function requireAdmin(req: Request) {
  const key = req.headers.get('x-admin-key') || ''
  return key && process.env.ADMIN_KEY && key === process.env.ADMIN_KEY
}

// PUT /api/ideas/[id]/schedule - Admin schedules an idea
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
    const { scheduledDate, youtubeLink } = body

    if (!scheduledDate) {
      return NextResponse.json({ error: 'Scheduled date is required' }, { status: 400 })
    }

    // Validate date format
    const date = new Date(scheduledDate)
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    const ideasPath = './data/ideas.json'
    const ideas = JSON.parse(await fs.readFile(ideasPath, 'utf8').catch(() => '[]'))
    
    const ideaIndex = ideas.findIndex((idea: any) => idea.id === ideaId)
    if (ideaIndex === -1) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    const idea = ideas[ideaIndex]
    if (idea.status !== 'Approved') {
      return NextResponse.json({ error: 'Can only schedule approved ideas' }, { status: 400 })
    }

    // Update idea with schedule
    ideas[ideaIndex] = {
      ...idea,
      status: 'Scheduled',
      scheduledDate: date.toISOString(),
      youtubeLink: youtubeLink || null,
      updatedAt: new Date().toISOString(),
      scheduledAt: new Date().toISOString()
    }

    await fs.writeFile(ideasPath, JSON.stringify(ideas, null, 2), 'utf8')

    // TODO: Send email notification to submitter
    
    return NextResponse.json({ ok: true, idea: ideas[ideaIndex] })
  } catch (err) {
    console.error('Schedule idea error', err)
    return NextResponse.json({ error: 'Failed to schedule idea' }, { status: 500 })
  }
}