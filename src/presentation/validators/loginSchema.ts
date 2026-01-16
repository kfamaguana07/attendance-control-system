import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string({ required_error: 'El usuario es requerido' }).min(1, 'El usuario es requerido'),
  password: z.string({ required_error: 'La contraseña es requerida' }).min(1, 'La contraseña es requerida'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
