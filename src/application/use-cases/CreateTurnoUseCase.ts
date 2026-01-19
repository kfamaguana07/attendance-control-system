import { ITurnoRepository } from '@/src/domain/interfaces/ITurnoRepository';
import { Turno } from '@/src/domain/entities/Turno';

export class CreateTurnoUseCase {
  constructor(private turnoRepository: ITurnoRepository) {}

  async execute(turnoData: Omit<Turno, 'id'>): Promise<Turno> {
    return await this.turnoRepository.create(turnoData);
  }
}
