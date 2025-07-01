import React, { useState } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EquipmentData } from './EquipmentNode';

interface EditEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: EquipmentData) => void;
  initialData: EquipmentData;
}

const EditEquipmentModal = ({ isOpen, onClose, onUpdate, initialData }: EditEquipmentModalProps) => {
  const [formData, setFormData] = useState<EquipmentData>(initialData);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.label.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive",
      });
      return;
    }

    onUpdate(formData);
    toast({
      title: "Sucesso",
      description: "Equipamento atualizado com sucesso!",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Editar Equipamento
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do equipamento.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="label">Nome *</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="Digite o nome"
              className="bg-background border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value: 'online' | 'offline' | 'maintenance') => 
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="maintenance">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="license">Licença</Label>
            <Input
              id="license"
              value={formData.license}
              onChange={(e) => setFormData({ ...formData, license: e.target.value })}
              placeholder="Ex: LIC-2024-001"
              className="bg-background border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Contato</Label>
            <Input
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              placeholder="email@exemplo.com"
              className="bg-background border-border"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Atualizar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface EquipmentContextMenuProps {
  children: React.ReactNode;
  data: EquipmentData;
  onUpdate: (data: EquipmentData) => void;
  onDelete: () => void;
}

const EquipmentContextMenu = ({ children, data, onUpdate, onDelete }: EquipmentContextMenuProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const handleQuickStatusChange = (status: 'online' | 'offline' | 'maintenance') => {
    onUpdate({ ...data, status });
    toast({
      title: "Status Atualizado",
      description: `Status alterado para ${status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Manutenção'}`,
    });
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este equipamento?')) {
      onDelete();
      toast({
        title: "Equipamento Excluído",
        description: "O equipamento foi removido do mapa.",
      });
    }
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64 bg-popover border-border">
          <ContextMenuItem 
            onClick={() => setIsEditModalOpen(true)}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar Equipamento
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            onClick={() => handleQuickStatusChange('online')}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <div className="w-3 h-3 rounded-full bg-status-online mr-2" />
            Marcar como Online
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => handleQuickStatusChange('offline')}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <div className="w-3 h-3 rounded-full bg-status-offline mr-2" />
            Marcar como Offline
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => handleQuickStatusChange('maintenance')}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <div className="w-3 h-3 rounded-full bg-status-maintenance mr-2" />
            Marcar como Manutenção
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            onClick={handleDelete}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir Equipamento
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <EditEquipmentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={onUpdate}
        initialData={data}
      />
    </>
  );
};

export default EquipmentContextMenu;