'use client'

interface BulkActionsProps {
  selectedStreams: string[]
  onBulkAction: (action: 'Live' | 'Completed' | 'Cancelled', streamIds: string[]) => Promise<void>
  onClearSelection: () => void
}

export default function BulkActions({ selectedStreams, onBulkAction, onClearSelection }: BulkActionsProps) {
  if (selectedStreams.length === 0) return null

  const handleAction = async (action: 'Live' | 'Completed' | 'Cancelled') => {
    const confirmed = confirm(`Are you sure you want to mark ${selectedStreams.length} stream(s) as ${action}?`)
    if (confirmed) {
      await onBulkAction(action, selectedStreams)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-white font-medium">
            {selectedStreams.length} stream{selectedStreams.length !== 1 ? 's' : ''} selected
          </span>
          <button
            onClick={onClearSelection}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Clear selection
          </button>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => handleAction('Live')}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
          >
            Set Live
          </button>
          <button
            onClick={() => handleAction('Completed')}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-sm transition-colors"
          >
            Mark Completed
          </button>
          <button
            onClick={() => handleAction('Cancelled')}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}