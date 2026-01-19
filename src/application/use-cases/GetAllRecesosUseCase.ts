import { IRecesoRepository } from '@/src/domain/interfaces/IRecesoRepository';
import { Receso } from '@/src/domain/entities/Receso';

export class GetAllRecesosUseCase {
  constructor(private recesoRepository: IRecesoRepository) {}

  async execute(): Promise<Receso[]> {
    return await this.recesoRepository.getAll();
  }
}
