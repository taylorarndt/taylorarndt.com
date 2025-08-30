import { handleLogin } from '@auth0/nextjs-auth0'

// Explicit login route that delegates to Auth0.
export const GET = handleLogin()