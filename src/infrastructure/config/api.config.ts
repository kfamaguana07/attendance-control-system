/**
 * Configuración de URLs de las APIs externas
 * Centraliza la configuración de las 5 APIs del sistema
 */

export const API_CONFIG = {
  /**
   * API de Tiempos Fuera (Pausas)
   * Puerto: 5004
   * Endpoints: /empleados, /pausas
   */
  TIEMPOS_FUERA: {
    BASE_URL: process.env.NEXT_PUBLIC_API_TIEMPOS_FUERA_URL,
    ENDPOINTS: {
      EMPLEADOS: '/empleados',
      PAUSAS: '/pausas',
      PAUSAS_POR_FECHA: (fecha: string) => `/pausas/fecha/${fecha}`,
      PAUSA_BY_ID: (id: number) => `/pausas/${id}`,
    },
  },

  /**
   * API de Personal
   * Puerto: 5001
   * Endpoints: /personal, /personal/<ci>, /personal/search
   */
  PERSONAL: {
    BASE_URL: process.env.NEXT_PUBLIC_API_PERSONAL_URL,
    ENDPOINTS: {
      PERSONAL: '/personal',
      PERSONAL_BY_CI: (ci: string) => `/personal/${ci}`,
      SEARCH: '/personal/search',
    },
  },

  /**
   * API de Turnos
   * Puerto: 5003
   * Endpoints: /api/turnos/insert, /api/turnos/read_all, /api/turnos/read_by_name, /api/turnos/update
   */
  TURNOS: {
    BASE_URL: process.env.NEXT_PUBLIC_API_TURNOS_URL,
    ENDPOINTS: {
      INSERT: '/turnos/insert',
      READ_ALL: '/turnos/read_all',
      READ_BY_NAME: (nombre: string) => `/turnos/read_by_name/${nombre}`,
      UPDATE: (id: number) => `/turnos/update/${id}`,
    },
  },

  /**
   * API de Recesos
   * Puerto: 5002
   * Endpoints: /recesos, /recesos/{receso_id}
   */
  RECESOS: {
    BASE_URL: process.env.NEXT_PUBLIC_API_RECESOS_URL,
    ENDPOINTS: {
      RECESOS: '/recesos',
      RECESO_BY_ID: (id: number) => `/recesos/${id}`,
    },
  },

  /**
   * API de Firmas (Pendiente de implementar)
   * Puerto: TBD
   */
  FIRMAS: {
    BASE_URL: process.env.NEXT_PUBLIC_API_FIRMAS_URL,
    ENDPOINTS: {
      // TODO: Definir endpoints cuando se implemente la API
    },
  },

  /**
   * API de Autenticación (Login)
   * Puerto: 5005
   * Endpoints: /auth/login
   */
  AUTH: {
    BASE_URL: process.env.NEXT_PUBLIC_API_AUTH_URL,
    ENDPOINTS: {
      LOGIN: '/auth/login',
    },
  },
};

export default API_CONFIG;
