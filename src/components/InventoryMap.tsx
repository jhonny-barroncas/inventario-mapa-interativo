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
import { initialNodes, initialEdges } from './data/inventoryData';
import { EquipmentData } from './EquipmentNode';
import { LocationData } from './LocationNode';

const InventoryMap = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Custom node components with access to state
  const CustomEquipmentNode = useCallback((props: any) => (
    <EquipmentNode
      {...props}
      onUpdate={(data: EquipmentData) => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === props.id ? { ...node, data: data as any } : node
          )
        );
      }}
      onDelete={() => {
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
        setNodes((nds) =>
          nds.map((node) =>
            node.id === props.id ? { ...node, data: data as any } : node
          )
        );
      }}
      onDelete={() => {
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
      <AddItemButton onAdd={handleAddItem} />
    </div>
  );
};

export default InventoryMap;