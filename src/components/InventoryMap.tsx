import React, { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import EquipmentNode from './EquipmentNode';
import LocationNode from './LocationNode';
import UnitNode from './UnitNode';
import Legend from './Legend';
import AddItemButton from './AddItemButton';
import { EquipmentData } from './EquipmentNode';
import { LocationData } from './LocationNode';
import { UnitData } from './UnitNode';
import useSupabaseInventory from '@/hooks/useSupabaseInventory';

const InventoryMap = () => {
  const {
    nodes,
    edges,
    loading,
    setNodes,
    setEdges,
    updateNodePosition,
    updateLocationData,
    updateUnitData,
    updateEquipmentData,
    deleteNode
  } = useSupabaseInventory();

  // Custom node components with access to state
  const CustomEquipmentNode = useCallback((props: any) => (
    <EquipmentNode
      {...props}
      onUpdate={(data: EquipmentData) => {
        updateEquipmentData(props.id, data);
      }}
      onDelete={() => {
        deleteNode(props.id);
      }}
    />
  ), [updateEquipmentData, deleteNode]);

  const CustomLocationNode = useCallback((props: any) => (
    <LocationNode
      {...props}
      onUpdate={(data: LocationData) => {
        updateLocationData(props.id, data);
      }}
      onDelete={() => {
        deleteNode(props.id);
      }}
    />
  ), [updateLocationData, deleteNode]);

  const CustomUnitNode = useCallback((props: any) => (
    <UnitNode
      {...props}
      onUpdate={(data: UnitData) => {
        updateUnitData(props.id, data);
      }}
      onDelete={() => {
        deleteNode(props.id);
      }}
    />
  ), [updateUnitData, deleteNode]);

  const nodeTypes = {
    equipment: CustomEquipmentNode,
    location: CustomLocationNode,
    unit: CustomUnitNode,
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onNodesChange = useCallback((changes: any) => {
    changes.forEach((change: any) => {
      if (change.type === 'position' && change.position) {
        updateNodePosition(change.id, change.position);
      }
    });
    
    setNodes((nds) => 
      nds.map((node) => {
        const change = changes.find((c: any) => c.id === node.id);
        if (change) {
          return { ...node, ...change };
        }
        return node;
      })
    );
  }, [updateNodePosition, setNodes]);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => 
      eds.map((edge) => {
        const change = changes.find((c: any) => c.id === edge.id);
        if (change) {
          return { ...edge, ...change };
        }
        return edge;
      })
    );
  }, [setEdges]);

  const handleAddItem = useCallback((newItem: Node) => {
    setNodes((nds) => [...nds, newItem]);
  }, [setNodes]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-background flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
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
      <AddItemButton onAdd={handleAddItem} />
    </div>
  );
};

export default InventoryMap;