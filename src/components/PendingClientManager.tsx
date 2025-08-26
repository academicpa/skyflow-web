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
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Phone,
  Mail,
  MessageCircle,
  Edit,
  Save,
  X,
  AlertTriangle,
  User
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  client_status: 'por_visitar' | 'pendiente' | 'plan_confirmado' | 'en_proceso' | 'completado' | 'inactivo';
  membershipPlan: string;
  membershipStatus: 'sin_plan' | 'pending' | 'active' | 'expired';
  firstContactDate?: string;
  notes?: string;
  leadSource?: string;
}

interface PendingClientManagerProps {
  clients: Client[];
  onClientUpdate?: () => void;
}

export const PendingClientManager: React.FC<PendingClientManagerProps> = ({ 
  clients, 
  onClientUpdate 
}) => {
  const { updateClientStatus } = useClients();
  const { toast } = useToast();
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    membershipPlan: '',
    notes: '',
    planStartDate: new Date().toISOString().split('T')[0]
  });

  // Filtrar clientes pendientes
  const pendingClients = clients.filter(client => client.client_status === 'pendiente');

  const handleConfirmPlan = async (clientId: string) => {
    try {
      const result = await updateClientStatus(clientId, 'plan_confirmado', {
        membershipStatus: 'active',
        membershipPlan: editForm.membershipPlan,
        planStartDate: editForm.planStartDate,
        notes: editForm.notes
      });

      if (result.success) {
        toast({
          title: "Plan Confirmado",
          description: "El cliente ha sido movido a 'Plan Confirmado' exitosamente.",
        });
        setEditingClient(null);
        onClientUpdate?.();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo confirmar el plan del cliente.",
        variant: "destructive"
      });
    }
  };

  const handleRejectClient = async (clientId: string) => {
    try {
      const result = await updateClientStatus(clientId, 'inactivo', {
        notes: `Cliente rechazado el ${new Date().toLocaleDateString()}`
      });

      if (result.success) {
        toast({
          title: "Cliente Rechazado",
          description: "El cliente ha sido marcado como inactivo.",
        });
        onClientUpdate?.();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar el cliente.",
        variant: "destructive"
      });
    }
  };

  const handleBackToPorVisitar = async (clientId: string) => {
    try {
      const result = await updateClientStatus(clientId, 'por_visitar', {
        notes: `Regresado a 'Por Visitar' el ${new Date().toLocaleDateString()}`
      });

      if (result.success) {
        toast({
          title: "Estado Actualizado",
          description: "El cliente ha sido regresado a 'Por Visitar'.",
        });
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

  const startEditing = (client: Client) => {
    setEditingClient(client.id);
    setEditForm({
      membershipPlan: client.membershipPlan || 'Básico',
      notes: client.notes || '',
      planStartDate: new Date().toISOString().split('T')[0]
    });
  };

  const cancelEditing = () => {
    setEditingClient(null);
    setEditForm({
      membershipPlan: '',
      notes: '',
      planStartDate: new Date().toISOString().split('T')[0]
    });
  };

  const getDaysInPending = (firstContactDate?: string) => {
    if (!firstContactDate) return 0;
    const contactDate = new Date(firstContactDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - contactDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getPriorityColor = (days: number) => {
    if (days > 7) return 'text-red-500';
    if (days > 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (pendingClients.length === 0) {
    return (
      <Card className="service-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-500" />
            Clientes Pendientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 border-2 border-dashed border-muted-foreground border-opacity-30 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-sm">No hay clientes pendientes</p>
            <p className="text-muted-foreground/70 text-xs mt-1">Los clientes que necesiten confirmación de plan aparecerán aquí</p>
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
            <Clock className="w-5 h-5 mr-2 text-yellow-500" />
            Clientes Pendientes ({pendingClients.length})
          </div>
          <Badge variant="outline" className="text-yellow-500 border-yellow-500">
            Requieren Atención
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingClients.map((client) => {
            const daysInPending = getDaysInPending(client.firstContactDate);
            const isEditing = editingClient === client.id;

            return (
              <div key={client.id} className="p-4 border border-border rounded-lg hover:border-yellow-500/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{client.name}</h3>
                      <p className="text-sm text-muted-foreground">{client.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getPriorityColor(daysInPending)} bg-transparent border`}>
                      {daysInPending} días pendiente
                    </Badge>
                    {daysInPending > 7 && (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
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
                      <MessageCircle className="w-4 h-4 text-neon-purple" />
                      <span>Fuente: {client.leadSource}</span>
                    </div>
                  )}
                  {client.firstContactDate && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-neon-purple" />
                      <span>Contacto: {new Date(client.firstContactDate).toLocaleDateString()}</span>
                    </div>
                  )}
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
                        <Label htmlFor={`plan-${client.id}`}>Plan de Membresía</Label>
                        <select
                          id={`plan-${client.id}`}
                          value={editForm.membershipPlan}
                          onChange={(e) => setEditForm({...editForm, membershipPlan: e.target.value})}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                        >
                          <option value="Básico">Básico</option>
                          <option value="Premium">Premium</option>
                          <option value="VIP">VIP</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor={`start-date-${client.id}`}>Fecha de Inicio</Label>
                        <Input
                          id={`start-date-${client.id}`}
                          type="date"
                          value={editForm.planStartDate}
                          onChange={(e) => setEditForm({...editForm, planStartDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor={`notes-${client.id}`}>Notas Adicionales</Label>
                      <Textarea
                        id={`notes-${client.id}`}
                        value={editForm.notes}
                        onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                        placeholder="Detalles del plan confirmado..."
                        rows={3}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleConfirmPlan(client.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Confirmar Plan
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditing}
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
                      onClick={() => startEditing(client)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirmar Plan
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBackToPorVisitar(client.id)}
                      className="border-blue-500 text-blue-500 hover:bg-blue-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Volver a Por Visitar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRejectClient(client.id)}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Rechazar
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

export default PendingClientManager;