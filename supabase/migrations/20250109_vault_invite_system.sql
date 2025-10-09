-- Create invite_links table for Vault app invitations
CREATE TABLE IF NOT EXISTS public.invite_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID,
  username VARCHAR(50) NOT NULL,
  display_name VARCHAR(100),
  type VARCHAR(50) DEFAULT 'friend_invite',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  used BOOLEAN DEFAULT false,
  used_by UUID,
  used_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  CONSTRAINT code_length CHECK (char_length(code) >= 6 AND char_length(code) <= 20)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_invite_links_code ON public.invite_links(code);
CREATE INDEX IF NOT EXISTS idx_invite_links_user_id ON public.invite_links(user_id);
CREATE INDEX IF NOT EXISTS idx_invite_links_expires_at ON public.invite_links(expires_at);
CREATE INDEX IF NOT EXISTS idx_invite_links_created_at ON public.invite_links(created_at DESC);

-- Enable RLS on invite_links table
ALTER TABLE public.invite_links ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read invite links (for public invite pages)
CREATE POLICY "Anyone can view invite links"
ON public.invite_links
FOR SELECT
USING (true);

-- Policy: Authenticated users can create invite links
CREATE POLICY "Authenticated users can create invites"
ON public.invite_links
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Users can update their own invite links
CREATE POLICY "Users can update own invites"
ON public.invite_links
FOR UPDATE
USING (auth.uid()::text = user_id::text);

-- Function to generate unique invite codes
CREATE OR REPLACE FUNCTION generate_invite_code(length INTEGER DEFAULT 8)
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
  max_attempts INTEGER := 100;
  attempt INTEGER := 0;
BEGIN
  WHILE attempt < max_attempts LOOP
    result := '';
    FOR i IN 1..length LOOP
      result := result || substr(chars, floor(random() * length(chars))::int + 1, 1);
    END LOOP;

    -- Check if code already exists
    IF NOT EXISTS (SELECT 1 FROM public.invite_links WHERE code = result) THEN
      RETURN result;
    END IF;

    attempt := attempt + 1;
  END LOOP;

  -- If we couldn't generate a unique code, throw an error
  RAISE EXCEPTION 'Could not generate unique invite code after % attempts', max_attempts;
END;
$$ LANGUAGE plpgsql;

-- Function to create an invite link
CREATE OR REPLACE FUNCTION create_invite_link(
  p_user_id UUID,
  p_username VARCHAR,
  p_display_name VARCHAR DEFAULT NULL,
  p_type VARCHAR DEFAULT 'friend_invite'
)
RETURNS TABLE (
  invite_id UUID,
  invite_code VARCHAR,
  expires_at TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  v_code VARCHAR;
  v_id UUID;
  v_expires TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Generate unique code
  v_code := generate_invite_code(8);

  -- Insert the invite
  INSERT INTO public.invite_links (code, user_id, username, display_name, type)
  VALUES (v_code, p_user_id, p_username, p_display_name, p_type)
  RETURNING id, code, expires_at INTO v_id, v_code, v_expires;

  RETURN QUERY SELECT v_id, v_code, v_expires;
END;
$$ LANGUAGE plpgsql;

-- Function to mark invite as used
CREATE OR REPLACE FUNCTION use_invite_link(
  p_code VARCHAR,
  p_used_by UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_invite RECORD;
BEGIN
  -- Get the invite
  SELECT * INTO v_invite
  FROM public.invite_links
  WHERE code = p_code
    AND used = false
    AND expires_at > NOW()
  FOR UPDATE;

  -- Check if invite exists and is valid
  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Mark as used
  UPDATE public.invite_links
  SET used = true,
      used_by = p_used_by,
      used_at = NOW()
  WHERE id = v_invite.id;

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Create analytics view for invite links
CREATE OR REPLACE VIEW invite_link_analytics AS
SELECT
  date_trunc('day', created_at) as date,
  type,
  COUNT(*) as total_created,
  COUNT(CASE WHEN used = true THEN 1 END) as total_used,
  COUNT(CASE WHEN expires_at < NOW() AND used = false THEN 1 END) as total_expired
FROM public.invite_links
GROUP BY date_trunc('day', created_at), type
ORDER BY date DESC;