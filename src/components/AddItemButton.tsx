import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AddItemModal } from './AddItemModal';

const AddItemButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="absolute top-4 right-4 z-10"
        size="sm"
      >
        <Plus className="w-4 h-4 mr-2" />
        Adicionar Item
      </Button>
      
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default AddItemButton;