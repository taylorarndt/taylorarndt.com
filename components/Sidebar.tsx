'use client'

import { useUser } from '@auth0/nextjs-auth0/client'

export default function Sidebar() {
  const { user, isLoading } = useUser()
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
        <div className="pt-4 border-t border-gray-800 mt-4">
          {isLoading ? (
            <span className="text-gray-400 text-sm">Loading...</span>
          ) : user ? (
            <div className="flex flex-col gap-2">
              <span className="text-gray-300 text-sm">{user.name || user.email}</span>
              <a href="/api/auth/logout" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">Logout</a>
            </div>
          ) : (
            <a href="/api/auth/login" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">Login</a>
          )}
        </div>
      </nav>
    </aside>
  )
}
