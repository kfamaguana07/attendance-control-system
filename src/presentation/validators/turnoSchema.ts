import { z } from 'zod';

export const turnoSchema = z.object({
  horaInicio: z.string({ required_error: 'La hora de inicio es requerida' })
    .refine((val) => val !== '<<SELECCIONA>>', { message: 'Debe seleccionar una hora de inicio' }),
  horaFin: z.string({ required_error: 'La hora de fin es requerida' })
    .refine((val) => val !== '<<SELECCIONA>>', { message: 'Debe seleccionar una hora de fin' }),
  horaTotal: z.string().default('00:00:00'),
  nombre: z.string({ required_error: 'El nombre del turno es requerido' })
    .min(1, 'El nombre del turno es requerido')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  descripcion: z.string({ required_error: 'La descripción es requerida' })
    .min(1, 'La descripción es requerida')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  tipo: z.string({ required_error: 'El tipo es requerido' })
    .refine((val) => val !== '<<SELECCIONA>>', { message: 'Debe seleccionar un tipo' })
    .refine((val) => ['NORMAL', 'ADICIONAL'].includes(val), { 
      message: 'El tipo debe ser NORMAL o ADICIONAL' 
    }),
}).refine((data) => {
  if (data.horaInicio === '<<SELECCIONA>>' || data.horaFin === '<<SELECCIONA>>') {
    return true;
  }
  
  const [inicioHoras, inicioMinutos] = data.horaInicio.split(':').map(Number);
  const [finHoras, finMinutos] = data.horaFin.split(':').map(Number);
  
  const inicioEnMinutos = inicioHoras * 60 + inicioMinutos;
  const finEnMinutos = finHoras * 60 + finMinutos;
  
  return finEnMinutos !== inicioEnMinutos;
}, {
  message: 'La hora de fin debe ser diferente a la hora de inicio',
  path: ['horaFin'],
});

export type TurnoFormData = z.infer<typeof turnoSchema>;
