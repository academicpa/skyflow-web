import { Card } from '@/components/ui/card';

export const Portfolio = () => {
  const projects = [
    {
      title: "Sesiones Fotográficas",
      type: "Fotografía",
      image: "/collage.png",
      description: "Retratos artísticos y sesiones comerciales que capturan la esencia de cada artista."
    },
    {
      title: "Videos Musicales",
      type: "Video",
      image: "/collage.png",
      description: "Clips musicales y contenido comercial que conecta con tu audiencia."
    },
    {
      title: "Producciones Musicales",
      type: "Producción Musical",
      image: "/collage.png",
      description: "Grabación, mezcla y masterización que hace que tu música suene profesional."
    }
  ];

  return (
    <section id="portfolio" className="py-20 px-6 bg-secondary/20">
      <div className="container mx-auto">
        <h2 className="section-title animate-fade-in">
          Mira lo que hemos hecho
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <Card 
              key={index} 
              className="group overflow-hidden border-border hover:border-neon-cyan/50 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-80 object-contain transition-transform duration-300 group-hover:scale-105 bg-background/10"
                  style={{ aspectRatio: '9/16' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-sm text-neon-cyan font-medium">{project.type}</span>
                  <h3 className="text-lg font-semibold text-white mt-1">{project.title}</h3>
                </div>
              </div>

            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};