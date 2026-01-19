import { ITurnoRepository } from '@/src/domain/interfaces/ITurnoRepository';
import { Turno } from '@/src/domain/entities/Turno';

export class GetAllTurnosUseCase {
  constructor(private turnoRepository: ITurnoRepository) {}

  async execute(): Promise<Turno[]> {
    return await this.turnoRepository.getAll();
  }
}
