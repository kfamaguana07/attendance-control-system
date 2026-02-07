/**
 * Cliente para el endpoint de autenticación
 * Maneja el login y almacenamiento del token JWT
 */

export interface LoginCredentials {
  ci: string;
  clave: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    ci: string;
    nombres: string;
    apellidos: string;
    correo: string;
  };
  role?: string;
  message?: string;
}

/**
 * Realiza login y almacena el token en localStorage
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en el login');
  }

  const data: LoginResponse = await response.json();

  // Guardar token en localStorage
  if (data.success && data.token) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    if (data.role) {
      localStorage.setItem('userRole', data.role);
    }
  }

  return data;
}

/**
 * Obtiene el token almacenado
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

/**
 * Obtiene el usuario almacenado
 */
export function getUser(): LoginResponse['user'] | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * Obtiene el rol del usuario
 */
export function getUserRole(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userRole');
}

/**
 * Verifica si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Cierra sesión (elimina token y datos del usuario)
 */
export function logout(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
}

/**
 * Hace una petición autenticada al orquestador
 * Incluye automáticamente el token en los headers
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken();

  if (!token) {
    throw new Error('No hay token de autenticación. Por favor inicia sesión.');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Ejemplo de uso para llamar al orquestador:
 * 
 * // Login
 * const result = await login({ ci: '1721009692', clave: 'admin' });
 * 
 * // Hacer petición autenticada al orquestador
 * const response = await authenticatedFetch('/api/orchestrator?resource=personal');
 * const data = await response.json();
 */
