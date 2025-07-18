import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Building2, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import UnitContextMenu from './UnitContextMenu';

export interface UnitData {
  label: string;
  responsible?: string;
  status: 'active' | 'inactive' | 'maintenance';
}

interface UnitNodeProps {
  data: UnitData;
  selected?: boolean;
  onUpdate?: (data: UnitData) => void;
  onDelete?: () => void;
}

const UnitNode = memo(({ data, selected, onUpdate, onDelete }: UnitNodeProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStatusColor = () => {
    switch (data.status) {
      case 'active':
        return 'border-status-online';
      case 'inactive':
        return 'border-status-offline';
      case 'maintenance':
        return 'border-status-maintenance';
      default:
        return 'border-border';
    }
  };

  return (
    <UnitContextMenu
      data={data}
      onUpdate={onUpdate || (() => {})}
      onDelete={onDelete || (() => {})}
    >
      <div
        className="relative"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <Handle type="target" position={Position.Top} className="opacity-0" />
        <Handle type="source" position={Position.Bottom} className="opacity-0" />
        <Handle type="target" position={Position.Left} className="opacity-0" />
        <Handle type="source" position={Position.Right} className="opacity-0" />
        
        <div
          className={cn(
            "w-20 h-20 rounded-lg bg-unit border-4 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl",
            getStatusColor(),
            selected && "ring-4 ring-ring ring-offset-2"
          )}
        >
          <Building2 className="w-6 h-6 text-unit-foreground" />
          <span className="text-xs font-bold text-unit-foreground mt-1 text-center px-1">
            {data.label}
          </span>
        </div>

        {showTooltip && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-card border border-border rounded-lg shadow-lg p-3 min-w-48 z-50">
            <div className="text-sm font-semibold text-foreground mb-2">{data.label}</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Status:</span>
                <span className={cn(
                  "font-medium",
                  data.status === 'active' && "text-status-online",
                  data.status === 'inactive' && "text-status-offline",
                  data.status === 'maintenance' && "text-status-maintenance"
                )}>
                  {data.status === 'active' ? 'Ativo' : 
                   data.status === 'inactive' ? 'Inativo' : 'Manutenção'}
                </span>
              </div>
              {data.responsible && (
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Responsável:</span>
                  <span className="text-foreground font-medium">{data.responsible}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </UnitContextMenu>
  );
});

UnitNode.displayName = 'UnitNode';

export default UnitNode;