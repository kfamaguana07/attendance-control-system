'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  isAuthenticated, 
  getUser, 
  getUserRole, 
  logout as logoutUser 
} from '@/src/infrastructure/utils/auth-client';

interface User {
  ci: string;
  nombres: string;
  apellidos: string;
  correo: string;
}

/**
 * Hook personalizado para manejar la autenticación
 * Proporciona estado y funciones para gestionar la sesión del usuario
 */
export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    setLoading(true);
    const isAuth = isAuthenticated();
    setAuthenticated(isAuth);

    if (isAuth) {
      const userData = getUser();
      const userRole = getUserRole();
      setUser(userData);
      setRole(userRole);
    } else {
      setUser(null);
      setRole(null);
    }

    setLoading(false);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setRole(null);
    setAuthenticated(false);
    router.push('/');
  };

  return {
    user,
    role,
    authenticated,
    loading,
    checkAuth,
    logout,
  };
}
