import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Video, Music, ArrowLeft, Check, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Services = () => {
  const navigate = useNavigate();
  const [selectedPlans, setSelectedPlans] = useState({
    fotografia: 'basico',
    audiovisual: 'basico',
    musical: 'basico'
  });
  const [selectedQuantities, setSelectedQuantities] = useState({
    fotografia: null as number | null
  });
  
  const serviceData = {
    fotografia: {
      icon: <Camera className="w-12 h-12 text-neon-cyan" />,
      title: "Sesión de fotos",
      image: "/fotografia.png",
      plans: {
        basico: {
          title: "Básico",
          description: "Incluye producción y edición de fotografía",
          note: "(No incluye impresión en físico)",
          quantities: {
            5: { price: "$30.000", description: "5 fotografías" },
            10: { price: "$50.000", description: "10 fotografías" },
            20: { price: "$80.000", description: "20 fotografías" }
          }
        },
        intermedio: {
          title: "Intermedio",
          description: "Incluye producción, edición de fotografía y impresiones en físico 20×30cm en retablo",
          quantities: {
            5: { price: "$50.000", description: "5 fotografías", extra: "1 fotografía impresa 20×30" },
            10: { price: "$100.000", description: "10 fotografías", extra: "2 fotografías impresas 20×30" },
            20: { price: "$200.000", description: "20 fotografías", extra: "4 fotografías impresas 20×30" }
          }
        },
        premium: {
          title: "Premium",
          description: "Incluye producción, edición de fotografía, impresiones en retablo y 20% de descuento para tu próxima sesión",
          quantities: {
            5: { price: "$100.000", description: "5 fotografías", extra: "1 fotografía impresa 20×30, 1 fotografía impresa 30×40" },
            10: { price: "$200.000", description: "10 fotografías", extra: "2 fotografías impresas 20×30, 2 fotografías impresas 30×40" },
            20: { price: "$400.000", description: "20 fotografías", extra: "2 fotografías impresas 20×30, 2 fotografías impresas 30×40 y una de 50×70" }
          }
        }
      }
    },
    audiovisual: {
      icon: <Video className="w-12 h-12 text-neon-purple" />,
      title: "Producción audiovisual",
      image: "/video.png",
      plans: {
        basico: {
          title: "Básico",
          description: "1 vídeo institucional en calidad full HD grabado con equipos profesionales (cámaras, luces, gimbal, trípode y micrófonos). (No incluye sesión fotográfica)",
          options: [
            { service: "1 video institucional Full HD", price: "$130.000", available: true },
            { service: "Sesión de fotos", price: "", available: false },
            { service: "Ediciones de flyers", price: "", available: false },
            { service: "Publicidad en redes sociales", price: "", available: false }
          ]
        },
        intermedio: {
          title: "Intermedio",
          description: "2 videos institucionales en calidad full HD y una sesión de fotos de productos o servicios, grabado con equipos profesionales.",
          options: [
            { service: "2 videos institucionales en calidad full HD", price: "$250.000", available: true },
            { service: "1 sesión de fotos de productos o servicios", price: "", available: true },
            { service: "Ediciones de flyers", price: "", available: false },
            { service: "Publicidad en redes sociales", price: "", available: false }
          ]
        },
        premium: {
          title: "Premium",
          description: "4 videos institucionales en calidad full HD, una sesión de fotos, 2 ediciones de imágenes tipo flyers y publicidad en nuestras redes sociales.",
          options: [
            { service: "4 videos institucionales en calidad full HD", price: "$500.000", available: true },
            { service: "1 sesión de fotos profesional", price: "", available: true },
            { service: "2 ediciones de imágenes tipo flyers", price: "", available: true },
            { service: "Publicidad en nuestras redes sociales", price: "", available: true }
          ]
        }
      }
    },
    musical: {
      icon: <Music className="w-12 h-12 text-neon-pink" />,
      title: "Producción musical",
      image: "/produccion.png",
      plans: {
        basico: {
          title: "Básico",
          description: "Grabación de voces, mezcla y masterización (No incluye instrumental). Entrega de audio en formato wav",
          options: [
            { service: "Grabación de voces", price: "$200.000", available: true },
            { service: "Mezcla profesional", price: "", available: true },
            { service: "Masterización", price: "", available: true },
            { service: "Entrega en formato WAV", price: "", available: true },
            { service: "Instrumental incluido", price: "", available: false },
            { service: "Videoclip base", price: "", available: false },
            { service: "Promoción en redes sociales", price: "", available: false }
          ]
        },
        intermedio: {
          title: "Intermedio",
          description: "Grabación de voces, mezcla, masterización e instrumental, y entrega de audio en formato wav",
          options: [
            { service: "Grabación de voces", price: "$350.000", available: true },
            { service: "Mezcla profesional", price: "", available: true },
            { service: "Masterización", price: "", available: true },
            { service: "Instrumental incluido", price: "", available: true },
            { service: "Entrega en formato WAV", price: "", available: true },
            { service: "Videoclip base", price: "", available: false },
            { service: "Promoción en redes sociales", price: "", available: false }
          ]
        },
        premium: {
          title: "Premium",
          description: "Grabación de voces, mezcla, masterización e instrumental, entrega de audio en formato wav, un vídeoclip base y promoción en nuestras redes sociales.",
          options: [
            { service: "Grabación de voces", price: "$650.000", available: true },
            { service: "Mezcla profesional", price: "", available: true },
            { service: "Masterización", price: "", available: true },
            { service: "Instrumental incluido", price: "", available: true },
            { service: "Videoclip base", price: "", available: true },
            { service: "Promoción en redes sociales", price: "", available: true },
            { service: "Entrega en formato WAV", price: "", available: true }
          ]
        }
      }
    }
  };

  const handlePlanChange = (serviceKey: string, plan: string) => {
    setSelectedPlans(prev => ({
      ...prev,
      [serviceKey]: plan
    }));
    // Keep quantity selection when changing photography plan
  };

  const handleQuantityChange = (quantity: number) => {
    setSelectedQuantities(prev => ({
      ...prev,
      fotografia: quantity
    }));
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto text-center">

            <h1 className="hero-title mb-6">
              Nuestros Servicios
            </h1>
            <p className="hero-subtitle mb-12 max-w-3xl mx-auto">
              Ofrecemos servicios completos de fotografía, video y producción musical 
              para artistas independientes y marcas que quieren destacar en el mercado.
            </p>
          </div>
        </section>

        {/* Services Detail Section */}
        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {Object.entries(serviceData).map(([serviceKey, service]) => {
                const selectedPlan = selectedPlans[serviceKey as keyof typeof selectedPlans];
                const currentPlan = service.plans[selectedPlan as keyof typeof service.plans];
                
                // Special handling for photography service
                if (serviceKey === 'fotografia') {
                  const selectedQuantity = selectedQuantities.fotografia;
                  const currentQuantityData = selectedQuantity ? currentPlan.quantities[selectedQuantity] : null;
                  
                  return (
                    <div key={serviceKey} className="space-y-6">
                      {/* Service Icon and Title */}
                      <div className="text-center space-y-2">
                        <div className="flex justify-center">
                          {service.icon}
                        </div>
                        <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                      </div>
                      
                      {/* Service Image */}
                      <div className="relative overflow-hidden rounded-lg mx-auto max-w-sm">
                        <img 
                          src={service.image} 
                          alt={`${service.title} image`}
                          className="w-full object-cover"
                          style={{ aspectRatio: '9/16' }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                      </div>

                      {/* Service Details */}
                      <Card className="service-card p-6 min-h-[500px] flex flex-col">
                        <div className="text-center mb-4">
                          <h3 className="text-2xl font-bold text-neon-cyan mb-2">{service.title}</h3>
                          
                          {/* Plan Selection Buttons */}
                          <div className="flex gap-1 justify-center mb-3">
                            {Object.keys(service.plans).map((planKey) => (
                              <button
                                key={planKey}
                                onClick={() => handlePlanChange(serviceKey, planKey)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                                  selectedPlan === planKey
                                    ? 'bg-neon-purple text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {service.plans[planKey as keyof typeof service.plans].title}
                              </button>
                            ))}
                          </div>
                          
                          {/* Quantity Selection Buttons */}
                          <div className="flex gap-2 justify-center mb-4">
                            {[5, 10, 20].map((quantity) => (
                              <button
                                key={quantity}
                                onClick={() => handleQuantityChange(quantity)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 border-2 ${
                                  selectedQuantity === quantity
                                    ? 'border-neon-purple text-neon-purple bg-neon-purple/10'
                                    : 'border-gray-300 text-gray-600 hover:border-gray-400 bg-transparent'
                                }`}
                              >
                                {quantity}
                              </button>
                            ))}
                          </div>
                          
                          <h4 className="text-lg font-semibold text-neon-purple mb-2">
                            {selectedQuantity ? `${currentPlan.title} x ${selectedQuantity}` : currentPlan.title}
                          </h4>
                          <p className="text-muted-foreground text-sm">{currentPlan.description}</p>
                          {currentPlan.note && (
                            <p className="text-muted-foreground text-xs mt-1">{currentPlan.note}</p>
                          )}
                        </div>
                        
                        <div className="flex-grow">
                           {selectedQuantity && currentQuantityData ? (
                             <div className="space-y-2">
                               <ul className="space-y-2 text-foreground">
                                 <li className="flex items-start gap-2">
                                   <span className="mt-1 text-neon-purple">•</span>
                                   <div>
                                     <span className="font-medium">
                                       {currentQuantityData.description} - {currentQuantityData.price}
                                     </span>
                                   </div>
                                 </li>
                                 <li className="flex items-start gap-2">
                                   <span className="mt-1 text-neon-purple">•</span>
                                   <div>
                                     <span className="font-medium">Producción y edición de fotografía</span>
                                   </div>
                                 </li>
                                 {selectedPlan === 'basico' ? (
                                   <>
                                     <li className="flex items-start gap-2">
                                       <span className="mt-1 text-gray-400">✗</span>
                                       <div>
                                         <span className="font-medium line-through opacity-50 text-gray-500">
                                           Impresiones físicas
                                         </span>
                                       </div>
                                     </li>
                                     <li className="flex items-start gap-2">
                                       <span className="mt-1 text-gray-400">✗</span>
                                       <div>
                                         <span className="font-medium line-through opacity-50 text-gray-500">
                                           Descuento próxima sesión
                                         </span>
                                       </div>
                                     </li>
                                   </>
                                 ) : (
                                   <>
                                     <li className="flex items-start gap-2">
                                       <span className="mt-1 text-neon-purple">•</span>
                                       <div>
                                         <span className="font-medium">Impresiones físicas incluidas</span>
                                         {currentQuantityData.extra && (
                                           <p className="text-sm text-muted-foreground mt-1">
                                             {currentQuantityData.extra}
                                           </p>
                                         )}
                                       </div>
                                     </li>
                                     {selectedPlan === 'premium' ? (
                                       <li className="flex items-start gap-2">
                                         <span className="mt-1 text-neon-purple">•</span>
                                         <div>
                                           <span className="font-medium">20% descuento próxima sesión</span>
                                         </div>
                                       </li>
                                     ) : (
                                       <li className="flex items-start gap-2">
                                         <span className="mt-1 text-gray-400">✗</span>
                                         <div>
                                           <span className="font-medium line-through opacity-50 text-gray-500">
                                             Descuento próxima sesión
                                           </span>
                                         </div>
                                       </li>
                                     )}
                                   </>
                                 )}
                               </ul>
                             </div>
                           ) : (
                             <div className="text-center text-muted-foreground py-8">
                               <p>Selecciona un plan y cantidad para ver los detalles</p>
                             </div>
                           )}
                         </div>

                        <button 
                          onClick={() => {
                            if (!selectedQuantity || !currentQuantityData) return;
                            
                            const serviceName = service.title;
                            const planName = currentPlan.title;
                            const quantityInfo = `${currentQuantityData.description}`;
                            const price = currentQuantityData.price;
                            
                            let servicesIncluded = ['• Producción y edición de fotografía'];
                            
                            if (selectedPlan !== 'basico') {
                              servicesIncluded.push('• Impresiones físicas incluidas');
                              if (currentQuantityData.extra) {
                                servicesIncluded.push(`  ${currentQuantityData.extra}`);
                              }
                            }
                            
                            if (selectedPlan === 'premium') {
                              servicesIncluded.push('• 20% de descuento para tu próxima sesión');
                            }
                            
                            const message = `🎯 *SOLICITUD DE COTIZACIÓN*\n\n📸 *Servicio:* ${serviceName}\n📋 *Plan:* ${planName}\n📊 *Cantidad:* ${quantityInfo}\n💰 *Precio:* ${price}\n\n✅ *Servicios incluidos:*\n${servicesIncluded.join('\n')}\n\n¡Hola! Me interesa contratar este servicio. ¿Podrían confirmar disponibilidad y brindarme más detalles?\n\nGracias! 😊`;
                            
                            window.open(`https://wa.me/573001234567?text=${encodeURIComponent(message)}`, '_blank');
                          }}
                          disabled={!selectedQuantity || !currentQuantityData}
                          className={`w-full mt-6 py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                            selectedQuantity && currentQuantityData
                              ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          <MessageCircle className="w-5 h-5" />
                          {selectedQuantity && currentQuantityData 
                            ? `Contratar ${currentPlan.title} - ${currentQuantityData.price}`
                            : 'Selecciona plan y cantidad'
                          }
                        </button>
                      </Card>
                    </div>
                  );
                }
                
                // Default handling for other services
                return (
                  <div key={serviceKey} className="space-y-6">
                    {/* Service Icon and Title */}
                    <div className="text-center space-y-2">
                      <div className="flex justify-center">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-foreground">{service.title}</h3>
                    </div>
                    
                    {/* Service Image */}
                    <div className="relative overflow-hidden rounded-lg mx-auto max-w-sm">
                      <img 
                        src={service.image} 
                        alt={`${service.title} image`}
                        className="w-full object-cover"
                        style={{ aspectRatio: '9/16' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>

                    {/* Service Details */}
                    <Card className="service-card p-6 min-h-[500px] flex flex-col">
                      <div className="text-center mb-4">
                        <h3 className="text-2xl font-bold text-neon-cyan mb-2">{service.title}</h3>
                        
                        {/* Plan Selection Buttons - Moved inside card */}
                        <div className="flex gap-1 justify-center mb-3">
                          {Object.keys(service.plans).map((planKey) => (
                            <button
                              key={planKey}
                              onClick={() => handlePlanChange(serviceKey, planKey)}
                              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                                selectedPlan === planKey
                                  ? 'bg-neon-purple text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {service.plans[planKey as keyof typeof service.plans].title}
                            </button>
                          ))}
                        </div>
                        
                        <h4 className="text-lg font-semibold text-neon-purple mb-2">{currentPlan.title}</h4>
                        <p className="text-muted-foreground text-sm">{currentPlan.description}</p>
                      </div>
                      
                      <div className="space-y-2 flex-grow">
                        <ul className="space-y-2 text-foreground">
                          {currentPlan.options.map((option, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className={`mt-1 ${option.available ? 'text-neon-purple' : 'text-gray-400'}`}>
                                {option.available ? '•' : '✗'}
                              </span>
                              <div>
                                <span className={`font-medium ${
                                  option.available 
                                    ? '' 
                                    : 'line-through opacity-50 text-gray-500'
                                }`}>
                                  {option.photos || option.service}
                                </span>
                                {option.extra && (
                                  <p className={`text-sm mt-1 ${
                                    option.available 
                                      ? 'text-muted-foreground' 
                                      : 'line-through opacity-50 text-gray-400'
                                  }`}>
                                    {option.extra}
                                  </p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button 
                        onClick={() => {
                          const serviceName = service.title;
                          const planName = currentPlan.title;
                          const price = currentPlan.options.find(option => option.available)?.price || 'Consultar precio';
                          
                          const availableServices = currentPlan.options
                            .filter(option => option.available)
                            .map(option => {
                              let serviceText = `• ${option.photos || option.service}`;
                              if (option.extra) {
                                serviceText += `\n  ${option.extra}`;
                              }
                              return serviceText;
                            })
                            .join('\n');
                          
                          const notIncludedServices = currentPlan.options
                            .filter(option => !option.available)
                            .map(option => `• ${option.photos || option.service} (No incluido)`)
                            .join('\n');
                          
                          let servicesSection = `✅ *Servicios incluidos:*\n${availableServices}`;
                          if (notIncludedServices) {
                            servicesSection += `\n\n❌ *No incluidos en este plan:*\n${notIncludedServices}`;
                          }
                          
                          const message = `🎯 *SOLICITUD DE COTIZACIÓN*\n\n${serviceName === 'Producción Audiovisual' ? '🎬' : '🎵'} *Servicio:* ${serviceName}\n📋 *Plan:* ${planName}\n💰 *Precio:* ${price}\n\n${servicesSection}\n\n¡Hola! Me interesa contratar este servicio. ¿Podrían confirmar disponibilidad y brindarme más detalles?\n\nGracias! 😊`;
                          
                          window.open(`https://wa.me/573001234567?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        className="w-full mt-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-5 h-5" />
                        Contratar {currentPlan.title} - {currentPlan.options.find(option => option.available)?.price || 'Consultar precio'}
                      </button>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-secondary/20">
          <div className="container mx-auto text-center">
            <h2 className="section-title mb-6">
              ¿Listo para empezar tu proyecto?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contáctanos y cuéntanos sobre tu proyecto. Te ayudaremos a crear contenido 
              que conecte con tu audiencia y eleve tu marca al siguiente nivel.
            </p>
            <button 
              onClick={() => navigate('/cotizar')}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white text-lg px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Solicitar Cotización
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;