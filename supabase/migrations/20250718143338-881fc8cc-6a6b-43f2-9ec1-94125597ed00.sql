-- Create unit_status enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE unit_status AS ENUM ('active', 'inactive', 'maintenance');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create units table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.units (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  responsible TEXT,
  status unit_status NOT NULL DEFAULT 'active',
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  position_x REAL NOT NULL,
  position_y REAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add unit_id column to equipment table if it doesn't exist
DO $$ BEGIN
    ALTER TABLE public.equipment ADD COLUMN unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE;
EXCEPTION
    WHEN duplicate_column THEN null;
END $$;

-- Enable Row Level Security on units table
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;

-- Create policies for units table
CREATE POLICY "Anyone can view units" ON public.units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can create units" ON public.units FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update units" ON public.units FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Anyone can delete units" ON public.units FOR DELETE TO authenticated USING (true);

-- Create updated_at trigger for units
CREATE TRIGGER update_units_updated_at
  BEFORE UPDATE ON public.units
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data: HUGV unit in Manaus location
INSERT INTO public.units (label, responsible, status, location_id, position_x, position_y) VALUES
('HUGV', 'Maria Santos', 'active', (SELECT id FROM public.locations WHERE label = 'MANAUS'), 400, 200);

-- Update equipment to link to HUGV unit
UPDATE public.equipment 
SET unit_id = (SELECT id FROM public.units WHERE label = 'HUGV')
WHERE unit_id IS NULL;