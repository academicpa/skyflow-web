import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensaje enviado",
      description: "Te contactaremos pronto para discutir tu proyecto.",
    });
    setFormData({ name: '', email: '', phone: '', project: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 px-6 bg-secondary/20">
      <div className="container mx-auto">
        <h2 className="section-title animate-fade-in">
          Contactanos
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <Card className="lg:col-span-2 service-card animate-fade-in">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Cuéntanos sobre tu proyecto</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-foreground">Nombre completo</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="bg-input border-border focus:border-neon-cyan"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-foreground">Correo electrónico</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="bg-input border-border focus:border-neon-cyan"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-foreground">Teléfono</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="bg-input border-border focus:border-neon-cyan"
                    />
                  </div>
                  <div>
                    <Label htmlFor="project" className="text-foreground">Tipo de proyecto</Label>
                    <Input
                      id="project"
                      name="project"
                      value={formData.project}
                      onChange={handleChange}
                      className="bg-input border-border focus:border-neon-cyan"
                      placeholder="Producción, Video, Mezcla..."
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="message" className="text-foreground">Mensaje</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="bg-input border-border focus:border-neon-cyan min-h-32"
                    placeholder="Cuéntanos más sobre tu proyecto..."
                    required
                  />
                </div>
                <Button type="submit" className="btn-neon w-full">
                  Enviar mensaje
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="service-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="w-6 h-6 text-neon-cyan mr-3" />
                  <h3 className="text-lg font-semibold text-foreground">Ubicación</h3>
                </div>
                <p className="text-muted-foreground">
                  Calle 85 #11-45<br />
                  Zona Rosa, Bogotá<br />
                  Colombia
                </p>
              </CardContent>
            </Card>

            <Card className="service-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-neon-purple mr-3" />
                  <h3 className="text-lg font-semibold text-foreground">Teléfono</h3>
                </div>
                <p className="text-muted-foreground">
                  +57 301 456 7890<br />
                  +57 1 234 5678
                </p>
              </CardContent>
            </Card>

            <Card className="service-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-neon-pink mr-3" />
                  <h3 className="text-lg font-semibold text-foreground">Email</h3>
                </div>
                <p className="text-muted-foreground">
                  info@skyflowstudios.com<br />
                  proyectos@skyflowstudios.com
                </p>
              </CardContent>
            </Card>

            <Card className="service-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-electric-blue mr-3" />
                  <h3 className="text-lg font-semibold text-foreground">Horarios</h3>
                </div>
                <p className="text-muted-foreground">
                  Lun - Vie: 9:00 AM - 10:00 PM<br />
                  Sáb: 10:00 AM - 8:00 PM<br />
                  Dom: Citas especiales
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};