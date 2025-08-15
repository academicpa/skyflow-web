import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { User, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';

export const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulación de autenticación
    setTimeout(() => {
      if (credentials.email === 'admin@skyflow.com' && credentials.password === 'admin123') {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userEmail', credentials.email);
        toast({ title: 'Bienvenido', description: 'Acceso como administrador' });
        navigate('/dashboard');
      } else if (credentials.email === 'cliente@test.com' && credentials.password === 'cliente123') {
        localStorage.setItem('userRole', 'client');
        localStorage.setItem('userEmail', credentials.email);
        toast({ title: 'Bienvenido', description: 'Acceso como cliente' });
        navigate('/dashboard');
      } else {
        toast({ 
          title: 'Error de acceso', 
          description: 'Credenciales incorrectas',
          variant: 'destructive'
        });
      }
      setIsLoading(false);
    }, 1000);
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
              
              <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Credenciales de prueba:</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Admin:</strong> admin@skyflow.com / admin123</p>
                  <p><strong>Cliente:</strong> cliente@test.com / cliente123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Login;