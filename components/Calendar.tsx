'use client'

import { useState } from 'react'

interface Stream {
  id: string
  title: string
  description: string
  category: string
  status: 'Scheduled' | 'Live' | 'Completed' | 'Cancelled'
  submittedBy: string
  submittedAt: string
  scheduledDate?: string
  youtubeLink?: string
  completedAt?: string
}

interface CalendarProps {
  streams: Stream[]
  onStreamClick: (stream: Stream) => void
  onDateClick: (date: Date) => void
  onStreamDrop: (streamId: string, newDate: Date) => void
  selectedStreams: string[]
  onStreamSelect: (streamId: string, selected: boolean) => void
}

type ViewMode = 'month' | 'week' | 'day'

export default function Calendar({ 
  streams, 
  onStreamClick, 
  onDateClick, 
  onStreamDrop,
  selectedStreams,
  onStreamSelect 
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [draggedStream, setDraggedStream] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-600'
      case 'Live': return 'bg-purple-600'
      case 'Completed': return 'bg-gray-600'
      case 'Cancelled': return 'bg-red-800'
      default: return 'bg-gray-600'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStreamsForDate = (date: Date) => {
    const dateStr = date.toDateString()
    return streams.filter(stream => {
      if (!stream.scheduledDate) return false
      return new Date(stream.scheduledDate).toDateString() === dateStr
    })
  }

  const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay()) // Start on Sunday
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const getMonthDates = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const startDate = new Date(firstDay)
    startDate.setDate(firstDay.getDate() - firstDay.getDay()) // Start on Sunday

    const dates = []
    const current = new Date(startDate)
    
    // Generate 6 weeks (42 days) to fill the calendar grid
    for (let i = 0; i < 42; i++) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return dates
  }

  const handleDragStart = (e: React.DragEvent, streamId: string) => {
    setDraggedStream(streamId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault()
    if (draggedStream) {
      onStreamDrop(draggedStream, date)
      setDraggedStream(null)
    }
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (viewMode === 'month') {
      newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7))
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  const renderMonthView = () => {
    const dates = getMonthDates(currentDate)

    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {dates.map((date, index) => {
            const dayStreams = getStreamsForDate(date)
            const isCurrentMonth = date.getMonth() === currentDate.getMonth()
            const isToday = date.toDateString() === new Date().toDateString()
            
            return (
              <div
                key={index}
                className={`min-h-24 p-1 border border-gray-700 rounded cursor-pointer hover:bg-gray-800 transition-colors ${
                  !isCurrentMonth ? 'bg-gray-950 text-gray-600' : 'bg-gray-900'
                } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => onDateClick(date)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, date)}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-blue-400' : 'text-white'}`}>
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {dayStreams.slice(0, 3).map(stream => (
                    <div
                      key={stream.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, stream.id)}
                      onClick={(e) => {
                        e.stopPropagation()
                        onStreamClick(stream)
                      }}
                      className={`text-xs p-1 rounded truncate text-white cursor-move hover:opacity-80 transition-opacity ${getStatusColor(stream.status)} ${
                        selectedStreams.includes(stream.id) ? 'ring-2 ring-yellow-400' : ''
                      }`}
                      title={`${stream.title} - ${stream.status}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedStreams.includes(stream.id)}
                        onChange={(e) => {
                          e.stopPropagation()
                          onStreamSelect(stream.id, e.target.checked)
                        }}
                        className="mr-1 w-3 h-3"
                      />
                      {stream.title}
                    </div>
                  ))}
                  {dayStreams.length > 3 && (
                    <div className="text-xs text-gray-400 p-1">
                      +{dayStreams.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate)
    
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const dayStreams = getStreamsForDate(date)
            const isToday = date.toDateString() === new Date().toDateString()
            
            return (
              <div key={index} className="border border-gray-700 rounded p-2">
                <div className={`text-sm font-medium mb-2 text-center ${isToday ? 'text-blue-400' : 'text-white'}`}>
                  {date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                </div>
                <div 
                  className="space-y-2 min-h-32"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, date)}
                >
                  {dayStreams.map(stream => (
                    <div
                      key={stream.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, stream.id)}
                      onClick={() => onStreamClick(stream)}
                      className={`text-xs p-2 rounded text-white cursor-move hover:opacity-80 transition-opacity ${getStatusColor(stream.status)} ${
                        selectedStreams.includes(stream.id) ? 'ring-2 ring-yellow-400' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedStreams.includes(stream.id)}
                        onChange={(e) => {
                          e.stopPropagation()
                          onStreamSelect(stream.id, e.target.checked)
                        }}
                        className="mr-1 w-3 h-3"
                      />
                      <div className="font-medium">{stream.title}</div>
                      {stream.scheduledDate && (
                        <div className="text-gray-200">{formatTime(stream.scheduledDate)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderDayView = () => {
    const dayStreams = getStreamsForDate(currentDate)
    const isToday = currentDate.toDateString() === new Date().toDateString()
    
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
        <div className={`text-lg font-medium mb-4 ${isToday ? 'text-blue-400' : 'text-white'}`}>
          {formatDate(currentDate)}
        </div>
        <div 
          className="space-y-3 min-h-64"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, currentDate)}
        >
          {dayStreams.length === 0 ? (
            <div className="text-gray-400 text-center py-8">No streams scheduled for this day</div>
          ) : (
            dayStreams.map(stream => (
              <div
                key={stream.id}
                draggable
                onDragStart={(e) => handleDragStart(e, stream.id)}
                onClick={() => onStreamClick(stream)}
                className={`p-4 rounded text-white cursor-move hover:opacity-80 transition-opacity ${getStatusColor(stream.status)} ${
                  selectedStreams.includes(stream.id) ? 'ring-2 ring-yellow-400' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedStreams.includes(stream.id)}
                    onChange={(e) => {
                      e.stopPropagation()
                      onStreamSelect(stream.id, e.target.checked)
                    }}
                    className="mt-1 w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-lg">{stream.title}</div>
                    <div className="text-gray-200 mb-2">{stream.description}</div>
                    <div className="text-sm text-gray-300">
                      {stream.scheduledDate && `Scheduled: ${formatTime(stream.scheduledDate)}`}
                      {stream.youtubeLink && (
                        <span className="ml-4">
                          <a href={stream.youtubeLink} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200">
                            YouTube Link
                          </a>
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(stream.status)}`}>
                    {stream.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateDate('prev')}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            ‹
          </button>
          <h2 className="text-xl font-semibold text-white">
            {viewMode === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            {viewMode === 'week' && `Week of ${getWeekDates(currentDate)[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
            {viewMode === 'day' && formatDate(currentDate)}
          </h2>
          <button
            onClick={() => navigateDate('next')}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
          >
            ›
          </button>
        </div>
        
        <div className="flex gap-2">
          {(['month', 'week', 'day'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === mode 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Content */}
      {viewMode === 'month' && renderMonthView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'day' && renderDayView()}
    </div>
  )
}