import { IFirmaRepository } from "@/src/domain/interfaces/IFirmaRepository";
import { Firma } from "@/src/domain/entities/Firma";

export class RegistrarFirmaUseCase {
  constructor(private firmaRepository: IFirmaRepository) {}

  async execute(ci: string, tipoFirma: string): Promise<void> {
    const today = new Date().toISOString().split("T")[0];
    const horaActual = new Date().toLocaleTimeString("es-ES", { hour12: false });

    // Obtener firma existente o crear nueva
    let firma = await this.firmaRepository.getTodayFirma(ci);

    if (!firma) {
      // Crear nueva firma del día
      firma = new Firma(
        today,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        ci,
        null,
        null,
        null
      );
    }

    // Actualizar según el tipo de firma
    switch (tipoFirma) {
      case "INICIO_JORNADA":
        firma.hIJornada = horaActual;
        // Calcular atraso si existe un turno asignado
        // Por ahora dejamos el cálculo básico
        firma.aIJornada = "00:00:00"; // TODO: calcular con turno asignado
        break;

      case "SALIDA_BREAK":
        firma.hIBreak = horaActual;
        break;

      case "REGRESO_BREAK":
        firma.hFBreak = horaActual;
        firma.aFBreak = "00:00:00"; // TODO: calcular atraso
        break;

      case "SALIDA_ALMUERZO":
        firma.hIAlmuerzo = horaActual;
        break;

      case "REGRESO_ALMUERZO":
        firma.hFAlmuerzo = horaActual;
        firma.aFAlmuerzo = "00:00:00"; // TODO: calcular atraso
        break;

      case "FIN_JORNADA":
        firma.hFJornada = horaActual;
        break;
    }

    // Guardar o actualizar
    if (await this.firmaRepository.getTodayFirma(ci)) {
      await this.firmaRepository.update(ci, today, firma);
    } else {
      await this.firmaRepository.create(firma);
    }
  }
}
