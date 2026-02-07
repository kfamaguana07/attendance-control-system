import { IFirmaRepository } from '@/src/domain/interfaces/IFirmaRepository';
import { Firma } from '@/src/domain/entities/Firma';
import { FirmasApiClient, FirmaApiResponse, ProcesarFirmaRequest } from '../api-clients/FirmasApiClient';

/**
 * Repositorio para conectar con la API real de Firmas
 * Puerto: 5001
 */
export class ApiFirmaRepository implements IFirmaRepository {
  private apiClient: FirmasApiClient;

  constructor() {
    this.apiClient = new FirmasApiClient();
  }

  /**
   * Mapea una respuesta de la API a una entidad Firma
   */
  private mapApiResponseToFirma(apiResponse: FirmaApiResponse): Firma {
    return new Firma(
      apiResponse.fecha_firma,
      apiResponse.h_i_jornada,
      apiResponse.a_i_jornada,
      apiResponse.h_i_break,
      apiResponse.h_f_break,
      apiResponse.a_f_break,
      apiResponse.h_i_almuerzo,
      apiResponse.h_f_almuerzo,
      apiResponse.a_f_almuerzo,
      apiResponse.h_f_jornada,
      apiResponse.ci,
      apiResponse.id_t,
      apiResponse.id_b,
      apiResponse.id_ba
    );
  }

  /**
   * Obtiene la firma de hoy de un empleado
   */
  async getTodayFirma(ci: string): Promise<Firma | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await this.apiClient.getFirmaByEmpleadoAndFecha(ci, today);
      
      if (response.success && response.data) {
        return this.mapApiResponseToFirma(response.data);
      }
      
      return null;
    } catch (error: any) {
      // Si es un error 404, significa que no hay firma hoy, retorna null
      if (error.message?.includes('404')) {
        console.log(`No se encontró firma de hoy para CI: ${ci}`);
        return null;
      }
      console.error('Error al obtener firma de hoy:', error);
      // Para otros errores también retorna null para no romper la app
      return null;
    }
  }

  /**
   * Obtiene una firma por empleado y fecha
   */
  async getFirmaByEmpleadoAndFecha(ci: string, fecha: string): Promise<Firma | null> {
    try {
      const response = await this.apiClient.getFirmaByEmpleadoAndFecha(ci, fecha);
      
      if (response.success && response.data) {
        return this.mapApiResponseToFirma(response.data);
      }
      
      return null;
    } catch (error: any) {
      // Si es un error 404, significa que no existe firma, retorna null
      if (error.message?.includes('404')) {
        console.log(`No se encontró firma para CI: ${ci}, fecha: ${fecha}`);
        return null;
      }
      console.error('Error al obtener firma:', error);
      return null;
    }
  }

  /**
   * Crea una nueva firma (usa el endpoint procesar)
   */
  async create(firma: Firma): Promise<void> {
    try {
      const request: ProcesarFirmaRequest = {
        ci: firma.ci,
        fecha_firma: firma.fechaFirma,
        hora_actual: firma.hIJornada || undefined,
      };

      await this.apiClient.procesarFirma(request);
    } catch (error) {
      console.error('Error al crear firma:', error);
      throw error;
    }
  }

  /**
   * Actualiza una firma existente (usa el endpoint procesar)
   */
  async update(ci: string, fecha: string, firma: Firma): Promise<void> {
    try {
      const request: ProcesarFirmaRequest = {
        ci: ci,
        fecha_firma: fecha,
      };

      await this.apiClient.procesarFirma(request);
    } catch (error) {
      console.error('Error al actualizar firma:', error);
      throw error;
    }
  }

  /**
   * Procesa una firma automáticamente
   * Este es el método principal para registrar firmas
   */
  async procesarFirma(ci: string, fecha?: string, hora?: string): Promise<any> {
    try {
      const request: ProcesarFirmaRequest = {
        ci: ci,
        fecha_firma: fecha,
        hora_actual: hora,
      };

      return await this.apiClient.procesarFirma(request);
    } catch (error) {
      console.error('Error al procesar firma:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las firmas de hoy
   */
  async getFirmasHoy(): Promise<Firma[]> {
    try {
      const response = await this.apiClient.getFirmasHoy();
      
      if (response.success && response.data) {
        return response.data.map(apiResponse => this.mapApiResponseToFirma(apiResponse));
      }
      
      return [];
    } catch (error) {
      console.error('Error al obtener firmas de hoy:', error);
      return [];
    }
  }

  /**
   * Obtiene todas las firmas de una fecha
   */
  async getFirmasByFecha(fecha: string): Promise<Firma[]> {
    try {
      const response = await this.apiClient.getFirmasByFecha(fecha);
      
      if (response.success && response.data) {
        return response.data.map(apiResponse => this.mapApiResponseToFirma(apiResponse));
      }
      
      return [];
    } catch (error) {
      console.error('Error al obtener firmas por fecha:', error);
      return [];
    }
  }

  /**
   * Obtiene todas las firmas de un empleado
   */
  async getFirmasByEmpleado(ci: string): Promise<FirmaApiResponse[]> {
    try {
      const response = await this.apiClient.getFirmasByEmpleado(ci);
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error al obtener firmas del empleado:', error);
      return [];
    }
  }

  /**
   * Obtiene firmas incompletas
   */
  async getFirmasIncompletas(): Promise<FirmaApiResponse[]> {
    try {
      const response = await this.apiClient.getFirmasIncompletas();
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error al obtener firmas incompletas:', error);
      return [];
    }
  }
}
