import { IRecesoRepository } from '@/src/domain/interfaces/IRecesoRepository';
import { Receso } from '@/src/domain/entities/Receso';

export class UpdateRecesoUseCase {
  constructor(private recesoRepository: IRecesoRepository) {}

  async execute(id: number, recesoData: Partial<Receso>): Promise<Receso> {
    return await this.recesoRepository.update(id, recesoData);
  }
}
