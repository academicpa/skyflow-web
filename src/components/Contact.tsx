import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail } from 'lucide-react';

export const Contact = () => {
  return (
    <section id="contact" className="py-20 px-6 bg-secondary/20">
      <div className="container mx-auto">
        <h2 className="section-title animate-fade-in">
          Contáctanos
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Estamos aquí para ayudarte. Ponte en contacto con nosotros para cualquier consulta o información adicional.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="service-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-neon-cyan mr-3" />
                <h3 className="text-lg font-semibold text-foreground">Ubicación</h3>
              </div>
              <p className="text-muted-foreground">
                Calle 85 #11-45<br />
                Zona Rosa, Bogotá<br />
                Colombia
              </p>
            </CardContent>
          </Card>

          <Card className="service-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Phone className="w-6 h-6 text-neon-purple mr-3" />
                <h3 className="text-lg font-semibold text-foreground">Teléfono</h3>
              </div>
              <p className="text-muted-foreground">
                +57 301 456 7890<br />
                +57 1 234 5678
              </p>
            </CardContent>
          </Card>

          <Card className="service-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Mail className="w-6 h-6 text-neon-pink mr-3" />
                <h3 className="text-lg font-semibold text-foreground">Email</h3>
              </div>
              <p className="text-muted-foreground">
                info@skyflowproduction.com<br />
                proyectos@skyflowproduction.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};