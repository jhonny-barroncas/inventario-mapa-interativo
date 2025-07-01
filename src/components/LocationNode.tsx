import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MapPin, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import LocationContextMenu from './LocationContextMenu';

export interface LocationData {
  label: string;
  responsible: string;
  status: 'active' | 'inactive';
}

interface LocationNodeProps {
  data: LocationData;
  selected?: boolean;
  onUpdate?: (data: LocationData) => void;
  onDelete?: () => void;
}

const LocationNode = memo(({ data, selected, onUpdate, onDelete }: LocationNodeProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <LocationContextMenu
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
            "w-24 h-24 rounded-full bg-location border-4 border-location flex flex-col items-center justify-center transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl",
            selected && "ring-4 ring-ring ring-offset-2"
          )}
        >
          <MapPin className="w-6 h-6 text-location-foreground" />
          <span className="text-xs font-bold text-location-foreground mt-1 text-center px-1">
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
                  data.status === 'active' ? "text-status-online" : "text-status-offline"
                )}>
                  {data.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">Responsável:</span>
                <span className="text-foreground font-medium">{data.responsible}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </LocationContextMenu>
  );
});

LocationNode.displayName = 'LocationNode';

export default LocationNode;