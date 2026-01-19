import { ITurnoRepository } from '@/src/domain/interfaces/ITurnoRepository';
import { Turno } from '@/src/domain/entities/Turno';

export class UpdateTurnoUseCase {
  constructor(private turnoRepository: ITurnoRepository) {}

  async execute(id: number, turnoData: Partial<Turno>): Promise<Turno> {
    return await this.turnoRepository.update(id, turnoData);
  }
}
