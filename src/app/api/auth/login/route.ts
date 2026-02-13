import { NextRequest, NextResponse } from 'next/server';
import { LoginDTO, LoginResponseDTO } from '@/src/presentation/dtos/AuthDTO';
import jwt from 'jsonwebtoken';
import API_CONFIG from '@/src/infrastructure/config/api.config';

/**
 * Endpoint de autenticación - POST /api/auth/login
 * 
 * Este endpoint:
 * - Recibe credenciales (ci y clave)
 * - Se conecta al microservicio de login en el puerto 5005
 * - Genera un JWT para el frontend
 * - El JWT se usa solo en el cliente para control de rutas/vistas del dashboard
 * - El token debe incluirse en headers cuando se llame al orquestador
 * 
 * Configuración:
 * - USE_REAL_API_AUTH=true: Usa el microservicio de login (puerto 5005)
 * - USE_REAL_API_AUTH=false: Usa datos mock para desarrollo
 */

const USE_REAL_API_AUTH = process.env.USE_REAL_API_AUTH === 'true';
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-super-seguro-cambia-esto-en-produccion';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

interface MicroserviceLoginResponse {
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
 * POST /api/auth/login
 * Autentica un usuario y devuelve un JWT
 */
export async function POST(request: NextRequest) {
  try {
    // Parsear el body
    const body: LoginDTO = await request.json();

    console.log('🔐 Login attempt:', { ci: body.ci, useRealAPI: USE_REAL_API_AUTH });

    // Validar campos requeridos
    if (!body.ci || !body.clave) {
      return NextResponse.json(
        {
          success: false,
          message: 'CI y contraseña son requeridos',
        },
        { status: 400 }
      );
    }

    let userInfo: { ci: string; nombres: string; apellidos: string; correo: string };

    if (USE_REAL_API_AUTH) {
      // Llamar al microservicio de login (puerto 5005)
      const apiUrl = API_CONFIG.AUTH.BASE_URL || 'http://localhost:5005';
      const loginResponse = await fetch(`${apiUrl}${API_CONFIG.AUTH.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ci: body.ci, clave: body.clave }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Credenciales inválidas');
      }

      const data: MicroserviceLoginResponse = await loginResponse.json();

      if (!data.success) {
        throw new Error(data.message || 'Error en el login');
      }

      userInfo = {
        ci: data.user.ci,
        nombres: data.user.nombres.trim(),
        apellidos: data.user.apellidos.trim(),
        correo: data.user.correo.trim(),
      };
    } else {
      // Mock data para desarrollo
      console.log('📝 Using mock authentication');
      console.log('Expected credentials: ci=1721009692, clave=admin');
      console.log('Received credentials: ci=' + body.ci);
      
      if (body.ci !== '1721009692' || body.clave !== 'admin') {
        console.log('❌ Invalid credentials');
        return NextResponse.json(
          { success: false, message: 'Credenciales inválidas' },
          { status: 401 }
        );
      }

      console.log('✅ Mock authentication successful');
      userInfo = {
        ci: '1721009692',
        nombres: 'ADMIN',
        apellidos: 'USER',
        correo: 'admin@example.com',
      };
    }

    // Generar JWT con la información del usuario
    const payload = {
      ci: userInfo.ci,
      nombres: userInfo.nombres,
      apellidos: userInfo.apellidos,
      correo: userInfo.correo,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);

    // Preparar respuesta
    const response: LoginResponseDTO = {
      success: true,
      token,
      user: {
        ci: userInfo.ci,
        nombres: userInfo.nombres,
        apellidos: userInfo.apellidos,
        correo: userInfo.correo,
      },
      role: 'user', // Role por defecto
      message: 'Login exitoso',
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error en login:', error);

    // Manejar errores de autenticación
    if (error instanceof Error && error.message.includes('Credenciales inválidas')) {
      return NextResponse.json(
        {
          success: false,
          message: 'CI o contraseña incorrectos',
        },
        { status: 401 }
      );
    }

    // Error general
    return NextResponse.json(
      {
        success: false,
        message: 'Error en el servidor al procesar el login',
      },
      { status: 500 }
    );
  }
}
