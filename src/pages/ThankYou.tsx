import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowLeft, Home, Mail, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll al inicio de la página cuando se carga el componente
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-24 pb-12 px-6 bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            ¡Gracias por contactarnos!
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Hemos recibido tu solicitud de cotización exitosamente. Nuestro equipo revisará tu proyecto y te contactaremos en menos de 24 horas con una propuesta personalizada.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={() => navigate('/')}
              className="btn-neon"
            >
              <Home className="w-5 h-5 mr-2" />
              Volver al inicio
            </Button>
            
            <Button 
              onClick={() => navigate('/servicios')}
              variant="outline"
              className="border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-white"
            >
              Ver nuestros servicios
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="service-card animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-neon-cyan" />
                  ¿Qué sigue ahora?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-neon-cyan rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Revisaremos tu solicitud detalladamente</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-neon-purple rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Prepararemos una cotización personalizada</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-neon-pink rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Te contactaremos en menos de 24 horas</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span>Coordinaremos una reunión si es necesario</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="service-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center">
                  <Mail className="w-6 h-6 mr-3 text-neon-purple" />
                  Información de contacto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-neon-cyan mr-3" />
                    <div>
                      <p className="text-foreground font-medium">WhatsApp</p>
                      <p className="text-muted-foreground">+57 322 2051115</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-neon-purple mr-3" />
                    <div>
                      <p className="text-foreground font-medium">Email</p>
                      <p className="text-muted-foreground text-sm">info@skyflowproduction.com</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-neon-cyan">¿Tienes prisa?</strong><br />
                      Puedes contactarnos directamente por WhatsApp para una respuesta más rápida.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ThankYou;