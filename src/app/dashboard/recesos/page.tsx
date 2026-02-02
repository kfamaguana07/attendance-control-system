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
import { RecesoTable } from '@/src/presentation/components/recesos/RecesoTable';
import { RecesoForm } from '@/src/presentation/components/recesos/RecesoForm';

export default function RecesosPage() {
  const [recesos, setRecesos] = useState<Receso[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedReceso, setSelectedReceso] = useState<Receso | null>(null);

  const loadRecesos = async () => {
    try {
      const response = await fetch('/api/orchestrator?resource=recesos');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar recesos');
      }
      
      // Convertir los datos al formato de Receso entity
      const recesosData = result.data.map((r: any) => new Receso(
        r.id,
        r.id_t,
        r.hora_inicio,
        r.hora_fin,
        r.hora_total,
        r.nombre,
        r.descripcion,
        r.tipo
      ));
      
      setRecesos(recesosData);
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
      if (!query.trim()) {
        loadRecesos();
        return;
      }
      
      const response = await fetch(`/api/orchestrator?resource=recesos&query=${encodeURIComponent(query)}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error en la búsqueda');
      }
      
      const recesosData = result.data.map((r: any) => new Receso(
        r.id,
        r.id_t,
        r.hora_inicio,
        r.hora_fin,
        r.hora_total,
        r.nombre,
        r.descripcion,
        r.tipo
      ));
      
      setRecesos(recesosData);
    } catch (error) {
      toast.error('Error en la búsqueda', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedReceso) {
        // Actualizar receso existente
        const response = await fetch('/api/orchestrator', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resource: 'recesos',
            id: selectedReceso.id,
            data,
          }),
        });
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Error al actualizar receso');
        }
        
        toast.success('Receso actualizado exitosamente');
      } else {
        // Crear nuevo receso
        const response = await fetch('/api/orchestrator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resource: 'recesos',
            data,
          }),
        });
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Error al crear receso');
        }
        
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
    toast.warning('Funcionalidad no disponible', {
      description: 'La API de Recesos no soporta eliminación. Esta funcionalidad está pendiente de desarrollo.',
      duration: 5000,
    });
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
