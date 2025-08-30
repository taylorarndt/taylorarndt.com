import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import { getSession } from '../../../../../lib/auth'

// POST /api/ideas/[id]/vote - Cast vote
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const ideaId = params.id
    const userEmail = session.user.email

    if (!ideaId) {
      return NextResponse.json({ error: 'Missing idea ID' }, { status: 400 })
    }

    const ideasPath = './data/ideas.json'
    const votesPath = './data/votes.json'

    // Check if idea exists and is approved
    const ideas = JSON.parse(await fs.readFile(ideasPath, 'utf8').catch(() => '[]'))
    const idea = ideas.find((i: any) => i.id === ideaId)
    
    if (!idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    if (idea.status !== 'Approved') {
      return NextResponse.json({ error: 'Can only vote on approved ideas' }, { status: 400 })
    }

    const votes = JSON.parse(await fs.readFile(votesPath, 'utf8').catch(() => '[]'))
    
    // Check if user already voted for this idea
    const existingVote = votes.find((vote: any) => vote.ideaId === ideaId && vote.userEmail === userEmail)
    
    if (existingVote) {
      return NextResponse.json({ error: 'You have already voted for this idea' }, { status: 400 })
    }

    // Add the vote
    const vote = {
      id: `vote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ideaId,
      userEmail,
      createdAt: new Date().toISOString()
    }

    votes.push(vote)
    await fs.writeFile(votesPath, JSON.stringify(votes, null, 2), 'utf8')

    // Get updated vote count
    const voteCount = votes.filter((v: any) => v.ideaId === ideaId).length

    return NextResponse.json({ ok: true, voteCount })
  } catch (err) {
    console.error('Vote error', err)
    return NextResponse.json({ error: 'Failed to vote' }, { status: 500 })
  }
}

// DELETE /api/ideas/[id]/vote - Remove vote
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const ideaId = params.id
    const userEmail = session.user.email

    if (!ideaId) {
      return NextResponse.json({ error: 'Missing idea ID' }, { status: 400 })
    }

    const votesPath = './data/votes.json'
    const votes = JSON.parse(await fs.readFile(votesPath, 'utf8').catch(() => '[]'))
    
    // Find and remove the user's vote
    const voteIndex = votes.findIndex((vote: any) => vote.ideaId === ideaId && vote.userEmail === userEmail)
    
    if (voteIndex === -1) {
      return NextResponse.json({ error: 'Vote not found' }, { status: 404 })
    }

    votes.splice(voteIndex, 1)
    await fs.writeFile(votesPath, JSON.stringify(votes, null, 2), 'utf8')

    // Get updated vote count
    const voteCount = votes.filter((v: any) => v.ideaId === ideaId).length

    return NextResponse.json({ ok: true, voteCount })
  } catch (err) {
    console.error('Remove vote error', err)
    return NextResponse.json({ error: 'Failed to remove vote' }, { status: 500 })
  }
}