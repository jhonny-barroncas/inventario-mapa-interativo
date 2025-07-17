import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Monitor, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: any) => void;
}

const AddItemModal = ({ isOpen, onClose, onAdd }: AddItemModalProps) => {
  const [itemType, setItemType] = useState<'equipment' | 'location'>('equipment');
  const [formData, setFormData] = useState({
    label: '',
    status: 'online',
    license: '',
    contact: '',
    responsible: '',
  });
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

    const newItem = {
      id: `${itemType}-${Date.now()}`,
      type: itemType,
      position: { 
        x: Math.random() * 400 + 200, 
        y: Math.random() * 400 + 200 
      },
      data: itemType === 'equipment' 
        ? {
            label: formData.label,
            status: formData.status as 'online' | 'offline' | 'maintenance',
            license: formData.license,
            contact: formData.contact,
          }
        : {
            label: formData.label,
            responsible: formData.responsible,
            status: formData.status === 'online' ? 'active' : 'inactive',
          }
    };

    onAdd(newItem);
    
    // Reset form
    setFormData({
      label: '',
      status: 'online',
      license: '',
      contact: '',
      responsible: '',
    });
    
    toast({
      title: "Sucesso",
      description: `${itemType === 'equipment' ? 'Equipamento' : 'Localidade'} adicionado com sucesso!`,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {itemType === 'equipment' ? <Monitor className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
            Adicionar {itemType === 'equipment' ? 'Equipamento' : 'Localidade'}
          </DialogTitle>
          <DialogDescription>
            Preencha as informações para adicionar um novo item ao mapa.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={itemType} onValueChange={(value: 'equipment' | 'location') => setItemType(value)}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="equipment">Equipamento</SelectItem>
                <SelectItem value="location">Localidade</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                {itemType === 'equipment' ? (
                  <>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="online">Ativo</SelectItem>
                    <SelectItem value="offline">Inativo</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {itemType === 'equipment' ? (
            <>
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
            </>
          ) : (
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
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AddItemButton = ({ onAdd }: { onAdd: (item: any) => void }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="absolute top-4 right-4 z-10 bg-primary hover:bg-primary/90"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Item
      </Button>
      
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={onAdd}
      />
    </>
  );
};

export default AddItemButton;