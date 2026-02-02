import { NextRequest, NextResponse } from 'next/server';
import { ApiPausaRepository } from '@/src/infrastructure/repositories/ApiPausaRepository';
import { MockPausaRepository } from '@/src/infrastructure/repositories/MockPausaRepository';
import { GetAllPausasUseCase } from '@/src/application/use-cases/GetAllPausasUseCase';
import { SearchPausasUseCase } from '@/src/application/use-cases/SearchPausasUseCase';
import { ApiPersonalRepository } from '@/src/infrastructure/repositories/ApiPersonalRepository';
import { MockPersonalRepository } from '@/src/infrastructure/repositories/MockPersonalRepository';
import { GetAllPersonalUseCase } from '@/src/application/use-cases/GetAllPersonalUseCase';
import { CreatePersonalUseCase } from '@/src/application/use-cases/CreatePersonalUseCase';
import { UpdatePersonalUseCase } from '@/src/application/use-cases/UpdatePersonalUseCase';
import { ApiRecesoRepository } from '@/src/infrastructure/repositories/ApiRecesoRepository';
import { MockRecesoRepository } from '@/src/infrastructure/repositories/MockRecesoRepository';
import { GetAllRecesosUseCase } from '@/src/application/use-cases/GetAllRecesosUseCase';
import { SearchRecesosUseCase } from '@/src/application/use-cases/SearchRecesosUseCase';
import { ApiTurnoRepository } from '@/src/infrastructure/repositories/ApiTurnoRepository';
import { MockTurnoRepository } from '@/src/infrastructure/repositories/MockTurnoRepository';
import { GetAllTurnosUseCase } from '@/src/application/use-cases/GetAllTurnosUseCase';
import { SearchTurnosUseCase } from '@/src/application/use-cases/SearchTurnosUseCase';

/**
 * API Orchestrator - Orquestación de llamadas a APIs externas
 * 
 * Este endpoint actúa como capa de orquestación entre el frontend y las APIs externas.
 * Permite cambiar fácilmente entre implementaciones Mock y APIs reales.
 * 
 * Configuración:
 * - USE_REAL_API=true: Usa la API real
 * - USE_REAL_API=false: Usa datos mock para desarrollo
 */

// Control de uso de APIs reales vs Mock
const USE_REAL_API_PAUSAS = process.env.USE_REAL_API_PAUSAS === 'true';
const USE_REAL_API_PERSONAL = process.env.USE_REAL_API_PERSONAL === 'true';
const USE_REAL_API_RECESOS = process.env.USE_REAL_API_RECESOS === 'true';
const USE_REAL_API_TURNOS = process.env.USE_REAL_API_TURNOS === 'true';

// Instancias de repositorios
const pausaRepository = USE_REAL_API_PAUSAS
  ? new ApiPausaRepository()
  : new MockPausaRepository();

const personalRepository = USE_REAL_API_PERSONAL
  ? new ApiPersonalRepository()
  : new MockPersonalRepository();

const recesoRepository = USE_REAL_API_RECESOS
  ? new ApiRecesoRepository()
  : new MockRecesoRepository();

