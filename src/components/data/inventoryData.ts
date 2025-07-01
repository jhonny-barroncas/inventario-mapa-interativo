import { Node, Edge } from '@xyflow/react';
import { EquipmentData } from '../EquipmentNode';
import { LocationData } from '../LocationNode';

export const initialNodes: Node[] = [
  // Central location - MANAUS (like BRINGEL in the image)
  {
    id: 'manaus',
    type: 'location',
    position: { x: 400, y: 300 },
    data: {
      label: 'MANAUS',
      responsible: 'João Silva',
      status: 'active',
    },
  },
  
  // Equipment nodes around the central location
  {
    id: 'equipment-1',
    type: 'equipment',
    position: { x: 150, y: 150 },
    data: {
      label: 'LACANDERIA',
      status: 'maintenance',
      license: 'LIC-2024-001',
      contact: 'maintenance@lacanderia.com',
    },
  },
  
  {
    id: 'equipment-2',
    type: 'equipment',
    position: { x: 650, y: 150 },
    data: {
      label: 'HUGV',
      status: 'online',
      license: 'LIC-2024-002',
      contact: 'admin@hugv.com',
    },
  },
  
  {
    id: 'equipment-3',
    type: 'equipment',
    position: { x: 150, y: 450 },
    data: {
      label: 'SERVIDOR-01',
      status: 'online',
      license: 'LIC-2024-003',
      contact: 'server@company.com',
    },
  },
  
  {
    id: 'equipment-4',
    type: 'equipment',
    position: { x: 650, y: 450 },
    data: {
      label: 'TERMINAL-05',
      status: 'offline',
      license: 'LIC-2024-004',
      contact: 'support@terminal.com',
    },
  },
  
  {
    id: 'equipment-5',
    type: 'equipment',
    position: { x: 400, y: 100 },
    data: {
      label: 'CENTRAL-NET',
      status: 'online',
      license: 'LIC-2024-005',
      contact: 'network@central.com',
    },
  },
  
  {
    id: 'equipment-6',
    type: 'equipment',
    position: { x: 400, y: 500 },
    data: {
      label: 'BACKUP-SYS',
      status: 'maintenance',
      license: 'LIC-2024-006',
      contact: 'backup@system.com',
    },
  },
];

export const initialEdges: Edge[] = [
  { id: 'e1', source: 'manaus', target: 'equipment-1', animated: true },
  { id: 'e2', source: 'manaus', target: 'equipment-2', animated: true },
  { id: 'e3', source: 'manaus', target: 'equipment-3', animated: true },
  { id: 'e4', source: 'manaus', target: 'equipment-4', animated: true },
  { id: 'e5', source: 'manaus', target: 'equipment-5', animated: true },
  { id: 'e6', source: 'manaus', target: 'equipment-6', animated: true },
];