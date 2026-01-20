export interface FirmaDTO {
  fechaFirma: string;
  hIJornada: string | null;
  aIJornada: string | null;
  hIBreak: string | null;
  hFBreak: string | null;
  aFBreak: string | null;
  hIAlmuerzo: string | null;
  hFAlmuerzo: string | null;
  aFAlmuerzo: string | null;
  hFJornada: string | null;
  ci: string;
  idT: number | null;
  idB: number | null;
  idBa: number | null;
  empleadoNombre?: string; // Nombre del empleado para mostrar
}
