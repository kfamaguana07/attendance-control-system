import { User } from '../entities/User';

export interface IAuthRepository {
  login(username: string, password: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
