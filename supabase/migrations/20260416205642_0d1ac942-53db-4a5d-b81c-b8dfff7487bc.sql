
-- =========================================================
-- 1) PLATFORM SETTINGS (singleton row)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_name TEXT NOT NULL DEFAULT 'ServiçoJá',
  platform_description TEXT DEFAULT 'Marketplace de profissionais de confiança em Moçambique',
  logo_url TEXT,
  support_email TEXT DEFAULT 'suporte@servicoja.mz',
  contact_phone TEXT DEFAULT '879132543',
  location TEXT DEFAULT 'Moçambique',
  require_login BOOLEAN NOT NULL DEFAULT true,
  allow_provider_signup BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by everyone"
  ON public.platform_settings FOR SELECT USING (true);

CREATE POLICY "Only admins can insert settings"
  ON public.platform_settings FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update settings"
  ON public.platform_settings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed singleton row
INSERT INTO public.platform_settings (platform_name) VALUES ('ServiçoJá')
  ON CONFLICT DO NOTHING;

-- =========================================================
-- 2) PAYMENTS (M-Pesa Fase 1 - manual)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.service_requests(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  provider_id UUID NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  method TEXT NOT NULL DEFAULT 'mpesa',
  mpesa_number TEXT,
  transaction_ref TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  confirmed_by UUID,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT payments_status_check CHECK (status IN ('pending','paid','confirmed','rejected'))
);

CREATE INDEX IF NOT EXISTS idx_payments_request ON public.payments(request_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON public.payments FOR SELECT
  USING (
    auth.uid() = client_id
    OR auth.uid() = provider_id
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Clients can create payments for their requests"
  ON public.payments FOR INSERT
  WITH CHECK (
    auth.uid() = client_id
    AND EXISTS (
      SELECT 1 FROM public.service_requests sr
      WHERE sr.id = request_id AND sr.client_id = auth.uid()
    )
  );

CREATE POLICY "Clients can mark as paid; providers and admins can update"
  ON public.payments FOR UPDATE
  USING (
    auth.uid() = client_id
    OR auth.uid() = provider_id
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
