import { IAuthRepository } from '@/src/domain/interfaces/IAuthRepository';
import { User } from '@/src/domain/entities/User';

export class MockAuthRepository implements IAuthRepository {
  private currentUser: User | null = null;

  async login(username: string, password: string): Promise<User> {
    // Simulación de validación
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === 'admin' && password === 'admin') {
      this.currentUser = new User('1', username, 'admin@example.com', 'admin');
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
