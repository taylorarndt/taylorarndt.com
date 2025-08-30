#!/usr/bin/env node
/**
 * Admin Role Management Script
 * 
 * Usage:
 *   node scripts/admin-manager.js list                    # List all users and their roles
 *   node scripts/admin-manager.js make-admin <email>      # Make user admin
 *   node scripts/admin-manager.js remove-admin <email>    # Remove admin role
 *   node scripts/admin-manager.js check <email>           # Check specific user's role
 *   node scripts/admin-manager.js init                    # Initialize admin user from env
 */

const { Client } = require('pg')
require('dotenv').config({ path: '.env.local' })

async function connectDB() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Please configure your database connection.')
  }
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })
  
  await client.connect()
  return client
}

async function listUsers() {
  const client = await connectDB()
  try {
    const result = await client.query(`
      SELECT id, email, name, is_admin, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC
    `)
    
    console.log('\n=== User List ===')
    console.log('ID | Email | Name | Admin | Created')
    console.log('---'.repeat(20))
    
    result.rows.forEach(user => {
      const adminStatus = user.is_admin ? '✅ ADMIN' : '👤 Member'
      console.log(`${user.id} | ${user.email} | ${user.name || 'N/A'} | ${adminStatus} | ${user.created_at.toISOString().split('T')[0]}`)
    })
    
    console.log(`\nTotal users: ${result.rows.length}`)
    const adminCount = result.rows.filter(u => u.is_admin).length
    console.log(`Admin users: ${adminCount}`)
    
  } finally {
    await client.end()
  }
}

async function makeAdmin(email) {
  if (!email) {
    throw new Error('Email is required')
  }
  
  const client = await connectDB()
  try {
    // First check if user exists
    const userCheck = await client.query('SELECT id, email, is_admin FROM users WHERE email = $1', [email.toLowerCase()])
    
    if (userCheck.rows.length === 0) {
      // Create user as admin
      const userId = `admin-${Date.now()}`
      await client.query(`
        INSERT INTO users (id, email, name, is_admin, created_at, updated_at)
        VALUES ($1, $2, $3, $4, NOW(), NOW())
      `, [userId, email.toLowerCase(), email.split('@')[0], true])
      
      console.log(`✅ Created new admin user: ${email}`)
    } else {
      // Update existing user
      if (userCheck.rows[0].is_admin) {
        console.log(`ℹ️  User ${email} is already an admin`)
        return
      }
      
      await client.query(`
        UPDATE users 
        SET is_admin = TRUE, updated_at = NOW() 
        WHERE email = $1
      `, [email.toLowerCase()])
      
      console.log(`✅ Granted admin role to: ${email}`)
    }
  } finally {
    await client.end()
  }
}

async function removeAdmin(email) {
  if (!email) {
    throw new Error('Email is required')
  }
  
  const client = await connectDB()
  try {
    const result = await client.query(`
      UPDATE users 
      SET is_admin = FALSE, updated_at = NOW() 
      WHERE email = $1
      RETURNING email, is_admin
    `, [email.toLowerCase()])
    
    if (result.rows.length === 0) {
      console.log(`❌ User not found: ${email}`)
    } else {
      console.log(`✅ Removed admin role from: ${email}`)
    }
  } finally {
    await client.end()
  }
}

async function checkUser(email) {
  if (!email) {
    throw new Error('Email is required')
  }
  
  const client = await connectDB()
  try {
    const result = await client.query(`
      SELECT id, email, name, is_admin, created_at, updated_at 
      FROM users 
      WHERE email = $1
    `, [email.toLowerCase()])
    
    if (result.rows.length === 0) {
      console.log(`❌ User not found: ${email}`)
      
      // Check if this is the env admin
      const envAdmin = process.env.ADMIN_EMAIL?.toLowerCase()
      if (envAdmin === email.toLowerCase()) {
        console.log(`ℹ️  This email matches ADMIN_EMAIL environment variable`)
        console.log(`ℹ️  User will be created as admin on first login`)
      }
    } else {
      const user = result.rows[0]
      console.log('\n=== User Details ===')
      console.log(`ID: ${user.id}`)
      console.log(`Email: ${user.email}`)
      console.log(`Name: ${user.name || 'N/A'}`)
      console.log(`Admin Role: ${user.is_admin ? '✅ YES' : '❌ NO'}`)
      console.log(`Created: ${user.created_at}`)
      console.log(`Updated: ${user.updated_at}`)
      
      // Also check env admin
      const envAdmin = process.env.ADMIN_EMAIL?.toLowerCase()
      if (envAdmin === email.toLowerCase()) {
        console.log(`\n🔑 Environment Admin: This email matches ADMIN_EMAIL`)
        console.log(`    Final admin status: ✅ YES (env override)`)
      }
    }
  } finally {
    await client.end()
  }
}

async function initAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail) {
    console.log('❌ ADMIN_EMAIL environment variable is not set')
    return
  }
  
  console.log(`🔄 Initializing admin user: ${adminEmail}`)
  await makeAdmin(adminEmail)
}

async function main() {
  const command = process.argv[2]
  const arg = process.argv[3]
  
  try {
    switch (command) {
      case 'list':
        await listUsers()
        break
      case 'make-admin':
        await makeAdmin(arg)
        break
      case 'remove-admin':
        await removeAdmin(arg)
        break
      case 'check':
        await checkUser(arg)
        break
      case 'init':
        await initAdmin()
        break
      default:
        console.log(`
Usage: node scripts/admin-manager.js <command> [args]

Commands:
  list                    List all users and their roles
  make-admin <email>      Grant admin role to user (creates if needed)
  remove-admin <email>    Remove admin role from user
  check <email>           Check specific user's role and details
  init                    Initialize admin user from ADMIN_EMAIL env var

Examples:
  node scripts/admin-manager.js list
  node scripts/admin-manager.js make-admin taylor@techopolisonline.com
  node scripts/admin-manager.js check taylor@techopolisonline.com
  node scripts/admin-manager.js init
        `)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}