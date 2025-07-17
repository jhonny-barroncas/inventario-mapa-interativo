import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Monitor, Wifi, WifiOff, Wrench, Smartphone, Radio, Computer } from 'lucide-react';
import { cn } from '@/lib/utils';
import EquipmentContextMenu from './EquipmentContextMenu';

export interface EquipmentData {
  label: string;
  status: 'online' | 'offline' | 'maintenance';
  license: string;
  contact: string;
  icon_type?: 'linux' | 'windows' | 'pc' | 'mobile' | 'antenna' | 'custom';
  custom_icon_url?: string;
  location_id?: string;
}

interface EquipmentNodeProps {
  data: EquipmentData;
  selected?: boolean;
  onUpdate?: (data: EquipmentData) => void;
  onDelete?: () => void;
}

const EquipmentNode = memo(({ data, selected, onUpdate, onDelete }: EquipmentNodeProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStatusIcon = () => {
    switch (data.status) {
      case 'online':
        return <Wifi className="w-4 h-4 text-status-online" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-status-offline" />;
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-status-maintenance" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getEquipmentIcon = () => {
    const iconClass = "w-8 h-8 text-equipment-foreground";
    
    if (data.icon_type === 'custom' && data.custom_icon_url) {
      return (
        <img 
          src={data.custom_icon_url} 
          alt="Custom icon" 
          className="w-8 h-8 object-contain"
        />
      );
    }

    switch (data.icon_type) {
      case 'linux':
        return <Computer className={iconClass} />;
      case 'windows':
        return <Monitor className={iconClass} />;
      case 'mobile':
        return <Smartphone className={iconClass} />;
      case 'antenna':
        return <Radio className={iconClass} />;
      default:
        return <Monitor className={iconClass} />;
    }
  };

  const getStatusColor = () => {
    switch (data.status) {
      case 'online':
        return 'border-status-online';
      case 'offline':
        return 'border-status-offline';
      case 'maintenance':
        return 'border-status-maintenance';
      default:
        return 'border-border';
    }
  };

  return (
    <EquipmentContextMenu
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
            "w-20 h-20 rounded-full bg-equipment border-4 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl",
            getStatusColor(),
            selected && "ring-4 ring-ring ring-offset-2"
          )}
        >
          {getEquipmentIcon()}
        </div>

        {showTooltip && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-card border border-border rounded-lg shadow-lg p-3 min-w-48 z-50">
            <div className="text-sm font-semibold text-foreground mb-2">{data.label}</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                {getStatusIcon()}
                <span className="text-muted-foreground">Status:</span>
                <span className={cn(
                  "font-medium",
                  data.status === 'online' && "text-status-online",
                  data.status === 'offline' && "text-status-offline",
                  data.status === 'maintenance' && "text-status-maintenance"
                )}>
                  {data.status === 'online' ? 'Online' : 
                   data.status === 'offline' ? 'Offline' : 'Manutenção'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Licença:</span>
                <span className="text-foreground font-medium">{data.license}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Contato:</span>
                <span className="text-foreground font-medium">{data.contact}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </EquipmentContextMenu>
  );
});

EquipmentNode.displayName = 'EquipmentNode';

export default EquipmentNode;