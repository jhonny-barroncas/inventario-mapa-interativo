import { useState, useEffect, useCallback } from 'react';
import { Node } from '@xyflow/react';
import { EquipmentData } from '@/components/EquipmentNode';
import { LocationData } from '@/components/LocationNode';

export interface StoredEquipment extends EquipmentData {
  id: string;
  locationId: string;
  position: { x: number; y: number };
}

export interface StoredLocation extends LocationData {
  id: string;
  parentLocationId?: string;
  position: { x: number; y: number };
}

interface InventoryData {
  equipment: StoredEquipment[];
  locations: StoredLocation[];
}

const STORAGE_KEY = 'inventory-data';

export const useInventoryData = () => {
  const [data, setData] = useState<InventoryData>({
    equipment: [],
    locations: []
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedData = JSON.parse(stored);
        setData(parsedData);
      } catch (error) {
        console.error('Error loading inventory data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addEquipment = useCallback((equipment: Omit<StoredEquipment, 'id'>) => {
    const newEquipment = {
      ...equipment,
      id: `equipment-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      equipment: [...prev.equipment, newEquipment]
    }));
    return newEquipment;
  }, []);

  const addLocation = useCallback((location: Omit<StoredLocation, 'id'>) => {
    const newLocation = {
      ...location,
      id: `location-${Date.now()}`
    };
    setData(prev => ({
      ...prev,
      locations: [...prev.locations, newLocation]
    }));
    return newLocation;
  }, []);

  const updateEquipment = useCallback((id: string, updates: Partial<StoredEquipment>) => {
    setData(prev => ({
      ...prev,
      equipment: prev.equipment.map(eq => 
        eq.id === id ? { ...eq, ...updates } : eq
      )
    }));
  }, []);

  const updateLocation = useCallback((id: string, updates: Partial<StoredLocation>) => {
    setData(prev => ({
      ...prev,
      locations: prev.locations.map(loc => 
        loc.id === id ? { ...loc, ...updates } : loc
      )
    }));
  }, []);

  const deleteEquipment = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      equipment: prev.equipment.filter(eq => eq.id !== id)
    }));
  }, []);

  const deleteLocation = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc.id !== id),
      equipment: prev.equipment.filter(eq => eq.locationId !== id)
    }));
  }, []);

  const getLocationName = useCallback((locationId: string): string => {
    const location = data.locations.find(loc => loc.id === locationId);
    return location?.label || 'Localidade não encontrada';
  }, [data.locations]);

  const getAvailableLocations = useCallback(() => {
    return data.locations;
  }, [data.locations]);

  return {
    data,
    addEquipment,
    addLocation,
    updateEquipment,
    updateLocation,
    deleteEquipment,
    deleteLocation,
    getLocationName,
    getAvailableLocations
  };
};