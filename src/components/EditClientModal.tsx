import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/useClients';
import { supabase } from '@/lib/supabase';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  client_status?: string;
  membership_plan?: string;
  notes?: string;
  firstContactDate?: string;
  join_date?: string;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
  onClientUpdated?: () => void;
}

export const EditClientModal: React.FC<EditClientModalProps> = ({ isOpen, onClose, client, onClientUpdated }) => {
  const { toast } = useToast();
  const { updateClient } = useClients();
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loadingPlanes, setLoadingPlanes] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    client_status: 'por_visitar' as const,
    membership_plan: '',
    notes: '',
    join_date: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar planes desde la base de datos
  const loadPlanes = async () => {
    try {
      setLoadingPlanes(true);
      const { data, error } = await supabase
        .from('planes')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setPlanes(data || []);
    } catch (error) {
      console.error('Error al cargar planes:', error);
    } finally {
      setLoadingPlanes(false);
    }
  };

  // Cargar planes cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadPlanes();
    }
  }, [isOpen]);

  // Cargar datos del cliente cuando se abre el modal
  useEffect(() => {
    if (client && isOpen) {
      setFormData({
           name: client.name || '',
           email: client.email || '',
           phone: client.phone || '',
           company: client.company || '',
           client_status: client.client_status || 'por_visitar',
           membership_plan: client.membership_plan || '',
           notes: client.notes || '',
           join_date: client.join_date || ''
         });
    }
  }, [client, isOpen]);

  const formatPhoneNumber = (value: string) => {
    // Remover todos los caracteres que no sean dígitos
    const digitsOnly = value.replace(/\D/g, '');
    
    // Si tiene exactamente 10 dígitos y no empieza con +57, agregar +57
    if (digitsOnly.length === 10 && !value.startsWith('+57')) {
      return `+57 ${digitsOnly}`;
    }
    
    // Si ya tiene +57, mantener el formato
    if (value.startsWith('+57')) {
      return value;
    }
    
    // Para otros casos, devolver el valor original
    return value;
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [field]: formattedPhone }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!client) return;
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast({
        title: "Error",
        description: "El nombre y email son obligatorios",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const clientData = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          company: formData.company.trim() || undefined,
          client_status: formData.client_status,
          membership_plan: formData.membership_plan || null,
          notes: formData.notes.trim() || undefined,
          join_date: formData.join_date
        };

      console.log('Datos a actualizar:', clientData);
      console.log('ID del cliente:', client.id);
      
      const result = await updateClient(client.id, clientData);
      console.log('Resultado de la actualización:', result);
      
      if (result.success) {
        toast({
          title: "Cliente actualizado",
          description: `${clientData.name} ha sido actualizado exitosamente.`,
        });
        
        // Llamar callback para actualizar la lista en el Dashboard
        if (onClientUpdated) {
          onClientUpdated();
        }
        
        onClose();
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el cliente. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-background border-border max-h-[95vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-semibold">Editar Cliente</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Primera fila - Campos obligatorios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="juan@ejemplo.com"
                  required
                />
              </div>
            </div>

            {/* Segunda fila - Campos opcionales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">WhatsApp / Teléfono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="3001234567 (se agregará +57 automáticamente)"
                />
              </div>

              <div>
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="Nombre de la empresa"
                />
              </div>
            </div>

            {/* Tercera fila - Estado del Cliente y Plan de Membresía */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="client_status">Estado del Cliente</Label>
                <select
                  id="client_status"
                  value={formData.client_status}
                  onChange={(e) => handleInputChange('client_status', e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                >
                  <option value="por_visitar">Por Visitar</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="plan_confirmado">Plan Confirmado</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="completado">Completado</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="membership_plan">Plan de Membresía</Label>
                <select
                  id="membership_plan"
                  value={formData.membership_plan}
                  onChange={(e) => handleInputChange('membership_plan', e.target.value)}
                  className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                  disabled={formData.client_status !== 'plan_confirmado' && formData.client_status !== 'en_proceso' && formData.client_status !== 'completado'}
                >
                  <option value="">Seleccionar plan...</option>
                  {loadingPlanes ? (
                    <option value="">Cargando planes...</option>
                  ) : (
                    planes.map((plan) => (
                      <option key={plan.id} value={plan.name}>
                        {plan.name} - ${plan.price}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Cuarta fila - Fecha de contacto */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="join_date">Fecha de Primer Contacto</Label>
                <Input
                  id="join_date"
                  type="date"
                  value={formData.join_date}
                  onChange={(e) => handleInputChange('join_date', e.target.value)}
                />
              </div>
              <div></div>
            </div>

            {/* Quinta fila - Notas */}
            <div>
              <Label htmlFor="notes">Notas (Opcional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notas adicionales sobre el cliente..."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || !formData.name.trim() || !formData.email.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  'Actualizar Cliente'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};