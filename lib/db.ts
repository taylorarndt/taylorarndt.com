import { Pool, QueryResult, QueryResultRow } from 'pg'

let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString || connectionString.includes('placeholder')) {
      throw new Error('DATABASE_URL is not set. Please configure your Neon connection string in environment variables.')
    }
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    })
  }
  return pool
}

export async function query<T extends QueryResultRow = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
  try {
    const client = getPool()
    return client.query<T>(text, params)
  } catch (err) {
    console.error('Database query error:', err)
    throw err
  }
}

export async function withTransaction<T>(fn: (client: Pool) => Promise<T>): Promise<T> {
  const p = getPool()
  // Pool-level transaction helper (simple usage pattern)
  const client = await p.connect()
  try {
    await client.query('BEGIN')
    const res = await fn(({
      query: client.query.bind(client),
    } as unknown) as Pool)
    await client.query('COMMIT')
    return res
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}
