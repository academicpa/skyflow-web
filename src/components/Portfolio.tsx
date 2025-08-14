import { Card, CardContent } from '@/components/ui/card';
import { Play, ExternalLink } from 'lucide-react';
import producerImage from '@/assets/producer-working.jpg';
import videoImage from '@/assets/video-production.jpg';

export const Portfolio = () => {
  const projects = [
    {
      title: "Álbum 'Neon Dreams'",
      type: "Producción Musical",
      image: producerImage,
      description: "Producción completa de álbum conceptual con sonidos electrónicos y orgánicos."
    },
    {
      title: "Video 'Urban Pulse'",
      type: "Video Musical",
      image: videoImage,
      description: "Video musical cinematográfico con efectos visuales y narrativa urbana."
    },
    {
      title: "EP 'Midnight Sessions'",
      type: "Grabación & Mezcla",
      image: producerImage,
      description: "Sesiones nocturnas de grabación y mezcla para proyecto indie alternativo."
    },
    {
      title: "Documental 'Beats Underground'",
      type: "Postproducción",
      image: videoImage,
      description: "Postproducción completa de documental sobre la escena musical underground."
    }
  ];

  return (
    <section id="portfolio" className="py-20 px-6 bg-secondary/20">
      <div className="container mx-auto">
        <h2 className="section-title animate-fade-in">
          Nuestro Portafolio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className="group overflow-hidden border-border hover:border-neon-cyan/50 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-4">
                    <button className="p-3 bg-neon-cyan/20 backdrop-blur-md rounded-full hover:bg-neon-cyan/30 transition-colors">
                      <Play className="w-6 h-6 text-neon-cyan" />
                    </button>
                    <button className="p-3 bg-neon-purple/20 backdrop-blur-md rounded-full hover:bg-neon-purple/30 transition-colors">
                      <ExternalLink className="w-6 h-6 text-neon-purple" />
                    </button>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-2">
                  <span className="text-sm text-neon-cyan">{project.type}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{project.title}</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};