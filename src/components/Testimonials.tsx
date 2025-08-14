import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export const Testimonials = () => {
  const testimonials = [
    {
      name: "María González",
      role: "Cantautora",
      content: "Skyflow transformó completamente mi visión musical. Su profesionalismo y creatividad superaron todas mis expectativas.",
      rating: 5
    },
    {
      name: "Carlos Mendoza",
      role: "Productor Independiente",
      content: "El estudio cuenta con la mejor tecnología y un equipo excepcional. Cada proyecto es tratado con dedicación única.",
      rating: 5
    },
    {
      name: "Ana Rodríguez",
      role: "Directora de Video",
      content: "La postproducción de mi último video fue impecable. Skyflow entiende la importancia de cada detalle visual.",
      rating: 5
    },
    {
      name: "Luis Torres",
      role: "Músico Electrónico",
      content: "Su enfoque innovador en la producción electrónica es extraordinario. Lograron el sonido exacto que buscaba.",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-20 px-6">
      <div className="container mx-auto">
        <h2 className="section-title animate-fade-in">
          Lo que dicen nuestros clientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="service-card animate-slide-in-left"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-neon-cyan">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};