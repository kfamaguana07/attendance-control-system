import { IPersonalRepository } from '@/src/domain/interfaces/IPersonalRepository';
import { Personal } from '@/src/domain/entities/Personal';

export class GetAllPersonalUseCase {
  constructor(private personalRepository: IPersonalRepository) {}

  async execute(): Promise<Personal[]> {
    return await this.personalRepository.findAll();
  }
}
