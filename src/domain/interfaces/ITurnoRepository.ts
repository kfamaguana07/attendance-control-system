import { Turno } from '../entities/Turno';

export interface ITurnoRepository {
  getAll(): Promise<Turno[]>;
  getById(id: number): Promise<Turno | null>;
  create(turno: Omit<Turno, 'id'>): Promise<Turno>;
  update(id: number, turno: Partial<Turno>): Promise<Turno>;
  delete(id: number): Promise<boolean>;
  search(query: string): Promise<Turno[]>;
}
