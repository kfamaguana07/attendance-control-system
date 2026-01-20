import { Firma } from "@/src/domain/entities/Firma";
import { IFirmaRepository } from "@/src/domain/interfaces/IFirmaRepository";

export class MockFirmaRepository implements IFirmaRepository {
  private firmas: Map<string, Firma> = new Map();

  constructor() {
    // Inicializar con datos de ejemplo para hoy
    const today = new Date().toISOString().split("T")[0];
    const mockFirma = new Firma(
      today,
      "08:05:00", // Hora inicio jornada
      "00:05:00", // Atraso inicio (5 minutos)
      null, // Hora inicio break
      null, // Hora fin break
      null, // Atraso fin break
      null, // Hora inicio almuerzo
      null, // Hora fin almuerzo
      null, // Atraso fin almuerzo
      null, // Hora fin jornada
      "1234567890", // CI del empleado de ejemplo
      1, // ID Turno
      null, // ID Break
      null // ID Break Almuerzo
    );
    this.firmas.set(`${mockFirma.ci}-${today}`, mockFirma);
  }

  async getFirmaByEmpleadoAndFecha(ci: string, fecha: string): Promise<Firma | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const key = `${ci}-${fecha}`;
        resolve(this.firmas.get(key) || null);
      }, 100);
    });
  }

  async create(firma: Firma): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const key = `${firma.ci}-${firma.fechaFirma}`;
        this.firmas.set(key, firma);
        resolve();
      }, 100);
    });
  }

  async update(ci: string, fecha: string, firma: Firma): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const key = `${ci}-${fecha}`;
        if (this.firmas.has(key)) {
          this.firmas.set(key, firma);
        }
        resolve();
      }, 100);
    });
  }

  async getTodayFirma(ci: string): Promise<Firma | null> {
    const today = new Date().toISOString().split("T")[0];
    return this.getFirmaByEmpleadoAndFecha(ci, today);
  }
}
