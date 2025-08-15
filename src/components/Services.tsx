import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, Video, Headphones, Palette, Mic, Camera } from 'lucide-react';

export const Services = () => {
  const services = [
    {
      icon: <Camera className="w-12 h-12 text-neon-cyan" />,
      title: "Fotografía",
      description: "Imágenes que cuentan tu historia. Desde retratos artísticos hasta sesiones comerciales que conectan con tu audiencia.",
      image: "/collage.png",
      examples: "Sesiones Fotográficas"
    },
    {
      icon: <Video className="w-12 h-12 text-neon-purple" />,
      title: "Video",
      description: "Videos que venden y emocionan. Clips musicales, comerciales y contenido publicitario que hace que tu marca destaque.",
      image: "/collage.png",
      examples: "Videos Musicales"
    },
    {
      icon: <Music className="w-12 h-12 text-neon-pink" />,
      title: "Producción Musical",
      description: "Tu música como nunca antes. Grabación, mezcla y masterización que hace que suenes como los grandes.",
      image: "/collage.png",
      examples: "Producciones Musicales"
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
              className="group overflow-hidden border-border hover:border-neon-cyan/50 transition-all duration-300 animate-fade-in hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.examples}
                  className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                  style={{ aspectRatio: '9/16' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute top-4 left-4">
                  {service.icon}
                </div>
              </div>
              
              <CardContent className="p-6">
                <CardTitle className="text-xl text-foreground mb-3">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground mb-4 line-clamp-3">
                  {service.description}
                </CardDescription>
                <button 
                   onClick={() => window.location.href = '/cotizar'}
                   className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
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