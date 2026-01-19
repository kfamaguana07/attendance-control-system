import { Receso } from '../entities/Receso';

export interface IRecesoRepository {
  getAll(): Promise<Receso[]>;
  getById(id: number): Promise<Receso | null>;
  create(receso: Omit<Receso, 'id'>): Promise<Receso>;
  update(id: number, receso: Partial<Receso>): Promise<Receso>;
  delete(id: number): Promise<void>;
  search(query: string): Promise<Receso[]>;
}
