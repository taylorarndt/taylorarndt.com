'use client'

import UserMenu from './UserMenu'

interface ClientUserSectionProps {
  user: {
    email?: string
    name?: string
    isAdmin?: boolean
  } | null
}

export default function ClientUserSection({ user }: ClientUserSectionProps) {
  if (!user) {
    return (
      <a href="/api/auth/login" className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
        Login
      </a>
    )
  }

  return <UserMenu user={user} />
}