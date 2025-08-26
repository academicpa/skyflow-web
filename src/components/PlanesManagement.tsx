import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Plus, Edit, Trash2, DollarSign, FileText, Package, Grid3X3, List } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
}

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: Plan | null;
  onPlanSaved: () => void;
}

const PlanModal: React.FC<PlanModalProps> = ({ isOpen, onClose, plan, onPlanSaved }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name,
        description: plan.description,
        price: plan.price
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0
      });
    }
  }, [plan, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (plan) {
        // Actualizar plan existente
        const { error } = await supabase
          .from('planes')
          .update({
            name: formData.name,
            description: formData.description,
            price: formData.price,
            updated_at: new Date().toISOString()
          })
          .eq('id', plan.id);

        if (error) throw error;

        toast({
          title: "Plan actualizado",
          description: "El plan se ha actualizado correctamente.",
          variant: "default"
        });
      } else {
        // Crear nuevo plan
        const { error } = await supabase
          .from('planes')
          .insert({
            name: formData.name,
            description: formData.description,
            price: formData.price
          });

        if (error) throw error;

        toast({
          title: "Plan creado",
          description: "El plan se ha creado correctamente.",
          variant: "default"
        });
      }

      onPlanSaved();
      onClose();
    } catch (error) {
      console.error('Error al guardar plan:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el plan. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-background border-border">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            {plan ? 'Editar Plan' : 'Crear Nuevo Plan'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Nombre del Plan *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                placeholder="Ej: Plan Básico"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-neon-cyan resize-none"
                placeholder="Describe las características del plan..."
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium mb-2">
                Precio (USD) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                placeholder="0.00"
                required
              />
            </div>

            <div className="flex space-x-3 pt-4">
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
                className="flex-1 btn-neon"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : (plan ? 'Actualizar' : 'Crear Plan')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const PlanesManagement: React.FC = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const loadPlanes = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('planes')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPlans(data || []);
      } catch (error) {
        console.error('Error loading planes:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los planes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadPlanes();
  }, []);

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setShowModal(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleDeletePlan = async (plan: Plan) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el plan "${plan.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('planes')
        .delete()
        .eq('id', plan.id);

      if (error) throw error;

      toast({
        title: "Plan eliminado",
        description: "El plan se ha eliminado correctamente.",
        variant: "default"
      });

      loadPlanes();
    } catch (error) {
      console.error('Error al eliminar plan:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el plan. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="service-card">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-cyan mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando planes...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestión de Planes</h2>
          <p className="text-muted-foreground">Administra los planes disponibles para tus clientes</p>
        </div>
      </div>
      
      {/* Header con botón y opciones de vista */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Button 
            onClick={handleCreatePlan}
            size="sm"
            className="btn-neon"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Plan
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center"
          >
            {viewMode === 'list' ? (
              <><Grid3X3 className="w-4 h-4 mr-2" /> Vista Cuadrícula</>
            ) : (
              <><List className="w-4 h-4 mr-2" /> Vista Lista</>
            )}
          </Button>
        </div>
      </div>

      <Card className="service-card">
        <CardContent className="p-6">
          {plans.length > 0 ? (
            <div className={viewMode === 'grid' ? 
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : 
              "space-y-4"
            }>
              {plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`p-4 border border-border rounded-lg hover:border-neon-cyan/50 transition-colors group ${
                    viewMode === 'list' ? 'flex items-center space-x-4' : ''
                  }`}
                >
                  {viewMode === 'grid' ? (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-neon-cyan transition-colors">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                        </div>
                        <Badge className="bg-neon-cyan/20 text-neon-cyan ml-2">
                          {formatPrice(plan.price)}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPlan(plan)}
                            className="hover:border-neon-cyan/50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePlan(plan)}
                            className="hover:border-red-500/50 text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-neon-cyan">{formatPrice(plan.price)}</div>
                          <div className="text-xs text-muted-foreground">por mes</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0 grid grid-cols-[1fr_100px_120px] gap-4 items-center">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-neon-cyan transition-colors truncate">{plan.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{plan.description}</p>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-neon-cyan">{formatPrice(plan.price)}</div>
                          <div className="text-xs text-muted-foreground">por mes</div>
                        </div>
                        <div className="flex items-center space-x-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPlan(plan)}
                            className="hover:border-neon-cyan/50 p-1 h-7 w-7"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePlan(plan)}
                            className="hover:border-red-500/50 text-red-500 p-1 h-7 w-7"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-2 border-dashed border-muted-foreground border-opacity-30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Package className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-lg mb-2">No hay planes creados</p>
              <p className="text-muted-foreground/70 text-sm mb-4">Crea tu primer plan para comenzar a gestionar tus servicios</p>
              <Button onClick={handleCreatePlan} className="btn-neon">
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <PlanModal
        isOpen={showModal}
        onClose={handleCloseModal}
        plan={editingPlan}
        onPlanSaved={loadPlanes}
      />
    </div>
  );
};

export default PlanesManagement;