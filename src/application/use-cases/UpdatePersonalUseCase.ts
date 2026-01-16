import { IPersonalRepository } from '@/src/domain/interfaces/IPersonalRepository';
import { Personal, PersonalData } from '@/src/domain/entities/Personal';

export class UpdatePersonalUseCase {
  constructor(private personalRepository: IPersonalRepository) {}

  async execute(id: string, personalData: PersonalData): Promise<Personal> {
    // Validaciones básicas
    if (!personalData.nombres || !personalData.apellidos) {
      throw new Error('Nombres y apellidos son requeridos');
    }

    if (!personalData.correo || !personalData.correo.includes('@')) {
      throw new Error('Correo electrónico inválido');
    }

    return await this.personalRepository.update(id, personalData);
  }
}
