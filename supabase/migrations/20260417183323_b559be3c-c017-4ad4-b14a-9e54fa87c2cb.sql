-- Allow service definer functions to insert notifications regardless of caller auth
CREATE OR REPLACE FUNCTION public.notify_payment_registered()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'paid' THEN
    INSERT INTO public.notifications (user_id, title, message, link, type)
    VALUES (
      NEW.provider_id,
      'Novo pagamento M-Pesa registado',
      'O cliente registou um pagamento de ' || NEW.amount::text || ' MZN. Aguarda confirmação do admin.',
      '/painel',
      'payment'
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_payment_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status IS DISTINCT FROM 'confirmed' THEN
    INSERT INTO public.notifications (user_id, title, message, link, type)
    VALUES (
      NEW.client_id,
      'Pagamento confirmado',
      'O seu pagamento de ' || NEW.amount::text || ' MZN foi confirmado pelo administrador.',
      '/meus-pedidos',
      'payment'
    );
    INSERT INTO public.notifications (user_id, title, message, link, type)
    VALUES (
      NEW.provider_id,
      'Pagamento confirmado',
      'O pagamento de ' || NEW.amount::text || ' MZN do cliente foi confirmado.',
      '/painel',
      'payment'
    );
  ELSIF NEW.status = 'rejected' AND OLD.status IS DISTINCT FROM 'rejected' THEN
    INSERT INTO public.notifications (user_id, title, message, link, type)
    VALUES (
      NEW.client_id,
      'Pagamento rejeitado',
      'O seu pagamento de ' || NEW.amount::text || ' MZN foi rejeitado. Contacte o suporte.',
      '/meus-pedidos',
      'payment'
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_payment_registered ON public.payments;
CREATE TRIGGER trg_notify_payment_registered
AFTER INSERT ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.notify_payment_registered();

DROP TRIGGER IF EXISTS trg_notify_payment_status_change ON public.payments;
CREATE TRIGGER trg_notify_payment_status_change
AFTER UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.notify_payment_status_change();

-- Also trigger updated_at on payments
DROP TRIGGER IF EXISTS trg_payments_updated_at ON public.payments;
CREATE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_platform_settings_updated_at ON public.platform_settings;
CREATE TRIGGER trg_platform_settings_updated_at
BEFORE UPDATE ON public.platform_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();