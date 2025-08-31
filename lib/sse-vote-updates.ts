// SSE vote update broadcasting functionality
import { query } from './db'

// Global map to track SSE connections
const connections = new Map<string, {
  controller: ReadableStreamDefaultController
  lastEventId: number
}>()

let eventCounter = 0

export interface VoteUpdateConnection {
  connectionId: string
  controller: ReadableStreamDefaultController
  lastEventId: number
}

export function addSSEConnection(connectionId: string, controller: ReadableStreamDefaultController, lastEventId: number = 0) {
  connections.set(connectionId, {
    controller,
    lastEventId
  })
}

export function removeSSEConnection(connectionId: string) {
  connections.delete(connectionId)
}

export async function sendCurrentVoteCounts(controller: ReadableStreamDefaultController) {
  try {
    const { rows } = await query(`
      SELECT 
        i.id,
        COUNT(v.id)::int as vote_count
      FROM ideas i
      LEFT JOIN votes v ON i.id = v.idea_id
      WHERE i.status = 'Approved'
      GROUP BY i.id
    `)
    
    const voteCounts = rows.reduce((acc: Record<string, number>, row: any) => {
      acc[row.id] = row.vote_count
      return acc
    }, {})

    const data = `data: ${JSON.stringify({ 
      type: 'vote_counts', 
      voteCounts,
      eventId: ++eventCounter 
    })}\n\n`
    controller.enqueue(new TextEncoder().encode(data))
  } catch (err) {
    console.error('Failed to send current vote counts:', err)
  }
}

// Function to broadcast vote updates to all connected clients
export function broadcastVoteUpdate(ideaId: string, newVoteCount: number) {
  const data = `data: ${JSON.stringify({ 
    type: 'vote_update', 
    ideaId, 
    voteCount: newVoteCount,
    eventId: ++eventCounter
  })}\n\n`
  
  const encodedData = new TextEncoder().encode(data)
  
  // Send to all connected clients
  for (const [connectionId, connection] of connections.entries()) {
    try {
      connection.controller.enqueue(encodedData)
      connection.lastEventId = eventCounter
    } catch (err) {
      // Connection closed, remove it
      connections.delete(connectionId)
    }
  }
}