import { Button } from '@/components/ui/button';

export const TeamSection = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 bg-neon-cyan/10 border border-neon-cyan/20 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-neon-cyan rounded-full"></div>
            <span className="text-sm text-neon-cyan font-medium">Nuestro equipo creativo</span>
          </div>

          {/* Main Content */}
          <div className="mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Conoce Tu <span className="italic text-neon-purple">Nuevo Estudio</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
              ¿Por qué elegir un freelancer cuando puedes tener todo un estudio dedicado a tu música? 
              Desde productores hasta especialistas en mezcla, nuestro equipo es la columna vertebral de tu éxito, 
              donde la creatividad cobra vida.
            </p>
            <Button className="bg-neon-cyan text-background hover:bg-neon-cyan/90 px-8 py-3 text-base font-semibold">
              Conoce Más de Nosotros
            </Button>
          </div>
        </div>

        {/* Polaroid Photos Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
            {/* Photo 1 */}
            <div className="polaroid-card transform rotate-[-8deg] hover:rotate-0 transition-transform duration-300">
              <div className="bg-white p-3 shadow-xl">
                <div className="w-32 h-24 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 mb-2"></div>
                <p className="text-xs text-gray-800 text-center">David junto a nuestro equipo de productores</p>
              </div>
            </div>

            {/* Photo 2 */}
            <div className="polaroid-card transform rotate-[12deg] hover:rotate-0 transition-transform duration-300">
              <div className="bg-white p-3 shadow-xl">
                <div className="w-32 h-24 bg-gradient-to-br from-neon-pink/20 to-electric-blue/20 mb-2"></div>
                <p className="text-xs text-gray-800 text-center">Sesión Beat Making Exclusiva</p>
              </div>
            </div>

            {/* Photo 3 */}
            <div className="polaroid-card transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
              <div className="bg-white p-3 shadow-xl">
                <div className="w-32 h-24 bg-gradient-to-br from-gold/20 to-neon-purple/20 mb-2"></div>
                <p className="text-xs text-gray-800 text-center">Mix and mastering en proceso</p>
              </div>
            </div>

            {/* Photo 4 */}
            <div className="polaroid-card transform rotate-[8deg] hover:rotate-0 transition-transform duration-300">
              <div className="bg-white p-3 shadow-xl">
                <div className="w-32 h-24 bg-gradient-to-br from-neon-cyan/20 to-neon-pink/20 mb-2"></div>
                <p className="text-xs text-gray-800 text-center">Beat ready para entrega</p>
              </div>
            </div>

            {/* Photo 5 */}
            <div className="polaroid-card transform rotate-[-12deg] hover:rotate-0 transition-transform duration-300">
              <div className="bg-white p-3 shadow-xl">
                <div className="w-32 h-24 bg-gradient-to-br from-electric-blue/20 to-gold/20 mb-2"></div>
                <p className="text-xs text-gray-800 text-center">Nuestro estudio y espacio creativo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-neon-purple/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 bg-neon-cyan/10 rounded-full blur-2xl"></div>
    </section>
  );
};