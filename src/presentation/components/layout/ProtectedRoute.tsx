'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/src/infrastructure/utils/auth-client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente de protección de rutas
 * Verifica si el usuario está autenticado antes de renderizar el contenido
 * Si no está autenticado, redirige al home
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  // Si no está autenticado, no renderizar nada mientras redirige
  if (!isAuthenticated()) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
          <p className="mt-4 text-sm text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
