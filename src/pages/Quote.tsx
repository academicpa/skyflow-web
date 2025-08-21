import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Calculator, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const Quote = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    timeline: '',
    message: ''
  });

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      setFormData(prev => ({ ...prev, service: serviceParam }));
    }
    // Scroll al inicio de la página cuando se carga el componente
    window.scrollTo(0, 0);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Cotización enviada",
      description: "Te contactaremos en menos de 24 horas con tu cotización personalizada.",
    });
    setFormData({ name: '', email: '', phone: '', service: '', budget: '', timeline: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-24 pb-12 px-6 bg-gradient-to-br from-background via-secondary/20 to-background">
        <div className="container mx-auto text-center">

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Cotiza tu proyecto
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cuéntanos sobre tu proyecto y te enviaremos una cotización personalizada en menos de 24 horas.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center">
            <Card className="w-full max-w-3xl service-card animate-fade-in">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center">
                  <Calculator className="w-6 h-6 mr-3 text-neon-cyan" />
                  Formulario de cotización
                </CardTitle>
                <p className="text-muted-foreground">
                  Completa la información para recibir una cotización precisa y personalizada.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-foreground">Nombre completo *</Label>
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
                      <Label htmlFor="email" className="text-foreground">Correo electrónico *</Label>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="service" className="text-foreground">Servicio requerido *</Label>
                      <Select value={formData.service} onValueChange={(value) => setFormData({...formData, service: value})}>
                        <SelectTrigger className="bg-input border-border focus:border-neon-cyan">
                          <SelectValue placeholder="Selecciona un servicio" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fotografia">Fotografía</SelectItem>
                          <SelectItem value="video">Video Musical</SelectItem>
                          <SelectItem value="produccion">Producción Musical</SelectItem>
                          <SelectItem value="mezcla">Mezcla y Masterización</SelectItem>
                          <SelectItem value="combo">Paquete Completo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="budget" className="text-foreground">Presupuesto estimado</Label>
                      <Select onValueChange={(value) => setFormData({...formData, budget: value})}>
                        <SelectTrigger className="bg-input border-border focus:border-neon-cyan">
                          <SelectValue placeholder="Rango de presupuesto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500-1000">$500.000 - $1.000.000</SelectItem>
                          <SelectItem value="1000-2500">$1.000.000 - $2.500.000</SelectItem>
                          <SelectItem value="2500-5000">$2.500.000 - $5.000.000</SelectItem>
                          <SelectItem value="5000+">Más de $5.000.000</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="timeline" className="text-foreground">Tiempo estimado del proyecto</Label>
                    <Select onValueChange={(value) => setFormData({...formData, timeline: value})}>
                      <SelectTrigger className="bg-input border-border focus:border-neon-cyan">
                        <SelectValue placeholder="¿Cuándo necesitas el proyecto?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgente">Urgente (1-2 semanas)</SelectItem>
                        <SelectItem value="normal">Normal (3-4 semanas)</SelectItem>
                        <SelectItem value="flexible">Flexible (1-2 meses)</SelectItem>
                        <SelectItem value="planificado">Planificado (más de 2 meses)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-foreground">Detalles del proyecto *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="bg-input border-border focus:border-neon-cyan min-h-32"
                      placeholder="Cuéntanos más sobre tu proyecto, objetivos, referencias, etc..."
                      required
                    />
                  </div>
                  <Button type="submit" className="btn-neon w-full text-lg py-4">
                    <Calculator className="w-5 h-5 mr-2" />
                    Enviar solicitud de cotización
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
              Información de contacto
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card className="service-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <CardContent className="p-4">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-6 h-6 text-neon-cyan mr-3" />
                    <h3 className="text-lg font-semibold text-foreground">Ubicación</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Carrera 3 # 14 - 19<br />
                    Anserma - Caldas<br />
                    Colombia
                  </p>
                </CardContent>
              </Card>

              <Card className="service-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardContent className="p-4">
                  <div className="flex items-center mb-4">
                    <Phone className="w-6 h-6 text-neon-purple mr-3" />
                    <h3 className="text-lg font-semibold text-foreground">WhatsApp</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    +57 322 2051115
                  </p>
                </CardContent>
              </Card>

              <Card className="service-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <CardContent className="p-4">
                  <div className="flex items-center mb-4">
                    <Mail className="w-6 h-6 text-neon-pink mr-3" />
                    <h3 className="text-lg font-semibold text-foreground">Email</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed break-words">
                    info@skyflowproduction.com<br />
                    proyectos@skyflowproduction.com
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Quote;