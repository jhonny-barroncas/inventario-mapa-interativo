import React, { useCallback } from 'react';
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
import { useInventoryData } from '@/hooks/useInventoryData';

const InventoryMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { updateEquipment, updateLocation, deleteEquipment, deleteLocation } = useInventoryData();

  // Custom node components with access to state
  const CustomEquipmentNode = useCallback((props: any) => (
    <EquipmentNode
      {...props}
      onUpdate={(data: EquipmentData) => {
        updateEquipment(props.id, data as any);
        setNodes((nds) =>
          nds.map((node) =>
            node.id === props.id ? { ...node, data: data as any } : node
          )
        );
      }}
      onDelete={() => {
        deleteEquipment(props.id);
        setNodes((nds) => nds.filter((node) => node.id !== props.id));
        setEdges((eds) => eds.filter((edge) => 
          edge.source !== props.id && edge.target !== props.id
        ));
      }}
    />
  ), [setNodes, setEdges]);

  const CustomLocationNode = useCallback((props: any) => (
    <LocationNode
      {...props}
      onUpdate={(data: LocationData) => {
        updateLocation(props.id, data as any);
        setNodes((nds) =>
          nds.map((node) =>
            node.id === props.id ? { ...node, data: data as any } : node
          )
        );
      }}
      onDelete={() => {
        deleteLocation(props.id);
        setNodes((nds) => nds.filter((node) => node.id !== props.id));
        setEdges((eds) => eds.filter((edge) => 
          edge.source !== props.id && edge.target !== props.id
        ));
      }}
    />
  ), [setNodes, setEdges]);

  const nodeTypes = {
    equipment: CustomEquipmentNode,
    location: CustomLocationNode,
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleAddItem = useCallback((newItem: Node) => {
    console.log("Adding new item to React Flow:", JSON.stringify(newItem, null, 2));
    setNodes((nds) => [...nds, newItem]);

    // Auto-connect equipment to its location or location to its parent
    if (newItem.type === 'equipment' && newItem.data.locationId) {
      const newEdge: Edge = {
        id: `e-${newItem.id}-${newItem.data.locationId}`,
        source: newItem.data.locationId, // Source is the location
        target: newItem.id, // Target is the new equipment
        type: 'smoothstep',
        animated: true,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    } else if (newItem.type === 'location' && newItem.data.parentLocationId) {
      const newEdge: Edge = {
        id: `e-${newItem.id}-${newItem.data.parentLocationId}`,
        source: newItem.data.parentLocationId, // Source is the parent location
        target: newItem.id, // Target is the new location
        type: 'smoothstep',
        animated: true,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    }
  }, [setNodes, setEdges]);

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
      <AddItemButton onAdd={handleAddItem} />
    </div>
  );
};

export default InventoryMap;