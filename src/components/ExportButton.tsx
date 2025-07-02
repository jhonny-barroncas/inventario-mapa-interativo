import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { useInventoryData } from '@/hooks/useInventoryData';

const ExportButton = () => {
  const { data, getLocationName } = useInventoryData();
  const { toast } = useToast();

  const handleExport = () => {
    try {
      // Prepare data for export
      const exportData = data.equipment.map(equipment => {
        const locationName = getLocationName(equipment.locationId);
        const location = data.locations.find(loc => loc.id === equipment.locationId);
        const parentLocationName = location?.parentLocationId 
          ? getLocationName(location.parentLocationId)
          : '';

        return {
          'Nome do Equipamento': equipment.label,
          'Status': equipment.status === 'online' ? 'Online' : 
                   equipment.status === 'offline' ? 'Offline' : 'Manutenção',
          'Licença': equipment.license,
          'Contato': equipment.contact,
          'Localidade': locationName,
          'Localidade Pai': parentLocationName
        };
      });

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Inventário');

      // Generate filename with current date
      const date = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
      const filename = `inventario-${date}.xlsx`;

      // Save file
      XLSX.writeFile(wb, filename);

      toast({
        title: "Sucesso",
        description: `Planilha exportada: ${filename}`,
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Erro",
        description: "Erro ao exportar planilha",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleExport}
      className="absolute top-4 left-4 z-10 bg-secondary hover:bg-secondary/90"
      size="sm"
      variant="secondary"
    >
      <Download className="w-4 h-4 mr-2" />
      Exportar Planilha
    </Button>
  );
};

export default ExportButton;