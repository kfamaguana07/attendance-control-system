import { User } from '../entities/User';

export interface IAuthRepository {
  login(ci: string, clave: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
