import { IAuthRepository } from '@/src/domain/interfaces/IAuthRepository';
import { User } from '@/src/domain/entities/User';
import API_CONFIG from '../config/api.config';

interface LoginApiResponse {
  success: boolean;
  token: string;
  user: {
    ci: string;
    nombres: string;
    apellidos: string;
    correo: string;
  };
  message?: string;
}

/**
 * Repositorio real de Autenticación que consume la API de Login
 * Se conecta al microservicio de login en el puerto 5005
 */
export class ApiAuthRepository implements IAuthRepository {
  private currentUser: User | null = null;
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.AUTH.BASE_URL || 'http://localhost:5005';
  }

  /**
   * Realiza login contra el microservicio de autenticación
   * @param ci - Cédula de identidad del usuario
   * @param clave - Contraseña del usuario
   * @returns Usuario autenticado
   */
  async login(ci: string, clave: string): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}${API_CONFIG.AUTH.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ci, clave }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Credenciales inválidas');
      }

      const data: LoginApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Error en el login');
      }

      // Crear entidad User del dominio
      // Usar CI como id y username
      const nombreCompleto = `${data.user.nombres.trim()} ${data.user.apellidos.trim()}`;
      this.currentUser = new User(
        data.user.ci, // id
        data.user.ci, // username (CI)
        data.user.correo.trim(),
        'user' // role por defecto, el microservicio no retorna role
      );

      return this.currentUser;
    } catch (error) {
      console.error('Error en login:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error al conectar con el servicio de autenticación');
    }
  }

  /**
   * Cierra la sesión del usuario actual
   */
  async logout(): Promise<void> {
    this.currentUser = null;
    // Si el backend maneja sesiones, aquí se haría la llamada
  }

  /**
   * Obtiene el usuario actual en sesión
   */
  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }
}
