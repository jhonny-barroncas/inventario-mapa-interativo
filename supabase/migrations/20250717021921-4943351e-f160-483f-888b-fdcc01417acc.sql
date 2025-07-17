-- Create enum for equipment icons
CREATE TYPE equipment_icon AS ENUM ('linux', 'windows', 'pc', 'mobile', 'antenna', 'custom');

-- Create enum for equipment status
CREATE TYPE equipment_status AS ENUM ('online', 'offline', 'maintenance');

-- Create enum for location status
CREATE TYPE location_status AS ENUM ('active', 'inactive', 'maintenance');

-- Create locations table
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  label TEXT NOT NULL,
  responsible TEXT,
  status location_status NOT NULL DEFAULT 'active',
  position_x REAL NOT NULL,
  position_y REAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create equipment table
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  label TEXT NOT NULL,
  status equipment_status NOT NULL DEFAULT 'offline',
  license TEXT,
  contact TEXT,
  icon_type equipment_icon NOT NULL DEFAULT 'pc',
  custom_icon_url TEXT,
  position_x REAL NOT NULL,
  position_y REAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

-- Create policies for locations (shared access - all authenticated users can see and edit)
CREATE POLICY "Authenticated users can view all locations" 
ON public.locations 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create locations" 
ON public.locations 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update all locations" 
ON public.locations 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete all locations" 
ON public.locations 
FOR DELETE 
TO authenticated
USING (true);

-- Create policies for equipment (shared access - all authenticated users can see and edit)
CREATE POLICY "Authenticated users can view all equipment" 
ON public.equipment 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create equipment" 
ON public.equipment 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update all equipment" 
ON public.equipment 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete all equipment" 
ON public.equipment 
FOR DELETE 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for custom icons
INSERT INTO storage.buckets (id, name, public) VALUES ('equipment-icons', 'equipment-icons', true);

-- Create storage policies for equipment icons
CREATE POLICY "Anyone can view equipment icons" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'equipment-icons');

CREATE POLICY "Authenticated users can upload equipment icons" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'equipment-icons');

CREATE POLICY "Authenticated users can update equipment icons" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'equipment-icons');

CREATE POLICY "Authenticated users can delete equipment icons" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'equipment-icons');