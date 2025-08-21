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
            <CardContent className="p-4">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-neon-cyan mr-3" />
                <h3 className="text-lg font-semibold text-foreground">Ubicación</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Carrera 3 # 14 - 19<br />
                Anserma - Caldas<br />
                Colombia
              </p>
            </CardContent>
          </Card>

          <Card className="service-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-4">
              <div className="flex items-center mb-4">
                <Phone className="w-6 h-6 text-neon-purple mr-3" />
                <h3 className="text-lg font-semibold text-foreground">WhatsApp</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                +57 322 2051115
              </p>
            </CardContent>
          </Card>

          <Card className="service-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-4">
              <div className="flex items-center mb-4">
                <Mail className="w-6 h-6 text-neon-pink mr-3" />
                <h3 className="text-lg font-semibold text-foreground">Email</h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed break-words">
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