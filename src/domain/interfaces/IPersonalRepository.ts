import { Personal, PersonalData } from '../entities/Personal';

export interface IPersonalRepository {
  findAll(): Promise<Personal[]>;
  findById(id: string): Promise<Personal | null>;
  create(personal: PersonalData): Promise<Personal>;
  update(id: string, personal: Partial<PersonalData>): Promise<Personal>;
  delete(id: string): Promise<void>;
}
