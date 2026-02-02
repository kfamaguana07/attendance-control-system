import { BaseApiClient } from './base/BaseApiClient';
import API_CONFIG from '../config/api.config';

/**
 * Interfaces que mapean las respuestas de la API de Turnos
 */

export interface TurnoApiResponse {
  id_t: number;
  nombre_t: string;
  descripcion_t: string;
  hora_inicio_t: string;
  hora_fin_t: string;
  total_t: string;
  tipo_t: string;
}

export interface CreateTurnoRequest {
  nombre_t: string;
  descripcion_t: string;
  hora_inicio_t: string;
  hora_fin_t: string;
  total_t: string;
  tipo_t: string;
}

export interface UpdateTurnoRequest {
  nombre_t?: string;
  descripcion_t?: string;
  hora_inicio_t?: string;
  hora_fin_t?: string;
  total_t?: string;
  tipo_t?: string;
}

export interface TurnoOperationResponse {
  success: boolean;
  message?: string;
  data?: TurnoApiResponse;
}

/**
 * Cliente para la API de Turnos
 * Puerto: 5003
 */
export class TurnosApiClient extends BaseApiClient {
  constructor() {
    const baseUrl = API_CONFIG.TURNOS.BASE_URL;
    if (!baseUrl) {
      throw new Error('TURNOS.BASE_URL is not configured in API_CONFIG');
    }

    super(baseUrl);
  }

  /**
   * GET /api/turnos/read_all
   * Obtiene la lista de todos los turnos
   */
  async getAllTurnos(): Promise<TurnoApiResponse[]> {
    return this.get<TurnoApiResponse[]>(
      API_CONFIG.TURNOS.ENDPOINTS.READ_ALL
    );
  }

  /**
   * GET /api/turnos/read_by_name/{nombre}
   * Busca turnos por nombre
   */
  async searchTurnosByName(nombre: string): Promise<TurnoApiResponse[]> {
    return this.get<TurnoApiResponse[]>(
      API_CONFIG.TURNOS.ENDPOINTS.READ_BY_NAME(nombre)
    );
  }

  /**
   * POST /api/turnos/insert
   * Crea un nuevo turno
   */
  async createTurno(data: CreateTurnoRequest): Promise<TurnoApiResponse> {
    return this.post<TurnoApiResponse, CreateTurnoRequest>(
      API_CONFIG.TURNOS.ENDPOINTS.INSERT,
      data
    );
  }

  /**
   * PUT /api/turnos/update/{id}
   * Actualiza un turno existente
   */
  async updateTurno(id: number, data: UpdateTurnoRequest): Promise<TurnoApiResponse> {
    return this.put<TurnoApiResponse, UpdateTurnoRequest>(
      API_CONFIG.TURNOS.ENDPOINTS.UPDATE(id),
      data
    );
  }

  /**
   * DELETE - No documentado en la API
   * Nota: Este endpoint no existe en la API según la documentación
   */
  async deleteTurno(id: number): Promise<void> {
    throw new Error('La API de Turnos no soporta eliminación. Funcionalidad pendiente de desarrollo.');
  }
}
