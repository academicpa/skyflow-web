import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Video, Headphones, Palette, Mic, Camera } from 'lucide-react';

export const Services = () => {
  const services = [
    {
      icon: <Music className="w-8 h-8 text-neon-cyan" />,
      title: "Producción Musical",
      description: "Composición, arreglos y producción completa de tus canciones con la más alta calidad."
    },
    {
      icon: <Video className="w-8 h-8 text-neon-purple" />,
      title: "Videos Musicales",
      description: "Conceptualización y producción de videos cinematográficos que complementan tu música."
    },
    {
      icon: <Headphones className="w-8 h-8 text-neon-pink" />,
      title: "Mezcla & Masterización",
      description: "Procesamiento profesional para lograr el sonido perfecto en cualquier plataforma."
    },
    {
      icon: <Palette className="w-8 h-8 text-electric-blue" />,
      title: "Diseño Sonoro",
      description: "Creación de paisajes sonoros únicos y efectos especiales para tus proyectos."
    },
    {
      icon: <Mic className="w-8 h-8 text-gold" />,
      title: "Grabación",
      description: "Estudios equipados con tecnología de punta para grabaciones de alta fidelidad."
    },
    {
      icon: <Camera className="w-8 h-8 text-neon-cyan" />,
      title: "Postproducción",
      description: "Edición y efectos visuales profesionales para llevar tus videos al siguiente nivel."
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