
-- 1) Restrict profiles SELECT: own, admin, approved providers, or service_request counterparty
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

CREATE POLICY "Users view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Approved provider profiles are viewable"
ON public.profiles FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.provider_profiles pp
    WHERE pp.user_id = profiles.user_id AND pp.is_approved = true
  )
);

CREATE POLICY "Service request counterparties view profiles"
ON public.profiles FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.service_requests sr
    WHERE (sr.client_id = auth.uid() AND sr.provider_id = profiles.user_id)
       OR (sr.provider_id = auth.uid() AND sr.client_id = profiles.user_id)
  )
);

-- 2) Tighten notifications INSERT policy: only own; system writes via SECURITY DEFINER bypass
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;

CREATE POLICY "Users can insert their own notifications"
ON public.notifications FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3) Restrict platform_settings SELECT to authenticated users
DROP POLICY IF EXISTS "Platform settings are viewable by everyone" ON public.platform_settings;
DROP POLICY IF EXISTS "Anyone can view platform settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Public can view platform settings" ON public.platform_settings;

CREATE POLICY "Authenticated users can view platform settings"
ON public.platform_settings FOR SELECT TO authenticated
USING (true);
