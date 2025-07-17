import InventoryMap from '@/components/InventoryMap';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground">Mapa de Inventário</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sistema de gerenciamento de equipamentos e localidades
          </p>
        </div>
      </header>
      
      <main className="h-[calc(100vh-80px)]">
        <InventoryMap />
      </main>
    </div>
  );
};

export default Index;
