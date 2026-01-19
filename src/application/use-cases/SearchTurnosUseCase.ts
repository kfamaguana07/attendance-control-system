import { ITurnoRepository } from '@/src/domain/interfaces/ITurnoRepository';
import { Turno } from '@/src/domain/entities/Turno';

export class SearchTurnosUseCase {
  constructor(private turnoRepository: ITurnoRepository) {}

  async execute(query: string): Promise<Turno[]> {
    if (!query || query.trim() === '') {
      return await this.turnoRepository.getAll();
    }
    return await this.turnoRepository.search(query);
  }
}
