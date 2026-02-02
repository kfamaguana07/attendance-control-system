import { BaseApiClient } from './base/BaseApiClient';
import API_CONFIG from '../config/api.config';

/**
 * Interfaces que mapean las respuestas de la API de Recesos
 */

export interface RecesoApiResponse {
  id: number;
  id_t: number;
  hora_inicio: string;
  hora_fin: string;
  hora_total: string;
  nombre: string;
  descripcion: string;
  tipo: string;
}

export interface CreateRecesoRequest {
  id_t: number;
  hora_inicio: string;
  hora_fin: string;
  hora_total: string;
  nombre: string;
  descripcion: string;
  tipo: string;
}

export interface UpdateRecesoRequest {
  id?: number;
  id_t?: number;
  hora_inicio?: string;
  hora_fin?: string;
  hora_total?: string;
  nombre?: string;
  descripcion?: string;
  tipo?: string;
}

export interface RecesoOperationResponse {
  success: boolean;
  message?: string;
  data?: RecesoApiResponse;
}

/**
 * Cliente para la API de Recesos
 * Puerto: 5002
 */
export class RecesosApiClient extends BaseApiClient {
  constructor() {
    const baseUrl = API_CONFIG.RECESOS.BASE_URL;
    if (!baseUrl) {
      throw new Error('RECESOS.BASE_URL is not configured in API_CONFIG');
    }

    super(baseUrl);
  }

  /**
   * GET /recesos
   * Obtiene la lista de todos los recesos o filtra por nombre
   */
  async getRecesos(nombre?: string): Promise<RecesoApiResponse[]> {
    const params = nombre ? { nombre } : undefined;
    return this.get<RecesoApiResponse[]>(
      API_CONFIG.RECESOS.ENDPOINTS.RECESOS,
      params
    );
  }

  /**
   * POST /recesos
   * Crea un nuevo receso
   */
  async createReceso(data: CreateRecesoRequest): Promise<RecesoApiResponse> {
    return this.post<RecesoApiResponse, CreateRecesoRequest>(
      API_CONFIG.RECESOS.ENDPOINTS.RECESOS,
      data
    );
  }

  /**
   * PUT /recesos/{receso_id}
   * Actualiza un receso existente
   */
  async updateReceso(id: number, data: UpdateRecesoRequest): Promise<RecesoApiResponse> {
    return this.put<RecesoApiResponse, UpdateRecesoRequest>(
      API_CONFIG.RECESOS.ENDPOINTS.RECESO_BY_ID(id),
      data
    );
  }

  /**
   * DELETE /recesos/{receso_id}
   * Nota: Este endpoint no existe en la API según la documentación
   */
  async deleteReceso(id: number): Promise<void> {
    throw new Error('La API de Recesos no soporta eliminación. Funcionalidad pendiente de desarrollo.');
  }
}
