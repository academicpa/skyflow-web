import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PortfolioPage = () => {
  const navigate = useNavigate();

  const portfolioItems = [
    {
      category: "Fotografía",
      title: "Recap Fotográfico - Momentos Únicos",
      client: "Diversos Clientes",
      date: "2025",
      description: "Una recopilación de nuestros mejores trabajos fotográficos. Desde quinceañeras hasta retratos corporativos, capturamos los momentos más importantes de nuestros clientes.",
      video: "/videos/Recap_fotos.mp4",
      details: [
        "Fotografía de quinceañeras y celebraciones",
        "Retratos corporativos y empresariales",
        "Sesiones familiares y personales",
        "Eventos especiales y sociales",
        "Más de 500 proyectos completados exitosamente"
      ]
    },
    {
      category: "Video",
      title: "Recap Audiovisual - Historias en Movimiento",
      client: "Artistas y Empresas",
      date: "2025",
      description: "Compilación de nuestros proyectos audiovisuales más destacados. Desde videos musicales hasta contenido comercial, capturamos la esencia de cada cliente.",
      video: "/videos/recap_marcas.mp4",
      details: [
        "Videos musicales para artistas emergentes",
        "Contenido comercial y publicitario",
        "Grabaciones de eventos y shows en vivo",
        "Documentales y entrevistas",
        "Colaboraciones con comediantes y creadores de contenido"
      ]
    },
    {
      category: "Producción Musical",
      title: "Recap Musical - El Arte de Crear Sonidos",
      client: "Artistas Diversos",
      date: "2025",
      description: "Un vistazo al proceso creativo en nuestro estudio. Extractos de diferentes sesiones donde artistas dan vida a sus ideas musicales con nuestra guía profesional.",
      video: "/videos/recap_musical.mp4",
      details: [
        "Sesiones de composición y arreglos",
        "Grabación con artistas de diversos géneros",
        "Proceso de mezcla y masterización",
        "Colaboraciones entre músicos locales",
        "Desde la idea inicial hasta el producto final"
      ]
    }
  ];

  const categories = ["Todos", "Fotografía", "Video", "Producción Musical"];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto text-center">

            <h1 className="hero-title mb-6">
              Nuestro Portafolio
            </h1>
            <p className="hero-subtitle mb-12 max-w-3xl mx-auto">
              Explora nuestros trabajos más recientes. Cada proyecto es único y refleja 
              nuestra pasión por crear contenido que conecta y emociona.
            </p>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioItems.map((item, index) => (
                <Card key={index} className="group overflow-hidden border-border hover:border-neon-cyan/50 transition-all duration-300">
                  {/* Video */}
                  <div className="relative overflow-hidden">
                    <video 
                      src={item.video} 
                      controls
                      muted
                      playsInline
                      className="w-full h-96 object-contain transition-transform duration-300 group-hover:scale-105"
                      style={{ aspectRatio: '9/16' }}
                    />
                  </div>
                  
                  {/* Category and Title - Moved outside video */}
                  <div className="p-4 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-neon-cyan/20 backdrop-blur-md text-neon-cyan text-xs font-medium px-3 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                    <div className="flex items-center text-sm text-gray-300">
                      <User className="w-3 h-3 mr-1" />
                      <span className="mr-3">{item.client}</span>
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{item.date}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="px-4 pb-6">
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-neon-cyan text-sm">Detalles del proyecto:</h4>
                      <ul className="space-y-1">
                        {item.details.slice(0, 3).map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start text-xs">
                            <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                            <span className="text-muted-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      variant="ghost" 
                      className="w-full mt-4 text-neon-cyan hover:text-white hover:bg-neon-cyan/20 border border-neon-cyan/30 text-sm"
                    >
                      Ver proyecto completo
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-secondary/20">
          <div className="container mx-auto text-center">
            <h2 className="section-title mb-6">
              ¿Te gusta lo que ves?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cada proyecto es una oportunidad de crear algo único. 
              Cuéntanos sobre tu idea y hagamos realidad tu visión.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="btn-neon text-lg px-8 py-3"
                onClick={() => navigate('/cotizar')}
              >
                Iniciar mi proyecto
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PortfolioPage;