import { NextResponse } from 'next/server'
import fs from 'fs/promises'

function requireAdmin(req: Request) {
  const key = req.headers.get('x-admin-key') || ''
  return key && process.env.ADMIN_KEY && key === process.env.ADMIN_KEY
}

export async function GET(req: Request) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const pendingPath = './data/pending-resources.json'
    const content = JSON.parse(await fs.readFile(pendingPath, 'utf8') || '[]')
    return NextResponse.json(content)
  } catch (err) {
    console.error('List pending error', err)
    return NextResponse.json({ error: 'Failed to list' }, { status: 500 })
  }
}
