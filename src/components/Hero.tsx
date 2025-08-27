import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-studio.jpg';

export const Hero = () => {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/40 to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl">
        <div className="animate-fade-in">
          <h1 className="hero-title mb-6">
            Hacemos que tu imagen se vea increíble
          </h1>
          <p className="hero-subtitle mb-8 max-w-3xl mx-auto">
            Fotografía, video y producción musical para artistas y marcas que quieren destacar. 
            Tu proyecto merece verse y sonar profesional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/cotizar">
              <Button className="btn-neon animate-glow-pulse text-lg px-8 py-3">
                Cotiza tu proyecto
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/portafolio">
              <Button 
                variant="outline" 
                className="text-foreground border-2 border-neon-purple/50 hover:border-neon-purple hover:bg-neon-purple/10 hover:text-white px-8 py-3 text-lg font-semibold transition-all duration-300"
              >
                Ver qué hacemos
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-neon-cyan/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-32 right-16 w-32 h-32 bg-neon-purple/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-neon-pink/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
    </section>
  );
};