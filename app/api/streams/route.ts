import { NextResponse } from 'next/server'
import fs from 'fs/promises'

// GET /api/streams - List scheduled/live/completed streams
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const status = url.searchParams.get('status')
    
    const ideasPath = './data/ideas.json'
    const ideas = JSON.parse(await fs.readFile(ideasPath, 'utf8').catch(() => '[]'))
    
    // Filter for stream-related statuses
    const streamStatuses = ['Scheduled', 'Live', 'Completed']
    let streams = ideas.filter((idea: any) => streamStatuses.includes(idea.status))
    
    // Further filter by specific status if provided
    if (status && streamStatuses.includes(status)) {
      streams = streams.filter((idea: any) => idea.status === status)
    }
    
    // Sort by scheduled date (ascending for upcoming, descending for completed)
    streams.sort((a: any, b: any) => {
      if (a.status === 'Completed' && b.status === 'Completed') {
        // Completed streams: most recent first
        return new Date(b.completedAt || b.updatedAt).getTime() - new Date(a.completedAt || a.updatedAt).getTime()
      } else {
        // Scheduled/Live streams: earliest first
        return new Date(a.scheduledDate || a.updatedAt).getTime() - new Date(b.scheduledDate || b.updatedAt).getTime()
      }
    })
    
    return NextResponse.json({ streams })
  } catch (err) {
    console.error('List streams error', err)
    return NextResponse.json({ error: 'Failed to list streams' }, { status: 500 })
  }
}