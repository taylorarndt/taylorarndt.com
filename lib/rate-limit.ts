// Rate limiting utility for API endpoints
// Simple in-memory rate limiter for serverless-friendly implementation

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitEntry>()

interface RateLimitOptions {
  windowMs: number  // Time window in milliseconds
  maxRequests: number  // Maximum requests per window
}

export function checkRateLimit(ip: string, options: RateLimitOptions): boolean {
  const now = Date.now()
  const { windowMs, maxRequests } = options
  
  const entry = rateLimitMap.get(ip)
  
  // If no entry exists or the window has expired, create new entry
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  // If max requests exceeded, deny request
  if (entry.count >= maxRequests) {
    return false
  }
  
  // Increment count and allow request
  entry.count++
  return true
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'unknown'
}

// Predefined rate limit configurations
export const RATE_LIMITS = {
  VOTING: { windowMs: 60 * 1000, maxRequests: 10 }, // 10 votes per minute
  SUBMISSION: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 submissions per 15 minutes
} as const