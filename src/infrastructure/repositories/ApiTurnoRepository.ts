import { ITurnoRepository } from '@/src/domain/interfaces/ITurnoRepository';
import { Turno } from '@/src/domain/entities/Turno';
import { TurnosApiClient, TurnoApiResponse } from '../api-clients/TurnosApiClient';

/**
 * Repositorio real de Turnos que consume la API de Turnos
 * Implementa ITurnoRepository adaptando las respuestas de la API al modelo de dominio
 */
export class ApiTurnoRepository implements ITurnoRepository {
  private apiClient: TurnosApiClient;

  constructor() {
    this.apiClient = new TurnosApiClient();
  }

  /**
   * Convierte la respuesta de la API al modelo de dominio Turno
   */
  private normalizeTimeToHHMMSS(value: string | null | undefined): string {
    if (!value) return '';

    const trimmed = value.trim();
    const timePart = trimmed.includes('T')
      ? trimmed.split('T')[1]
      : trimmed.includes(' ')
        ? trimmed.split(' ')[trimmed.split(' ').length - 1]
        : trimmed;

    const clean = timePart.replace(/Z$/i, '').split('.')[0];
    const parts = clean.split(':');

    if (parts.length === 2) {
      const [hh, mm] = parts;
      return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:00`;
    }

    if (parts.length >= 3) {
      const [hh, mm, ss] = parts;
      return `${hh.padStart(2, '0')}:${mm.padStart(2, '0')}:${(ss ?? '00').padStart(2, '0')}`;
    }

    return '';
  }

  private normalizeTipo(value: string | null | undefined): string {
    if (!value) return '';
    const upper = value.trim().toUpperCase();
    if (upper === 'N' || upper === 'NORMAL') return 'NORMAL';
    if (upper === 'A' || upper === 'ADICIONAL') return 'ADICIONAL';
    return upper;
  }

  private mapApiResponseToDomain(apiTurno: TurnoApiResponse): Turno {
    return new Turno(
      apiTurno.id_t,
      this.normalizeTimeToHHMMSS(apiTurno.hora_inicio_t),
      this.normalizeTimeToHHMMSS(apiTurno.hora_fin_t),
      this.normalizeTimeToHHMMSS(apiTurno.total_t),
      apiTurno.nombre_t,
      apiTurno.descripcion_t,
      this.normalizeTipo(apiTurno.tipo_t)
    );
  }

  /**
   * Obtiene todos los turnos
   */
  async getAll(): Promise<Turno[]> {
    try {
      const apiTurnos = await this.apiClient.getAllTurnos();
      return apiTurnos.map(t => this.mapApiResponseToDomain(t));
    } catch (error) {
      console.error('Error al obtener turnos:', error);
      throw new Error('No se pudo obtener la lista de turnos desde la API');
    }
  }

  /**
   * Obtiene un turno por ID
   * Nota: La API no tiene endpoint específico para obtener por ID,
   * así que filtramos del listado completo
   */
  async getById(id: number): Promise<Turno | null> {
    try {
      const allTurnos = await this.getAll();
      return allTurnos.find(t => t.id === id) || null;
    } catch (error) {
      console.error(`Error al obtener turno ${id}:`, error);
      return null;
    }
  }

  /**
   * Crea un nuevo turno
   */
  async create(turnoData: Omit<Turno, 'id'>): Promise<Turno> {
    try {
      const apiTurno = await this.apiClient.createTurno({
        nombre_t: turnoData.nombre,
        descripcion_t: turnoData.descripcion,
        hora_inicio_t: turnoData.horaInicio,
        hora_fin_t: turnoData.horaFin,
        total_t: turnoData.horaTotal,
        tipo_t: turnoData.tipo,
      });

      return this.mapApiResponseToDomain(apiTurno);
    } catch (error) {
      console.error('Error al crear turno:', error);
      throw new Error('No se pudo crear el turno');
    }
  }

  /**
   * Actualiza un turno existente
   */
  async update(id: number, turnoData: Partial<Turno>): Promise<Turno> {
    try {
      const updateData: any = {};

      if (turnoData.nombre !== undefined) updateData.nombre_t = turnoData.nombre;
      if (turnoData.descripcion !== undefined) updateData.descripcion_t = turnoData.descripcion;
      if (turnoData.horaInicio !== undefined) updateData.hora_inicio_t = turnoData.horaInicio;
      if (turnoData.horaFin !== undefined) updateData.hora_fin_t = turnoData.horaFin;
      if (turnoData.horaTotal !== undefined) updateData.total_t = turnoData.horaTotal;
      if (turnoData.tipo !== undefined) updateData.tipo_t = turnoData.tipo;

      const apiTurno = await this.apiClient.updateTurno(id, updateData);
      return this.mapApiResponseToDomain(apiTurno);
    } catch (error) {
      console.error(`Error al actualizar turno ${id}:`, error);
      throw new Error('No se pudo actualizar el turno');
    }
  }

  /**
   * Elimina un turno
   * Nota: La API no soporta eliminación según la documentación
   */
  async delete(id: number): Promise<boolean> {
    throw new Error('La API de Turnos no soporta eliminación. Funcionalidad pendiente de desarrollo.');
  }

  /**
   * Busca turnos por nombre
   */
  async search(query: string): Promise<Turno[]> {
    try {
      const apiTurnos = await this.apiClient.searchTurnosByName(query);
      return apiTurnos.map(t => this.mapApiResponseToDomain(t));
    } catch (error) {
      console.error('Error al buscar turnos:', error);
      throw new Error('No se pudo realizar la búsqueda de turnos');
    }
  }
}
