import { IAuthRepository } from '@/src/domain/interfaces/IAuthRepository';
import { User } from '@/src/domain/entities/User';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(ci: string, clave: string): Promise<User> {
    if (!ci || !clave) {
      throw new Error('CI y contraseña son requeridos');
    }

    return await this.authRepository.login(ci, clave);
  }
}
