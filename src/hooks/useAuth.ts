import { useState, useEffect } from 'react';

interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'client';
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión actual desde localStorage
    const checkUser = () => {
      console.log('🔍 useAuth: Verificando usuario en localStorage');
      try {
        const userData = localStorage.getItem('user');
        console.log('🔍 useAuth: Datos encontrados en localStorage:', userData);
        
        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('🔍 useAuth: Usuario parseado:', parsedUser);
          setUser({
            id: parsedUser.id,
            email: parsedUser.email,
            role: parsedUser.role
          });
          console.log('🟢 useAuth: Usuario establecido correctamente');
        } else {
          console.log('❌ useAuth: No hay datos de usuario en localStorage');
          setUser(null);
        }
      } catch (error) {
        console.log('❌ useAuth: Error al parsear usuario:', error);
        setUser(null);
      } finally {
        setLoading(false);
        console.log('🔍 useAuth: Loading establecido a false');
      }
    };

    checkUser();

    // Escuchar cambios en localStorage y eventos personalizados
    const handleStorageChange = () => {
      checkUser();
    };

    const handleAuthChange = () => {
      checkUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authStateChanged', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';
  const isAuthenticated = !!user;

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    // Disparar evento personalizado para actualizar el estado de autenticación
    window.dispatchEvent(new Event('authStateChanged'));
  };

  return {
    user,
    loading,
    isAdmin,
    isClient,
    isAuthenticated,
    logout
  };
};