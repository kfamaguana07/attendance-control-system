import { z } from "zod";

export const firmaSchema = z.object({
  firma: z.string().min(1, "Debes ingresar tu firma para registrar"),
});

export type FirmaFormData = z.infer<typeof firmaSchema>;
