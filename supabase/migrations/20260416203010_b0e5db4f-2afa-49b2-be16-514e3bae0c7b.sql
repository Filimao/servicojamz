  Restrict profiles SELECT to authenticated users (was: public USING true)
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- 2. Tighten notifications INSERT: only system (admin) or self can insert.
-- Provider notifications go through a SECURITY DEFINER RPC.
DROP POLICY IF EXISTS "Authenticated users can receive notifications" ON public.notifications;

CREATE POLICY "Users can insert their own notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- RPC to safely create a notification for a provider when a client creates a service request
CREATE OR REPLACE FUNCTION public.notify_provider_of_request(
  _provider_user_id uuid,
  _title text,
  _message text,
  _link text DEFAULT NULL,
  _type text DEFAULT 'info'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow if caller has at least one service_request linking them (as client) to that provider
  IF NOT EXISTS (
    SELECT 1 FROM public.service_requests
    WHERE client_id = auth.uid() AND provider_id = _provider_user_id
  ) THEN
    RAISE EXCEPTION 'Not authorized to notify this provider';
  END IF;

  INSERT INTO public.notifications (user_id, title, message, link, type)
  VALUES (
    _provider_user_id,
    SUBSTRING(COALESCE(_title, ''), 1, 100),
    SUBSTRING(COALESCE(_message, ''), 1, 500),
    CASE WHEN _link IS NULL OR _link = '' THEN NULL
         WHEN _link LIKE '/%' THEN _link
         ELSE NULL
    END,
    COALESCE(_type, 'info')
  );
END;
$$;

CREATE POLICY "Reporters can view their own reports"
ON public.reports FOR SELECT
TO authenticated
USING (auth.uid() = reporter_id);

-- 4. Harden handle_new_user with input length limits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone)
  VALUES (
    NEW.id,
    SUBSTRING(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 1, 200),
    SUBSTRING(COALESCE(NEW.raw_user_meta_data->>'phone', ''), 1, 30)
  );
  RETURN NEW;
END;
$$;

-- 5. Harden get_category_provider_count to count only approved
CREATE OR REPLACE FUNCTION public.get_category_provider_count(category_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.provider_profiles
  WHERE provider_profiles.category_id = $1
    AND is_approved = true
$$;
