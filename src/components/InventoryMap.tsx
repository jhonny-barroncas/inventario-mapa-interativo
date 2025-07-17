import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import EquipmentNode from './EquipmentNode';
import LocationNode from './LocationNode';
import Legend from './Legend';
import AddItemButton from './AddItemButton';
import ExportButton from './ExportButton';
import { initialNodes, initialEdges } from './data/inventoryData';
import { EquipmentData } from './EquipmentNode';
import { LocationData } from './LocationNode';
import { useSupabaseInventory } from '@/hooks/useSupabaseInventory';

const InventoryMap = () => {
  const { data, loading, updateEquipment, updateLocation, deleteEquipment, deleteLocation } = useSupabaseInventory();
  
  // Convert inventory data to ReactFlow nodes
  const inventoryNodes: Node[] = useMemo(() => {
    const equipmentNodes: Node[] = data.equipment.map(equipment => ({
      id: equipment.id,
      type: 'equipment',
      position: { x: equipment.position_x, y: equipment.position_y },
      data: {
        label: equipment.label,
        status: equipment.status,
        license: equipment.license,
        contact: equipment.contact,
        icon_type: equipment.icon_type,
        custom_icon_url: equipment.custom_icon_url,
        location_id: equipment.location_id,
      }
    }));

    const locationNodes: Node[] = data.locations.map(location => ({
      id: location.id,
      type: 'location',
      position: { x: location.position_x, y: location.position_y },
      data: {
        label: location.label,
        responsible: location.responsible,
        status: location.status,
      }
    }));

    return [...locationNodes, ...equipmentNodes];
  }, [data]);

  // Use ReactFlow state for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when inventory data changes
  useEffect(() => {
    if (!loading) {
      setNodes(inventoryNodes);
    }
  }, [inventoryNodes, setNodes, loading]);

  // Custom node components with access to state
  const CustomEquipmentNode = useCallback((props: any) => (
    <EquipmentNode
      {...props}
      onUpdate={(data: EquipmentData) => {
        updateEquipment(props.id, {
          label: data.label,
          status: data.status,
          license: data.license,
          contact: data.contact,
          icon_type: (data as any).icon_type,
          custom_icon_url: (data as any).custom_icon_url,
          location_id: (data as any).location_id,
          position_x: props.position.x,
          position_y: props.position.y,
        });
      }}
      onDelete={() => {
        deleteEquipment(props.id);
        setNodes((nds) => nds.filter((node) => node.id !== props.id));
        setEdges((eds) => eds.filter((edge) => 
          edge.source !== props.id && edge.target !== props.id
        ));
      }}
    />
  ), [updateEquipment, deleteEquipment, setNodes, setEdges]);

  const CustomLocationNode = useCallback((props: any) => (
    <LocationNode
      {...props}
      onUpdate={(data: LocationData) => {
        updateLocation(props.id, {
          label: data.label,
          responsible: data.responsible,
          status: data.status,
          position_x: props.position.x,
          position_y: props.position.y,
        });
      }}
      onDelete={() => {
        deleteLocation(props.id);
        setNodes((nds) => nds.filter((node) => node.id !== props.id));
        setEdges((eds) => eds.filter((edge) => 
          edge.source !== props.id && edge.target !== props.id
        ));
      }}
    />
  ), [updateLocation, deleteLocation, setNodes, setEdges]);

  const nodeTypes = {
    equipment: CustomEquipmentNode,
    location: CustomLocationNode,
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-lg">Carregando inventário...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-background relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { stroke: 'hsl(var(--connection))', strokeWidth: 3 },
          animated: true,
        }}
      >
        <Background color="hsl(var(--muted-foreground))" gap={20} />
        <Controls className="bg-card border-border" />
      </ReactFlow>
      <Legend />
      <ExportButton />
      <AddItemButton />
    </div>
  );
};

export default InventoryMap;