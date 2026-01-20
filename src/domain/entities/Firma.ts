export class Firma {
  constructor(
    public fechaFirma: string, // Fecha de la firma
    public hIJornada: string | null, // Hora inicio jornada
    public aIJornada: string | null, // Atraso inicio jornada
    public hIBreak: string | null, // Hora inicio break
    public hFBreak: string | null, // Hora fin break
    public aFBreak: string | null, // Atraso fin break
    public hIAlmuerzo: string | null, // Hora inicio almuerzo
    public hFAlmuerzo: string | null, // Hora fin almuerzo
    public aFAlmuerzo: string | null, // Atraso fin almuerzo
    public hFJornada: string | null, // Hora fin jornada
    public ci: string, // Cédula del empleado
    public idT: number | null, // ID Turno
    public idB: number | null, // ID Break
    public idBa: number | null // ID Break Almuerzo
  ) {}

  /**
   * Calcula el tiempo transcurrido entre dos horas en formato HH:mm:ss
   */
  static calcularTiempoTranscurrido(horaInicio: string, horaFin: string): string {
    if (!horaInicio || !horaFin) return "00:00:00";

    const [hi, mi, si] = horaInicio.split(":").map(Number);
    const [hf, mf, sf] = horaFin.split(":").map(Number);

    const inicioEnSegundos = hi * 3600 + mi * 60 + si;
    const finEnSegundos = hf * 3600 + mf * 60 + sf;

    const diferenciaSegundos = finEnSegundos - inicioEnSegundos;

    const horas = Math.floor(diferenciaSegundos / 3600);
    const minutos = Math.floor((diferenciaSegundos % 3600) / 60);
    const segundos = diferenciaSegundos % 60;

    return `${String(horas).padStart(2, "0")}:${String(minutos).padStart(2, "0")}:${String(segundos).padStart(2, "0")}`;
  }

  /**
   * Obtiene el tiempo transcurrido del break
   */
  getTiempoBreak(): string {
    if (!this.hIBreak || !this.hFBreak) return "00:00:00";
    return Firma.calcularTiempoTranscurrido(this.hIBreak, this.hFBreak);
  }

  /**
   * Obtiene el tiempo transcurrido del almuerzo
   */
  getTiempoAlmuerzo(): string {
    if (!this.hIAlmuerzo || !this.hFAlmuerzo) return "00:00:00";
    return Firma.calcularTiempoTranscurrido(this.hIAlmuerzo, this.hFAlmuerzo);
  }
}
