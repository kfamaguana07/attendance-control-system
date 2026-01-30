'use client';

import { useState, useEffect } from 'react';
import { Pausa } from '@/src/domain/entities/Pausa';
import { PausaForm } from '@/src/presentation/components/pausas/PausaForm';
import { PausaTable } from '@/src/presentation/components/pausas/PausaTable';
import { Button } from '@/src/presentation/components/ui/button';
import { TiemposFueraApiClient } from '@/src/infrastructure/api-clients/TiemposFueraApiClient';
import { Plus, CalendarIcon, Filter, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/src/infrastructure/utils/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/presentation/components/ui/popover";
import { Calendar } from "@/src/presentation/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/presentation/components/ui/select";
import { Card, CardContent } from "@/src/presentation/components/ui/card";
import { Label } from "@/src/presentation/components/ui/label";

export default function PausasPage() {
  const [pausas, setPausas] = useState<Pausa[]>([]);
  const [selectedPausa, setSelectedPausa] = useState<Pausa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [empleados, setEmpleados] = useState<Array<{ id: string; nombre: string }>>([]);
  const [dataSource, setDataSource] = useState<string>('');

  // Estados para filtros
  const [fechaInicio, setFechaInicio] = useState<Date>();
  const [fechaFin, setFechaFin] = useState<Date>();
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<string>("todos");
  const [showFilters, setShowFilters] = useState(false);

  // Repositorio para personal (temporal)
  // Cliente API para personal
  const apiClient = new TiemposFueraApiClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);

      // Obtener pausas desde el orchestrator
      const pausasResponse = await fetch('/api/orchestrator?resource=pausas');
      const pausasResult = await pausasResponse.json();

      // Obtener empleados de la API
      const empleadosApi = await apiClient.getEmpleados();
      const empleadosList = empleadosApi.map((e) => ({
        id: e.id.trim(),
        nombre: e.name.trim(),
      }));

      setEmpleados(empleadosList);

      if (pausasResult.success) {
        setPausas(pausasResult.data);
        setDataSource(pausasResult.source || 'Unknown');
      } else {
        toast.error('Error al cargar pausas: ' + pausasResult.error);
      }
    } catch (error) {
      toast.error('Error al cargar los datos');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadPausas = async () => {
    try {
      let url = '/api/orchestrator?resource=pausas';

      const queryParams = new URLSearchParams();
      if (empleadoSeleccionado && empleadoSeleccionado !== "todos") {
        queryParams.append('ci', empleadoSeleccionado);
      }
      if (fechaInicio) {
        queryParams.append('fecha_inicio', format(fechaInicio, "yyyy-MM-dd"));
      }
      if (fechaFin) {
        queryParams.append('fecha_fin', format(fechaFin, "yyyy-MM-dd"));
      } else if (fechaInicio) {
        // Si solo hay fecha inicio, asumimos busqueda por fecha especifica (inicio == fin) o rango abierto
        // Para cumplir requerimiento de busqueda por fecha, si no hay fin, enviamos la misma fecha si el usuario solo seleccionó un día
      }

      const queryString = queryParams.toString();
      if (queryString) {
        url += `&${queryString}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setPausas(result.data);
      } else {
        toast.error('Error al cargar pausas: ' + result.error);
      }
    } catch (error) {
      toast.error('Error al cargar los registros');
      console.error(error);
    }
  };

  const handleApplyFilters = () => {
    loadPausas();
  };

  const clearFilters = () => {
    setFechaInicio(undefined);
    setFechaFin(undefined);
    setEmpleadoSeleccionado("todos");
    // Recargar sin filtros (aunque loadPausas leera el estado actual que aun no se ha actualizado en este render cycle si no usamos useEffect o timeout, 
    // mejor llamar directo o usar useEffect para el reload, pero aqui llamaremos directo pasando params vacios simulados o esperando render)
    // Para simplificar, reseteamos estado y llamamos a una funcion que no dependa del estado o esperamos.
    // Hack rapido: llamar a fetch directo aqui o usar setTimeout. 
    // Mejor opcion: loadAllPausasClean()

    // Forzamos la recarga "limpia"
    fetch('/api/orchestrator?resource=pausas')
      .then(res => res.json())
      .then(result => {
        if (result.success) setPausas(result.data);
      });
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedPausa) {
        // Actualizar
        const response = await fetch('/api/orchestrator', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resource: 'pausas',
            id: selectedPausa.id,
            data: {
              estado: data.estado,
              subEstado: data.subEstado,
              observacion: data.observacion,
              empleadosIds: data.empleadosIds,
              fechaPausa: data.fechaPausa,
              horaInicio: data.horaInicio,
              horaFin: data.horaFin,
            }
          })
        });

        const result = await response.json();
        if (result.success) {
          toast.success('Registro actualizado exitosamente');
        } else {
          toast.error('Error al actualizar: ' + result.error);
        }
      } else {
        // Crear
        const response = await fetch('/api/orchestrator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resource: 'pausas',
            data: {
              estado: data.estado,
              subEstado: data.subEstado,
              observacion: data.observacion,
              empleadosIds: data.empleadosIds,
              fechaPausa: data.fechaPausa,
              horaInicio: data.horaInicio,
              horaFin: data.horaFin,
            }
          })
        });

        const result = await response.json();
        if (result.success) {
          toast.success('Registro creado exitosamente');
        } else {
          toast.error('Error al crear: ' + result.error);
        }
      }
      await loadPausas();
      setSelectedPausa(null);
      setFormOpen(false);
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
      const response = await fetch(`/api/orchestrator?resource=pausas&id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Registro eliminado exitosamente');
        await loadPausas();
      } else {
        toast.error('Error al eliminar: ' + result.error);
      }
    } catch (error) {
      toast.error('Error al eliminar el registro');
      console.error(error);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      if (!query.trim()) {
        await loadPausas();
        return;
      }

      const response = await fetch(`/api/orchestrator?resource=pausas&query=${encodeURIComponent(query)}`);
      const result = await response.json();

      if (result.success) {
        setPausas(result.data);
      } else {
        toast.error('Error en la búsqueda: ' + result.error);
      }
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

      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2">
          <Filter className="h-4 w-4" />
          {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
        </Button>
        {showFilters && (
          <Button variant="ghost" onClick={clearFilters} className="gap-2 text-destructive hover:text-destructive">
            <X className="h-4 w-4" />
            Limpiar
          </Button>
        )}
      </div>

      {showFilters && (
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="space-y-2">
                <Label>Fecha Inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fechaInicio && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaInicio ? format(fechaInicio, "PPP", { locale: es }) : <span>Seleccionar</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaInicio}
                      onSelect={setFechaInicio}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Fecha Fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fechaFin && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaFin ? format(fechaFin, "PPP", { locale: es }) : <span>Seleccionar</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaFin}
                      onSelect={setFechaFin}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Empleado</Label>
                <Select value={empleadoSeleccionado} onValueChange={setEmpleadoSeleccionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {empleados.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
            </div>
          </CardContent>
        </Card>
      )}

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
