-- Create enum types for status fields
CREATE TYPE location_status AS ENUM ('active', 'inactive');
CREATE TYPE unit_status AS ENUM ('active', 'inactive', 'maintenance');
CREATE TYPE equipment_status AS ENUM ('online', 'offline', 'maintenance');
CREATE TYPE equipment_icon AS ENUM ('linux', 'windows', 'pc', 'mobile', 'antenna', 'custom');

-- Create locations table (top level)
CREATE TABLE public.locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  responsible TEXT,
  status location_status NOT NULL DEFAULT 'active',
  position_x REAL NOT NULL,
  position_y REAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create units table (middle level - linked to locations)
CREATE TABLE public.units (
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

-- Create equipment table (bottom level - linked to units)
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  status equipment_status NOT NULL DEFAULT 'offline',
  license TEXT,
  contact TEXT,
  unit_id UUID REFERENCES public.units(id) ON DELETE CASCADE,
  icon_type equipment_icon NOT NULL DEFAULT 'pc',
  custom_icon_url TEXT,
  position_x REAL NOT NULL,
  position_y REAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

-- Create policies (allowing all authenticated users to view/edit everything as requested)
CREATE POLICY "Anyone can view locations" ON public.locations FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can create locations" ON public.locations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update locations" ON public.locations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Anyone can delete locations" ON public.locations FOR DELETE TO authenticated USING (true);

CREATE POLICY "Anyone can view units" ON public.units FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can create units" ON public.units FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update units" ON public.units FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Anyone can delete units" ON public.units FOR DELETE TO authenticated USING (true);

CREATE POLICY "Anyone can view equipment" ON public.equipment FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can create equipment" ON public.equipment FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Anyone can update equipment" ON public.equipment FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Anyone can delete equipment" ON public.equipment FOR DELETE TO authenticated USING (true);

-- Create updated_at triggers
CREATE TRIGGER update_locations_updated_at
  BEFORE UPDATE ON public.locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_units_updated_at
  BEFORE UPDATE ON public.units
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial data: Manaus (location) -> HUGV (unit) -> Equipment items
INSERT INTO public.locations (label, responsible, status, position_x, position_y) VALUES
('MANAUS', 'João Silva', 'active', 400, 300);

INSERT INTO public.units (label, responsible, status, location_id, position_x, position_y) VALUES
('HUGV', 'Maria Santos', 'active', (SELECT id FROM public.locations WHERE label = 'MANAUS'), 400, 200);

-- Insert equipment linked to HUGV unit
INSERT INTO public.equipment (label, status, license, contact, unit_id, icon_type, position_x, position_y) VALUES
('LACANDERIA', 'maintenance', 'LIC-2024-001', 'maintenance@lacanderia.com', (SELECT id FROM public.units WHERE label = 'HUGV'), 'pc', 150, 150),
('SERVIDOR-01', 'online', 'LIC-2024-003', 'server@company.com', (SELECT id FROM public.units WHERE label = 'HUGV'), 'linux', 150, 450),
('TERMINAL-05', 'offline', 'LIC-2024-004', 'support@terminal.com', (SELECT id FROM public.units WHERE label = 'HUGV'), 'windows', 650, 450),
('CENTRAL-NET', 'online', 'LIC-2024-005', 'network@central.com', (SELECT id FROM public.units WHERE label = 'HUGV'), 'antenna', 400, 100),
('BACKUP-SYS', 'maintenance', 'LIC-2024-006', 'backup@system.com', (SELECT id FROM public.units WHERE label = 'HUGV'), 'pc', 400, 500);