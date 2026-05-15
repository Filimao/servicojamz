
CREATE POLICY "Settings are viewable by everyone"
ON public.platform_settings
FOR SELECT
TO anon, authenticated
USING (true);
