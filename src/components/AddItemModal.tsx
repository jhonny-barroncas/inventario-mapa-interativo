import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Monitor, MapPin, Upload, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSupabaseInventory } from '@/hooks/useSupabaseInventory';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddItemModal = ({ isOpen, onClose }: AddItemModalProps) => {
  const [itemType, setItemType] = useState<'equipment' | 'location'>('location');
  const [label, setLabel] = useState('');
  const [status, setStatus] = useState('online');
  const [license, setLicense] = useState('');
  const [contact, setContact] = useState('');
  const [responsible, setResponsible] = useState('');
  const [locationId, setLocationId] = useState('');
  const [iconType, setIconType] = useState<'linux' | 'windows' | 'pc' | 'mobile' | 'antenna' | 'custom'>('pc');
  const [customIconFile, setCustomIconFile] = useState<File | null>(null);
  const [customIconPreview, setCustomIconPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { addEquipment, addLocation, getAvailableLocations, uploadCustomIcon } = useSupabaseInventory();
  const availableLocations = getAvailableLocations();

  const resetForm = () => {
    setLabel('');
    setStatus('online');
    setLicense('');
    setContact('');
    setResponsible('');
    setLocationId('');
    setIconType('pc');
    setCustomIconFile(null);
    setCustomIconPreview('');
  };

  const handleIconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomIconFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomIconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!label.trim()) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório",
        variant: "destructive",
      });
      return;
    }

    if (itemType === 'equipment' && !locationId) {
      toast({
        title: "Erro", 
        description: "Localidade é obrigatória para equipamentos",
        variant: "destructive",
      });
      return;
    }

    const position = { 
      x: Math.random() * 400 + 200, 
      y: Math.random() * 400 + 200 
    };

    try {
      if (itemType === 'equipment') {
        let customIconUrl: string | null = null;
        
        if (iconType === 'custom' && customIconFile) {
          customIconUrl = await uploadCustomIcon(customIconFile);
          if (!customIconUrl) {
            return; // Error already shown by uploadCustomIcon
          }
        }

        await addEquipment({
          label,
          status: status as 'online' | 'offline' | 'maintenance',
          license,
          contact,
          icon_type: iconType,
          custom_icon_url: customIconUrl || undefined,
          location_id: locationId,
          position_x: position.x,
          position_y: position.y,
        });
      } else {
        await addLocation({
          label,
          responsible,
          status: status === 'online' ? 'active' : 'inactive',
          position_x: position.x,
          position_y: position.y,
        });
      }

      toast({
        title: "Sucesso",
        description: `${itemType === 'equipment' ? 'Equipamento' : 'Localidade'} adicionado com sucesso!`,
      });
      
      resetForm();
      onClose();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar item",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {itemType === 'equipment' ? <Monitor className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
            Adicionar {itemType === 'equipment' ? 'Equipamento' : 'Localidade'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={itemType} onValueChange={(value: 'equipment' | 'location') => setItemType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="location">Localidade</SelectItem>
                <SelectItem value="equipment">Equipamento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Digite o nome"
              required
            />
          </div>

          {itemType === 'equipment' ? (
            <>
              <div className="space-y-2">
                <Label>Localidade *</Label>
                <Select value={locationId} onValueChange={setLocationId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a localidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Licença</Label>
                <Input
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  placeholder="Ex: LIC-2024-001"
                />
              </div>

              <div className="space-y-2">
                <Label>Contato</Label>
                <Input
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de Ícone</Label>
                <Select value={iconType} onValueChange={(value: any) => setIconType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pc">PC/Computador</SelectItem>
                    <SelectItem value="windows">Windows</SelectItem>
                    <SelectItem value="linux">Linux</SelectItem>
                    <SelectItem value="mobile">Celular</SelectItem>
                    <SelectItem value="antenna">Antena</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {iconType === 'custom' && (
                <div className="space-y-2">
                  <Label>Ícone Personalizado</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {customIconFile ? customIconFile.name : 'Escolher arquivo'}
                    </Button>
                    {customIconPreview && (
                      <div className="w-10 h-10 border border-border rounded-md flex items-center justify-center">
                        <img src={customIconPreview} alt="Preview" className="w-8 h-8 object-contain" />
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleIconFileChange}
                    className="hidden"
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Ativo</SelectItem>
                    <SelectItem value="offline">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Responsável</Label>
                <Input
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  placeholder="Nome do responsável"
                />
              </div>
            </>
          )}

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};