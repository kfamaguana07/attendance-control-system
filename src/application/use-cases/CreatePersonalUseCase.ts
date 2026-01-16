import { IPersonalRepository } from '@/src/domain/interfaces/IPersonalRepository';
import { Personal, PersonalData } from '@/src/domain/entities/Personal';

export class CreatePersonalUseCase {
  constructor(private personalRepository: IPersonalRepository) {}

  async execute(personalData: PersonalData): Promise<Personal> {
    // Validaciones básicas
    if (!personalData.nombres || !personalData.apellidos) {
      throw new Error('Nombres y apellidos son requeridos');
    }

    if (!personalData.correo || !personalData.correo.includes('@')) {
      throw new Error('Correo electrónico inválido');
    }

    return await this.personalRepository.create(personalData);
  }
}
