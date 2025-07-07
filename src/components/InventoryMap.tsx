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
import { useInventoryData } from '@/hooks/useInventoryData';

const InventoryMap = () => {
  const { data, updateEquipment, updateLocation, deleteEquipment, deleteLocation } = useInventoryData();
  
  // Convert inventory data to ReactFlow nodes
  const inventoryNodes: Node[] = useMemo(() => {
    const equipmentNodes: Node[] = data.equipment.map(equipment => ({
      id: equipment.id,
      type: 'equipment',
      position: equipment.position,
      data: {
        label: equipment.label,
        status: equipment.status,
        license: equipment.license,
        contact: equipment.contact,
      }
    }));

    const locationNodes: Node[] = data.locations.map(location => ({
      id: location.id,
      type: 'location',
      position: location.position,
      data: {
        label: location.label,
        responsible: location.responsible,
        status: location.status,
      }
    }));

    return [...locationNodes, ...equipmentNodes];
  }, [data]);

  // Use inventory data or fallback to initial nodes if no data exists
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(
    inventoryNodes.length > 0 ? inventoryNodes : initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when inventory data changes
  useEffect(() => {
    if (inventoryNodes.length > 0) {
      setNodes(inventoryNodes);
    }
  }, [inventoryNodes, setNodes]);

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
  ), [updateEquipment, deleteEquipment, setNodes, setEdges]);

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
  ), [updateLocation, deleteLocation, setNodes, setEdges]);

  const nodeTypes = {
    equipment: CustomEquipmentNode,
    location: CustomLocationNode,
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleAddItem = useCallback((newItem: Node) => {
    setNodes((nds) => [...nds, newItem]);
  }, [setNodes]);

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