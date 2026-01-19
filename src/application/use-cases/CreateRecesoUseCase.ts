import { IRecesoRepository } from '@/src/domain/interfaces/IRecesoRepository';
import { Receso } from '@/src/domain/entities/Receso';

export class CreateRecesoUseCase {
  constructor(private recesoRepository: IRecesoRepository) {}

  async execute(recesoData: Omit<Receso, 'id'>): Promise<Receso> {
    return await this.recesoRepository.create(recesoData);
  }
}
