export interface PausaDTO {
  id: number;
  estado: string;
  subEstado: string;
  observacion: string;
  empleadosIds: string[];
  fechaPausa: string;
  horaInicio: string;
  horaFin: string;
}

export interface CreatePausaDTO {
  estado: string;
  subEstado: string;
  observacion: string;
  empleadosIds: string[];
  fechaPausa: string;
  horaInicio: string;
  horaFin: string;
}

export interface UpdatePausaDTO {
  estado?: string;
  subEstado?: string;
  observacion?: string;
  empleadosIds?: string[];
  fechaPausa?: string;
  horaInicio?: string;
  horaFin?: string;
}
