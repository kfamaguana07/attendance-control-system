import { IPausaRepository } from '@/src/domain/interfaces/IPausaRepository';
import { Pausa } from '@/src/domain/entities/Pausa';

export class SearchPausasUseCase {
  constructor(private pausaRepository: IPausaRepository) {}

  async execute(query: string): Promise<Pausa[]> {
    if (!query || query.trim() === '') {
      return await this.pausaRepository.getAll();
    }
    return await this.pausaRepository.search(query);
  }
}
