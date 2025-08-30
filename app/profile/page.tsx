'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useEffect, useState } from 'react'
import { getGravatarUrl } from '../../lib/gravatar'
import Image from 'next/image'

interface UserProfile {
  email: string
  name?: string
  firstName?: string
  lastName?: string
  bio?: string
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const { user, isLoading: authLoading, error: authError } = useUser()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string[]>([])
  
  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')

  // Debug function
  const addDebug = (message: string) => {
    console.log(`[Profile] ${message}`)
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const fetchProfile = async () => {
    try {
      addDebug('Starting fetchProfile...')
      setLoading(true)
      setError(null)
      
      addDebug('Making request to /api/user/profile')
      const res = await fetch('/api/user/profile')
      const data = await res.json()
      
      addDebug(`API response: ${res.status} - ${JSON.stringify(data)}`)
      
      if (!res.ok) throw new Error(data.error || 'Failed to load profile')
      
      setProfile(data.profile)
      setFirstName(data.profile.firstName || '')
      setLastName(data.profile.lastName || '')
      setBio(data.profile.bio || '')
      addDebug('Profile loaded successfully')
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      addDebug(`Error fetching profile: ${errorMsg}`)
      setError(errorMsg)
    } finally {
      setLoading(false)
      addDebug('fetchProfile complete, loading set to false')
    }
  }

  // Load profile data
  useEffect(() => {
    addDebug(`useEffect triggered: authLoading=${authLoading}, hasUser=${!!user}, authError=${authError}`)
    
    if (authError) {
      addDebug(`Auth error: ${authError.message}`)
      setError(`Authentication error: ${authError.message}`)
      setLoading(false)
      return
    }
    
    if (!authLoading && !user) {
      addDebug('No user, redirecting to login')
      window.location.href = '/api/auth/login'
      return
    }

    if (user?.email) {
      addDebug(`User found: ${user.email}`)
      fetchProfile()
    } else if (!authLoading) {
      addDebug('Auth complete but no user found')
      setError('No user information available')
      setLoading(false)
    }
  }, [user, authLoading, authError])

  // Emergency timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        addDebug('Emergency timeout reached - forcing page to show')
        setLoading(false)
        if (!error) {
          setError('Profile loading timed out. Please refresh the page.')
        }
      }
    }, 8000)

    return () => clearTimeout(timeout)
  }, [loading, error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim() || null,
          lastName: lastName.trim() || null,
          bio: bio.trim() || null,
        }),
      })
      
      const data = await res.json()
      
      if (!res.ok) throw new Error(data.error || 'Failed to save profile')
      
      setProfile(data.profile)
      setSuccess('Profile updated successfully!')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSaving(false)
    }
  }

  // Show debug info in development
  const showDebug = process.env.NODE_ENV === 'development' || error

  if (authLoading || loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-20 bg-gray-800 rounded"></div>
            <div className="h-12 bg-gray-800 rounded"></div>
            <div className="h-12 bg-gray-800 rounded"></div>
            <div className="h-24 bg-gray-800 rounded"></div>
          </div>
        </div>
        {showDebug && (
          <div className="mt-4 p-4 bg-gray-800 rounded text-xs">
            <p className="text-yellow-400 mb-2">Debug Info:</p>
            {debugInfo.map((info, i) => (
              <p key={i} className="text-gray-300">{info}</p>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Please log in</h1>
        <a 
          href="/api/auth/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
        >
          Log In
        </a>
        {showDebug && (
          <div className="mt-4 p-4 bg-gray-800 rounded text-xs text-left">
            <p className="text-yellow-400 mb-2">Debug Info:</p>
            {debugInfo.map((info, i) => (
              <p key={i} className="text-gray-300">{info}</p>
            ))}
          </div>
        )}
      </div>
    )
  }

  const gravatarUrl = user.email ? getGravatarUrl(user.email, 128) : null

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>
        
        {/* Avatar Section */}
        <div className="flex items-center space-x-6 mb-8">
          {gravatarUrl && (
            <div className="relative">
              <Image
                src={gravatarUrl}
                alt="Profile Avatar"
                width={128}
                height={128}
                className="rounded-full border-2 border-gray-700"
              />
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">
              {profile?.name || user.name || 'User'}
            </h2>
            <p className="text-gray-400 mb-2">{user.email}</p>
            {profile?.isAdmin && (
              <p className="text-yellow-400 text-sm mb-2">
                ⭐ Admin User
              </p>
            )}
            <p className="text-sm text-gray-500">
              Avatar powered by{' '}
              <a 
                href="https://gravatar.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Gravatar
              </a>
            </p>
          </div>
        </div>

        {/* Debug Info */}
        {showDebug && (
          <div className="mb-6 p-4 bg-gray-800 rounded text-xs">
            <p className="text-yellow-400 mb-2">Debug Info:</p>
            {debugInfo.map((info, i) => (
              <p key={i} className="text-gray-300">{info}</p>
            ))}
          </div>
        )}

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded mb-6" role="alert">
            <strong className="font-medium">Error:</strong> {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded mb-6" role="alert">
            <strong className="font-medium">Success:</strong> {success}
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                maxLength={50}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your first name"
                aria-describedby="firstName-help"
              />
              <p id="firstName-help" className="text-xs text-gray-500 mt-1">
                Optional, max 50 characters
              </p>
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                maxLength={50}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your last name"
                aria-describedby="lastName-help"
              />
              <p id="lastName-help" className="text-xs text-gray-500 mt-1">
                Optional, max 50 characters
              </p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
              aria-describedby="bio-help"
            />
            <p id="bio-help" className="text-xs text-gray-500 mt-1">
              Optional, max 500 characters ({bio.length}/500)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              aria-describedby="submit-help"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            <p id="submit-help" className="text-xs text-gray-500">
              Changes are saved immediately
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}