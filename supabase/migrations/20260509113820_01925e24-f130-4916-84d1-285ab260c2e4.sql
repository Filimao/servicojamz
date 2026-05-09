-- Phone OTP table for SMS verification (signup, password reset)
CREATE TABLE public.phone_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('signup','reset','verify')),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_phone_otps_phone_purpose ON public.phone_otps(phone, purpose, created_at DESC);

ALTER TABLE public.phone_otps ENABLE ROW LEVEL SECURITY;

-- No client access; only edge functions with service role
CREATE POLICY "deny all client access to phone_otps"
ON public.phone_otps FOR ALL
TO authenticated, anon
USING (false) WITH CHECK (false);

-- Add phone_verified flag to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN NOT NULL DEFAULT false;
