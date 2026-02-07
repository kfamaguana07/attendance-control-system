"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/presentation/components/ui/card";
import { Button } from "@/src/presentation/components/ui/button";
import { Input } from "@/src/presentation/components/ui/input";
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
import { ApiPersonalRepository } from "@/src/infrastructure/repositories/ApiPersonalRepository";
import { ApiFirmaRepository } from "@/src/infrastructure/repositories/ApiFirmaRepository";
import { GetAllPersonalUseCase } from "@/src/application/use-cases/GetAllPersonalUseCase";
import { Separator } from "@/src/presentation/components/ui/separator";
import { FirmaApiResponse } from "@/src/infrastructure/api-clients/FirmasApiClient";

const personalRepository = new ApiPersonalRepository();
const firmaRepository = new ApiFirmaRepository();
const getAllPersonalUseCase = new GetAllPersonalUseCase(personalRepository);

interface ReporteData {
  ci: string;
  fechaFirma: string;
  nombres: string;
  apellidos: string;
  ingresoJornada: string;
  salidaJornada: string;
  inicioBreak: string;
  regresoBreak: string;
  inicioAlmuerzo: string;
  regresoAlmuerzo: string;
  atrasoJornada: string;
  atrasoBreak: string;
  atrasoAlmuerzo: string;
  observaciones: string;
}

