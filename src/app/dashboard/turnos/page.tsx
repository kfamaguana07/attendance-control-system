'use client';

import { useState, useEffect } from 'react';
import { Turno } from '@/src/domain/entities/Turno';
import { TurnoForm } from '@/src/presentation/components/turnos/TurnoForm';
import { TurnoTable } from '@/src/presentation/components/turnos/TurnoTable';
import { Button } from '@/src/presentation/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function TurnosPage() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    loadTurnos();
  }, []);

  const loadTurnos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/orchestrator?resource=turnos');
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al cargar turnos');
      }
      
      // Convertir los datos al formato de Turno entity
      const turnosData = result.data.map((t: any) => new Turno(
        t.id,
        t.horaInicio,
        t.horaFin,
        t.horaTotal,
        t.nombre,
        t.descripcion,
        t.tipo
      ));
      
      setTurnos(turnosData);
    } catch (error) {
      toast.error('Error al cargar los turnos', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedTurno) {
        // Actualizar turno existente
        const response = await fetch('/api/orchestrator', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resource: 'turnos',
            id: selectedTurno.id,
            data: {
              horaInicio: data.horaInicio,
              horaFin: data.horaFin,
              horaTotal: data.horaTotal,
              nombre: data.nombre,
              descripcion: data.descripcion,
              tipo: data.tipo,
            },
          }),
        });
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Error al actualizar turno');
        }
        
        toast.success('Turno actualizado exitosamente');
      } else {
        // Crear nuevo turno
        const response = await fetch('/api/orchestrator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resource: 'turnos',
            data: {
              horaInicio: data.horaInicio,
              horaFin: data.horaFin,
              horaTotal: data.horaTotal,
              nombre: data.nombre,
              descripcion: data.descripcion,
              tipo: data.tipo,
            },
          }),
        });
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Error al crear turno');
        }
        
        toast.success('Turno creado exitosamente');
      }
      await loadTurnos();
      setSelectedTurno(null);
    } catch (error) {
      toast.error('Error al guardar el turno', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
      throw error;
    }
  };

  const handleEdit = (turno: Turno) => {
    setSelectedTurno(turno);
    setFormOpen(true);
  };

  const handleNew = () => {
    setSelectedTurno(null);
    setFormOpen(true);
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) {
      setSelectedTurno(null);
    }
  };

  const handleDelete = async (id: number) => {
    toast.warning('Funcionalidad no disponible', {
      description: 'La API de Turnos no soporta eliminación. Esta funcionalidad está pendiente de desarrollo.',
      duration: 5000,
    });
  };

  const handleSearch = async (query: string) => {
    try {
      if (!query.trim()) {
        loadTurnos();
        return;
      }
      
      const response = await fetch(`/api/orchestrator?resource=turnos&query=${encodeURIComponent(query)}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error en la búsqueda');
      }
      
      const turnosData = result.data.map((t: any) => new Turno(
        t.id,
        t.horaInicio,
        t.horaFin,
        t.horaTotal,
        t.nombre,
        t.descripcion,
        t.tipo
      ));
      
      setTurnos(turnosData);
    } catch (error) {
      toast.error('Error al buscar turnos', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Cargando turnos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Turnos</h1>
          <p className="text-muted-foreground mt-2">
            Administre los turnos de trabajo del personal
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Turno
        </Button>
      </div>

      <TurnoTable
        turnos={turnos}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
      />

      <TurnoForm
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        turno={selectedTurno}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
