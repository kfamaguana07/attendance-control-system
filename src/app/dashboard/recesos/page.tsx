'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/src/presentation/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/presentation/components/ui/dialog';
import { Receso } from '@/src/domain/entities/Receso';
import { MockRecesoRepository } from '@/src/infrastructure/repositories/MockRecesoRepository';
import { GetAllRecesosUseCase } from '@/src/application/use-cases/GetAllRecesosUseCase';
import { CreateRecesoUseCase } from '@/src/application/use-cases/CreateRecesoUseCase';
import { UpdateRecesoUseCase } from '@/src/application/use-cases/UpdateRecesoUseCase';
import { DeleteRecesoUseCase } from '@/src/application/use-cases/DeleteRecesoUseCase';
import { SearchRecesosUseCase } from '@/src/application/use-cases/SearchRecesosUseCase';
import { RecesoTable } from '@/src/presentation/components/recesos/RecesoTable';
import { RecesoForm } from '@/src/presentation/components/recesos/RecesoForm';

const recesoRepository = new MockRecesoRepository();
const getAllRecesosUseCase = new GetAllRecesosUseCase(recesoRepository);
const createRecesoUseCase = new CreateRecesoUseCase(recesoRepository);
const updateRecesoUseCase = new UpdateRecesoUseCase(recesoRepository);
const deleteRecesoUseCase = new DeleteRecesoUseCase(recesoRepository);
const searchRecesosUseCase = new SearchRecesosUseCase(recesoRepository);

export default function RecesosPage() {
  const [recesos, setRecesos] = useState<Receso[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedReceso, setSelectedReceso] = useState<Receso | null>(null);

  const loadRecesos = async () => {
    try {
      const data = await getAllRecesosUseCase.execute();
      setRecesos(data);
    } catch (error) {
      toast.error('Error al cargar recesos', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  useEffect(() => {
    loadRecesos();
  }, []);

  const handleSearch = async (query: string) => {
    try {
      const data = await searchRecesosUseCase.execute(query);
      setRecesos(data);
    } catch (error) {
      toast.error('Error en la búsqueda');
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedReceso) {
        await updateRecesoUseCase.execute(selectedReceso.id, data);
        toast.success('Receso actualizado exitosamente');
      } else {
        await createRecesoUseCase.execute(data);
        toast.success('Receso creado exitosamente');
      }
      setOpenModal(false);
      setSelectedReceso(null);
      loadRecesos();
    } catch (error) {
      toast.error('Error al guardar', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  const handleEdit = (receso: Receso) => {
    setSelectedReceso(receso);
    setOpenModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRecesoUseCase.execute(id);
      loadRecesos();
    } catch (error) {
      toast.error('Error al eliminar');
    }
  };

  const handleNewReceso = () => {
    setSelectedReceso(null);
    setOpenModal(true);
  };

  const handleCancel = () => {
    setOpenModal(false);
    setSelectedReceso(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recesos</h1>
          <p className="text-muted-foreground mt-2">
            Gestión de breaks y almuerzos del sistema
          </p>
        </div>
        <Button onClick={handleNewReceso}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Receso
        </Button>
      </div>

      <RecesoTable
        recesos={recesos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
      />

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedReceso ? 'Editar Receso' : 'Agregar Nuevo Receso'}
            </DialogTitle>
          </DialogHeader>
          <RecesoForm
            receso={selectedReceso}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
