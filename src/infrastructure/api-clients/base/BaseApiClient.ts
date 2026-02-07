/**
 * Cliente HTTP Base para consumir APIs externas
 * Proporciona métodos reutilizables para GET, POST, PUT, DELETE
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class BaseApiClient {
  constructor(protected baseURL: string) {}

  /**
   * Realiza una petición GET
   */
  protected async get<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<T> {
    // Construir URL correctamente
    const fullUrl = this.baseURL.endsWith('/') 
      ? `${this.baseURL}${endpoint.startsWith('/') ? endpoint.substring(1) : endpoint}`
      : `${this.baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    
    try {
      const url = new URL(fullUrl);
      
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      console.log('[API Client] GET:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP Error ${response.status}:`, errorText);
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error en GET ${fullUrl}:`, error);
      throw error;
    }
  }

  /**
   * Realiza una petición POST
   */
  protected async post<T, D = any>(
    endpoint: string,
    data: D
  ): Promise<T> {
    const fullUrl = this.baseURL.endsWith('/') 
      ? `${this.baseURL}${endpoint.startsWith('/') ? endpoint.substring(1) : endpoint}`
      : `${this.baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    
    try {
      const url = new URL(fullUrl);

      console.log('[API Client] POST:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
        cache: 'no-store',
      });

      // Intentar parsear el response como JSON primero
      const responseText = await response.text();
      let responseJson;
      
      try {
        responseJson = JSON.parse(responseText);
      } catch (parseError) {
        // Si no se puede parsear como JSON
        if (!response.ok) {
          console.error(`HTTP Error ${response.status}:`, responseText);
          throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
        }
        throw new Error('Invalid JSON response');
      }

      // Si la respuesta tiene success: false, retornar el JSON completo
      // para que la aplicación pueda manejar el campo "error"
      if (responseJson.success === false) {
        return responseJson;
      }

      // Si el status no es OK pero tiene JSON válido, lanzar con el mensaje
      if (!response.ok) {
        console.error(`HTTP Error ${response.status}:`, responseText);
        if (responseJson.error || responseJson.message) {
          throw new Error(responseJson.error || responseJson.message);
        }
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return responseJson;
    } catch (error) {
      console.error(`Error en POST ${fullUrl}:`, error);
      throw error;
    }
  }

  /**
   * Realiza una petición PUT
   */
  protected async put<T, D = any>(
    endpoint: string,
    data: D
  ): Promise<T> {
    const fullUrl = this.baseURL.endsWith('/') 
      ? `${this.baseURL}${endpoint.startsWith('/') ? endpoint.substring(1) : endpoint}`
      : `${this.baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    
    try {
      const url = new URL(fullUrl);

      console.log('[API Client] PUT:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP Error ${response.status}:`, errorText);
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error en PUT ${fullUrl}:`, error);
      throw error;
    }
  }

  /**
   * Realiza una petición DELETE
   */
  protected async delete<T>(endpoint: string): Promise<T> {
    const fullUrl = this.baseURL.endsWith('/') 
      ? `${this.baseURL}${endpoint.startsWith('/') ? endpoint.substring(1) : endpoint}`
      : `${this.baseURL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    
    try {
      const url = new URL(fullUrl);

      console.log('[API Client] DELETE:', url.toString());

      const response = await fetch(url.toString(), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP Error ${response.status}:`, errorText);
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      // DELETE puede retornar 204 No Content
      if (response.status === 204) {
        return { success: true } as T;
      }

      return await response.json();
    } catch (error) {
      console.error(`Error en DELETE ${fullUrl}:`, error);
      throw error;
    }
  }
}
