import { IRecesoRepository } from '@/src/domain/interfaces/IRecesoRepository';

export class DeleteRecesoUseCase {
  constructor(private recesoRepository: IRecesoRepository) {}

  async execute(id: number): Promise<void> {
    return await this.recesoRepository.delete(id);
  }
}
