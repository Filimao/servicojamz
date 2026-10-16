-- Run once in the Supabase SQL Editor to grant the platform owner admin access.
-- This only inserts a role for an existing auth user and is safe to run again.
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = lower('filimaofelix10@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;

SELECT users.email, roles.role
FROM auth.users AS users
JOIN public.user_roles AS roles ON roles.user_id = users.id
WHERE lower(users.email) = lower('filimaofelix10@gmail.com')
  AND roles.role = 'admin'::public.app_role;