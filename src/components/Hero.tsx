import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-studio.jpg';

export const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl">
        <div className="animate-fade-in">
          <h1 className="hero-title mb-6">
            SKYFLOW PRODUCTION
          </h1>
          <p className="hero-subtitle mb-8 max-w-3xl mx-auto">
            Estudio de producción musical y audiovisual de clase mundial. 
            Creamos experiencias sonoras y visuales que conectan con tu audiencia y elevan tu arte al siguiente nivel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={scrollToContact}
              className="btn-neon animate-glow-pulse"
            >
              Comienza tu proyecto
            </Button>
            <Button 
              variant="ghost" 
              className="text-foreground border border-border hover:border-neon-purple hover:bg-neon-purple/10"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver servicios
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-neon-cyan/20 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-neon-purple/20 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-neon-pink/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
    </section>
  );
};