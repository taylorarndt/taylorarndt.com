'use client'
import { useState } from 'react'

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        aria-label={isOpen ? 'Close mobile menu' : 'Open mobile menu'}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed top-0 right-0 w-64 h-full bg-white shadow-xl z-50 md:hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-bold text-gray-900">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900"
                aria-label="Close menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="p-4" role="navigation" aria-label="Mobile navigation">
              <div className="space-y-4">
                <a 
                  href="/" 
                  className="block text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="/about" 
                  className="block text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </a>
                <a 
                  href="/media" 
                  className="block text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Media
                </a>
                <a 
                  href="/resources" 
                  className="block text-gray-600 hover:text-gray-900 font-medium transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Resources
                </a>
                <a 
                  href="/contact" 
                  className="btn btn-primary mt-4 text-center block"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </a>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  )
}