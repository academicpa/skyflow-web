import { Button } from '@/components/ui/button';

export const ProjectFunding = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              La manera más <span className="underline decoration-neon-cyan decoration-4">fácil</span> de conseguir 
              que tu <span className="italic text-neon-purple">música sea financiada</span> es 
              aplicar hoy
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Financiar tus primeros sueños musicales puede ser desafiante tu primer proyecto real. 
              Experimenta una nueva manera. Obtén tu proyecto en los ojos de 
              financiadores del ámbito musical.
            </p>
            <Button className="bg-neon-cyan text-background hover:bg-neon-cyan/90 px-8 py-4 text-lg font-semibold">
              Inicia tu proyecto →
            </Button>
          </div>

          {/* Right Content - Project Cards */}
          <div className="relative">
            <div className="space-y-4">
              {/* Card 1 - Main Project */}
              <div className="bg-card border border-border rounded-lg p-6 transform rotate-[2deg] hover:rotate-0 transition-transform duration-300 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-cyan rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">SK</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground mb-2">Skyflow 2024</h3>
                    <div className="text-sm text-muted-foreground mb-3">
                      <p>Álbum completo</p>
                      <p className="text-neon-cyan font-semibold">$15,000</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-neon-cyan rounded-full flex items-center justify-center">
                          <span className="text-background text-xs">✓</span>
                        </div>
                        <span className="text-xs text-foreground">Producción completa</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-neon-cyan rounded-full flex items-center justify-center">
                          <span className="text-background text-xs">✓</span>
                        </div>
                        <span className="text-xs text-foreground">Mix y mastering profesional</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-neon-cyan rounded-full flex items-center justify-center">
                          <span className="text-background text-xs">✓</span>
                        </div>
                        <span className="text-xs text-foreground">Videos musicales incluidos</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 - Secondary Project */}
              <div className="bg-card border border-border rounded-lg p-4 transform rotate-[-3deg] hover:rotate-0 transition-transform duration-300 shadow-lg ml-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-neon-pink to-electric-blue rounded-lg"></div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">EP Debut</h4>
                    <p className="text-xs text-muted-foreground">4 tracks • $8,500</p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Mini Project */}
              <div className="bg-card border border-border rounded-lg p-3 transform rotate-[4deg] hover:rotate-0 transition-transform duration-300 shadow-md mr-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-gold to-neon-purple rounded"></div>
                  <div>
                    <h5 className="font-medium text-foreground text-xs">Single Hit</h5>
                    <p className="text-xs text-neon-cyan">$2,500</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-neon-cyan/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-neon-purple/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};