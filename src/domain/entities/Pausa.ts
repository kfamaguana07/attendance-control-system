export interface PausaData {
  id?: number;
  estado: string;
  subEstado: string;
  observacion: string;
  empleadosIds: string[];
  fechaPausa: string;
  horaInicio: string;
  horaFin: string;
}

export class Pausa {
  constructor(
    public id: number,
    public estado: string,
    public subEstado: string,
    public observacion: string,
    public empleadosIds: string[],
    public fechaPausa: string,
    public horaInicio: string,
    public horaFin: string
  ) {}

  get nombreCompleto(): string {
    return `${this.estado} - ${this.subEstado}`;
  }

  static getSubEstadosPorEstado(estado: string): string[] {
    const subEstados: { [key: string]: string[] } = {
      'Capacitación': ['Interna', 'Externa', 'Online', 'Presencial'],
      'Permisos': ['Personal', 'Médico', 'Familiar', 'Otros'],
      'Reunión': ['Departamental', 'Gerencial', 'Cliente', 'Equipo'],
    };
    return subEstados[estado] || [];
  }
}
