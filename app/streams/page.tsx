"use client"
import { useUser } from '@auth0/nextjs-auth0/client'
import { useState, useEffect } from 'react'

interface Idea {
  id: string
  title: string
  description: string
  category: string
  status: string
  submittedBy: string
  submittedAt: string
  createdAt: string
  updatedAt: string
  scheduledDate?: string
  youtubeLink?: string
  voteCount: number
}

interface Vote {
  ideaId: string
  userEmail: string
}

export default function StreamsPage() {
  const { user, isLoading: authLoading } = useUser()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set())
  const [pendingVoteIds, setPendingVoteIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('created')
  const [showLogin] = useState(false)
  const [userInfo, setUserInfo] = useState<{ email?: string; name?: string; isAdmin?: boolean } | null>(null)
  const [userInfoLoading, setUserInfoLoading] = useState(false)
  const [liveMessage, setLiveMessage] = useState('')

  useEffect(() => {
    fetchIdeas()
  }, [filter, sortBy])

  useEffect(() => {
    // Fetch user info immediately when user is available
    if (user?.email && !authLoading) {
      fetchUserVotes()
      fetchUserInfo()
    }
  }, [user?.email, authLoading]) // Trigger when user email is available and not loading

  const fetchUserInfo = async () => {
    setUserInfoLoading(true)
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      })
      if (response.ok) {
        const data = await response.json()
        console.log('Frontend user info:', data) // Debug log
        setUserInfo(data.user)
      } else {
        console.error('Failed to fetch user info:', response.status)
      }
    } catch (err) {
      console.error('Failed to fetch user info:', err)
    } finally {
      setUserInfoLoading(false)
    }
  }

  const fetchIdeas = async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter)
      params.append('sort', sortBy)
      
      const response = await fetch(`/api/ideas?${params}`)
      if (response.ok) {
        const data = await response.json()
        setIdeas(data.ideas || [])
      }
    } catch (err) {
      console.error('Failed to fetch ideas:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserVotes = async () => {
    try {
      const response = await fetch('/api/user/votes')
      if (response.ok) {
        const data = await response.json()
        setUserVotes(new Set(data.votes || []))
      }
    } catch (err) {
      console.error('Failed to fetch user votes:', err)
    }
  }


  const handleVote = async (ideaId: string) => {
  if (!user) return (window.location.href = '/api/auth/login') as any

    try {
      setPendingVoteIds(prev => new Set(prev).add(ideaId))
      const hasVoted = userVotes.has(ideaId)
      const method = hasVoted ? 'DELETE' : 'POST'
      const response = await fetch(`/api/ideas/${ideaId}/vote`, { method })
      
      if (response.ok) {
        const data = await response.json()
        
        // Update local state
        setIdeas(prev => prev.map(idea => 
          idea.id === ideaId ? { ...idea, voteCount: data.voteCount } : idea
        ))
        
        setUserVotes(prev => {
          const newVotes = new Set(prev)
          if (hasVoted) {
            newVotes.delete(ideaId)
          } else {
            newVotes.add(ideaId)
          }
          return newVotes
        })

        // Announce change for screen readers
        const changedIdea = ideas.find(i => i.id === ideaId)
        const title = changedIdea ? changedIdea.title : 'this idea'
        setLiveMessage(`${hasVoted ? 'Removed vote from' : 'Voted for'} ${title}. Total votes: ${data.voteCount}.`)
        // Clear message after a short delay
        setTimeout(() => setLiveMessage(''), 2000)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to vote')
      }
    } catch (err) {
      console.error('Vote error:', err)
      alert('Failed to vote')
    } finally {
      setPendingVoteIds(prev => {
        const n = new Set(prev)
        n.delete(ideaId)
        return n
      })
    }
  }

  // Auth handled by Auth0 login/logout routes

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
      case 'Live': return 'bg-purple-600 animate-pulse'
      case 'Completed': return 'bg-gray-600'
      case 'Cancelled': return 'bg-red-800'
      default: return 'bg-gray-600'
    }
  }

  if (authLoading) {
    return (
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-8">
  {/* Live region for announcing vote updates to assistive tech */}
  <span className="sr-only" role="status" aria-live="polite">{liveMessage}</span>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-6 text-white">YouTube Live Stream Ideas</h1>
    <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-8">
          Share your ideas for live streams and vote on ideas you'd like to see. Authenticated users can submit ideas and vote on approved suggestions.
        </p>
        
        {user ? (
          <div className="flex justify-center gap-4">
            <a href="/streams/submit" className="btn btn-primary">
              Submit New Idea
            </a>
            {userInfo?.isAdmin && !userInfoLoading && (
              <a href="/admin" className="btn bg-purple-600 hover:bg-purple-700 text-white">
                Admin Panel
              </a>
            )}
            <a href="/api/auth/logout" className="btn border border-gray-600 text-white hover:bg-gray-900">Logout ({user.email})</a>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
      <a href="/api/auth/login" className="btn btn-primary">Login to Submit Ideas</a>
          </div>
        )}
      </div>

      {/* Debug Info */}
      {user && (
        <div className="mb-8 p-4 bg-gray-900 border border-gray-700 rounded-lg max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-white">Debug Info</h3>
            <button 
              onClick={fetchUserInfo}
              className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
              disabled={userInfoLoading}
            >
              {userInfoLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.name || 'Not set'}</p>
            <p><strong>Admin Status:</strong> {userInfoLoading ? '⏳ Loading...' : userInfo?.isAdmin ? '✅ Admin' : '❌ Regular User'}</p>
            <p><strong>Can Approve Ideas:</strong> {userInfoLoading ? 'Checking...' : userInfo?.isAdmin ? 'Yes - Admin user in database' : 'No - Contact admin to grant access'}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4 justify-center">
        <div className="flex gap-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="all">All Ideas</option>
            <option value="Approved">Approved</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Live">Live Now</option>
            <option value="Completed">Completed</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="created">Newest First</option>
            <option value="votes">Most Votes</option>
            <option value="updated">Recently Updated</option>
          </select>
        </div>
      </div>

      {/* Ideas List */}
      {loading ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-800 rounded mb-3 w-3/4"></div>
              <div className="h-3 bg-gray-800 rounded mb-2 w-full"></div>
              <div className="h-3 bg-gray-800 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      ) : ideas.length > 0 ? (
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
          {ideas.map((idea) => (
            <div key={idea.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:bg-gray-800 transition-colors">
              {/* Header: Title | Category | Votes | Vote button */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-xl font-semibold text-white line-clamp-2 mr-3">{idea.title}</h3>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300" aria-label={`Category: ${idea.category}`}>
                    {idea.category}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 bg-gray-800 text-gray-200 px-2 py-1 rounded text-xs font-medium"
                    title="Total votes"
                    aria-label={`${idea.voteCount} votes`}
                    role="status"
                    aria-live="polite"
                  >
                    <span aria-hidden="true">👍</span>
                    <span>{idea.voteCount}</span>
                    <span className="sr-only">votes</span>
                  </span>
                  {user && idea.status === 'Approved' && (
                    userVotes.has(idea.id) ? (
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="px-2 py-1 rounded-lg bg-green-700 text-white text-xs font-semibold inline-flex items-center gap-1"
                          aria-label={`You have voted for ${idea.title}`}
                        >
                          <span aria-hidden="true">✔</span>
                          Voted
                        </span>
                        <button
                          onClick={() => handleVote(idea.id)}
                          disabled={pendingVoteIds.has(idea.id)}
                          aria-busy={pendingVoteIds.has(idea.id)}
                          className={`px-2 py-1 rounded-lg text-white text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 border ${
                            pendingVoteIds.has(idea.id)
                              ? 'bg-red-900 border-red-900 cursor-not-allowed'
                              : 'bg-red-700 hover:bg-red-800 border-red-700'
                          }`}
                          aria-label={`Remove your vote for ${idea.title}`}
                          title="Remove your vote"
                        >
                          {pendingVoteIds.has(idea.id) ? 'Removing…' : 'Remove vote'}
                        </button>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleVote(idea.id)}
                        disabled={pendingVoteIds.has(idea.id)}
                        aria-busy={pendingVoteIds.has(idea.id)}
                        className={`px-3 py-1.5 rounded-lg text-white text-xs font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                          pendingVoteIds.has(idea.id)
                            ? 'bg-blue-900 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                        aria-label={`Vote for ${idea.title}`}
                      >
                        {pendingVoteIds.has(idea.id) ? 'Voting…' : 'Vote'}
                      </button>
                    )
                  )}
                </div>
              </div>
              {/* Status chip below header for clarity */}
              <div className="mb-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(idea.status)}`} aria-label={`Status: ${idea.status}`}>
                  {idea.status}
                </span>
              </div>
              <p className="text-gray-400 mb-4 leading-relaxed line-clamp-3">{idea.description}</p>
              
              

              
              <div className="text-sm text-gray-500 space-y-1">
                <p>Submitted: {formatDate(idea.submittedAt)}</p>
                {idea.scheduledDate && (
                  <p>Scheduled: {formatDate(idea.scheduledDate)}</p>
                )}
                {idea.youtubeLink && (
                  <a 
                    href={idea.youtubeLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                    aria-label={`Watch ${idea.title} on YouTube`}
                  >
                    Watch on YouTube <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No ideas found. Be the first to submit one!</p>
        </div>
      )}

      {/* Login Modal */}
  {/* Auth0 handles login UI externally */}
    </div>
  )
}