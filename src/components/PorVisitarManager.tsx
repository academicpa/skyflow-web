import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useClients } from '@/hooks/useClients';
import { useToast } from '@/hooks/use-toast';
import {
  UserPlus,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building,
  MapPin,
  Edit,
  Save,
  X,
  AlertCircle
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  membership_status: 'por_visitar' | 'pendiente' | 'plan_confirmado' | 'en_proceso' | 'completado' | 'inactivo';
  membership_plan?: string;
  membershipStatus: 'sin_plan' | 'pending' | 'active' | 'expired';
  firstContactDate?: string;
  notes?: string;
  leadSource?: string;
}

interface PorVisitarManagerProps {
  clients: Client[];
  onClientUpdate?: () => void;
}

export const PorVisitarManager: React.FC<PorVisitarManagerProps> = ({ 
  clients, 
  onClientUpdate 
}) => {
  const { updateClientStatus } = useClients();
  const { toast } = useToast();
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    contactMethod: 'phone',
    notes: '',
    nextAction: 'pendiente'
  });

  // Filtrar clientes por visitar
  const porVisitarClients = clients.filter(client => client.client_status === 'por_visitar');

  const handleMarkAsContacted = async (clientId: string) => {
    try {
      const contactDate = new Date().toISOString();
      const result = await updateClientStatus(clientId, contactForm.nextAction as any, {
        firstContactDate: contactDate,
        notes: `Contactado vía ${contactForm.contactMethod} el ${new Date().toLocaleDateString()}. ${contactForm.notes}`,
        membershipStatus: contactForm.nextAction === 'pendiente' ? 'pending' : 'sin_plan'
      });

      if (result.success) {
        toast({
          title: "Cliente Contactado",
          description: `El cliente ha sido marcado como contactado y movido a '${contactForm.nextAction}'.`,
        });
        setEditingClient(null);
        onClientUpdate?.();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del cliente.",
        variant: "destructive"
      });
    }
  };

  const handleMarkAsInactive = async (clientId: string) => {
    try {
      const result = await updateClientStatus(clientId, 'inactivo', {
        notes: `Marcado como inactivo el ${new Date().toLocaleDateString()} - No contactable o no interesado`
      });

      if (result.success) {
        toast({
          title: "Cliente Inactivo",
          description: "El cliente ha sido marcado como inactivo.",
        });
        onClientUpdate?.();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo marcar el cliente como inactivo.",
        variant: "destructive"
      });
    }
  };

  const startContactProcess = (client: Client) => {
    setEditingClient(client.id);
    setContactForm({
      contactMethod: 'phone',
      notes: '',
      nextAction: 'pendiente'
    });
  };

  const cancelContactProcess = () => {
    setEditingClient(null);
    setContactForm({
      contactMethod: 'phone',
      notes: '',
      nextAction: 'pendiente'
    });
  };

  const getDaysAsLead = (createdDate?: string) => {
    if (!createdDate) return 0;
    const created = new Date(createdDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPriorityColor = (days: number) => {
    if (days > 30) return 'text-red-500';
    if (days > 14) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getContactMethodIcon = (method: string) => {
    switch (method) {
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'whatsapp': return <MessageCircle className="w-4 h-4" />;
      default: return <Phone className="w-4 h-4" />;
    }
  };

  if (porVisitarClients.length === 0) {
    return (
      <Card className="service-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-blue-500" />
            Clientes Por Visitar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 border-2 border-dashed border-muted-foreground border-opacity-30 rounded-lg flex items-center justify-center mb-4">
              <UserPlus className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-sm">No hay clientes por visitar</p>
            <p className="text-muted-foreground/70 text-xs mt-1">Los nuevos leads aparecerán aquí para contacto inicial</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="service-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2 text-blue-500" />
            Clientes Por Visitar ({porVisitarClients.length})
          </div>
          <Badge variant="outline" className="text-blue-500 border-blue-500">
            Contacto Inicial
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {porVisitarClients.map((client) => {
            const daysAsLead = getDaysAsLead(client.firstContactDate);
            const isEditing = editingClient === client.id;

            return (
              <div key={client.id} className="p-4 border border-border rounded-lg hover:border-blue-500/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{client.name}</h3>
                      {client.company && (
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Building className="w-3 h-3 mr-1" />
                          {client.company}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                      Nuevo Lead
                    </Badge>
                    {daysAsLead > 14 && (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-4 h-4 text-neon-cyan" />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="w-4 h-4 text-neon-cyan" />
                    <span>{client.phone}</span>
                  </div>
                  {client.leadSource && (
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-neon-purple" />
                      <span>Fuente: {client.leadSource}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-neon-purple" />
                    <span>Lead desde: {daysAsLead} días</span>
                  </div>
                </div>

                {client.notes && (
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">{client.notes}</p>
                  </div>
                )}

                {isEditing ? (
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`contact-method-${client.id}`}>Método de Contacto</Label>
                        <select
                          id={`contact-method-${client.id}`}
                          value={contactForm.contactMethod}
                          onChange={(e) => setContactForm({...contactForm, contactMethod: e.target.value})}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                        >
                          <option value="phone">Teléfono</option>
                          <option value="email">Email</option>
                          <option value="whatsapp">WhatsApp</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor={`next-action-${client.id}`}>Próximo Estado</Label>
                        <select
                          id={`next-action-${client.id}`}
                          value={contactForm.nextAction}
                          onChange={(e) => setContactForm({...contactForm, nextAction: e.target.value})}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                        >
                          <option value="pendiente">Pendiente (Interesado)</option>
                          <option value="plan_confirmado">Plan Confirmado (Directo)</option>
                          <option value="inactivo">No Interesado</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`contact-notes-${client.id}`}>Notas del Contacto</Label>
                      <Textarea
                        id={`contact-notes-${client.id}`}
                        value={contactForm.notes}
                        onChange={(e) => setContactForm({...contactForm, notes: e.target.value})}
                        placeholder="Detalles de la conversación, interés mostrado, próximos pasos..."
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsContacted(client.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {getContactMethodIcon(contactForm.contactMethod)}
                        <span className="ml-2">Marcar como Contactado</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelContactProcess}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => startContactProcess(client)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Contactar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsInactive(client.id)}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Marcar Inactivo
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PorVisitarManager;