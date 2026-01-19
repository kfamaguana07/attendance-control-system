import { IRecesoRepository } from '@/src/domain/interfaces/IRecesoRepository';
import { Receso } from '@/src/domain/entities/Receso';

export class SearchRecesosUseCase {
  constructor(private recesoRepository: IRecesoRepository) {}

  async execute(query: string): Promise<Receso[]> {
    if (!query || query.trim() === '') {
      return await this.recesoRepository.getAll();
    }
    return await this.recesoRepository.search(query);
  }
}
