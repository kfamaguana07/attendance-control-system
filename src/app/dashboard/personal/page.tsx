'use client';

import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/src/presentation/components/ui/button';
import { Input } from '@/src/presentation/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/src/presentation/components/ui/dialog';
import { Personal } from '@/src/domain/entities/Personal';
import { Area } from '@/src/domain/entities/Area';
import { MockAreaRepository } from '@/src/infrastructure/repositories/MockAreaRepository';
import { GetAllAreasUseCase } from '@/src/application/use-cases/GetAllAreasUseCase';
import { PersonalTable } from '@/src/presentation/components/personal/PersonalTable';
import { PersonalFormComplete } from '@/src/presentation/components/personal/PersonalFormComplete';

const areaRepository = new MockAreaRepository();
const getAllAreasUseCase = new GetAllAreasUseCase(areaRepository);

export default function PersonalPage() {
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [filteredPersonal, setFilteredPersonal] = useState<Personal[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPersonal, setSelectedPersonal] = useState<Personal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadPersonal = async () => {
    try {
      setIsLoading(true);
      
      // Cargar personal desde el orquestador
      const personalResponse = await fetch('/api/orchestrator?resource=personal');
      const personalResult = await personalResponse.json();
      
      if (!personalResult.success) {
        throw new Error(personalResult.error || 'Error al cargar personal');
      }
      
      // Convertir los datos al formato de Personal entity
      const personalData = personalResult.data.map((p: any) => new Personal(
        p.cl,
        p.ci,
        p.id_a,
        p.id_t,
        p.id_b,
        p.id_ba,
        p.nombres,
        p.apellidos,
        p.direccion,
        p.telefonos,
        p.correo,
        p.fechaNacimiento,
        p.fechaIngreso,
        p.fechaContrato,
        p.salario
      ));
      
      // Cargar áreas
      const areasData = await getAllAreasUseCase.execute();
      
      setPersonal(personalData);
      setFilteredPersonal(personalData);
      setAreas(areasData);
    } catch (error) {
      toast.error('Error al cargar personal', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPersonal();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPersonal(personal);
    } else {
      const filtered = personal.filter(p => 
        p.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ci.includes(searchTerm) ||
        p.correo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPersonal(filtered);
    }
  }, [searchTerm, personal]);

  const handleCreateSuccess = () => {
    setOpenModal(false);
    setSelectedPersonal(null);
    loadPersonal();
  };

  const handleSelectPersonal = (p: Personal) => {
    setSelectedPersonal(p);
    setOpenModal(true);
  };

  const handleNewPersonal = () => {
    setSelectedPersonal(null);
    setOpenModal(true);
  };

  const handleCancel = () => {
    setOpenModal(false);
    setSelectedPersonal(null);
  };

  const handleEdit = (p: Personal) => {
    setSelectedPersonal(p);
    setOpenModal(true);
  };

  const handleDelete = async (ci: string) => {
    try {
      const response = await fetch(`/api/orchestrator?resource=personal&id=${ci}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al eliminar personal');
      }
      
      toast.success('Personal eliminado exitosamente');
      loadPersonal();
    } catch (error) {
      toast.error('Error al eliminar personal', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personal</h1>
          <p className="text-muted-foreground mt-2">
            Gestión de empleados y personal del sistema
          </p>
        </div>
        <Button onClick={handleNewPersonal}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Personal
        </Button>
      </div>

      {/* Buscador */}
      <div className="border rounded-lg p-4 bg-white">
        <div className="flex items-center gap-2 max-w-md ml-auto">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, CI, correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>

      {/* Tabla de Personal */}
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-w-full">
            <PersonalTable 
            personal={filteredPersonal} 
            isLoading={isLoading}
            onSelectPersonal={handleSelectPersonal}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {/* Modal de Formulario */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPersonal ? 'Editar Personal' : 'Agregar Nuevo Personal'}
            </DialogTitle>
          </DialogHeader>
          <PersonalFormComplete
            selectedPersonal={selectedPersonal}
            onSuccess={handleCreateSuccess}
            onCancel={handleCancel}
            areas={areas}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
