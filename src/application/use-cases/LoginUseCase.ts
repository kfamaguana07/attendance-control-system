import { IAuthRepository } from '@/src/domain/interfaces/IAuthRepository';
import { User } from '@/src/domain/entities/User';

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(username: string, password: string): Promise<User> {
    if (!username || !password) {
      throw new Error('Usuario y contraseña son requeridos');
    }

    return await this.authRepository.login(username, password);
  }
}
