import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Video, Headphones, Palette, Mic, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Services = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      icon: <Camera className="w-12 h-12 text-neon-cyan" />,
      title: "Fotografía Profesional Creativa",
      description: "Capturamos la esencia de tu marca con imágenes profesionales que conectan emocionalmente. Desde retratos artísticos hasta sesiones comerciales que elevan tu presencia visual y cuentan tu historia única.",
      image: "/fotografia.png",
      examples: "Sesiones Fotográficas",
      serviceParam: "fotografia"
    },
    {
      icon: <Video className="w-12 h-12 text-neon-purple" />,
      title: "Producción Audiovisual",
      description: "Creamos contenido audiovisual que impacta y convierte. Videos musicales cinematográficos, comerciales publicitarios y contenido para redes sociales que hace que tu marca destaque en el mercado digital.",
      image: "/video.png",
      examples: "Videos Musicales",
      serviceParam: "video"
    },
    {
      icon: <Music className="w-12 h-12 text-neon-pink" />,
      title: "Producción Musical Profesional",
      description: "Transformamos tus ideas musicales en producciones profesionales de nivel internacional. Grabación, mezcla y masterización con la más alta calidad que hace que tu música suene como los grandes éxitos.",
      image: "/produccion.png",
      examples: "Producciones Musicales",
      serviceParam: "produccion"
    }
  ];

  return (
    <section id="services" className="py-20 px-6">
      <div className="container mx-auto">
        <h2 className="section-title animate-fade-in">
          Lo que hacemos por ti
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group overflow-hidden border-border hover:border-neon-cyan/50 transition-all duration-300 animate-fade-in hover:scale-102"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.examples}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-102"
                  style={{ aspectRatio: '9/16' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute top-4 left-4">
                  {service.icon}
                </div>
              </div>
              
              <CardContent className="p-8">
                <CardTitle className="text-xl text-foreground mb-4 leading-tight">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  {service.description}
                </CardDescription>
                <button 
                   onClick={() => navigate(`/cotizar?service=${service.serviceParam}`)}
                   className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                 >
                   Cotizar {service.title}
                 </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};