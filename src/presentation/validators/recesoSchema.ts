import { z } from 'zod';

export const recesoSchema = z.object({
  id_t: z.number({
    required_error: 'El turno es requerido',
  }).min(1, 'Seleccione un turno válido'),
  
  nombre: z.string({
    required_error: 'El nombre es requerido',
  }).min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  
  tipo: z.enum(['BREAK', 'ALMUERZO'], {
    required_error: 'El tipo es requerido',
    invalid_type_error: 'El tipo debe ser BREAK o ALMUERZO',
  }),
  
  descripcion: z.string({
    required_error: 'La descripción es requerida',
  }).min(5, 'La descripción debe tener al menos 5 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  
  hora_inicio: z.string({
    required_error: 'La hora de inicio es requerida',
  }).regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Formato de hora inválido (HH:MM:SS)'),
  
  hora_fin: z.string({
    required_error: 'La hora de fin es requerida',
  }).regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Formato de hora inválido (HH:MM:SS)'),
  
  hora_total: z.string({
    required_error: 'La hora total es requerida',
  }).regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/, 'Formato de hora inválido (HH:MM:SS)'),
});

export type RecesoFormData = z.infer<typeof recesoSchema>;
