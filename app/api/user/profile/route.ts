import { NextResponse } from 'next/server'
import { getServerUser } from '../../../../lib/auth0'
import { query } from '../../../../lib/db'
export const dynamic = 'force-dynamic'

// GET /api/user/profile - Get current user profile
export async function GET() {
  try {
    const user = await getServerUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const result = await query(
      'SELECT email, name, first_name, last_name, bio, is_admin, created_at, updated_at FROM users WHERE email = $1',
      [user.email.toLowerCase()]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const profile = result.rows[0]
    return NextResponse.json({ 
      profile: {
        email: profile.email,
        name: profile.name,
        firstName: profile.first_name,
        lastName: profile.last_name,
        bio: profile.bio,
        isAdmin: profile.is_admin,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      }
    })
  } catch (err) {
    console.error('Get profile error:', err)
    return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 })
  }
}

// PUT /api/user/profile - Update current user profile
export async function PUT(req: Request) {
  try {
    const user = await getServerUser()
    if (!user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const body = await req.json()
    const { firstName, lastName, bio } = body

    // Validate input
    if (firstName && (typeof firstName !== 'string' || firstName.length > 50)) {
      return NextResponse.json({ error: 'First name must be a string with max 50 characters' }, { status: 400 })
    }
    if (lastName && (typeof lastName !== 'string' || lastName.length > 50)) {
      return NextResponse.json({ error: 'Last name must be a string with max 50 characters' }, { status: 400 })
    }
    if (bio && (typeof bio !== 'string' || bio.length > 500)) {
      return NextResponse.json({ error: 'Bio must be a string with max 500 characters' }, { status: 400 })
    }

    // Compute full name from first and last name
    const fullName = [firstName, lastName].filter(Boolean).join(' ') || null

    const result = await query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, bio = $3, name = $4, updated_at = NOW() 
       WHERE email = $5 
       RETURNING email, name, first_name, last_name, bio, is_admin, created_at, updated_at`,
      [firstName || null, lastName || null, bio || null, fullName, user.email.toLowerCase()]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const profile = result.rows[0]
    return NextResponse.json({ 
      profile: {
        email: profile.email,
        name: profile.name,
        firstName: profile.first_name,
        lastName: profile.last_name,
        bio: profile.bio,
        isAdmin: profile.is_admin,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      }
    })
  } catch (err) {
    console.error('Update profile error:', err)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}