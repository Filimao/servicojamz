
-- Add slug column to service_categories
ALTER TABLE public.service_categories ADD COLUMN slug TEXT UNIQUE;

-- Populate slugs for existing categories
UPDATE public.service_categories SET slug = 'cabeleireiro' WHERE name = 'Cabeleireiro(a)';
UPDATE public.service_categories SET slug = 'canalizador' WHERE name = 'Canalizador';
UPDATE public.service_categories SET slug = 'eletricista' WHERE name = 'Eletricista';
UPDATE public.service_categories SET slug = 'pedreiro' WHERE name = 'Pedreiro';
UPDATE public.service_categories SET slug = 'tecnico-tv-internet' WHERE name = 'Técnico TV/Internet';

-- Make slug NOT NULL after populating
ALTER TABLE public.service_categories ALTER COLUMN slug SET NOT NULL;
