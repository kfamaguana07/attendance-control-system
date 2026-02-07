import { IAuthRepository } from '@/src/domain/interfaces/IAuthRepository';
import { User } from '@/src/domain/entities/User';

export class MockAuthRepository implements IAuthRepository {
  private currentUser: User | null = null;

  async login(ci: string, clave: string): Promise<User> {
    // Simulación de validación
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (ci === '1721009692' && clave === 'admin') {
      this.currentUser = new User('1', ci, 'admin@example.com', 'admin');
      return this.currentUser;
    }
    
    throw new Error('Credenciales inválidas');
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }
}