export default function JornadaTotalPage() {
  const [fechaInicio, setFechaInicio] = useState<Date>();
  const [fechaFin, setFechaFin] = useState<Date>();
  const [empleados, setEmpleados] = useState<Array<{ ci: string; nombre: string }>>([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState<string>("todos");
  const [datos, setDatos] = useState<ReporteData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadEmpleados();
  }, []);

  const loadEmpleados = async () => {
    try {
      const personal = await getAllPersonalUseCase.execute();
      const empleadosList = personal.map((p) => ({
        ci: p.ci,
        nombre: `${p.nombres} ${p.apellidos}`,
      }));
      setEmpleados(empleadosList);
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  const handleConsultar = async () => {
    setIsLoading(true);
    try {
      // Obtener todas las firmas según los filtros
      let todasLasFirmas: FirmaApiResponse[] = [];
      
      // Si se seleccionó un empleado específico
      if (empleadoSeleccionado !== "todos") {
        todasLasFirmas = await firmaRepository.getFirmasByEmpleado(empleadoSeleccionado);
        
        // Filtrar por fechas si están seleccionadas
        if (fechaInicio && fechaFin) {
          const fechaInicioStr = format(fechaInicio, 'yyyy-MM-dd');
          const fechaFinStr = format(fechaFin, 'yyyy-MM-dd');
          todasLasFirmas = todasLasFirmas.filter((firma: FirmaApiResponse) => {
            const fechaFirma = firma.fecha_firma;
            return fechaFirma >= fechaInicioStr && fechaFirma <= fechaFinStr;
          });
        } else if (fechaInicio) {
          const fechaInicioStr = format(fechaInicio, 'yyyy-MM-dd');
          todasLasFirmas = todasLasFirmas.filter((firma: FirmaApiResponse) => 
            firma.fecha_firma >= fechaInicioStr
          );
        } else if (fechaFin) {
          const fechaFinStr = format(fechaFin, 'yyyy-MM-dd');
          todasLasFirmas = todasLasFirmas.filter((firma: FirmaApiResponse) => 
            firma.fecha_firma <= fechaFinStr
          );
        }
      } else {
        // Si no se seleccionó empleado, obtener por fecha
        if (fechaInicio && fechaFin) {
          // Obtener firmas para todas las fechas en el rango
          const fechaActual = new Date(fechaInicio);
          const fechaFinal = new Date(fechaFin);
          
          while (fechaActual <= fechaFinal) {
            const fechaStr = format(fechaActual, 'yyyy-MM-dd');
            const firmasDia = await firmaRepository.getFirmasByFecha(fechaStr);
            todasLasFirmas = [...todasLasFirmas, ...firmasDia];
            fechaActual.setDate(fechaActual.getDate() + 1);
          }
        } else if (fechaInicio) {
          // Solo fecha inicio, obtener esa fecha
          const fechaStr = format(fechaInicio, 'yyyy-MM-dd');
          todasLasFirmas = await firmaRepository.getFirmasByFecha(fechaStr);
        } else if (fechaFin) {
          // Solo fecha fin, obtener esa fecha
          const fechaStr = format(fechaFin, 'yyyy-MM-dd');
          todasLasFirmas = await firmaRepository.getFirmasByFecha(fechaStr);
        } else {
          // Sin fechas, obtener todas las firmas de hoy
          todasLasFirmas = await firmaRepository.getFirmasHoy();
        }
      }

      // Mapear los datos a la estructura de la tabla
      const datosFormateados: ReporteData[] = todasLasFirmas.map((firma: FirmaApiResponse) => ({
        ci: firma.ci,
        fechaFirma: firma.fecha_firma,
        nombres: firma.empleado?.nombres || '',
        apellidos: firma.empleado?.apellidos || '',
        ingresoJornada: firma.h_i_jornada || '-',
        salidaJornada: firma.h_f_jornada || '-',
        inicioBreak: firma.h_i_break || '-',
        regresoBreak: firma.h_f_break || '-',
        inicioAlmuerzo: firma.h_i_almuerzo || '-',
        regresoAlmuerzo: firma.h_f_almuerzo || '-',
        atrasoJornada: firma.a_i_jornada || '00:00:00',
        atrasoBreak: firma.a_f_break || '00:00:00',
        atrasoAlmuerzo: firma.a_f_almuerzo || '00:00:00',
        observaciones: firma.observacion || '',
      }));

      setDatos(datosFormateados);
      
      if (datosFormateados.length === 0) {
        toast.info("No se encontraron registros para los filtros seleccionados");
      } else {
        toast.success(`Se encontraron ${datosFormateados.length} registros`);
      }
    } catch (error) {
      toast.error("Error al consultar datos");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportar = () => {
    if (datos.length === 0) {
      toast.error("No hay datos para exportar");
      return;
    }

    try {
      // Crear CSV
      const headers = [
        "CI",
        "Fecha",
        "Nombres",
        "Apellidos",
        "Ingreso Jornada",
        "Salida Jornada",
        "Inicio Break",
        "Regreso Break",
        "Inicio Almuerzo",
        "Regreso Almuerzo",
        "Atraso Jornada",
        "Atraso Break",
        "Atraso Almuerzo",
        "Observaciones"
      ];

      const csvContent = [
        headers.join(","),
        ...datos.map(row => [
          row.ci,
          row.fechaFirma,
          row.nombres,
          row.apellidos,
          row.ingresoJornada,
          row.salidaJornada,
          row.inicioBreak,
          row.regresoBreak,
          row.inicioAlmuerzo,
          row.regresoAlmuerzo,
          row.atrasoJornada,
          row.atrasoBreak,
          row.atrasoAlmuerzo,
          `"${row.observaciones}"`
        ].join(","))
      ].join("\n");

      // Descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `reporte_jornada_total_${format(new Date(), 'yyyy-MM-dd_HHmmss')}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Reporte exportado exitosamente");
    } catch (error) {
      toast.error("Error al exportar el reporte");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reporte: Jornada Total</h1>
        <p className="text-muted-foreground mt-2">
          Consulta el reporte completo de las jornadas laborales
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
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
                    {empleados.map((emp) => (
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
              <Button onClick={handleExportar} variant="outline" className="gap-2">
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
                  <TableHead>CI</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Nombres</TableHead>
                  <TableHead>Apellidos</TableHead>
                  <TableHead>Ingreso</TableHead>
                  <TableHead>Salida</TableHead>
                  <TableHead>Inicio Break</TableHead>
                  <TableHead>Regreso Break</TableHead>
                  <TableHead>Inicio Almuerzo</TableHead>
                  <TableHead>Regreso Almuerzo</TableHead>
                  <TableHead>Atraso Jornada</TableHead>
                  <TableHead>Atraso Break</TableHead>
                  <TableHead>Atraso Almuerzo</TableHead>
                  <TableHead>Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {datos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={14} className="text-center text-muted-foreground py-8">
                      No hay datos para mostrar. Selecciona los filtros y presiona Consultar.
                    </TableCell>
                  </TableRow>
                ) : (
                  datos.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.ci}</TableCell>
                      <TableCell>{row.fechaFirma}</TableCell>
                      <TableCell>{row.nombres}</TableCell>
                      <TableCell>{row.apellidos}</TableCell>
                      <TableCell>{row.ingresoJornada}</TableCell>
                      <TableCell>{row.salidaJornada}</TableCell>
                      <TableCell>{row.inicioBreak}</TableCell>
                      <TableCell>{row.regresoBreak}</TableCell>
                      <TableCell>{row.inicioAlmuerzo}</TableCell>
                      <TableCell>{row.regresoAlmuerzo}</TableCell>
                      <TableCell>{row.atrasoJornada}</TableCell>
                      <TableCell>{row.atrasoBreak}</TableCell>
                      <TableCell>{row.atrasoAlmuerzo}</TableCell>
                      <TableCell>{row.observaciones}</TableCell>
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
