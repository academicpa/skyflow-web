import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    if (location.pathname === '/' && path.startsWith('#')) {
      // Si estamos en home y es un anchor, hacer scroll
      const element = document.getElementById(path.substring(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    } else if (path.startsWith('/')) {
      // Si es una ruta, navegar
      navigate(path);
    } else {
      // Si no estamos en home, ir a home y luego hacer scroll
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(path.substring(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md border-b border-border' : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-6 py-4 max-w-[90%]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="SkyFlow Logo" 
              className="h-10 w-auto"
            />
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('/')}
              className="text-foreground hover:text-neon-cyan transition-colors animated-link"
            >
              Inicio
            </button>
            <button 
              onClick={() => handleNavigation('/servicios')}
              className="text-foreground hover:text-neon-cyan transition-colors animated-link"
            >
              Servicios
            </button>
            <button 
              onClick={() => handleNavigation('/portafolio')}
              className="text-foreground hover:text-neon-cyan transition-colors animated-link"
            >
              Portafolio
            </button>
            <button 
              onClick={() => handleNavigation('/cotizar')}
              className="text-foreground hover:text-neon-cyan transition-colors animated-link"
            >
              Cotización
            </button>
            <Button 
              onClick={() => handleNavigation('/login')}
              className="btn-neon bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple"
            >
              Acceder
            </Button>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground hover:text-neon-cyan transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-sm border-t border-border">
            <div className="px-6 py-4 space-y-4">
              <button 
                onClick={() => {
                  handleNavigation('/');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-foreground hover:text-neon-cyan transition-colors animated-link"
              >
                Inicio
              </button>
              <button 
                onClick={() => {
                  handleNavigation('/servicios');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-foreground hover:text-neon-cyan transition-colors animated-link"
              >
                Servicios
              </button>
              <button 
                onClick={() => {
                  handleNavigation('/portafolio');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-foreground hover:text-neon-cyan transition-colors animated-link"
              >
                Portafolio
              </button>
              <button 
                onClick={() => {
                  handleNavigation('/cotizar');
                  setIsMobileMenuOpen(false);
                }}
                className="block w-full text-left text-foreground hover:text-neon-cyan transition-colors animated-link"
              >
                Cotización
              </button>
              <Button 
                onClick={() => {
                  handleNavigation('/login');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full btn-neon bg-gradient-to-r from-neon-purple to-neon-cyan hover:from-neon-cyan hover:to-neon-purple"
              >
                Acceder
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};