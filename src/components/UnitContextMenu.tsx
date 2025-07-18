import React from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { Edit, Trash2 } from 'lucide-react';
import { UnitData } from './UnitNode';

interface UnitContextMenuProps {
  children: React.ReactNode;
  data: UnitData;
  onUpdate: (data: UnitData) => void;
  onDelete: () => void;
}

const UnitContextMenu = ({ children, data, onUpdate, onDelete }: UnitContextMenuProps) => {
  const handleEdit = () => {
    const label = prompt('Nome da Unidade:', data.label);
    if (label !== null) {
      const responsible = prompt('Responsável (opcional):', data.responsible || '');
      const statusOptions = ['active', 'inactive', 'maintenance'];
      const statusLabels = ['Ativo', 'Inativo', 'Manutenção'];
      const currentStatusIndex = statusOptions.indexOf(data.status);
      
      const statusChoice = prompt(
        `Status (0: ${statusLabels[0]}, 1: ${statusLabels[1]}, 2: ${statusLabels[2]}):`,
        currentStatusIndex.toString()
      );
      
      if (statusChoice !== null) {
        const statusIndex = parseInt(statusChoice);
        if (statusIndex >= 0 && statusIndex < statusOptions.length) {
          onUpdate({
            label: label.trim(),
            responsible: responsible?.trim() || undefined,
            status: statusOptions[statusIndex] as UnitData['status']
          });
        }
      }
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleEdit}>
          <Edit className="w-4 h-4 mr-2" />
          Editar Unidade
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className="text-destructive">
          <Trash2 className="w-4 h-4 mr-2" />
          Excluir Unidade
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default UnitContextMenu;