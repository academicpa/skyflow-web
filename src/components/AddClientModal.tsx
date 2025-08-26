import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X, Plus, Loader2 } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { supabase } from '@/lib/supabase';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClientAdded?: () => void;
}

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
}

export const AddClientModal = ({ isOpen, onClose, onClientAdded }: AddClientModalProps) => {
  const { addClient } = useClients();
  const [loading, setLoading] = useState(false);
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
    join_date: new Date().toISOString().split('T')[0]
  });

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

  useEffect(() => {
    if (isOpen) {
      loadPlanes();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }

    setLoading(true);
    
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

    const result = await addClient(clientData);
    
    if (result.success) {
      // Resetear formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        client_status: 'por_visitar' as const,
        membership_plan: '',
        notes: '',
        join_date: new Date().toISOString().split('T')[0]
      });
      // Llamar callback para actualizar la lista en el Dashboard
      if (onClientAdded) {
        onClientAdded();
      }
      onClose();
    }
    
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl">Nuevo Cliente</CardTitle>
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
                  placeholder="+1 234 567 8900"
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
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading || !formData.name.trim() || !formData.email.trim()}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Cliente
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};