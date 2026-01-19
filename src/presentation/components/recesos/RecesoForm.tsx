'use client';

import { useState, useEffect } from 'react';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod';
import { recesoSchema } from '@/src/presentation/validators/recesoSchema';
import { Receso } from '@/src/domain/entities/Receso';
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

interface RecesoFormProps {
  receso?: Receso | null;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const HORAS_OPTIONS = [
  '07:00:00', '07:30:00', '08:00:00', '08:30:00', '09:00:00', '09:30:00',
  '10:00:00', '10:30:00', '11:00:00', '11:30:00', '12:00:00', '12:30:00',
  '13:00:00', '13:30:00', '14:00:00', '14:30:00', '15:00:00', '15:30:00',
  '16:00:00', '16:30:00', '17:00:00', '17:30:00', '18:00:00', '18:30:00',
  '19:00:00', '19:30:00', '20:00:00', '20:30:00'
];

const DURACION_OPTIONS = [
  '00:15:00',
  '00:30:00',
  '00:45:00',
  '01:00:00'
];

export function RecesoForm({ receso, onSubmit, onCancel }: RecesoFormProps) {
  const [horaInicio, setHoraInicio] = useState(receso?.hora_inicio || '');
  const [duracion, setDuracion] = useState(receso?.hora_fin || '');
  const [horaTotal, setHoraTotal] = useState(receso?.hora_total || '00:00:00');
  const [tipo, setTipo] = useState(receso?.tipo || '');
  const [turno, setTurno] = useState(receso?.id_t.toString() || '');

  useEffect(() => {
    if (receso) {
      setHoraInicio(receso.hora_inicio);
      setDuracion(receso.hora_fin);
      setHoraTotal(receso.hora_total);
      setTipo(receso.tipo);
      setTurno(receso.id_t.toString());
    } else {
      resetForm();
    }
  }, [receso]);

  useEffect(() => {
    if (horaInicio && duracion) {
      const total = calcularHoraTotal(horaInicio, duracion);
      setHoraTotal(total);
    }
  }, [horaInicio, duracion]);

  const calcularHoraTotal = (inicio: string, dur: string): string => {
    try {
      const [h1, m1, s1] = inicio.split(':').map(Number);
      const [h2, m2, s2] = dur.split(':').map(Number);

      const inicioEnSegundos = h1 * 3600 + m1 * 60 + s1;
      const duracionEnSegundos = h2 * 3600 + m2 * 60 + s2;
      const finEnSegundos = inicioEnSegundos + duracionEnSegundos;

      const horas = Math.floor(finEnSegundos / 3600);
      const minutos = Math.floor((finEnSegundos % 3600) / 60);
      const segundos = finEnSegundos % 60;

      return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
    } catch (error) {
      return '00:00:00';
    }
  };

  const resetForm = () => {
    setHoraInicio('');
    setDuracion('');
    setHoraTotal('00:00:00');
    setTipo('');
    setTurno('');
  };

  const [form, fields] = useForm({
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: recesoSchema });
    },
    shouldValidate: 'onBlur',
    shouldRevalidate: 'onInput',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const submission = parseWithZod(formData, { schema: recesoSchema });

    if (submission.status !== 'success') {
      toast.error('Error en el formulario', {
        description: 'Por favor revisa los campos',
      });
      return;
    }

    try {
      await onSubmit(submission.value);
      resetForm();
    } catch (error) {
      toast.error('Error al guardar', {
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  };

  return (
    <form id={form.id} onSubmit={handleSubmit} className="space-y-4" key={receso?.id || 'new'}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="id_t">Turno</Label>
          <Select
            key={`turno-${receso?.id || 'new'}`}
            name="id_t"
            value={turno}
            onValueChange={setTurno}
          >
            <SelectTrigger id="id_t">
              <SelectValue placeholder="Seleccione turno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Turno Mañana</SelectItem>
              <SelectItem value="2">Turno Tarde</SelectItem>
              <SelectItem value="3">Turno Noche</SelectItem>
            </SelectContent>
          </Select>
          {fields.id_t.errors && (
            <p className="text-sm text-destructive">{fields.id_t.errors}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo</Label>
          <Select
            key={`tipo-${receso?.id || 'new'}`}
            name="tipo"
            value={tipo}
            onValueChange={setTipo}
          >
            <SelectTrigger id="tipo">
              <SelectValue placeholder="Seleccione tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BREAK">BREAK</SelectItem>
              <SelectItem value="ALMUERZO">ALMUERZO</SelectItem>
            </SelectContent>
          </Select>
          {fields.tipo.errors && (
            <p className="text-sm text-destructive">{fields.tipo.errors}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre receso</Label>
        <Input
          id="nombre"
          name="nombre"
          defaultValue={receso?.nombre}
          placeholder="Ej: Break Mañana"
        />
        {fields.nombre.errors && (
          <p className="text-sm text-destructive">{fields.nombre.errors}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hora_inicio">Hora inicio</Label>
          <Select
            key={`hora-inicio-${receso?.id || 'new'}`}
            name="hora_inicio"
            value={horaInicio}
            onValueChange={setHoraInicio}
          >
            <SelectTrigger id="hora_inicio">
              <SelectValue placeholder="Seleccione hora" />
            </SelectTrigger>
            <SelectContent>
              {HORAS_OPTIONS.map((hora) => (
                <SelectItem key={hora} value={hora}>
                  {hora}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fields.hora_inicio.errors && (
            <p className="text-sm text-destructive">{fields.hora_inicio.errors}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="hora_fin">Tiempo receso</Label>
          <Select
            key={`duracion-${receso?.id || 'new'}`}
            name="hora_fin"
            value={duracion}
            onValueChange={setDuracion}
          >
            <SelectTrigger id="hora_fin">
              <SelectValue placeholder="Seleccione duración" />
            </SelectTrigger>
            <SelectContent>
              {DURACION_OPTIONS.map((dur) => (
                <SelectItem key={dur} value={dur}>
                  {dur}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fields.hora_fin.errors && (
            <p className="text-sm text-destructive">{fields.hora_fin.errors}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hora_total">Total</Label>
        <Input
          id="hora_total"
          name="hora_total"
          value={horaTotal}
          readOnly
          className="bg-muted"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          defaultValue={receso?.descripcion}
          placeholder="Descripción del receso"
          rows={3}
        />
        {fields.descripcion.errors && (
          <p className="text-sm text-destructive">{fields.descripcion.errors}</p>
        )}
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {receso ? 'Actualizar' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
}
