"use client"

import { useState, useEffect } from 'react'

interface Idea {
  id: string
  title: string
  description: string
  category: string
  status: string
  submittedBy: string
  submittedAt: string
  scheduledDate?: string
  youtubeLink?: string
  voteCount: number
}

export default function AdminPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [adminKey, setAdminKey] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const savedKey = localStorage.getItem('adminKey')
    if (savedKey) {
      setAdminKey(savedKey)
      setIsAuthenticated(true)
      fetchIdeas(savedKey)
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (adminKey.trim()) {
      localStorage.setItem('adminKey', adminKey)
      setIsAuthenticated(true)
      fetchIdeas(adminKey)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminKey')
    setAdminKey('')
    setIsAuthenticated(false)
    setIdeas([])
  }

  const fetchIdeas = async (key?: string) => {
    try {
      const response = await fetch('/api/ideas', {
        headers: {
          'x-admin-key': key || adminKey
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setIdeas(data.ideas || [])
      } else if (response.status === 401) {
        setIsAuthenticated(false)
        localStorage.removeItem('adminKey')
      }
    } catch (err) {
      console.error('Failed to fetch ideas:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (ideaId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        await fetchIdeas()
        alert('Status updated successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update status')
      }
    } catch (err) {
      console.error('Status update error:', err)
      alert('Failed to update status')
    }
  }

  const handleApprove = async (ideaId: string) => {
    try {
      const response = await fetch(`/api/ideas/${ideaId}/approve`, {
        method: 'PUT',
        headers: {
          'x-admin-key': adminKey
        }
      })

      if (response.ok) {
        await fetchIdeas()
        alert('Idea approved successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to approve idea')
      }
    } catch (err) {
      console.error('Approve error:', err)
      alert('Failed to approve idea')
    }
  }

  const handleSchedule = async (ideaId: string) => {
    const scheduledDate = prompt('Enter scheduled date and time (YYYY-MM-DD HH:MM):')
    if (!scheduledDate) return

    const youtubeLink = prompt('Enter YouTube link (optional):') || ''

    try {
      const response = await fetch(`/api/ideas/${ideaId}/schedule`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({ 
          scheduledDate: new Date(scheduledDate).toISOString(),
          youtubeLink 
        })
      })

      if (response.ok) {
        await fetchIdeas()
        alert('Idea scheduled successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to schedule idea')
      }
    } catch (err) {
      console.error('Schedule error:', err)
      alert('Failed to schedule idea')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-600'
      case 'Approved': return 'bg-green-600'
      case 'Rejected': return 'bg-red-600'
      case 'Scheduled': return 'bg-blue-600'
      case 'Live': return 'bg-purple-600'
      case 'Completed': return 'bg-gray-600'
      case 'Cancelled': return 'bg-red-800'
      default: return 'bg-gray-600'
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-8">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-white text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="adminKey" className="block text-sm font-medium text-white mb-2">
                Admin Key
              </label>
              <input
                type="password"
                id="adminKey"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin key"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  const pendingIdeas = ideas.filter(idea => idea.status === 'Pending')
  const approvedIdeas = ideas.filter(idea => idea.status === 'Approved')
  const scheduledIdeas = ideas.filter(idea => idea.status === 'Scheduled')

  return (
    <div className="max-w-6xl mx-auto px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 border border-gray-600 text-white hover:bg-gray-800 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">{pendingIdeas.length}</div>
          <div className="text-sm text-gray-400">Pending Review</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">{approvedIdeas.length}</div>
          <div className="text-sm text-gray-400">Approved</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{scheduledIdeas.length}</div>
          <div className="text-sm text-gray-400">Scheduled</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-white">{ideas.length}</div>
          <div className="text-sm text-gray-400">Total Ideas</div>
        </div>
      </div>

      {/* Ideas List */}
      <div className="space-y-4">
        {ideas.map(idea => (
          <div key={idea.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusColor(idea.status)}`}>
                    {idea.status}
                  </span>
                  <span className="text-sm text-gray-400">
                    Votes: {idea.voteCount}
                  </span>
                  <span className="text-sm text-gray-400">
                    Category: {idea.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{idea.title}</h3>
                <p className="text-gray-400 mb-3">{idea.description}</p>
                <div className="text-sm text-gray-500">
                  <p>Submitted by: {idea.submittedBy}</p>
                  <p>Submitted: {formatDate(idea.submittedAt)}</p>
                  {idea.scheduledDate && <p>Scheduled: {formatDate(idea.scheduledDate)}</p>}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                {idea.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(idea.id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusChange(idea.id, 'Rejected')}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
                
                {idea.status === 'Approved' && (
                  <button
                    onClick={() => handleSchedule(idea.id)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                  >
                    Schedule
                  </button>
                )}
                
                {idea.status === 'Scheduled' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(idea.id, 'Live')}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
                    >
                      Set Live
                    </button>
                    <button
                      onClick={() => handleStatusChange(idea.id, 'Completed')}
                      className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                    >
                      Complete
                    </button>
                  </>
                )}
                
                {idea.status === 'Live' && (
                  <button
                    onClick={() => handleStatusChange(idea.id, 'Completed')}
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {ideas.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No ideas submitted yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}