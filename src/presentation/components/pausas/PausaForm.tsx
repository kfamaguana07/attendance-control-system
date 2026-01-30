'use client';

import { useState, useEffect } from 'react';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { pausaSchema } from '@/src/presentation/validators/pausaSchema';
import { Pausa } from '@/src/domain/entities/Pausa';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/presentation/components/ui/dialog';
import { Label } from '@/src/presentation/components/ui/label';
import { Input } from '@/src/presentation/components/ui/input';
import { Textarea } from '@/src/presentation/components/ui/textarea';
import { Button } from '@/src/presentation/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/presentation/components/ui/select';
import { toast } from 'sonner';

interface PausaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pausa?: Pausa | null;
  onSubmit: (data: any) => Promise<void>;
  empleados: Array<{ id: string; nombre: string }>;
}

const ESTADOS_OPTIONS = ['Visita', 'Permisos', 'Reunion'];
const HORAS_OPTIONS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export function PausaForm({ open, onOpenChange, pausa, onSubmit, empleados }: PausaFormProps) {
  const [estado, setEstado] = useState('');
  const [subEstado, setSubEstado] = useState('');
  const [subEstadosDisponibles, setSubEstadosDisponibles] = useState<string[]>([]);
  const [empleadosSeleccionados, setEmpleadosSeleccionados] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      if (pausa) {
        setEstado(pausa.estado);
        setSubEstado(pausa.subEstado);
        setEmpleadosSeleccionados(pausa.empleadosIds);
        setSubEstadosDisponibles(Pausa.getSubEstadosPorEstado(pausa.estado));
      } else {
        setEstado('');
        setSubEstado('');
        setEmpleadosSeleccionados([]);
        setSubEstadosDisponibles([]);
      }
    }
  }, [open, pausa]);

  useEffect(() => {
    if (estado && estado !== '<<SELECCIONA>>') {
      const subEstados = Pausa.getSubEstadosPorEstado(estado);
      setSubEstadosDisponibles(subEstados);
    } else {
      setSubEstadosDisponibles([]);
    }
  }, [estado]);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: pausaSchema });
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    defaultValue: pausa
      ? {
        estado: pausa.estado,
        subEstado: pausa.subEstado,
        observacion: pausa.observacion,
        empleadosIds: pausa.empleadosIds,
        fechaPausa: pausa.fechaPausa,
        horaInicio: pausa.horaInicio,
        horaFin: pausa.horaFin,
      }
      : undefined,
  });

  const handleEstadoChange = (value: string) => {
    setEstado(value);
    setSubEstado('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Agregar empleados seleccionados al formData
    formData.delete('empleadosIds');
    empleadosSeleccionados.forEach(id => {
      formData.append('empleadosIds', id);
    });

    const submission = parseWithZod(formData, { schema: pausaSchema });

    if (submission.status !== 'success') {
      toast.error('Por favor, corrija los errores en el formulario');
      return;
    }

    try {
      await onSubmit(submission.value);
      onOpenChange(false);
    } catch (error) {
      toast.error('Error al guardar el registro');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setEstado('');
      setSubEstado('');
      setEmpleadosSeleccionados([]);
    }
    onOpenChange(newOpen);
  };

  const toggleEmpleado = (empleadoId: string) => {
    setEmpleadosSeleccionados(prev =>
      prev.includes(empleadoId)
        ? prev.filter(id => id !== empleadoId)
        : [...prev, empleadoId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{pausa ? 'Editar Tiempo Fuera de Trabajo' : 'Nuevo Tiempo Fuera de Trabajo'}</DialogTitle>
          <DialogDescription>
            {pausa
              ? 'Modifique los datos del registro seleccionado'
              : 'Complete el formulario para registrar un nuevo tiempo fuera de trabajo'}
          </DialogDescription>
        </DialogHeader>
        <form id={form.id} onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={fields.estado.id}>
                  Estado <span className="text-destructive">*</span>
                </Label>
                <Select
                  name={fields.estado.name}
                  value={estado}
                  onValueChange={handleEstadoChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="<<SELECCIONA>>" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS_OPTIONS.map((est) => (
                      <SelectItem key={est} value={est}>
                        {est}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fields.estado.errors && (
                  <p className="text-sm text-destructive">{fields.estado.errors[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={fields.subEstado.id}>
                  Sub Estado <span className="text-destructive">*</span>
                </Label>
                <Select
                  name={fields.subEstado.name}
                  value={subEstado}
                  onValueChange={setSubEstado}
                  disabled={!estado || estado === '<<SELECCIONA>>'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="<<SELECCIONA>>" />
                  </SelectTrigger>
                  <SelectContent>
                    {subEstadosDisponibles.map((subEst) => (
                      <SelectItem key={subEst} value={subEst}>
                        {subEst}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fields.subEstado.errors && (
                  <p className="text-sm text-destructive">{fields.subEstado.errors[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>
                  Empleados <span className="text-destructive">*</span>
                </Label>
                <div className="border rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                  {empleados.map((empleado) => (
                    <div key={empleado.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`emp-${empleado.id}`}
                        checked={empleadosSeleccionados.includes(empleado.id)}
                        onChange={() => toggleEmpleado(empleado.id)}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={`emp-${empleado.id}`} className="text-sm cursor-pointer">
                        {empleado.nombre}
                      </label>
                    </div>
                  ))}
                </div>
                {fields.empleadosIds.errors && (
                  <p className="text-sm text-destructive">{fields.empleadosIds.errors[0]}</p>
                )}
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={fields.observacion.id}>
                  Observación <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id={fields.observacion.id}
                  name={fields.observacion.name}
                  defaultValue={pausa?.observacion}
                  placeholder="Ingrese una observación"
                  rows={5}
                  className="resize-none"
                />
                {fields.observacion.errors && (
                  <p className="text-sm text-destructive">{fields.observacion.errors[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={fields.fechaPausa.id}>
                  Fecha <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  id={fields.fechaPausa.id}
                  name={fields.fechaPausa.name}
                  defaultValue={pausa?.fechaPausa}
                />
                {fields.fechaPausa.errors && (
                  <p className="text-sm text-destructive">{fields.fechaPausa.errors[0]}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={fields.horaInicio.id}>
                    Hora Inicio <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    name={fields.horaInicio.name}
                    defaultValue={pausa?.horaInicio}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {HORAS_OPTIONS.map((hora) => (
                        <SelectItem key={hora} value={hora}>
                          {hora}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fields.horaInicio.errors && (
                    <p className="text-sm text-destructive">{fields.horaInicio.errors[0]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={fields.horaFin.id}>
                    Hora Fin <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    name={fields.horaFin.name}
                    defaultValue={pausa?.horaFin}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {HORAS_OPTIONS.map((hora) => (
                        <SelectItem key={hora} value={hora}>
                          {hora}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fields.horaFin.errors && (
                    <p className="text-sm text-destructive">{fields.horaFin.errors[0]}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {pausa ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
