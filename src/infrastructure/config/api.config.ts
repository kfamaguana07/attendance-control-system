/**
 * Configuración de URLs de las APIs externas
 * Centraliza la configuración de las 5 APIs del sistema
 */

export const API_CONFIG = {
  /**
   * API de Tiempos Fuera (Pausas)
   * Puerto: 5004
   * Endpoints: /api/empleados, /api/pausas
   */
  TIEMPOS_FUERA: {
    BASE_URL: process.env.NEXT_PUBLIC_API_TIEMPOS_FUERA_URL,
    ENDPOINTS: {
      EMPLEADOS: '/api/empleados',
      PAUSAS: '/api/pausas',
      PAUSAS_POR_FECHA: (fecha: string) => `/api/pausas/fecha/${fecha}`,
      PAUSA_BY_ID: (id: number) => `/api/pausas/${id}`,
    },
  },

  /**
   * API de Personal
   * Puerto: 5001
   * Endpoints: /api/personal, /api/personal/<ci>, /api/personal/search
   */
  PERSONAL: {
    BASE_URL: process.env.NEXT_PUBLIC_API_PERSONAL_URL,
    ENDPOINTS: {
      PERSONAL: '/api/personal',
      PERSONAL_BY_CI: (ci: string) => `/api/personal/${ci}`,
      SEARCH: '/api/personal/search',
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
      INSERT: '/api/turnos/insert',
      READ_ALL: '/api/turnos/read_all',
      READ_BY_NAME: (nombre: string) => `/api/turnos/read_by_name/${nombre}`,
      UPDATE: (id: number) => `/api/turnos/update/${id}`,
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
   * API de Firmas
   * Puerto: 5006
   * Endpoints: /api/firmas, /api/firmas/hoy, /api/firmas/procesar, etc.
   */
  FIRMAS: {
    BASE_URL: process.env.NEXT_PUBLIC_API_FIRMAS_URL,
    ENDPOINTS: {
      HEALTH: '/api/health',
      FIRMAS: '/api/firmas',
      HOY: '/api/firmas/hoy',
      BY_ID: (id: number) => `/api/firmas/${id}`,
      BY_EMPLEADO: (ci: string) => `/api/firmas/empleado/${ci}`,
      BY_EMPLEADO_FECHA: (ci: string, fecha: string) => `/api/firmas/empleado/${ci}/fecha/${fecha}`,
      BY_FECHA: (fecha: string) => `/api/firmas/fecha/${fecha}`,
      INCOMPLETAS: '/api/firmas/incompletas',
      INICIAR_JORNADA: '/api/firmas/iniciar-jornada',
      PROCESAR: '/api/firmas/procesar',
      UPDATE: (id: number) => `/api/firmas/${id}`,
      AUTOCOMPLETAR: '/api/firmas/autocompletar',
      DELETE: (id: number) => `/api/firmas/${id}`,
    },
  },

  /**
   * API de Autenticación (Login)
   * Puerto: 5005
   * Endpoints: /api/auth/login
   */
  AUTH: {
    BASE_URL: process.env.NEXT_PUBLIC_API_AUTH_URL,
    ENDPOINTS: {
      LOGIN: '/api/auth/login',
    },
  },
};

export default API_CONFIG;
