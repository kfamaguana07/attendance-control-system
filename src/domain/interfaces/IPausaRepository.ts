import { Pausa } from '../entities/Pausa';

export interface IPausaRepository {
  getAll(): Promise<Pausa[]>;
  getById(id: number): Promise<Pausa | null>;
  create(pausa: Omit<Pausa, 'id'>): Promise<Pausa>;
  update(id: number, pausa: Partial<Pausa>): Promise<Pausa>;
  delete(id: number): Promise<boolean>;
  search(query: string): Promise<Pausa[]>;
  getFiltered(filters: { ci?: string; fechaInicio?: string; fechaFin?: string; }): Promise<Pausa[]>;
}
