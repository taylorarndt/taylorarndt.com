import { handleLogin } from '@auth0/nextjs-auth0'

// Explicit login route that delegates to Auth0.
// Note: May cause compatibility issues with Next.js 14 App Router
export const GET = handleLogin()