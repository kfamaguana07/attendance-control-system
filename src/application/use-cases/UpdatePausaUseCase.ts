import { IPausaRepository } from '@/src/domain/interfaces/IPausaRepository';
import { Pausa } from '@/src/domain/entities/Pausa';

export class UpdatePausaUseCase {
  constructor(private pausaRepository: IPausaRepository) {}

  async execute(id: number, pausaData: Partial<Pausa>): Promise<Pausa> {
    return await this.pausaRepository.update(id, pausaData);
  }
}
