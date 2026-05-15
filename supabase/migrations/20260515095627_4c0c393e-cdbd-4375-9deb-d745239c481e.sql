
-- 1) Lock down notifications: remove direct user INSERT (server/triggers use service role and bypass RLS)
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;

CREATE POLICY "Admins can insert notifications"
ON public.notifications
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- 2) Platform settings: drop the public (anon) read policy; keep the authenticated read policy.
-- Public pages will still work for logged-in users; anonymous visitors no longer see contact email/phone via API.
DROP POLICY IF EXISTS "Settings are viewable by everyone" ON public.platform_settings;

-- 3) Payments: prevent clients/providers from updating sensitive fields
CREATE OR REPLACE FUNCTION public.guard_payment_updates()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF public.has_role(auth.uid(), 'admin'::app_role) THEN
    RETURN NEW;
  END IF;

  -- Non-admins cannot change sensitive fields
  IF NEW.status IS DISTINCT FROM OLD.status
     OR NEW.confirmed_at IS DISTINCT FROM OLD.confirmed_at
     OR NEW.confirmed_by IS DISTINCT FROM OLD.confirmed_by
     OR NEW.amount IS DISTINCT FROM OLD.amount
     OR NEW.mpesa_number IS DISTINCT FROM OLD.mpesa_number
     OR NEW.method IS DISTINCT FROM OLD.method
     OR NEW.client_id IS DISTINCT FROM OLD.client_id
     OR NEW.provider_id IS DISTINCT FROM OLD.provider_id
     OR NEW.request_id IS DISTINCT FROM OLD.request_id
  THEN
    -- Allow client to set status from 'pending' to 'paid' once (registers M-Pesa payment) and update transaction_ref/notes
    IF auth.uid() = OLD.client_id
       AND OLD.status = 'pending'
       AND NEW.status = 'paid'
       AND NEW.confirmed_at IS NULL
       AND NEW.confirmed_by IS NULL
       AND NEW.amount = OLD.amount
       AND NEW.method = OLD.method
       AND NEW.client_id = OLD.client_id
       AND NEW.provider_id = OLD.provider_id
       AND NEW.request_id = OLD.request_id
    THEN
      RETURN NEW;
    END IF;
    RAISE EXCEPTION 'Not authorized to modify protected payment fields';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_payment_updates_trg ON public.payments;
CREATE TRIGGER guard_payment_updates_trg
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.guard_payment_updates();

-- 4) Realtime authorization for chat: enforce private-channel policy on realtime.messages
-- Topics used by the app: chat-<requestId>, conversations, unread-count
-- Conversations / unread-count channels broadcast every messages change to everyone today.
-- We restrict subscriptions so that:
--   - 'chat-<requestId>' is allowed only if the user is the client or provider of that request
--   - personal topics 'conversations:<uid>' / 'unread:<uid>' must match the user's id

CREATE POLICY "Authenticated users can read realtime messages they are part of"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  -- chat-<uuid> topic
  (
    realtime.topic() LIKE 'chat-%'
    AND EXISTS (
      SELECT 1 FROM public.service_requests sr
      WHERE sr.id::text = substring(realtime.topic() from 6)
        AND (sr.client_id = auth.uid() OR sr.provider_id = auth.uid())
    )
  )
  OR realtime.topic() = ('conversations:' || auth.uid()::text)
  OR realtime.topic() = ('unread:' || auth.uid()::text)
);
