import { ITurnoRepository } from '@/src/domain/interfaces/ITurnoRepository';

export class DeleteTurnoUseCase {
  constructor(private turnoRepository: ITurnoRepository) {}

  async execute(id: number): Promise<boolean> {
    return await this.turnoRepository.delete(id);
  }
}
