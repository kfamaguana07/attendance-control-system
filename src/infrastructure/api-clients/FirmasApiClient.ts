import { BaseApiClient } from './base/BaseApiClient';
import API_CONFIG from '../config/api.config';

/**
 * Interfaces que mapean las respuestas de la API de Firmas
 */

export interface FirmaApiResponse {
  id_f?: number;
  fecha_firma: string;
  h_i_jornada: string | null;
  a_i_jornada: string | null;
  h_i_break: string | null;
  h_f_break: string | null;
  a_f_break: string | null;
  h_i_almuerzo: string | null;
  h_f_almuerzo: string | null;
  a_f_almuerzo: string | null;
  h_f_jornada: string | null;
  ci: string;
  id_t: number | null;
  id_b: number | null;
  id_ba: number | null;
  observacion?: string | null;
  empleado?: {
    ci: string;
    nombres: string;
    apellidos: string;
  };
  turno?: {
    id_t: number;
    nombre_t: string;
  };
}

export interface FirmaListResponse {
  success: boolean;
  data: FirmaApiResponse[];
  total: number;
  message?: string;
}

export interface FirmaSingleResponse {
  success: boolean;
  data: FirmaApiResponse;
  message?: string;
}

export interface FirmaHoyResponse {
  success: boolean;
  data: FirmaApiResponse[];
  total: number;
  fecha: string;
  message?: string;
}

export interface FirmaIncompletasResponse {
  success: boolean;
  data: FirmaApiResponse[];
  total: number;
  message?: string;
}

export interface IniciarJornadaRequest {
  ci: string;
  fecha_firma?: string;
  h_i_jornada?: string;
  a_i_jornada?: string;
}

export interface ProcesarFirmaRequest {
  ci: string;
  fecha_firma?: string;
  hora_actual?: string;
}

export interface ProcesarFirmaResponse {
  success: boolean;
  message?: string;
  error?: string;
  evento?: string;
  data?: FirmaApiResponse;
  detalles?: {
    hora_registro?: string;
    hora_esperada?: string;
    atraso?: string;
    hora_regreso_break?: string;
    hora_esperada_regreso?: string;
    hora_regreso_almuerzo?: string;
  };
}

export interface UpdateFirmaRequest {
  h_i_jornada?: string;
  a_i_jornada?: string;
  h_i_break?: string;
  h_f_break?: string;
  a_f_break?: string;
  h_i_almuerzo?: string;
  h_f_almuerzo?: string;
  a_f_almuerzo?: string;
  h_f_jornada?: string;
  observacion?: string;
}

export interface AutocompletarResponse {
  success: boolean;
  message: string;
  total: number;
  firmas_completadas: Array<{
    id_f: number;
    ci: string;
    fecha: string;
    observacion: string;
  }>;
}

export interface HealthResponse {
  success: boolean;
  message: string;
  status: string;
  timestamp: string;
}

export interface FirmaOperationResponse {
  success: boolean;
  message: string;
  data?: FirmaApiResponse;
}

/**
 * Cliente para la API de Firmas
 * Puerto: 5001
 */
export class FirmasApiClient extends BaseApiClient {
  constructor() {
    const baseUrl = API_CONFIG.FIRMAS.BASE_URL;
    if (!baseUrl) {
      throw new Error('FIRMAS.BASE_URL is not configured in API_CONFIG');
    }

    super(baseUrl);
  }

  /**
   * GET /api/health
   * Verifica que la API está funcionando
   */
  async health(): Promise<HealthResponse> {
    return this.get<HealthResponse>(API_CONFIG.FIRMAS.ENDPOINTS.HEALTH);
  }

  /**
   * GET /api/firmas
   * Obtiene todas las firmas
   */
  async getAllFirmas(): Promise<FirmaListResponse> {
    return this.get<FirmaListResponse>(API_CONFIG.FIRMAS.ENDPOINTS.FIRMAS);
  }

