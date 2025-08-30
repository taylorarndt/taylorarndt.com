#!/usr/bin/env node
/* Simple migration runner: node scripts/db-migrate.cjs [path-to-sql] */
const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

async function main() {
  const sqlPath = process.argv[2] || path.join(__dirname, '..', 'migrations', '0001_init.sql')
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set. Aborting.')
    process.exit(1)
  }

  const sql = fs.readFileSync(sqlPath, 'utf8')
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  await client.connect()
  try {
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('COMMIT')
    console.log('Migration applied:', path.basename(sqlPath))
  } catch (e) {
    await client.query('ROLLBACK')
    console.error('Migration failed:', e.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

main()
