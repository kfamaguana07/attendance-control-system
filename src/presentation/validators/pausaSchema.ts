import { z } from 'zod';

export const pausaSchema = z.object({
  estado: z.string({ required_error: 'El estado es requerido' })
    .refine((val) => val !== '<<SELECCIONA>>', { message: 'Debe seleccionar un estado' })
    .refine((val) => ['Visita', 'Permisos', 'Reunion'].includes(val), {
      message: 'El estado debe ser Visita, Permisos o Reunion'
    }),
  subEstado: z.string({ required_error: 'El sub estado es requerido' })
    .refine((val) => val !== '<<SELECCIONA>>', { message: 'Debe seleccionar un sub estado' }),
  observacion: z.string({ required_error: 'La observación es requerida' })
    .min(1, 'La observación es requerida')
    .max(500, 'La observación no puede exceder 500 caracteres'),
  empleadosIds: z.array(z.string())
    .min(1, 'Debe seleccionar al menos un empleado'),
  fechaPausa: z.string({ required_error: 'La fecha es requerida' })
    .min(1, 'La fecha es requerida'),
  horaInicio: z.string({ required_error: 'La hora de inicio es requerida' })
    .min(1, 'La hora de inicio es requerida'),
  horaFin: z.string({ required_error: 'La hora de fin es requerida' })
    .min(1, 'La hora de fin es requerida'),
}).refine((data) => {
  const inicio = parseInt(data.horaInicio.replace(':', ''));
  const fin = parseInt(data.horaFin.replace(':', ''));
  return fin > inicio;
}, {
  message: 'La hora de fin debe ser mayor a la hora de inicio',
  path: ['horaFin'],
});

export type PausaFormData = z.infer<typeof pausaSchema>;
