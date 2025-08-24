import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, loading, isAdmin, isAuthenticated } = useAuth();
  
  console.log('🛡️ ProtectedRoute: Estado recibido:', {
    user,
    loading,
    isAdmin,
    isAuthenticated,
    requireAdmin
  });

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    console.log('🛡️ ProtectedRoute: Mostrando loading...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Redirigir a login si no está autenticado
  if (!isAuthenticated) {
    console.log('🛡️ ProtectedRoute: Usuario no autenticado, redirigiendo a /login');
    return <Navigate to="/login" replace />;
  }

  // Redirigir si se requiere admin pero el usuario no lo es
  if (requireAdmin && !isAdmin) {
    console.log('🛡️ ProtectedRoute: Se requiere admin pero usuario no es admin');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-4">
            No tienes permisos para acceder a esta página.
          </p>
          <p className="text-sm text-muted-foreground">
            Se requieren permisos de administrador.
          </p>
        </div>
      </div>
    );
  }

  console.log('🟢 ProtectedRoute: Acceso permitido, mostrando contenido');
  return <>{children}</>;
};