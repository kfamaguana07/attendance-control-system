import { z } from 'zod';

export const personalSchema = z.object({
  ci: z.string({ required_error: 'El documento de identificación es requerido' }).min(1, 'El documento de identificación es requerido'),
  id_a: z.number({ required_error: 'El área es requerida', invalid_type_error: 'El área es requerida' }).int().positive('El área es requerida'),
  id_t: z.number({ required_error: 'El turno es requerido', invalid_type_error: 'El turno es requerido' }).int().positive('El turno es requerido'),
  id_b: z.number({ required_error: 'El break es requerido', invalid_type_error: 'El break es requerido' }).int().positive('El break es requerido'),
  id_ba: z.number({ required_error: 'El almuerzo es requerido', invalid_type_error: 'El almuerzo es requerido' }).int().positive('El almuerzo es requerido'),
  nombres: z.string({ required_error: 'Los nombres son requeridos' }).min(1, 'Los nombres son requeridos'),
  apellidos: z.string({ required_error: 'Los apellidos son requeridos' }).min(1, 'Los apellidos son requeridos'),
  direccion: z.string({ required_error: 'La dirección es requerida' }).min(1, 'La dirección es requerida'),
  telefonos: z.string({ required_error: 'El teléfono es requerido' }).min(1, 'El teléfono es requerido'),
  correo: z.string({ required_error: 'El correo electrónico es requerido' }).email('Correo electrónico inválido'),
  fechaNacimiento: z.string({ required_error: 'La fecha de nacimiento es requerida' }).min(1, 'La fecha de nacimiento es requerida'),
  fechaIngreso: z.string({ required_error: 'La fecha de ingreso es requerida' }).min(1, 'La fecha de ingreso es requerida'),
  fechaContrato: z.string({ required_error: 'La fecha de contrato es requerida' }).min(1, 'La fecha de contrato es requerida'),
  salario: z.number({ required_error: 'El salario es requerido', invalid_type_error: 'El salario debe ser un número válido' }).positive('El salario debe ser un número positivo'),
});

export type PersonalFormData = z.infer<typeof personalSchema>;
