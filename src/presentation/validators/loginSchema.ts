import { z } from 'zod';

export const loginSchema = z.object({
  ci: z.string({ required_error: 'La cédula es requerida' }).min(1, 'La cédula es requerida'),
  clave: z.string({ required_error: 'La contraseña es requerida' }).min(1, 'La contraseña es requerida'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
