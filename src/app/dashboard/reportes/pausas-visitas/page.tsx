"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/presentation/components/ui/card";
import { Button } from "@/src/presentation/components/ui/button";
import { Label } from "@/src/presentation/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/presentation/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/presentation/components/ui/table";
import { Calendar } from "@/src/presentation/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/presentation/components/ui/popover";
import { CalendarIcon, Download, Search } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/src/infrastructure/utils/utils";
import { toast } from "sonner";
import { TiemposFueraApiClient } from "@/src/infrastructure/api-clients/TiemposFueraApiClient";
import { Separator } from "@/src/presentation/components/ui/separator";
import { ApiPausaRepository } from "@/src/infrastructure/repositories/ApiPausaRepository";
import { Personal } from "@/src/domain/entities/Personal";

const apiClient = new TiemposFueraApiClient();
const pausaRepository = new ApiPausaRepository();

interface ReportePausasData {
  tipo: string;
  subTipo: string;
  nombres: string;
  apellidos: string;
  ci: string;
  observacion: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  fechaEdicion: string;
  usuarioEdicion: string;
}

export default function PausasVisitasPage() {
  const [fechaInicio, setFechaInicio] = useState<Date>();
  const [fechaFin, setFechaFin] = useState<Date>();
  const [personalList, setPersonalList] = useState<Personal[]>([]);
  const [empleadosForSelect, setEmpleadosForSelect] = useState<Array<{ ci: string; nombre: string }>>([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<string>("todos");
  const [datos, setDatos] = useState<ReportePausasData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEmpleados();
  }, []);

  const loadEmpleados = async () => {
    try {
      // Obtener empleados de la API
      const empleadosApi = await apiClient.getEmpleados();

      const empleadosList = empleadosApi.map((e) => ({
        ci: e.id.trim(),
        nombre: e.name.trim(),
      }));
      setEmpleadosForSelect(empleadosList);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  const handleConsultar = async () => {
    if (!fechaInicio && !fechaFin && empleadoSeleccionado === "todos") {
      toast.error("Debes seleccionar al menos un filtro (Fecha o Empleado)");
      return;
    }

    setIsLoading(true);
    try {
      const filters = {
        ci: empleadoSeleccionado !== "todos" ? empleadoSeleccionado : undefined,
        fechaInicio: fechaInicio ? format(fechaInicio, "yyyy-MM-dd") : undefined,
        fechaFin: fechaFin ? format(fechaFin, "yyyy-MM-dd") : undefined,
      };

      const pausas = await pausaRepository.getFiltered(filters);

      const tableData: ReportePausasData[] = pausas.map((p) => {
        return {
          tipo: p.estado,
          subTipo: p.subEstado,
          nombres: p.empleadoNombre || "Desconocido",
          apellidos: "", // API de pausas retorna nombre completo en un solo campo
          ci: p.empleadosIds[0] || "",
          observacion: p.observacion,
          fecha: p.fechaPausa,
          horaInicio: p.horaInicio,
          horaFin: p.horaFin,
          fechaEdicion: "-", // No disponible en entidad Pausa actualmente
          usuarioEdicion: "Sistema", // No disponible en entidad Pausa actualmente
        };
      });

      setDatos(tableData);
      toast.success("Consulta realizada exitosamente");
    } catch (error) {
      toast.error("Error al consultar datos");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportar = () => {
    if (datos.length === 0) return;

    // Crear encabezados CSV
    const headers = [
      "Tipo",
      "Sub Tipo",
      "Nombres",
      "Apellidos",
      "CI",
      "Observación",
      "Fecha",
      "Hora Inicio",
      "Hora Fin",
      "Fecha Edición",
      "Usuario Edición"
    ];

    // Convertir datos a CSV
    const csvContent = [
      headers.join(","),
      ...datos.map(row => [
        `"${row.tipo}"`,
        `"${row.subTipo}"`,
        `"${row.nombres}"`,
        `"${row.apellidos}"`,
        `"${row.ci}"`,
        `"${row.observacion}"`,
        `"${row.fecha}"`,
        `"${row.horaInicio}"`,
        `"${row.horaFin}"`,
        `"${row.fechaEdicion}"`,
        `"${row.usuarioEdicion}"`
      ].join(","))
    ].join("\n");

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reporte_pausas_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Reporte exportado exitosamente");
  };

  const handleLimpiar = () => {
    setFechaInicio(undefined);
    setFechaFin(undefined);
    setEmpleadoSeleccionado("todos");
    setDatos([]);
    toast.success("Filtros limpiados");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reporte: Pausas / Visitas / Reuniones</h1>
        <p className="text-muted-foreground mt-2">
          Consulta el reporte de tiempos fuera del trabajo
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Filtros</CardTitle>
          <Button
            onClick={handleLimpiar}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground h-8"
          >
            Limpiar Filtros
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Fecha Inicio */}
              <div className="space-y-2">
                <Label>Fecha inicio:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fechaInicio && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaInicio ? (
                        format(fechaInicio, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
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

              {/* Fecha Fin */}
              <div className="space-y-2">
                <Label>Fecha fin:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fechaFin && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaFin ? (
                        format(fechaFin, "PPP", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
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

              {/* Empleados */}
              <div className="space-y-2">
                <Label>Empleados:</Label>
                <Select value={empleadoSeleccionado} onValueChange={setEmpleadoSeleccionado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {empleadosForSelect.map((emp) => (
                      <SelectItem key={emp.ci} value={emp.ci}>
                        {emp.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator orientation="vertical" className="hidden md:block" />

            {/* Botones */}
            <div className="flex flex-col gap-2 justify-center">
              <Button onClick={handleConsultar} disabled={isLoading} className="gap-2">
                <Search className="h-4 w-4" />
                {isLoading ? "Consultando..." : "Consultar"}
              </Button>
              <Button
                onClick={handleExportar}
                variant="outline"
                className="gap-2"
                disabled={datos.length === 0}
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de resultados */}
      <Card>
        <CardHeader>
          <CardTitle>Resultados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Sub Tipo</TableHead>
                  <TableHead>Nombres</TableHead>
                  <TableHead>Apellidos</TableHead>
                  <TableHead>CI</TableHead>
                  <TableHead>Observación</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora Inicio</TableHead>
                  <TableHead>Hora Fin</TableHead>
                  <TableHead>Fecha Edición</TableHead>
                  <TableHead>Usuario Edición</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                      No hay datos para mostrar. Selecciona los filtros y presiona Consultar.
                    </TableCell>
                  </TableRow>
                ) : (
                  datos.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.tipo}</TableCell>
                      <TableCell>{row.subTipo}</TableCell>
                      <TableCell>{row.nombres}</TableCell>
                      <TableCell>{row.apellidos}</TableCell>
                      <TableCell>{row.ci}</TableCell>
                      <TableCell>{row.observacion}</TableCell>
                      <TableCell>{row.fecha}</TableCell>
                      <TableCell>{row.horaInicio}</TableCell>
                      <TableCell>{row.horaFin}</TableCell>
                      <TableCell>{row.fechaEdicion}</TableCell>
                      <TableCell>{row.usuarioEdicion}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
