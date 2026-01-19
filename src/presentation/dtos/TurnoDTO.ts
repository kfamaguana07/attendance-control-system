export interface TurnoDTO {
  id: number;
  horaInicio: string;
  horaFin: string;
  horaTotal: string;
  nombre: string;
  descripcion: string;
  tipo: string;
}

export interface CreateTurnoDTO {
  horaInicio: string;
  horaFin: string;
  horaTotal: string;
  nombre: string;
  descripcion: string;
  tipo: string;
}

export interface UpdateTurnoDTO {
  horaInicio?: string;
  horaFin?: string;
  horaTotal?: string;
  nombre?: string;
  descripcion?: string;
  tipo?: string;
}
