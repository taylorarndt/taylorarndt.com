import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import fs from 'fs/promises'

function requireAdmin(req: Request) {
  const key = req.headers.get('x-admin-key') || ''
  return key && process.env.ADMIN_KEY && key === process.env.ADMIN_KEY
}

export async function PATCH(req: Request) {
  try {
    if (!requireAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const body = await req.json()
    const id = String(body.id || '')
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const pendingPath = './data/pending-resources.json'
    const resourcesPath = './data/resources.json'

    const pending = JSON.parse(await fs.readFile(pendingPath, 'utf8') || '[]')
    const idx = pending.findIndex((p: any) => p.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const item = pending.splice(idx, 1)[0]
    const resources = JSON.parse(await fs.readFile(resourcesPath, 'utf8') || '[]')

    const now = new Date().toISOString()
    const approved = { id: item.id, title: item.title, url: item.url, summary: item.summary, tags: item.tags || [], updatedAt: now }
    resources.push(approved)

    await fs.writeFile(resourcesPath, JSON.stringify(resources, null, 2), 'utf8')
    await fs.writeFile(pendingPath, JSON.stringify(pending, null, 2), 'utf8')

    return NextResponse.json({ ok: true, approved })
  } catch (err) {
    console.error('Approve error', err)
    return NextResponse.json({ error: 'Failed to approve' }, { status: 500 })
  }
}
