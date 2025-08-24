import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { supabase } from '@/lib/supabase';

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🔍 Iniciando proceso de login...');
    setIsLoading(true);

    try {
      // Usar la función de autenticación tradicional
      const { data, error } = await supabase.rpc('authenticate_user', {
        input_email: credentials.email,
        user_password: credentials.password
      });
      
      if (error) {
        toast({ 
          title: 'Error de conexión', 
          description: 'Error al conectar con el servidor',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }

      // La función devuelve un array, tomamos el primer elemento
      const result = Array.isArray(data) ? data[0] : data;
      
      if (!result.success) {
        toast({ 
          title: 'Error de acceso', 
          description: result.message || 'Credenciales incorrectas',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }

      // Login exitoso
      if (result.success) {
        console.log('🟢 Login exitoso, datos recibidos:', result);
        
        // Guardar información del usuario en localStorage
        const userData = {
          id: result.user_id,
          email: result.user_email,
          role: result.user_role
        };
        
        console.log('🟢 Guardando usuario en localStorage:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Verificar que se guardó correctamente
        const savedUser = localStorage.getItem('user');
        console.log('🟢 Usuario guardado verificado:', savedUser);
        
        // Disparar evento personalizado para actualizar el estado de autenticación
        console.log('🟢 Disparando evento authStateChanged');
        window.dispatchEvent(new Event('authStateChanged'));
        
        toast({ 
          title: 'Acceso exitoso', 
          description: `Bienvenido, ${result.user_email}`,
          variant: 'default'
        });
        
        console.log('🟢 Navegando a /dashboard');
        navigate('/dashboard');
        setIsLoading(false);
        return;
      }
    } catch (err) {
      toast({ 
        title: 'Error', 
        description: 'Error de conexión. Verifica tu configuración de Supabase.',
        variant: 'destructive'
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      <section className="pt-4 pb-12 px-6 min-h-screen flex items-start justify-center">
        <div className="w-full max-w-md mt-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
          
          <Card className="service-card">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <img src="/logo.png" alt="SKYFLOW" className="h-12 w-auto" />
              </div>
              <CardTitle className="text-2xl bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                Área Privada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={credentials.email}
                    onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                    className="bg-input border-border focus:border-neon-cyan"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    className="bg-input border-border focus:border-neon-cyan"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full btn-neon"
                  disabled={isLoading}
                >
                  {isLoading ? 'Accediendo...' : 'Acceder'}
                  <User className="w-4 h-4 ml-2" />
                </Button>
              </form>
              

            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Login;