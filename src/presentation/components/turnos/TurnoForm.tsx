'use client';

import { useState, useEffect } from 'react';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { turnoSchema } from '@/src/presentation/validators/turnoSchema';
import { Turno } from '@/src/domain/entities/Turno';
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

interface TurnoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  turno?: Turno | null;
  onSubmit: (data: any) => Promise<void>;
}

const HORAS_OPTIONS = [
  '07:00:00', '07:30:00', '08:00:00', '08:30:00', '09:00:00', '09:30:00',
  '10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00',
  '13:00:00', '13:30:00', '14:00:00', '14:30:00', '15:00:00', '15:30:00',
  '16:00:00', '16:30:00', '17:00:00', '17:30:00', '18:00:00', '18:30:00',
  '19:00:00', '19:30:00', '20:00:00', '20:30:00'
];

function normalizeTimeToHHMMSS(value?: string | null): string {
  if (!value) return '';

  const trimmed = value.trim();
  // If API returns datetime/ISO, keep only the time portion.
  // Examples handled: "2026-02-01T07:00:00", "2026-02-01 07:00:00"
  const timePart = trimmed.includes('T')
    ? trimmed.split('T')[1]
    : trimmed.includes(' ')
      ? trimmed.split(' ')[trimmed.split(' ').length - 1]
      : trimmed;

  // Drop timezone/millis if present: "07:00:00.000Z" -> "07:00:00"
  const clean = timePart.replace(/Z$/i, '').split('.')[0];
  const parts = clean.split(':');

  if (parts.length === 2) {
    const [hh, mm] = parts;
    return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:00`;
  }

  if (parts.length >= 3) {
    const [hh, mm, ss] = parts;
    return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:${(ss ?? '00').padStart(2, '0')}`;
  }

  return '';
}

function normalizeTipo(value?: string | null): string {
  if (!value) return '';
  const upper = value.trim().toUpperCase();
  if (upper === 'N' || upper === 'NORMAL') return 'NORMAL';
  if (upper === 'A' || upper === 'ADICIONAL') return 'ADICIONAL';
  return upper;
}

export function TurnoForm({ open, onOpenChange, turno, onSubmit }: TurnoFormProps) {
  const [horaInicio, setHoraInicio] = useState(normalizeTimeToHHMMSS(turno?.horaInicio) || '');
  const [horaFin, setHoraFin] = useState(normalizeTimeToHHMMSS(turno?.horaFin) || '');
  const [horaTotal, setHoraTotal] = useState(normalizeTimeToHHMMSS(turno?.horaTotal) || '00:00:00');
  const [tipo, setTipo] = useState(normalizeTipo(turno?.tipo) || '');

  useEffect(() => {
    if (open) {
      if (turno) {
        setHoraInicio(normalizeTimeToHHMMSS(turno.horaInicio) || '');
        setHoraFin(normalizeTimeToHHMMSS(turno.horaFin) || '');
        setHoraTotal(normalizeTimeToHHMMSS(turno.horaTotal) || '00:00:00');
        setTipo(normalizeTipo(turno.tipo) || '');
      } else {
        setHoraInicio('');
        setHoraFin('');
        setHoraTotal('00:00:00');
        setTipo('');
      }
    }
  }, [open, turno]);

  useEffect(() => {
    if (horaInicio && horaFin && horaInicio !== '<<SELECCIONA>>' && horaFin !== '<<SELECCIONA>>') {
      const calculada = Turno.calcularHoraTotal(horaInicio, horaFin);
      setHoraTotal(calculada);
    } else {
      setHoraTotal('00:00:00');
    }
  }, [horaInicio, horaFin]);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: turnoSchema });
    },
    shouldValidate: 'onSubmit',
    shouldRevalidate: 'onInput',
    defaultValue: turno
      ? {
          horaInicio: turno.horaInicio,
          horaFin: turno.horaFin,
          horaTotal: turno.horaTotal,
          nombre: turno.nombre,
          descripcion: turno.descripcion,
          tipo: turno.tipo,
        }
      : undefined,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const submission = parseWithZod(formData, { schema: turnoSchema });

    if (submission.status !== 'success') {
      toast.error('Por favor, corrija los errores en el formulario');
      return;
    }

    try {
      await onSubmit(submission.value);
      onOpenChange(false);
    } catch (error) {
      toast.error('Error al guardar el turno');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setHoraInicio('');
      setHoraFin('');
      setHoraTotal('00:00:00');
      setTipo('');
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{turno ? 'Editar Turno' : 'Nuevo Turno'}</DialogTitle>
          <DialogDescription>
            {turno
              ? 'Modifique los datos del turno seleccionado'
              : 'Complete el formulario para registrar un nuevo turno'}
          </DialogDescription>
        </DialogHeader>
        <form id={form.id} onSubmit={handleSubmit} key={turno?.id || 'new'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna izquierda */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={fields.horaInicio.id}>
                  Hora Inicio <span className="text-destructive">*</span>
                </Label>
                <Select
                  name={fields.horaInicio.name}
                  value={horaInicio}
                  onValueChange={setHoraInicio}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="<<SELECCIONA>>" />
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
                  value={horaFin}
                  onValueChange={setHoraFin}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="<<SELECCIONA>>" />
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

              <div className="space-y-2">
                <Label htmlFor={fields.horaTotal.id}>Total</Label>
                <Input
                  id={fields.horaTotal.id}
                  name={fields.horaTotal.name}
                  value={horaTotal}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={fields.nombre.id}>
                  Nombre Turno <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={fields.nombre.id}
                  name={fields.nombre.name}
                  defaultValue={turno?.nombre}
                  placeholder="Ej: Turno Mañana"
                />
                {fields.nombre.errors && (
                  <p className="text-sm text-destructive">{fields.nombre.errors[0]}</p>
                )}
              </div>
            </div>

            {/* Columna derecha */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={fields.descripcion.id}>
                  Descripción <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id={fields.descripcion.id}
                  name={fields.descripcion.name}
                  defaultValue={turno?.descripcion}
                  placeholder="Ingrese una descripción del turno"
                  rows={5}
                  className="resize-none"
                />
                {fields.descripcion.errors && (
                  <p className="text-sm text-destructive">{fields.descripcion.errors[0]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={fields.tipo.id}>
                  Tipo <span className="text-destructive">*</span>
                </Label>
                <Select
                  name={fields.tipo.name}
                  value={tipo}
                  onValueChange={setTipo}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="<<SELECCIONA>>" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">NORMAL</SelectItem>
                    <SelectItem value="ADICIONAL">ADICIONAL</SelectItem>
                  </SelectContent>
                </Select>
                {fields.tipo.errors && (
                  <p className="text-sm text-destructive">{fields.tipo.errors[0]}</p>
                )}
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
              {turno ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

