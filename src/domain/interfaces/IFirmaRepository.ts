import { Firma } from "../entities/Firma";

export interface IFirmaRepository {
  getFirmaByEmpleadoAndFecha(ci: string, fecha: string): Promise<Firma | null>;
  create(firma: Firma): Promise<void>;
  update(ci: string, fecha: string, firma: Firma): Promise<void>;
  getTodayFirma(ci: string): Promise<Firma | null>;
}
