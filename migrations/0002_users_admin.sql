-- Users table for admin roles
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert taylor@techopolisonline.com as admin
INSERT INTO users (id, email, name, is_admin, created_at, updated_at) 
VALUES (
  'admin-taylor', 
  'taylor@techopolisonline.com', 
  'Taylor Arndt', 
  TRUE, 
  NOW(), 
  NOW()
) ON CONFLICT (email) DO UPDATE SET is_admin = TRUE, updated_at = NOW();

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_admin ON users(is_admin);
