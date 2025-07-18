import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Node, Edge } from '@xyflow/react';
import { EquipmentData } from '@/components/EquipmentNode';
import { LocationData } from '@/components/LocationNode';
import { UnitData } from '@/components/UnitNode';

export interface Location {
  id: string;
  label: string;
  responsible?: string;
  status: 'active' | 'inactive';
  position_x: number;
  position_y: number;
}

export interface Unit {
  id: string;
  label: string;
  responsible?: string;
  status: 'active' | 'inactive' | 'maintenance';
  location_id: string;
  position_x: number;
  position_y: number;
}

export interface Equipment {
  id: string;
  label: string;
  status: 'online' | 'offline' | 'maintenance';
  license?: string;
  contact?: string;
  unit_id: string;
  icon_type: 'linux' | 'windows' | 'pc' | 'mobile' | 'antenna' | 'custom';
  custom_icon_url?: string;
  position_x: number;
  position_y: number;
}

const useSupabaseInventory = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      // Load locations
      const { data: locations, error: locationsError } = await supabase
        .from('locations')
        .select('*');
      
      if (locationsError) throw locationsError;

      // Load units
      const { data: units, error: unitsError } = await supabase
        .from('units')
        .select('*');
      
      if (unitsError) throw unitsError;

      // Load equipment
      const { data: equipment, error: equipmentError } = await supabase
        .from('equipment')
        .select('*');
      
      if (equipmentError) throw equipmentError;

      // Convert to nodes
      const locationNodes: Node[] = (locations || []).map((location: Location) => ({
        id: `location-${location.id}`,
        type: 'location',
        position: { x: location.position_x, y: location.position_y },
        data: {
          label: location.label,
          responsible: location.responsible || '',
          status: location.status
        } as any
      }));

      const unitNodes: Node[] = (units || []).map((unit: Unit) => ({
        id: `unit-${unit.id}`,
        type: 'unit',
        position: { x: unit.position_x, y: unit.position_y },
        data: {
          label: unit.label,
          responsible: unit.responsible,
          status: unit.status
        } as any
      }));

      const equipmentNodes: Node[] = (equipment || []).map((item: Equipment) => ({
        id: `equipment-${item.id}`,
        type: 'equipment',
        position: { x: item.position_x, y: item.position_y },
        data: {
          label: item.label,
          status: item.status,
          license: item.license || '',
          contact: item.contact || ''
        } as any
      }));

      // Create edges (connections)
      const newEdges: Edge[] = [];

      // Connect units to locations
      units?.forEach((unit: Unit) => {
        newEdges.push({
          id: `location-unit-${unit.id}`,
          source: `location-${unit.location_id}`,
          target: `unit-${unit.id}`,
          type: 'smoothstep',
          style: { 
            stroke: 'hsl(var(--connection))', 
            strokeWidth: 3,
            strokeDasharray: '10,5'
          },
          animated: true
        });
      });

      // Connect equipment to units
      equipment?.forEach((item: Equipment) => {
        newEdges.push({
          id: `unit-equipment-${item.id}`,
          source: `unit-${item.unit_id}`,
          target: `equipment-${item.id}`,
          type: 'smoothstep',
          style: { 
            stroke: 'hsl(var(--connection))', 
            strokeWidth: 3,
            strokeDasharray: '10,5'
          },
          animated: true
        });
      });

      setNodes([...locationNodes, ...unitNodes, ...equipmentNodes]);
      setEdges(newEdges);
    } catch (error) {
      console.error('Error loading inventory data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateNodePosition = async (nodeId: string, position: { x: number; y: number }) => {
    const [type, id] = nodeId.split('-');
    
    try {
      if (type === 'location') {
        await supabase
          .from('locations')
          .update({ position_x: position.x, position_y: position.y })
          .eq('id', id);
      } else if (type === 'unit') {
        await supabase
          .from('units')
          .update({ position_x: position.x, position_y: position.y })
          .eq('id', id);
      } else if (type === 'equipment') {
        await supabase
          .from('equipment')
          .update({ position_x: position.x, position_y: position.y })
          .eq('id', id);
      }
    } catch (error) {
      console.error('Error updating node position:', error);
    }
  };

  const updateLocationData = async (nodeId: string, data: LocationData) => {
    const id = nodeId.replace('location-', '');
    
    try {
      await supabase
        .from('locations')
        .update({
          label: data.label,
          responsible: data.responsible,
          status: data.status
        })
        .eq('id', id);
      
      loadData(); // Reload to update UI
    } catch (error) {
      console.error('Error updating location:', error);
    }
  };

  const updateUnitData = async (nodeId: string, data: UnitData) => {
    const id = nodeId.replace('unit-', '');
    
    try {
      await supabase
        .from('units')
        .update({
          label: data.label,
          responsible: data.responsible,
          status: data.status
        })
        .eq('id', id);
      
      loadData(); // Reload to update UI
    } catch (error) {
      console.error('Error updating unit:', error);
    }
  };

  const updateEquipmentData = async (nodeId: string, data: EquipmentData) => {
    const id = nodeId.replace('equipment-', '');
    
    try {
      await supabase
        .from('equipment')
        .update({
          label: data.label,
          status: data.status,
          license: data.license,
          contact: data.contact
        })
        .eq('id', id);
      
      loadData(); // Reload to update UI
    } catch (error) {
      console.error('Error updating equipment:', error);
    }
  };

  const deleteNode = async (nodeId: string) => {
    const [type, id] = nodeId.split('-');
    
    try {
      if (type === 'location') {
        await supabase.from('locations').delete().eq('id', id);
      } else if (type === 'unit') {
        await supabase.from('units').delete().eq('id', id);
      } else if (type === 'equipment') {
        await supabase.from('equipment').delete().eq('id', id);
      }
      
      loadData(); // Reload to update UI
    } catch (error) {
      console.error('Error deleting node:', error);
    }
  };

  return {
    nodes,
    edges,
    loading,
    setNodes,
    setEdges,
    updateNodePosition,
    updateLocationData,
    updateUnitData,
    updateEquipmentData,
    deleteNode,
    reload: loadData
  };
};

export default useSupabaseInventory;