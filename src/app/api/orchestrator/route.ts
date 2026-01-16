import { NextRequest, NextResponse } from 'next/server';

/**
 * API Orchestrator - Client-side API orchestration
 * Este endpoint será utilizado en el futuro para orquestar llamadas a múltiples APIs
 * Por ahora retorna datos mock para desarrollo del frontend
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resource = searchParams.get('resource');

  try {
    switch (resource) {
      case 'personal':
        return NextResponse.json({
          success: true,
          data: [
            {
              cl: '001',
              id_a: 1,
              id_t: 1,
              id_b: 1,
              id_ba: 1,
              nombres: 'Juan',
              apellidos: 'Pérez García',
              direccion: 'Av. Principal 123',
              telefonos: '555-0001',
              correo: 'juan.perez@example.com',
              fechaNacimiento: '1990-01-15',
              fechaIngreso: '2020-03-01',
              fechaContrato: '2020-03-01',
              salario: 2500.00,
            },
          ],
        });

      case 'attendance':
        return NextResponse.json({
          success: true,
          data: [],
          message: 'No hay registros de asistencia',
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Recurso no encontrado' },
          { status: 404 }
        );
    }
  } catch (error) {
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
      case 'personal':
        // Simular creación de personal
        return NextResponse.json({
          success: true,
          data: {
            cl: String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
            ...data,
          },
          message: 'Personal creado exitosamente',
        });

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
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      },
      { status: 500 }
    );
  }
}
