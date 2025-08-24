import { Instagram, Youtube, Music } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="container mx-auto max-w-[90%]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center text-center md:text-left">
          {/* Logo & Description */}
          <div>
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="Skyflow Production" className="h-12 w-auto" />
            </div>
            <p className="text-muted-foreground text-sm">
              Estudio de producción musical y audiovisual especializado en crear contenido de calidad.
            </p>
            <div className="flex space-x-3 mt-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary hover:bg-neon-cyan/20 transition-colors">
                <Instagram className="w-4 h-4 text-neon-cyan" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary hover:bg-neon-purple/20 transition-colors">
                <Youtube className="w-4 h-4 text-neon-purple" />
              </a>
              <a href="https://spotify.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-secondary hover:bg-neon-pink/20 transition-colors">
                <Music className="w-4 h-4 text-neon-pink" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li><a href="/servicios" className="text-muted-foreground hover:text-neon-cyan transition-colors text-sm">Producción Musical</a></li>
              <li><a href="/servicios" className="text-muted-foreground hover:text-neon-cyan transition-colors text-sm">Videos Musicales</a></li>
              <li><a href="/servicios" className="text-muted-foreground hover:text-neon-cyan transition-colors text-sm">Mezcla & Masterización</a></li>
              <li><a href="/cotizar" className="text-muted-foreground hover:text-neon-purple transition-colors text-sm font-medium">Cotizar Proyecto</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li><a href="tel:+573222051115" className="text-muted-foreground hover:text-neon-cyan transition-colors text-sm">+57 322 2051115</a></li>
              <li><a href="mailto:info@skyflowproduction.com" className="text-muted-foreground hover:text-neon-cyan transition-colors text-sm">info@skyflowproduction.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2025 Skyflow Production. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};