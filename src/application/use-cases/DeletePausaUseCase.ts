import { IPausaRepository } from '@/src/domain/interfaces/IPausaRepository';

export class DeletePausaUseCase {
  constructor(private pausaRepository: IPausaRepository) {}

  async execute(id: number): Promise<boolean> {
    return await this.pausaRepository.delete(id);
  }
}
