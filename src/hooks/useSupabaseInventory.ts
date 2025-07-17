import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Equipment {
  id: string;
  user_id: string;
  location_id?: string;
  label: string;
  status: 'online' | 'offline' | 'maintenance';
  license?: string;
  contact?: string;
  icon_type: 'linux' | 'windows' | 'pc' | 'mobile' | 'antenna' | 'custom';
  custom_icon_url?: string;
  position_x: number;
  position_y: number;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  user_id: string;
  label: string;
  responsible?: string;
  status: 'active' | 'inactive' | 'maintenance';
  position_x: number;
  position_y: number;
  created_at: string;
  updated_at: string;
}

interface InventoryData {
  equipment: Equipment[];
  locations: Location[];
}

export const useSupabaseInventory = () => {
  const [data, setData] = useState<InventoryData>({
    equipment: [],
    locations: []
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load data from Supabase
  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Load locations
      const { data: locations, error: locationsError } = await supabase
        .from('locations')
        .select('*')
        .order('created_at', { ascending: true });

      if (locationsError) {
        console.error('Error loading locations:', locationsError);
        toast({
          title: "Erro ao carregar localidades",
          description: locationsError.message,
          variant: "destructive",
        });
        return;
      }

      // Load equipment
      const { data: equipment, error: equipmentError } = await supabase
        .from('equipment')
        .select('*')
        .order('created_at', { ascending: true });

      if (equipmentError) {
        console.error('Error loading equipment:', equipmentError);
        toast({
          title: "Erro ao carregar equipamentos",
          description: equipmentError.message,
          variant: "destructive",
        });
        return;
      }

      setData({
        equipment: equipment || [],
        locations: locations || []
      });
    } catch (error) {
      console.error('Error loading inventory data:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar dados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Load data when user changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  const addEquipment = useCallback(async (equipment: Omit<Equipment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data: newEquipment, error } = await supabase
        .from('equipment')
        .insert([{
          ...equipment,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding equipment:', error);
        toast({
          title: "Erro ao adicionar equipamento",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      setData(prev => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment]
      }));

      toast({
        title: "Equipamento adicionado",
        description: "Equipamento criado com sucesso!",
      });

      return newEquipment;
    } catch (error) {
      console.error('Error adding equipment:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao adicionar equipamento",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  const addLocation = useCallback(async (location: Omit<Location, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data: newLocation, error } = await supabase
        .from('locations')
        .insert([{
          ...location,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding location:', error);
        toast({
          title: "Erro ao adicionar localidade",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      setData(prev => ({
        ...prev,
        locations: [...prev.locations, newLocation]
      }));

      toast({
        title: "Localidade adicionada",
        description: "Localidade criada com sucesso!",
      });

      return newLocation;
    } catch (error) {
      console.error('Error adding location:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao adicionar localidade",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  const updateEquipment = useCallback(async (id: string, updates: Partial<Equipment>) => {
    try {
      const { error } = await supabase
        .from('equipment')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating equipment:', error);
        toast({
          title: "Erro ao atualizar equipamento",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setData(prev => ({
        ...prev,
        equipment: prev.equipment.map(eq => 
          eq.id === id ? { ...eq, ...updates } : eq
        )
      }));

      toast({
        title: "Equipamento atualizado",
        description: "Alterações salvas com sucesso!",
      });
    } catch (error) {
      console.error('Error updating equipment:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar equipamento",
        variant: "destructive",
      });
    }
  }, [toast]);

  const updateLocation = useCallback(async (id: string, updates: Partial<Location>) => {
    try {
      const { error } = await supabase
        .from('locations')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating location:', error);
        toast({
          title: "Erro ao atualizar localidade",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setData(prev => ({
        ...prev,
        locations: prev.locations.map(loc => 
          loc.id === id ? { ...loc, ...updates } : loc
        )
      }));

      toast({
        title: "Localidade atualizada",
        description: "Alterações salvas com sucesso!",
      });
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao atualizar localidade",
        variant: "destructive",
      });
    }
  }, [toast]);

  const deleteEquipment = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting equipment:', error);
        toast({
          title: "Erro ao excluir equipamento",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setData(prev => ({
        ...prev,
        equipment: prev.equipment.filter(eq => eq.id !== id)
      }));

      toast({
        title: "Equipamento excluído",
        description: "Equipamento removido com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting equipment:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir equipamento",
        variant: "destructive",
      });
    }
  }, [toast]);

  const deleteLocation = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting location:', error);
        toast({
          title: "Erro ao excluir localidade",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setData(prev => ({
        ...prev,
        locations: prev.locations.filter(loc => loc.id !== id)
      }));

      toast({
        title: "Localidade excluída",
        description: "Localidade removida com sucesso!",
      });
    } catch (error) {
      console.error('Error deleting location:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao excluir localidade",
        variant: "destructive",
      });
    }
  }, [toast]);

  const getLocationName = useCallback((locationId: string): string => {
    const location = data.locations.find(loc => loc.id === locationId);
    return location?.label || 'Localidade não encontrada';
  }, [data.locations]);

  const getAvailableLocations = useCallback(() => {
    return data.locations;
  }, [data.locations]);

  const uploadCustomIcon = useCallback(async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('equipment-icons')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading icon:', uploadError);
        toast({
          title: "Erro ao enviar ícone",
          description: uploadError.message,
          variant: "destructive",
        });
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('equipment-icons')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading custom icon:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao enviar ícone",
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  return {
    data,
    loading,
    addEquipment,
    addLocation,
    updateEquipment,
    updateLocation,
    deleteEquipment,
    deleteLocation,
    getLocationName,
    getAvailableLocations,
    uploadCustomIcon,
    reload: loadData
  };
};