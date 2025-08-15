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
      title: "Sesión Artística - Luna Roja",
      client: "Artista Independiente",
      date: "2024",
      description: "Sesión fotográfica conceptual para el lanzamiento del EP 'Luna Roja'. Retratos artísticos que capturan la esencia melancólica y poética de la propuesta musical.",
      image: "/collage.png",
      details: [
        "Concepto visual desarrollado en colaboración con la artista",
        "Sesión en locación urbana y estudio",
        "15 fotografías finales en alta resolución",
        "Edición y retoque profesional",
        "Entrega para uso en redes sociales y promoción"
      ]
    },
    {
      category: "Video",
      title: "Video Musical - 'Neon Dreams'",
      client: "Banda Electrónica",
      date: "2024",
      description: "Video musical cinematográfico con estética cyberpunk. Narrativa visual que complementa la propuesta sonora electrónica de la banda.",
      image: "/collage.png",
      details: [
        "Preproducción completa: storyboard y planificación",
        "Grabación en 4K con equipos profesionales",
        "Efectos visuales y color grading avanzado",
        "Postproducción de audio sincronizada",
        "Entrega optimizada para YouTube y redes sociales"
      ]
    },
    {
      category: "Producción Musical",
      title: "EP 'Midnight Sessions'",
      client: "Proyecto Indie",
      date: "2024",
      description: "Producción completa de EP de 5 tracks. Grabación, mezcla y masterización de proyecto indie alternativo con sonidos orgánicos y electrónicos.",
      image: "/collage.png",
      details: [
        "Preproducción y arreglos musicales",
        "Grabación en estudio acústicamente tratado",
        "Mezcla analógica y digital híbrida",
        "Masterización para streaming y vinilo",
        "Distribución digital en todas las plataformas"
      ]
    },
    {
      category: "Fotografía",
      title: "Campaña Comercial - Marca de Ropa",
      client: "Fashion Brand",
      date: "2024",
      description: "Sesión fotográfica comercial para campaña de temporada. Fotografías de producto y lifestyle que reflejan la identidad de marca.",
      image: "/collage.png",
      details: [
        "Desarrollo de concepto visual de marca",
        "Sesión con modelos profesionales",
        "Fotografía de producto en estudio",
        "20 imágenes finales para campaña",
        "Adaptación para diferentes formatos digitales"
      ]
    },
    {
      category: "Video",
      title: "Documental Musical - 'Beats Underground'",
      client: "Productora Cultural",
      date: "2024",
      description: "Documental de 30 minutos sobre la escena musical underground local. Entrevistas, performances en vivo y narrativa documental.",
      image: "/collage.png",
      details: [
        "Investigación y desarrollo de narrativa",
        "Grabación de entrevistas y performances",
        "Edición documental con múltiples cámaras",
        "Diseño sonoro y mezcla de audio",
        "Entrega para festivales y plataformas digitales"
      ]
    },
    {
      category: "Producción Musical",
      title: "Single 'Urban Pulse'",
      client: "Artista Hip-Hop",
      date: "2024",
      description: "Producción de single hip-hop con elementos urbanos contemporáneos. Grabación de voces, producción de beats y masterización final.",
      image: "/collage.png",
      details: [
        "Producción de instrumental original",
        "Grabación de voces principales y coros",
        "Mezcla con procesamiento vocal avanzado",
        "Masterización para máximo impacto",
        "Versiones instrumentales y acapella"
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
            <Button 
              onClick={() => navigate('/')}
              variant="ghost" 
              className="mb-8 text-neon-cyan hover:text-neon-purple"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
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
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-neon-cyan/20 backdrop-blur-md text-neon-cyan text-xs font-medium px-3 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                      <div className="flex items-center text-sm text-gray-300">
                        <User className="w-3 h-3 mr-1" />
                        <span className="mr-3">{item.client}</span>
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
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
                      className="w-full mt-4 text-neon-purple hover:text-neon-cyan text-sm"
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
                onClick={() => navigate('/')}
              >
                Iniciar mi proyecto
              </Button>
              <Button 
                variant="ghost" 
                className="text-foreground border border-border hover:border-neon-purple hover:bg-neon-purple/10"
                onClick={() => navigate('/services')}
              >
                Ver servicios
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