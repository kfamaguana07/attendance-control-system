import { IRecesoRepository } from '@/src/domain/interfaces/IRecesoRepository';
import { Receso } from '@/src/domain/entities/Receso';
import { RecesosApiClient, RecesoApiResponse } from '../api-clients/RecesosApiClient';

/**
 * Repositorio real de Recesos que consume la API de Recesos
 * Implementa IRecesoRepository adaptando las respuestas de la API al modelo de dominio
 */
export class ApiRecesoRepository implements IRecesoRepository {
  private apiClient: RecesosApiClient;

  constructor() {
    this.apiClient = new RecesosApiClient();
  }

  /**
   * Convierte la respuesta de la API al modelo de dominio Receso
   */
  private mapApiResponseToDomain(apiReceso: RecesoApiResponse): Receso {
    return new Receso(
      apiReceso.id,
      apiReceso.id_t,
      apiReceso.hora_inicio,
      apiReceso.hora_fin,
      apiReceso.hora_total,
      apiReceso.nombre,
      apiReceso.descripcion,
      apiReceso.tipo
    );
  }

  /**
   * Obtiene todos los recesos
   */
  async getAll(): Promise<Receso[]> {
    try {
      const apiRecesos = await this.apiClient.getRecesos();
      return apiRecesos.map(r => this.mapApiResponseToDomain(r));
    } catch (error) {
      console.error('Error al obtener recesos:', error);
      throw new Error('No se pudo obtener la lista de recesos desde la API');
    }
  }

  /**
   * Obtiene un receso por ID
   * Nota: La API no tiene endpoint específico para obtener por ID,
   * así que filtramos del listado completo
   */
  async getById(id: number): Promise<Receso | null> {
    try {
      const allRecesos = await this.getAll();
      return allRecesos.find(r => r.id === id) || null;
    } catch (error) {
      console.error(`Error al obtener receso ${id}:`, error);
      return null;
    }
  }

  /**
   * Crea un nuevo receso
   */
  async create(recesoData: Omit<Receso, 'id'>): Promise<Receso> {
    try {
      const apiReceso = await this.apiClient.createReceso({
        id_t: Number(recesoData.id_t),
        hora_inicio: recesoData.hora_inicio,
        hora_fin: recesoData.hora_fin,
        hora_total: recesoData.hora_total,
        nombre: recesoData.nombre,
        descripcion: recesoData.descripcion,
        tipo: recesoData.tipo,
      });

      return this.mapApiResponseToDomain(apiReceso);
    } catch (error) {
      console.error('Error al crear receso:', error);
      throw new Error('No se pudo crear el receso');
    }
  }

  /**
   * Actualiza un receso existente
   */
  async update(id: number, recesoData: Partial<Receso>): Promise<Receso> {
    try {
      const updateData: any = { id };

      if (recesoData.id_t !== undefined) updateData.id_t = Number(recesoData.id_t);
      if (recesoData.hora_inicio !== undefined) updateData.hora_inicio = recesoData.hora_inicio;
      if (recesoData.hora_fin !== undefined) updateData.hora_fin = recesoData.hora_fin;
      if (recesoData.hora_total !== undefined) updateData.hora_total = recesoData.hora_total;
      if (recesoData.nombre !== undefined) updateData.nombre = recesoData.nombre;
      if (recesoData.descripcion !== undefined) updateData.descripcion = recesoData.descripcion;
      if (recesoData.tipo !== undefined) updateData.tipo = recesoData.tipo;

      const apiReceso = await this.apiClient.updateReceso(id, updateData);
      return this.mapApiResponseToDomain(apiReceso);
    } catch (error) {
      console.error(`Error al actualizar receso ${id}:`, error);
      throw new Error('No se pudo actualizar el receso');
    }
  }

  /**
   * Elimina un receso
   * Nota: La API no soporta eliminación según la documentación
   */
  async delete(id: number): Promise<void> {
    throw new Error('La API de Recesos no soporta eliminación. Funcionalidad pendiente de desarrollo.');
  }

  /**
   * Busca recesos por nombre
   */
  async search(query: string): Promise<Receso[]> {
    try {
      const apiRecesos = await this.apiClient.getRecesos(query);
      return apiRecesos.map(r => this.mapApiResponseToDomain(r));
    } catch (error) {
      console.error('Error al buscar recesos:', error);
      throw new Error('No se pudo realizar la búsqueda de recesos');
    }
  }
}
