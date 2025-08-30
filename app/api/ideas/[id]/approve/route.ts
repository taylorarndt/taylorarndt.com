import { NextResponse } from 'next/server'
import fs from 'fs/promises'

function requireAdmin(req: Request) {
  const key = req.headers.get('x-admin-key') || ''
  return key && process.env.ADMIN_KEY && key === process.env.ADMIN_KEY
}

// PUT /api/ideas/[id]/approve - Admin approves idea
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!requireAdmin(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ideaId = params.id
    if (!ideaId) {
      return NextResponse.json({ error: 'Missing idea ID' }, { status: 400 })
    }

    const ideasPath = './data/ideas.json'
    const ideas = JSON.parse(await fs.readFile(ideasPath, 'utf8').catch(() => '[]'))
    
    const ideaIndex = ideas.findIndex((idea: any) => idea.id === ideaId)
    if (ideaIndex === -1) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    const idea = ideas[ideaIndex]
    if (idea.status !== 'Pending') {
      return NextResponse.json({ error: 'Can only approve pending ideas' }, { status: 400 })
    }

    // Update idea status
    ideas[ideaIndex] = {
      ...idea,
      status: 'Approved',
      updatedAt: new Date().toISOString(),
      approvedAt: new Date().toISOString()
    }

    await fs.writeFile(ideasPath, JSON.stringify(ideas, null, 2), 'utf8')

    // TODO: Send email notification to submitter
    
    return NextResponse.json({ ok: true, idea: ideas[ideaIndex] })
  } catch (err) {
    console.error('Approve idea error', err)
    return NextResponse.json({ error: 'Failed to approve idea' }, { status: 500 })
  }
}