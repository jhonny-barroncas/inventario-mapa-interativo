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
import { Edit, Trash2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LocationData } from './LocationNode';

interface EditLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: LocationData) => void;
  initialData: LocationData;
}

const EditLocationModal = ({ isOpen, onClose, onUpdate, initialData }: EditLocationModalProps) => {
  const [formData, setFormData] = useState<LocationData>(initialData);
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
      description: "Localidade atualizada com sucesso!",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Editar Localidade
          </DialogTitle>
          <DialogDescription>
            Atualize as informações da localidade.
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
              onValueChange={(value: 'active' | 'inactive') => 
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="responsible">Responsável</Label>
            <Input
              id="responsible"
              value={formData.responsible}
              onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
              placeholder="Nome do responsável"
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

interface LocationContextMenuProps {
  children: React.ReactNode;
  data: LocationData;
  onUpdate: (data: LocationData) => void;
  onDelete: () => void;
}

const LocationContextMenu = ({ children, data, onUpdate, onDelete }: LocationContextMenuProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const handleQuickStatusChange = (status: 'active' | 'inactive') => {
    onUpdate({ ...data, status });
    toast({
      title: "Status Atualizado",
      description: `Status alterado para ${status === 'active' ? 'Ativo' : 'Inativo'}`,
    });
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta localidade?')) {
      onDelete();
      toast({
        title: "Localidade Excluída",
        description: "A localidade foi removida do mapa.",
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
            Editar Localidade
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            onClick={() => handleQuickStatusChange('active')}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <div className="w-3 h-3 rounded-full bg-status-online mr-2" />
            Marcar como Ativo
          </ContextMenuItem>
          <ContextMenuItem 
            onClick={() => handleQuickStatusChange('inactive')}
            className="hover:bg-accent hover:text-accent-foreground"
          >
            <div className="w-3 h-3 rounded-full bg-status-offline mr-2" />
            Marcar como Inativo
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem 
            onClick={handleDelete}
            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir Localidade
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <EditLocationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={onUpdate}
        initialData={data}
      />
    </>
  );
};

export default LocationContextMenu;