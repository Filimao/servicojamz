
-- Create storage bucket for work photos
INSERT INTO storage.buckets (id, name, public) VALUES ('work-photos', 'work-photos', true);

-- RLS for work-photos bucket
CREATE POLICY "Anyone can view work photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'work-photos');

CREATE POLICY "Providers can upload their own work photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'work-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Providers can update their own work photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'work-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Providers can delete their own work photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'work-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (auth.uid() = user_id);

-- Admins and system can insert notifications
CREATE POLICY "System can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

-- Add estimated_budget and location fields to service_requests
ALTER TABLE public.service_requests
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS neighborhood TEXT,
ADD COLUMN IF NOT EXISTS estimated_budget TEXT,
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;

-- Create work_photos table for provider gallery
CREATE TABLE public.work_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.work_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view work photos table"
ON public.work_photos FOR SELECT
USING (true);

CREATE POLICY "Providers can insert their own work photos"
ON public.work_photos FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Providers can delete their own work photos"
ON public.work_photos FOR DELETE
USING (auth.uid() = user_id);

-- Create reports table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL,
  reported_user_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create reports"
ON public.reports FOR INSERT
WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Admins can view all reports"
ON public.reports FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update reports"
ON public.reports FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));
