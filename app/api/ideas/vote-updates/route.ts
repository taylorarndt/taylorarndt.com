import { NextRequest } from 'next/server'
export const dynamic = 'force-dynamic'
import { addSSEConnection, removeSSEConnection, sendCurrentVoteCounts } from '../../../../lib/sse-vote-updates'

// SSE endpoint for real-time vote updates
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lastEventId = parseInt(searchParams.get('lastEventId') || '0')
  
  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      const connectionId = `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      
      // Store connection
      addSSEConnection(connectionId, controller, lastEventId)

      // Send initial connection message
      const initialData = `data: ${JSON.stringify({ type: 'connected', connectionId })}\n\n`
      controller.enqueue(new TextEncoder().encode(initialData))

      // Send current vote counts for all approved ideas
      sendCurrentVoteCounts(controller)

      // Handle connection cleanup
      req.signal.addEventListener('abort', () => {
        removeSSEConnection(connectionId)
        try {
          controller.close()
        } catch (e) {
          // Connection already closed
        }
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
}