const turnoRepository = USE_REAL_API_TURNOS
  ? new ApiTurnoRepository()
  : new MockTurnoRepository();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource');
  const query = searchParams.get('query');

  try {
    switch (resource) {
      case 'pausas': {
        const ci = searchParams.get('ci');
        const fechaInicio = searchParams.get('fecha_inicio');
        const fechaFin = searchParams.get('fecha_fin');

        if (ci || fechaInicio || fechaFin) {
          // Filtrado específico
          const pausas = await pausaRepository.getFiltered({
            ci: ci || undefined,
            fechaInicio: fechaInicio || undefined,
            fechaFin: fechaFin || undefined
          });
          return NextResponse.json({
            success: true,
            data: pausas,
            source: USE_REAL_API_PAUSAS ? 'API Real (Puerto 5004)' : 'Mock Data',
          });
        } else if (query) {
          // Búsqueda de pausas
          const searchUseCase = new SearchPausasUseCase(pausaRepository);
          const pausas = await searchUseCase.execute(query);
          return NextResponse.json({
            success: true,
            data: pausas,
            source: USE_REAL_API_PAUSAS ? 'API Real (Puerto 5004)' : 'Mock Data',
          });
        } else {
          // Obtener todas las pausas
          const getAllUseCase = new GetAllPausasUseCase(pausaRepository);
          const pausas = await getAllUseCase.execute();
          return NextResponse.json({
            success: true,
            data: pausas,
            source: USE_REAL_API_PAUSAS ? 'API Real (Puerto 5004)' : 'Mock Data',
          });
        }
      }

      case 'personal': {
        const ci = searchParams.get('ci');
        
        if (ci) {
          // Obtener un empleado específico por CI
          const personal = await personalRepository.findById(ci);
          if (!personal) {
            return NextResponse.json(
              { success: false, error: 'Empleado no encontrado' },
              { status: 404 }
            );
          }
          return NextResponse.json({
            success: true,
            data: personal,
            source: USE_REAL_API_PERSONAL ? 'API Real (Puerto 5001)' : 'Mock Data',
          });
        } else {
          // Obtener todos los empleados
          const getAllUseCase = new GetAllPersonalUseCase(personalRepository);
          const personal = await getAllUseCase.execute();
          return NextResponse.json({
            success: true,
            data: personal,
            source: USE_REAL_API_PERSONAL ? 'API Real (Puerto 5001)' : 'Mock Data',
          });
        }
      }

      case 'turnos': {
        const id = searchParams.get('id');
        
        if (id) {
          // Obtener un turno específico por ID
          const turno = await turnoRepository.getById(Number(id));
          if (!turno) {
            return NextResponse.json(
              { success: false, error: 'Turno no encontrado' },
              { status: 404 }
            );
          }
          return NextResponse.json({
            success: true,
            data: turno,
            source: USE_REAL_API_TURNOS ? 'API Real (Puerto 5003)' : 'Mock Data',
          });
        } else if (query) {
          // Búsqueda de turnos
          const searchUseCase = new SearchTurnosUseCase(turnoRepository);
          const turnos = await searchUseCase.execute(query);
          return NextResponse.json({
            success: true,
            data: turnos,
            source: USE_REAL_API_TURNOS ? 'API Real (Puerto 5003)' : 'Mock Data',
          });
        } else {
          // Obtener todos los turnos
          const getAllUseCase = new GetAllTurnosUseCase(turnoRepository);
          const turnos = await getAllUseCase.execute();
          return NextResponse.json({
            success: true,
            data: turnos,
            source: USE_REAL_API_TURNOS ? 'API Real (Puerto 5003)' : 'Mock Data',
          });
        }
      }

      case 'recesos': {
        const id = searchParams.get('id');
        
        if (id) {
          // Obtener un receso específico por ID
          const receso = await recesoRepository.getById(Number(id));
          if (!receso) {
            return NextResponse.json(
              { success: false, error: 'Receso no encontrado' },
              { status: 404 }
            );
          }
          return NextResponse.json({
            success: true,
            data: receso,
            source: USE_REAL_API_RECESOS ? 'API Real (Puerto 5002)' : 'Mock Data',
          });
        } else if (query) {
          // Búsqueda de recesos
          const searchUseCase = new SearchRecesosUseCase(recesoRepository);
          const recesos = await searchUseCase.execute(query);
          return NextResponse.json({
            success: true,
            data: recesos,
            source: USE_REAL_API_RECESOS ? 'API Real (Puerto 5002)' : 'Mock Data',
          });
        } else {
          // Obtener todos los recesos
          const getAllUseCase = new GetAllRecesosUseCase(recesoRepository);
          const recesos = await getAllUseCase.execute();
          return NextResponse.json({
            success: true,
            data: recesos,
            source: USE_REAL_API_RECESOS ? 'API Real (Puerto 5002)' : 'Mock Data',
          });
        }
      }

      case 'attendance':
        return NextResponse.json({
          success: true,
          data: [],
          message: 'No hay registros de asistencia',
          source: 'Mock Data',
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Recurso no encontrado' },
          { status: 404 }
        );
    }
  } catch (error) {
    console.error('Error en orchestrator:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resource, data } = body;

    switch (resource) {
      case 'pausas': {
        // Crear pausas usando el repositorio configurado
        const pausa = await pausaRepository.create(data);
        return NextResponse.json({
          success: true,
          data: pausa,
          message: 'Pausa(s) creada(s) exitosamente',
          source: USE_REAL_API_PAUSAS ? 'API Real (Puerto 5004)' : 'Mock Data',
        });
      }

      case 'personal': {
        // Crear personal usando el repositorio configurado
        const createUseCase = new CreatePersonalUseCase(personalRepository);
        const personal = await createUseCase.execute(data);
        return NextResponse.json({
          success: true,
          data: personal,
          message: 'Personal creado exitosamente',
          source: USE_REAL_API_PERSONAL ? 'API Real (Puerto 5001)' : 'Mock Data',
        });
      }

      case 'turnos': {
        // Crear turno usando el repositorio configurado
        const turno = await turnoRepository.create(data);
        return NextResponse.json({
          success: true,
          data: turno,
          message: 'Turno creado exitosamente',
          source: USE_REAL_API_TURNOS ? 'API Real (Puerto 5003)' : 'Mock Data',
        });
      }

      case 'recesos': {
        // Crear receso usando el repositorio configurado
        const receso = await recesoRepository.create(data);
        return NextResponse.json({
          success: true,
          data: receso,
          message: 'Receso creado exitosamente',
          source: USE_REAL_API_RECESOS ? 'API Real (Puerto 5002)' : 'Mock Data',
        });
      }

      case 'login':
        // Simular autenticación
        if (data.username === 'admin' && data.password === 'admin') {
          return NextResponse.json({
            success: true,
            data: {
              id: '1',
              username: data.username,
              email: 'admin@example.com',
              role: 'admin',
            },
          });
        }
        return NextResponse.json(
          { success: false, error: 'Credenciales inválidas' },
          { status: 401 }
        );

      default:
        return NextResponse.json(
          { success: false, error: 'Recurso no encontrado' },
          { status: 404 }
        );
    }
  } catch (error) {
    console.error('Error en orchestrator POST:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { resource, id, data } = body;

    switch (resource) {
      case 'pausas': {
        // Actualizar pausa usando el repositorio configurado
        const pausa = await pausaRepository.update(id, data);
        return NextResponse.json({
          success: true,
          data: pausa,
          message: 'Pausa actualizada exitosamente',
          source: USE_REAL_API_PAUSAS ? 'API Real (Puerto 5004)' : 'Mock Data',
        });
      }

      case 'personal': {
        // Actualizar personal usando el repositorio configurado
        const updateUseCase = new UpdatePersonalUseCase(personalRepository);
        const personal = await updateUseCase.execute(id, data);
        return NextResponse.json({
          success: true,
          data: personal,
          message: 'Personal actualizado exitosamente',
          source: USE_REAL_API_PERSONAL ? 'API Real (Puerto 5001)' : 'Mock Data',
        });
      }

      case 'turnos': {
        // Actualizar turno usando el repositorio configurado
        const turno = await turnoRepository.update(Number(id), data);
        return NextResponse.json({
          success: true,
          data: turno,
          message: 'Turno actualizado exitosamente',
          source: USE_REAL_API_TURNOS ? 'API Real (Puerto 5003)' : 'Mock Data',
        });
      }

      case 'recesos': {
        // Actualizar receso usando el repositorio configurado
        const receso = await recesoRepository.update(Number(id), data);
        return NextResponse.json({
          success: true,
          data: receso,
          message: 'Receso actualizado exitosamente',
          source: USE_REAL_API_RECESOS ? 'API Real (Puerto 5002)' : 'Mock Data',
        });
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Recurso no encontrado' },
          { status: 404 }
        );
    }
  } catch (error) {
    console.error('Error en orchestrator PUT:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resource = searchParams.get('resource');
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID no proporcionado' },
        { status: 400 }
      );
    }

    switch (resource) {
      case 'pausas': {
        // Eliminar pausa usando el repositorio configurado
        const success = await pausaRepository.delete(Number(id));
        return NextResponse.json({
          success,
          message: success ? 'Pausa eliminada exitosamente' : 'No se pudo eliminar la pausa',
          source: USE_REAL_API_PAUSAS ? 'API Real (Puerto 5004)' : 'Mock Data',
        });
      }

      case 'personal': {
        // Eliminar personal usando el repositorio configurado
        await personalRepository.delete(id);
        return NextResponse.json({
          success: true,
          message: 'Personal eliminado exitosamente',
          source: USE_REAL_API_PERSONAL ? 'API Real (Puerto 5001)' : 'Mock Data',
        });
      }

      case 'turnos': {
        // Eliminar turno - NO SOPORTADO por la API
        return NextResponse.json(
          {
            success: false,
            error: 'La API de Turnos no soporta eliminación. Funcionalidad pendiente de desarrollo.',
          },
          { status: 501 }
        );
      }

      case 'recesos': {
        // Eliminar receso - NO SOPORTADO por la API
        return NextResponse.json(
          {
            success: false,
            error: 'La API de Recesos no soporta eliminación. Funcionalidad pendiente de desarrollo.',
          },
          { status: 501 }
        );
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Recurso no encontrado' },
          { status: 404 }
        );
    }
  } catch (error) {
    console.error('Error en orchestrator DELETE:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}