  /**
   * GET /api/firmas/hoy
   * Obtiene las firmas de hoy
   */
  async getFirmasHoy(): Promise<FirmaHoyResponse> {
    return this.get<FirmaHoyResponse>(API_CONFIG.FIRMAS.ENDPOINTS.HOY);
  }

  /**
   * GET /api/firmas/{id_f}
   * Obtiene una firma por ID
   */
  async getFirmaById(id: number): Promise<FirmaSingleResponse> {
    return this.get<FirmaSingleResponse>(
      API_CONFIG.FIRMAS.ENDPOINTS.BY_ID(id)
    );
  }

  /**
   * GET /api/firmas/empleado/{ci}
   * Obtiene todas las firmas de un empleado
   */
  async getFirmasByEmpleado(ci: string): Promise<FirmaListResponse> {
    return this.get<FirmaListResponse>(
      API_CONFIG.FIRMAS.ENDPOINTS.BY_EMPLEADO(ci)
    );
  }

  /**
   * GET /api/firmas/empleado/{ci}/fecha/{fecha}
   * Obtiene la firma de un empleado en una fecha específica
   */
  async getFirmaByEmpleadoAndFecha(
    ci: string,
    fecha: string
  ): Promise<FirmaSingleResponse> {
    return this.get<FirmaSingleResponse>(
      API_CONFIG.FIRMAS.ENDPOINTS.BY_EMPLEADO_FECHA(ci, fecha)
    );
  }

  /**
   * GET /api/firmas/fecha/{fecha}
   * Obtiene todas las firmas de una fecha
   */
  async getFirmasByFecha(fecha: string): Promise<FirmaListResponse> {
    return this.get<FirmaListResponse>(
      API_CONFIG.FIRMAS.ENDPOINTS.BY_FECHA(fecha)
    );
  }

  /**
   * GET /api/firmas/incompletas
   * Obtiene las firmas incompletas
   */
  async getFirmasIncompletas(): Promise<FirmaIncompletasResponse> {
    return this.get<FirmaIncompletasResponse>(
      API_CONFIG.FIRMAS.ENDPOINTS.INCOMPLETAS
    );
  }

  /**
   * POST /api/firmas/iniciar-jornada
   * Inicia la jornada de un empleado (manual)
   */
  async iniciarJornada(
    data: IniciarJornadaRequest
  ): Promise<FirmaOperationResponse> {
    return this.post<FirmaOperationResponse, IniciarJornadaRequest>(
      API_CONFIG.FIRMAS.ENDPOINTS.INICIAR_JORNADA,
      data
    );
  }

  /**
   * POST /api/firmas/procesar
   * Procesa una firma automáticamente (detecta el evento)
   */
  async procesarFirma(
    data: ProcesarFirmaRequest
  ): Promise<ProcesarFirmaResponse> {
    return this.post<ProcesarFirmaResponse, ProcesarFirmaRequest>(
      API_CONFIG.FIRMAS.ENDPOINTS.PROCESAR,
      data
    );
  }

  /**
   * PUT /api/firmas/{id_f}
   * Actualiza una firma manualmente
   */
  async updateFirma(
    id: number,
    data: UpdateFirmaRequest
  ): Promise<FirmaOperationResponse> {
    return this.put<FirmaOperationResponse, UpdateFirmaRequest>(
      API_CONFIG.FIRMAS.ENDPOINTS.UPDATE(id),
      data
    );
  }

  /**
   * PUT /api/firmas/autocompletar
   * Autocompleta firmas pendientes
   */
  async autocompletar(): Promise<AutocompletarResponse> {
    return this.put<AutocompletarResponse, {}>(
      API_CONFIG.FIRMAS.ENDPOINTS.AUTOCOMPLETAR,
      {}
    );
  }

  /**
   * DELETE /api/firmas/{id_f}
   * Elimina una firma
   */
  async deleteFirma(id: number): Promise<FirmaOperationResponse> {
    return this.delete<FirmaOperationResponse>(
      API_CONFIG.FIRMAS.ENDPOINTS.DELETE(id)
    );
  }
}
