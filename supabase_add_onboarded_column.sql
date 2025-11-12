-- Add is_onboarded column to onboarding_submissions table
ALTER TABLE onboarding_submissions 
ADD COLUMN IF NOT EXISTS is_onboarded BOOLEAN DEFAULT false;

-- Create index on is_onboarded for faster filtering
CREATE INDEX IF NOT EXISTS idx_onboarding_submissions_is_onboarded 
ON onboarding_submissions(is_onboarded);

