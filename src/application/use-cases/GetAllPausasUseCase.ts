import { IPausaRepository } from '@/src/domain/interfaces/IPausaRepository';
import { Pausa } from '@/src/domain/entities/Pausa';

export class GetAllPausasUseCase {
  constructor(private pausaRepository: IPausaRepository) {}

  async execute(): Promise<Pausa[]> {
    return await this.pausaRepository.getAll();
  }
}
