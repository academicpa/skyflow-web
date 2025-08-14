import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Video, Headphones, Palette, Mic, Camera } from 'lucide-react';

export const Services = () => {
  const services = [
    {
      icon: <Music className="w-8 h-8 text-neon-cyan" />,
      title: "Producción Musical",
      description: "Composición, arreglos y producción integral con estándares internacionales. Desde la idea hasta el master final."
    },
    {
      icon: <Video className="w-8 h-8 text-neon-purple" />,
      title: "Videos Musicales",
      description: "Narrativa visual cinematográfica que potencia tu música. Desde el concepto hasta la entrega final en 4K."
    },
    {
      icon: <Headphones className="w-8 h-8 text-neon-pink" />,
      title: "Mezcla & Masterización",
      description: "Procesamiento de audio con tecnología de vanguardia. Sonido competitivo para todas las plataformas digitales."
    },
    {
      icon: <Palette className="w-8 h-8 text-electric-blue" />,
      title: "Diseño Sonoro",
      description: "Paisajes sonoros inmersivos y efectos especiales únicos que definen la identidad de tu proyecto."
    },
    {
      icon: <Mic className="w-8 h-8 text-gold" />,
      title: "Grabación",
      description: "Estudios acústicamente tratados con equipos de gama alta. Capturamos cada detalle de tu interpretación."
    },
    {
      icon: <Camera className="w-8 h-8 text-neon-cyan" />,
      title: "Postproducción",
      description: "Edición avanzada, color grading y VFX. Transformamos material bruto en contenido de impacto visual."
    }
  ];

  return (
    <section id="services" className="py-20 px-6">
      <div className="container mx-auto">
        <h2 className="section-title animate-fade-in">
          Nuestros Servicios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="service-card animate-fade-in hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className="mb-4">
                  {service.icon}
                </div>
                <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};