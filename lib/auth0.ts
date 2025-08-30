import { getSession as getAuth0Session, getAccessToken, withApiAuthRequired, handleAuth } from '@auth0/nextjs-auth0'
import { query } from './db'

export type Auth0User = {
  email?: string
  name?: string
  [key: string]: any
}

export async function getServerUser() {
  let session: Awaited<ReturnType<typeof getAuth0Session>> | undefined
  try {
    session = await getAuth0Session()
  } catch (err) {
    // Commonly thrown when AUTH0_SECRET or other config is missing.
    console.error('Auth0 session error:', err)
    return null
  }
  const user = session?.user as Auth0User | undefined
  
  if (!user?.email) return null
  try {
    console.log('[auth] Session user:', { email: user.email, name: user.name })
  } catch {}
  
  // Check admin status from database
  let isAdmin = false
  try {
    const emailLower = user.email.toLowerCase()
    const adminEmailLower = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
    const envAdmin = adminEmailLower && emailLower === adminEmailLower

    const result = await query(
      'SELECT is_admin FROM users WHERE email = $1',
      [emailLower]
    )

    if (result.rows.length > 0) {
      const dbIsAdmin = Boolean(result.rows[0].is_admin)
      isAdmin = dbIsAdmin || Boolean(envAdmin)
      console.log('[auth] DB user found. dbIsAdmin:', dbIsAdmin, 'envAdmin:', Boolean(envAdmin), 'computed isAdmin:', isAdmin)
      // If env says admin but DB not yet marked, update it for consistency
      if (envAdmin && !dbIsAdmin) {
        await query('UPDATE users SET is_admin = TRUE, updated_at = NOW() WHERE email = $1', [emailLower])
        console.log('[auth] DB updated is_admin = TRUE for', emailLower)
      }
    } else {
      // Insert user; set is_admin based on envAdmin
      await query(
        'INSERT INTO users (id, email, name, is_admin, created_at, updated_at) VALUES ($1, $2, $3, $4, NOW(), NOW()) ON CONFLICT (email) DO NOTHING',
        [`user-${Date.now()}`, emailLower, user.name || '', Boolean(envAdmin)]
      )
      isAdmin = Boolean(envAdmin)
      console.log('[auth] DB user created. envAdmin:', Boolean(envAdmin), 'computed isAdmin:', isAdmin)
    }
  } catch (err) {
    console.error('Database error checking admin status:', err)
    // Fallback to env var if DB fails
    isAdmin = Boolean(process.env.ADMIN_EMAIL && user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase())
    console.log('[auth] Fallback isAdmin from env:', isAdmin)
  }
  
  return {
    email: user.email,
    name: user.name,
    isAdmin,
  }
}

export { withApiAuthRequired }
