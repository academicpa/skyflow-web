import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Video, Music, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: <Camera className="w-12 h-12 text-neon-cyan" />,
      title: "Fotografía",
      description: "Imágenes que cuentan tu historia y conectan con tu audiencia.",
      details: [
        "Retratos artísticos profesionales",
        "Sesiones comerciales para marcas",
        "Fotografía de eventos y conciertos",
        "Edición y retoque avanzado",
        "Entrega en alta resolución"
      ],
      videoUrl: "/collage.png"
    },
    {
      icon: <Video className="w-12 h-12 text-neon-purple" />,
      title: "Video",
      description: "Videos que venden, emocionan y hacen que tu marca destaque.",
      details: [
        "Clips musicales cinematográficos",
        "Videos comerciales y publicitarios",
        "Contenido para redes sociales",
        "Postproducción y efectos visuales",
        "Entrega en 4K y formatos optimizados"
      ],
      videoUrl: "/collage.png"
    },
    {
      icon: <Music className="w-12 h-12 text-neon-pink" />,
      title: "Producción Musical",
      description: "Tu música como nunca antes. Sonido profesional garantizado.",
      details: [
        "Grabación en estudios acústicamente tratados",
        "Mezcla y masterización profesional",
        "Composición y arreglos musicales",
        "Diseño sonoro y efectos especiales",
        "Distribución digital en plataformas"
      ],
      videoUrl: "/collage.png"
    }
  ];

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
              Nuestros Servicios
            </h1>
            <p className="hero-subtitle mb-12 max-w-3xl mx-auto">
              Ofrecemos servicios completos de fotografía, video y producción musical 
              para artistas independientes y marcas que quieren destacar en el mercado.
            </p>
          </div>
        </section>

        {/* Services Detail Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {services.map((service, index) => (
                <div key={index} className="space-y-8">
                  {/* Video Vertical */}
                  <div className="relative overflow-hidden rounded-lg mx-auto max-w-sm">
                    <img 
                      src={service.videoUrl} 
                      alt={`${service.title} video`}
                      className="w-full h-96 object-cover"
                      style={{ aspectRatio: '9/16' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      {service.icon}
                      <h3 className="text-xl font-semibold text-white mt-2">{service.title}</h3>
                    </div>
                  </div>

                  {/* Service Details */}
                  <Card className="service-card p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-foreground mb-3">{service.title}</h3>
                      <p className="text-muted-foreground">{service.description}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-neon-cyan">¿Qué incluye?</h4>
                      <ul className="space-y-2">
                        {service.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start">
                            <span className="w-2 h-2 bg-neon-cyan rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-muted-foreground">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      className="w-full mt-6 btn-neon"
                      onClick={() => navigate('/cotizar')}
                    >
                      Cotizar {service.title}
                    </Button>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-secondary/20">
          <div className="container mx-auto text-center">
            <h2 className="section-title mb-6">
              ¿Listo para empezar tu proyecto?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contáctanos y cuéntanos sobre tu proyecto. Te ayudaremos a crear contenido 
              que conecte con tu audiencia y eleve tu marca al siguiente nivel.
            </p>
            <Button 
              className="btn-neon text-lg px-8 py-3"
              onClick={() => navigate('/cotizar')}
            >
              Solicitar Cotización
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;