import React from 'react';
import { Monitor, MapPin, Building2, Wifi, WifiOff, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Legend = () => {
  return (
    <Card className="absolute top-4 left-4 w-64 z-10 bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Legenda</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">TIPOS</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-location border-2 border-location flex items-center justify-center">
                <MapPin className="w-3 h-3 text-location-foreground" />
              </div>
              <span className="text-xs">Localidade</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-unit border-2 border-unit flex items-center justify-center">
                <Building2 className="w-3 h-3 text-unit-foreground" />
              </div>
              <span className="text-xs">Unidade</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-equipment border-2 border-equipment flex items-center justify-center">
                <Monitor className="w-3 h-3 text-equipment-foreground" />
              </div>
              <span className="text-xs">Equipamento</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">STATUS</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-status-online" />
              <span className="text-xs">Online/Ativo</span>
            </div>
            <div className="flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-status-offline" />
              <span className="text-xs">Offline/Inativo</span>
            </div>
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-status-maintenance" />
              <span className="text-xs">Manutenção</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Legend;