'use client';

import { useState, useEffect } from 'react';
import { Pausa } from '@/src/domain/entities/Pausa';
import { PausaForm } from '@/src/presentation/components/pausas/PausaForm';
import { PausaTable } from '@/src/presentation/components/pausas/PausaTable';
import { Button } from '@/src/presentation/components/ui/button';
import { MockPausaRepository } from '@/src/infrastructure/repositories/MockPausaRepository';
import { MockPersonalRepository } from '@/src/infrastructure/repositories/MockPersonalRepository';
import { GetAllPausasUseCase } from '@/src/application/use-cases/GetAllPausasUseCase';
import { CreatePausaUseCase } from '@/src/application/use-cases/CreatePausaUseCase';
import { UpdatePausaUseCase } from '@/src/application/use-cases/UpdatePausaUseCase';
import { DeletePausaUseCase } from '@/src/application/use-cases/DeletePausaUseCase';
import { SearchPausasUseCase } from '@/src/application/use-cases/SearchPausasUseCase';
import { GetAllPersonalUseCase } from '@/src/application/use-cases/GetAllPersonalUseCase';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function PausasPage() {
  const [pausas, setPausas] = useState<Pausa[]>([]);
  const [selectedPausa, setSelectedPausa] = useState<Pausa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [empleados, setEmpleados] = useState<Array<{ id: string; nombre: string }>>([]);

  // Repositorios y casos de uso
  const pausaRepository = new MockPausaRepository();
  const personalRepository = new MockPersonalRepository();
  const getAllPausasUseCase = new GetAllPausasUseCase(pausaRepository);
  const createPausaUseCase = new CreatePausaUseCase(pausaRepository);
  const updatePausaUseCase = new UpdatePausaUseCase(pausaRepository);
  const deletePausaUseCase = new DeletePausaUseCase(pausaRepository);
  const searchPausasUseCase = new SearchPausasUseCase(pausaRepository);
  const getAllPersonalUseCase = new GetAllPersonalUseCase(personalRepository);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [pausasData, personalData] = await Promise.all([
        getAllPausasUseCase.execute(),
        getAllPersonalUseCase.execute(),
      ]);
      setPausas(pausasData);
      setEmpleados(
        personalData.map((p) => ({
          id: p.cl,
          nombre: p.nombreCompleto,
        }))
      );
    } catch (error) {
      toast.error('Error al cargar los datos');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPausas = async () => {
    try {
      const data = await getAllPausasUseCase.execute();
      setPausas(data);
    } catch (error) {
      toast.error('Error al cargar los registros');
      console.error(error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedPausa) {
        // Actualizar
        await updatePausaUseCase.execute(selectedPausa.id, {
          estado: data.estado,
          subEstado: data.subEstado,
          observacion: data.observacion,
          empleadosIds: data.empleadosIds,
          fechaPausa: data.fechaPausa,
          horaInicio: data.horaInicio,
          horaFin: data.horaFin,
        });
        toast.success('Registro actualizado exitosamente');
      } else {
        // Crear
        await createPausaUseCase.execute({
          estado: data.estado,
          subEstado: data.subEstado,
          observacion: data.observacion,
          empleadosIds: data.empleadosIds,
          fechaPausa: data.fechaPausa,
          horaInicio: data.horaInicio,
          horaFin: data.horaFin,
        } as Omit<Pausa, 'id'>);
        toast.success('Registro creado exitosamente');
      }
      await loadPausas();
      setSelectedPausa(null);
    } catch (error) {
      toast.error('Error al guardar el registro');
      throw error;
    }
  };

  const handleEdit = (pausa: Pausa) => {
    setSelectedPausa(pausa);
    setFormOpen(true);
  };

  const handleNew = () => {
    setSelectedPausa(null);
    setFormOpen(true);
  };

  const handleFormOpenChange = (open: boolean) => {
    setFormOpen(open);
    if (!open) {
      setSelectedPausa(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePausaUseCase.execute(id);
      await loadPausas();
    } catch (error) {
      throw error;
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const results = await searchPausasUseCase.execute(query);
      setPausas(results);
    } catch (error) {
      toast.error('Error al buscar registros');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tiempos Fuera de Trabajo</h1>
          <p className="text-muted-foreground mt-2">
            Administre los tiempos de capacitación, permisos y reuniones del personal
          </p>
        </div>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Registro
        </Button>
      </div>

      <PausaTable
        pausas={pausas}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSearch={handleSearch}
      />

      <PausaForm
        open={formOpen}
        onOpenChange={handleFormOpenChange}
        pausa={selectedPausa}
        onSubmit={handleSubmit}
        empleados={empleados}
      />
    </div>
  );
}
