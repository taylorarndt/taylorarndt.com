"use client"

import { useState, useEffect } from 'react'
import { useUser } from '@auth0/nextjs-auth0/client'

interface UserData {
  email: string
  name: string
  isAdmin: boolean
}

export default function AdminDebugPage() {
  const { user, error, isLoading } = useUser()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      console.log('[DEBUG] Fetching user data from /api/auth/me...')
      const response = await fetch('/api/auth/me')
      console.log('[DEBUG] Response status:', response.status)
      const data = await response.json()
      console.log('[DEBUG] Response data:', data)
      setUserData(data.user)
      setDebugInfo({
        auth0User: user,
        serverUser: data.user,
        apiResponse: data,
        responseStatus: response.status,
        timestamp: new Date().toISOString()
      })
    } catch (err) {
      console.error('Error fetching user data:', err)
      setDebugInfo({
        auth0User: user,
        serverUser: null,
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  const testAdminAPI = async () => {
    try {
      const response = await fetch('/api/ideas?status=Pending')
      const data = await response.json()
      console.log('Admin API test result:', data)
      alert(`Admin API test: ${response.ok ? 'SUCCESS' : 'FAILED'} (check console for details)`)
    } catch (err) {
      console.error('Admin API test failed:', err)
      alert('Admin API test failed')
    }
  }

  if (isLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading admin debug info...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6">🔧 Admin Role Debug Panel</h1>
        
        {/* Auth Status */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Authentication Status</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            {!user ? (
              <div>
                <p className="text-red-400 mb-4">❌ Not authenticated</p>
                <a 
                  href="/api/auth/login"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign In with Auth0
                </a>
              </div>
            ) : (
              <div>
                <p className="text-green-400 mb-2">✅ Authenticated</p>
                <p className="text-gray-300">Email: {user.email}</p>
                <p className="text-gray-300">Name: {user.name || 'N/A'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Server User Data */}
        {userData && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Server User Data</h2>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="grid grid-cols-1 gap-2">
                <p className="text-gray-300">Email: <span className="text-white">{userData.email}</span></p>
                <p className="text-gray-300">Name: <span className="text-white">{userData.name || 'N/A'}</span></p>
                <p className="text-gray-300">
                  Admin Status: 
                  <span className={`ml-2 px-2 py-1 rounded text-sm font-medium ${
                    userData.isAdmin ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {userData.isAdmin ? '✅ ADMIN' : '❌ NOT ADMIN'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Environment Info */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Environment Configuration</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="space-y-2">
              <p className="text-gray-300">
                Admin Email (ADMIN_EMAIL): 
                <span className="text-yellow-400 ml-2">
                  {process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'Not exposed to client'}
                </span>
              </p>
              <p className="text-gray-300 text-sm">
                ℹ️ Admin email is checked server-side and not exposed to client
              </p>
              
              {/* Environment Variable Check */}
              <div className="mt-4 p-3 bg-orange-900 border border-orange-700 rounded">
                <p className="text-orange-200 text-sm">
                  ⚠️ <strong>Common Issue:</strong> If you see "Not authenticated" or admin status is wrong, 
                  check that these environment variables are set:
                  <br />
                  <code className="text-orange-100">AUTH0_SECRET, AUTH0_ISSUER_BASE_URL, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, ADMIN_EMAIL</code>
                  <br />
                  Missing AUTH0 configuration will prevent session creation entirely.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={fetchUserData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🔄 Refresh User Data
            </button>
            
            {userData && (
              <button
                onClick={testAdminAPI}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🧪 Test Admin API
              </button>
            )}
            
            <a
              href="/admin"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🎛️ Go to Admin Dashboard
            </a>
            
            <a
              href="/api/auth/logout"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🚪 Logout
            </a>
          </div>
        </div>

        {/* Debug Data */}
        {debugInfo && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Debug Data (JSON)</h2>
            <div className="bg-gray-800 p-4 rounded-lg overflow-auto">
              <pre className="text-sm text-gray-300">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Troubleshooting */}
        <div className="border-t border-gray-700 pt-8">
          <h2 className="text-xl font-bold text-white mb-4">🔍 Troubleshooting Steps</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Verify Auth0 configuration is correct</li>
              <li>Check that ADMIN_EMAIL environment variable matches your email</li>
              <li>Ensure database is accessible and migrations have run</li>
              <li>Check if user exists in database with admin role</li>
              <li>Test admin API endpoints to verify permissions</li>
            </ol>
            
            <div className="mt-4 p-3 bg-yellow-900 border border-yellow-700 rounded">
              <p className="text-yellow-200 text-sm">
                💡 <strong>Admin Management:</strong> Use the admin-manager.js script to manage user roles:
                <br />
                <code className="text-yellow-100">node scripts/admin-manager.js check {user?.email}</code>
                <br />
                <code className="text-yellow-100">node scripts/admin-manager.js make-admin {user?.email}</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}