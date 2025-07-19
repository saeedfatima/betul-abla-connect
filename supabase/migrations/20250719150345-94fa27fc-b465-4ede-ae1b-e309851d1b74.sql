-- Create tables for foundation management

-- Orphans table
CREATE TABLE public.orphans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  guardian_name TEXT,
  guardian_phone TEXT,
  address TEXT,
  school_name TEXT,
  education_level TEXT,
  health_status TEXT DEFAULT 'good',
  special_needs TEXT,
  photo_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Boreholes table
CREATE TABLE public.boreholes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  depth_meters INTEGER,
  water_quality TEXT CHECK (water_quality IN ('excellent', 'good', 'fair', 'poor')),
  status TEXT CHECK (status IN ('active', 'maintenance', 'inactive')) DEFAULT 'active',
  installation_date DATE,
  last_maintenance DATE,
  community_served TEXT,
  beneficiaries_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  report_type TEXT CHECK (report_type IN ('monthly', 'quarterly', 'annual', 'project', 'incident')),
  content TEXT,
  file_url TEXT,
  status TEXT CHECK (status IN ('draft', 'submitted', 'approved', 'published')) DEFAULT 'draft',
  orphan_id UUID REFERENCES public.orphans(id),
  borehole_id UUID REFERENCES public.boreholes(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table for additional user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT CHECK (role IN ('admin', 'coordinator', 'staff')) DEFAULT 'staff',
  phone TEXT,
  location TEXT,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.orphans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boreholes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for orphans
CREATE POLICY "Users can view orphans" ON public.orphans
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and coordinators can insert orphans" ON public.orphans
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'coordinator')
    )
  );

CREATE POLICY "Admins and coordinators can update orphans" ON public.orphans
  FOR UPDATE USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'coordinator')
    )
  );

-- Create RLS policies for boreholes
CREATE POLICY "Users can view boreholes" ON public.boreholes
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins and coordinators can modify boreholes" ON public.boreholes
  FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'coordinator')
    )
  );

-- Create RLS policies for reports
CREATE POLICY "Users can view reports" ON public.reports
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can manage their own reports" ON public.reports
  FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Admins can manage all reports" ON public.reports
  FOR ALL USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('documents', 'documents', false),
  ('photos', 'photos', true),
  ('reports', 'reports', false);

-- Storage policies for documents bucket
CREATE POLICY "Authenticated users can upload documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can view their own documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'documents' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for photos bucket (public)
CREATE POLICY "Anyone can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'photos' AND 
    auth.uid() IS NOT NULL
  );

-- Storage policies for reports bucket
CREATE POLICY "Authenticated users can upload reports" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'reports' AND 
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can view reports" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'reports' AND 
    auth.uid() IS NOT NULL
  );

-- Enable realtime for all tables
ALTER TABLE public.orphans REPLICA IDENTITY FULL;
ALTER TABLE public.boreholes REPLICA IDENTITY FULL;
ALTER TABLE public.reports REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.orphans;
ALTER PUBLICATION supabase_realtime ADD TABLE public.boreholes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_orphans_updated_at
  BEFORE UPDATE ON public.orphans
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_boreholes_updated_at
  BEFORE UPDATE ON public.boreholes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'staff'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();