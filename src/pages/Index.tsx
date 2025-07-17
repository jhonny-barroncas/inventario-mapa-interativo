import InventoryMap from '@/components/InventoryMap';
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const Index = () => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mapa de Inventário</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sistema de gerenciamento de equipamentos e localidades
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {user?.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>
      
      <main className="h-[calc(100vh-80px)]">
        <InventoryMap />
      </main>
    </div>
  );
};

export default Index;
