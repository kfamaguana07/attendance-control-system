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
    public horaFin: string,
    public empleadoNombre?: string
  ) { }

  get nombreCompleto(): string {
    return `${this.estado} - ${this.subEstado}`;
  }

  static getSubEstadosPorEstado(estado: string): string[] {
    const subEstados: { [key: string]: string[] } = {
      'Visita': ['V_proveedores', 'V_clientes'],
      'Permisos': ['P_con_descuento', 'P_sin_descuento'],
      'Reunión': ['R_interna', 'R_externa'],
    };
    return subEstados[estado] || [];
  }
}
