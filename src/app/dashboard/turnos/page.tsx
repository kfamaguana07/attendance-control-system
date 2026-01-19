'use client';

import { useState, useEffect } from 'react';
import { Turno } from '@/src/domain/entities/Turno';
import { TurnoForm } from '@/src/presentation/components/turnos/TurnoForm';
import { TurnoTable } from '@/src/presentation/components/turnos/TurnoTable';
import { Button } from '@/src/presentation/components/ui/button';
import { MockTurnoRepository } from '@/src/infrastructure/repositories/MockTurnoRepository';
import { GetAllTurnosUseCase } from '@/src/application/use-cases/GetAllTurnosUseCase';
import { CreateTurnoUseCase } from '@/src/application/use-cases/CreateTurnoUseCase';
import { UpdateTurnoUseCase } from '@/src/application/use-cases/UpdateTurnoUseCase';
import { DeleteTurnoUseCase } from '@/src/application/use-cases/DeleteTurnoUseCase';
import { SearchTurnosUseCase } from '@/src/application/use-cases/SearchTurnosUseCase';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function TurnosPage() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  // Repositorio y casos de uso
  const turnoRepository = new MockTurnoRepository();
  const getAllTurnosUseCase = new GetAllTurnosUseCase(turnoRepository);
  const createTurnoUseCase = new CreateTurnoUseCase(turnoRepository);
  const updateTurnoUseCase = new UpdateTurnoUseCase(turnoRepository);
  const deleteTurnoUseCase = new DeleteTurnoUseCase(turnoRepository);
  const searchTurnosUseCase = new SearchTurnosUseCase(turnoRepository);

  useEffect(() => {
    loadTurnos();
  }, []);

  const loadTurnos = async () => {
    try {
      setIsLoading(true);
      const data = await getAllTurnosUseCase.execute();
      setTurnos(data);
    } catch (error) {
      toast.error('Error al cargar los turnos');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedTurno) {
        // Actualizar
        await updateTurnoUseCase.execute(selectedTurno.id, {
          horaInicio: data.horaInicio,
          horaFin: data.horaFin,
          horaTotal: data.horaTotal,
          nombre: data.nombre,
          descripcion: data.descripcion,
          tipo: data.tipo,
        });
        toast.success('Turno actualizado exitosamente');
      } else {
        // Crear
        await createTurnoUseCase.execute({
          horaInicio: data.horaInicio,
          horaFin: data.horaFin,
          horaTotal: data.horaTotal,
          nombre: data.nombre,
          descripcion: data.descripcion,
          tipo: data.tipo,
        } as Omit<Turno, 'id'>);
        toast.success('Turno creado exitosamente');
      }
      await loadTurnos();
      setSelectedTurno(null);
    } catch (error) {
      toast.error('Error al guardar el turno');
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
    try {
      await deleteTurnoUseCase.execute(id);
      await loadTurnos();
    } catch (error) {
      throw error;
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const results = await searchTurnosUseCase.execute(query);
      setTurnos(results);
    } catch (error) {
      toast.error('Error al buscar turnos');
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
