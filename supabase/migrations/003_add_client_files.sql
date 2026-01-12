-- Add file storage fields to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS videos TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS documents TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Add index for better query performance (if needed)
-- CREATE INDEX IF NOT EXISTS idx_clients_has_files ON clients USING GIN (photos, videos, documents);
