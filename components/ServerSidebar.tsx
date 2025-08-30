import { cookies } from 'next/headers'
import ClientUserSection from './ClientUserSection'

export default async function ServerSidebar() {
  // Avoid using Auth0 SDK in Server Components to prevent cookie warnings
  // Fetch from our API which reads the session server-side
  let user: { email?: string; name?: string; isAdmin?: boolean } | null = null
  try {
    const cookieHeader = cookies().toString()
    const res = await fetch(`${process.env.AUTH0_BASE_URL || ''}/api/auth/me`, {
      // Ensure no caching and include cookies in the server request
      cache: 'no-store',
      headers: cookieHeader ? { cookie: cookieHeader } : undefined,
      // next: { revalidate: 0 } // alternative
    })
    if (res.ok) {
      const data = await res.json()
      user = data.user || null
    }
  } catch {
    // ignore
  }
  return (
    <aside className="w-64 bg-gray-900 p-6 border-r border-gray-800">
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold">TA</span>
        </div>
      </div>
      <nav className="space-y-2">
        <a href="/" className="flex items-center gap-3 px-3 py-2 text-white hover:bg-gray-800 rounded-lg transition-colors">
          <span>Home</span>
        </a>
        <a href="/about" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
          <span>About</span>
        </a>
        <a href="/streams" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
          <span>Stream Ideas</span>
        </a>
        <a href="/contact" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
          <span>Contact</span>
        </a>
        <a href="/media" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
          <span>Media</span>
        </a>
        <a href="/resources" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
          <span>Resources</span>
        </a>
        {user?.isAdmin && (
          <a href="/admin" className="flex items-center gap-3 px-3 py-2 text-purple-300 hover:bg-purple-900/20 hover:text-purple-200 rounded-lg transition-colors border border-purple-800/30">
            <span>🔧 Admin Dashboard</span>
          </a>
        )}
        <div className="pt-4 border-t border-gray-800 mt-4">
          <ClientUserSection user={user} />
        </div>
      </nav>
    </aside>
  )
}
