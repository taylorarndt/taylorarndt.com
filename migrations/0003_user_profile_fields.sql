-- Add profile fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;

-- Update existing users to split name into first_name/last_name if possible
UPDATE users 
SET 
  first_name = CASE 
    WHEN name IS NOT NULL AND name != '' AND position(' ' in name) > 0 
    THEN split_part(name, ' ', 1)
    ELSE name
  END,
  last_name = CASE 
    WHEN name IS NOT NULL AND name != '' AND position(' ' in name) > 0 
    THEN substring(name from position(' ' in name) + 1)
    ELSE NULL
  END,
  updated_at = NOW()
WHERE first_name IS NULL AND last_name IS NULL;