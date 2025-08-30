import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import { getSession } from '../../../../lib/auth'

// GET /api/user/votes - Get current user's votes
export async function GET(req: Request) {
  try {
    const session = await getSession()
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const userEmail = session.user.email
    const votesPath = './data/votes.json'
    const votes = JSON.parse(await fs.readFile(votesPath, 'utf8').catch(() => '[]'))
    
    const userVotes = votes
      .filter((vote: any) => vote.userEmail === userEmail)
      .map((vote: any) => vote.ideaId)
    
    return NextResponse.json({ votes: userVotes })
  } catch (err) {
    console.error('Get user votes error', err)
    return NextResponse.json({ error: 'Failed to get votes' }, { status: 500 })
  }
}