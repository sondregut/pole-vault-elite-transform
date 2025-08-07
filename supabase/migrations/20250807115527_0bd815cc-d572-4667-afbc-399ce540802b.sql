-- Enable RLS on waitlist table
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert into waitlist
CREATE POLICY "Anyone can join waitlist" 
ON public.waitlist 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow anyone to view waitlist (for admin purposes)
CREATE POLICY "Anyone can view waitlist" 
ON public.waitlist 
FOR SELECT 
USING (true);

-- Add missing synced_to_beehiiv column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'waitlist' 
                   AND column_name = 'synced_to_beehiiv') THEN
        ALTER TABLE public.waitlist ADD COLUMN synced_to_beehiiv boolean DEFAULT false;
    END IF;
END $$;