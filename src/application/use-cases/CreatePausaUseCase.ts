import { IPausaRepository } from '@/src/domain/interfaces/IPausaRepository';
import { Pausa } from '@/src/domain/entities/Pausa';

export class CreatePausaUseCase {
  constructor(private pausaRepository: IPausaRepository) {}

  async execute(pausaData: Omit<Pausa, 'id'>): Promise<Pausa> {
    return await this.pausaRepository.create(pausaData);
  }
}
