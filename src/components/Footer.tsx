import { Instagram, Youtube, Music, Radio } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <span className="text-3xl font-bold text-neon-cyan">SKY</span>
              <span className="text-3xl font-bold text-neon-purple">FLOW</span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Estudio de producción musical y videos líder en Colombia. 
              Transformamos ideas en experiencias audiovisuales extraordinarias.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="p-2 rounded-full bg-secondary hover:bg-neon-cyan/20 transition-colors">
                <Instagram className="w-5 h-5 text-neon-cyan" />
              </a>
              <a href="#" className="p-2 rounded-full bg-secondary hover:bg-neon-purple/20 transition-colors">
                <Youtube className="w-5 h-5 text-neon-purple" />
              </a>
              <a href="#" className="p-2 rounded-full bg-secondary hover:bg-neon-pink/20 transition-colors">
                <Radio className="w-5 h-5 text-neon-pink" />
              </a>
              <a href="#" className="p-2 rounded-full bg-secondary hover:bg-electric-blue/20 transition-colors">
                <Music className="w-5 h-5 text-electric-blue" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Servicios</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-neon-cyan transition-colors animated-link">Producción Musical</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-neon-cyan transition-colors animated-link">Videos Musicales</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-neon-cyan transition-colors animated-link">Mezcla & Masterización</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-neon-cyan transition-colors animated-link">Postproducción</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">Zona Rosa, Bogotá</li>
              <li><a href="tel:+573014567890" className="text-muted-foreground hover:text-neon-cyan transition-colors">+57 301 456 7890</a></li>
              <li><a href="mailto:info@skyflowstudios.com" className="text-muted-foreground hover:text-neon-cyan transition-colors">info@skyflowstudios.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2024 Skyflow Studios. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};