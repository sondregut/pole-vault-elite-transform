
-- Add columns to track Beehiiv sync status
ALTER TABLE newsletter_subscribers 
ADD COLUMN IF NOT EXISTS synced_to_beehiiv BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS beehiiv_id TEXT;
