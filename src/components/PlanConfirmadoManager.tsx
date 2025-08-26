import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useClients } from '@/hooks/useClients';
import { useTasks } from '@/hooks/useTasks';
import { useToast } from '@/hooks/use-toast';
import {
  CheckCircle,
  Calendar,
  Clock,
  User,
  Building,
  Mail,
  Phone,
  CreditCard,
  Play,
  Pause,
  Settings,
  Plus,
  FileText,
  Target,
  AlertTriangle,
  Edit,
  Save,
  X
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  client_status: 'por_visitar' | 'pendiente' | 'plan_confirmado' | 'en_proceso' | 'completado' | 'inactivo';
  membership_plan?: string;
  planStartDate?: string;
  firstContactDate?: string;
  notes?: string;
  leadSource?: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date?: string;
  client_id: string;
  project_id?: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at?: string;
}

interface PlanConfirmadoManagerProps {
  clients: Client[];
  onClientUpdate?: () => void;
}

const DEFAULT_TASKS_TEMPLATES = {
  'Básico': [
    { title: 'Reunión inicial de planificación', description: 'Definir objetivos y alcance del proyecto', priority: 'high' as const, daysFromStart: 1 },
    { title: 'Entrega de brief inicial', description: 'Proporcionar documentación y materiales necesarios', priority: 'high' as const, daysFromStart: 3 },
    { title: 'Primera revisión de progreso', description: 'Evaluar avance y ajustar cronograma si es necesario', priority: 'medium' as const, daysFromStart: 7 },
    { title: 'Entrega de primer borrador', description: 'Presentar versión inicial para feedback', priority: 'high' as const, daysFromStart: 14 },
    { title: 'Revisión y ajustes', description: 'Implementar cambios solicitados', priority: 'medium' as const, daysFromStart: 21 },
    { title: 'Entrega final', description: 'Presentar versión final del proyecto', priority: 'high' as const, daysFromStart: 30 }
  ],
  'Premium': [
    { title: 'Reunión estratégica inicial', description: 'Análisis profundo de objetivos y estrategia', priority: 'high' as const, daysFromStart: 1 },
    { title: 'Investigación de mercado', description: 'Análisis de competencia y audiencia objetivo', priority: 'high' as const, daysFromStart: 2 },
    { title: 'Desarrollo de concepto creativo', description: 'Creación de propuesta creativa personalizada', priority: 'high' as const, daysFromStart: 5 },
    { title: 'Presentación de propuesta', description: 'Presentar concepto y obtener aprobación', priority: 'high' as const, daysFromStart: 7 },
    { title: 'Inicio de producción', description: 'Comenzar desarrollo del proyecto', priority: 'high' as const, daysFromStart: 10 },
    { title: 'Revisión intermedia', description: 'Evaluación de progreso y ajustes', priority: 'medium' as const, daysFromStart: 15 },
    { title: 'Pre-entrega para revisión', description: 'Presentar versión casi final', priority: 'high' as const, daysFromStart: 25 },
    { title: 'Implementación de cambios', description: 'Ajustes finales basados en feedback', priority: 'medium' as const, daysFromStart: 28 },
    { title: 'Entrega final y capacitación', description: 'Entrega completa con sesión de capacitación', priority: 'high' as const, daysFromStart: 35 }
  ],
  'VIP': [
    { title: 'Consultoría estratégica inicial', description: 'Sesión de consultoría personalizada de 2 horas', priority: 'high' as const, daysFromStart: 1 },
    { title: 'Análisis competitivo completo', description: 'Investigación exhaustiva del mercado y competencia', priority: 'high' as const, daysFromStart: 2 },
    { title: 'Desarrollo de estrategia de marca', description: 'Creación de estrategia integral de marca', priority: 'high' as const, daysFromStart: 3 },
    { title: 'Sesión de brainstorming creativo', description: 'Sesión colaborativa de ideación', priority: 'high' as const, daysFromStart: 5 },
    { title: 'Desarrollo de múltiples conceptos', description: 'Creación de 3-5 propuestas creativas', priority: 'high' as const, daysFromStart: 8 },
    { title: 'Presentación ejecutiva', description: 'Presentación formal a stakeholders', priority: 'high' as const, daysFromStart: 12 },
    { title: 'Refinamiento de concepto elegido', description: 'Perfeccionamiento del concepto seleccionado', priority: 'high' as const, daysFromStart: 15 },
    { title: 'Desarrollo y producción', description: 'Fase de producción con seguimiento diario', priority: 'high' as const, daysFromStart: 18 },
    { title: 'Revisiones semanales', description: 'Reuniones de seguimiento cada semana', priority: 'medium' as const, daysFromStart: 21 },
    { title: 'Testing y optimización', description: 'Pruebas y optimización del resultado', priority: 'medium' as const, daysFromStart: 30 },
    { title: 'Pre-lanzamiento', description: 'Preparación para lanzamiento', priority: 'high' as const, daysFromStart: 35 },
    { title: 'Entrega premium y soporte', description: 'Entrega completa con soporte extendido', priority: 'high' as const, daysFromStart: 42 }
  ]
};

export const PlanConfirmadoManager: React.FC<PlanConfirmadoManagerProps> = ({ 
  clients, 
  onClientUpdate 
}) => {
  const { updateClientStatus } = useClients();
  const { createTask, getTasksByClient } = useTasks();
  const { toast } = useToast();
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [clientTasks, setClientTasks] = useState<Record<string, Task[]>>({});
  const [editForm, setEditForm] = useState({
    planStartDate: new Date().toISOString().split('T')[0],
    notes: '',
    createTasks: true,
    customTasks: [] as { title: string; description: string; priority: 'low' | 'medium' | 'high'; daysFromStart: number }[]
  });

  // Filtrar clientes con plan confirmado
  const planConfirmadoClients = clients.filter(client => client.client_status === 'plan_confirmado');

  // Cargar tareas de clientes
  useEffect(() => {
    const loadClientTasks = async () => {
      const tasksData: Record<string, Task[]> = {};
      for (const client of planConfirmadoClients) {
        try {
          const tasks = await getTasksByClient(client.id);
          tasksData[client.id] = tasks;
        } catch (error) {
          console.error(`Error loading tasks for client ${client.id}:`, error);
          tasksData[client.id] = [];
        }
      }
      setClientTasks(tasksData);
    };

    if (planConfirmadoClients.length > 0) {
      loadClientTasks();
    }
  }, [planConfirmadoClients, getTasksByClient]);

  const handleStartProject = async (clientId: string) => {
    try {
      const result = await updateClientStatus(clientId, 'en_proceso', {
        notes: `Proyecto iniciado el ${new Date().toLocaleDateString()}`
      });

      if (result.success) {
        toast({
          title: "Proyecto Iniciado",
          description: "El cliente ha sido movido a 'En Proceso'.",
        });
        onClientUpdate?.();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo iniciar el proyecto.",
        variant: "destructive"
      });
    }
  };

  const handleCreateTasks = async (client: Client) => {
    try {
      const startDate = new Date(editForm.planStartDate);
      const tasksTemplate = DEFAULT_TASKS_TEMPLATES[client.membershipPlan as keyof typeof DEFAULT_TASKS_TEMPLATES] || DEFAULT_TASKS_TEMPLATES['Básico'];
      
      // Crear tareas del template
      for (const taskTemplate of tasksTemplate) {
        const dueDate = new Date(startDate);
        dueDate.setDate(dueDate.getDate() + taskTemplate.daysFromStart);
        
        await createTask({
          title: taskTemplate.title,
          description: taskTemplate.description,
          client_id: client.id,
          priority: taskTemplate.priority,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'pending'
        });
      }

      // Crear tareas personalizadas si las hay
      for (const customTask of editForm.customTasks) {
        const dueDate = new Date(startDate);
        dueDate.setDate(dueDate.getDate() + customTask.daysFromStart);
        
        await createTask({
          title: customTask.title,
          description: customTask.description,
          client_id: client.id,
          priority: customTask.priority,
          due_date: dueDate.toISOString().split('T')[0],
          status: 'pending'
        });
      }

      // Actualizar cliente con fecha de inicio
      await updateClientStatus(client.id, 'plan_confirmado', {
        planStartDate: editForm.planStartDate,
        notes: editForm.notes
      });

      toast({
        title: "Tareas Creadas",
        description: `Se han creado ${tasksTemplate.length + editForm.customTasks.length} tareas para el cliente.`,
      });

      setEditingClient(null);
      onClientUpdate?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron crear las tareas.",
        variant: "destructive"
      });
    }
  };

  const startPlanning = (client: Client) => {
    setEditingClient(client.id);
    setEditForm({
      planStartDate: client.planStartDate || new Date().toISOString().split('T')[0],
      notes: client.notes || '',
      createTasks: true,
      customTasks: []
    });
  };

  const cancelPlanning = () => {
    setEditingClient(null);
    setEditForm({
      planStartDate: new Date().toISOString().split('T')[0],
      notes: '',
      createTasks: true,
      customTasks: []
    });
  };

  const addCustomTask = () => {
    setEditForm({
      ...editForm,
      customTasks: [...editForm.customTasks, {
        title: '',
        description: '',
        priority: 'medium',
        daysFromStart: 1
      }]
    });
  };

  const removeCustomTask = (index: number) => {
    setEditForm({
      ...editForm,
      customTasks: editForm.customTasks.filter((_, i) => i !== index)
    });
  };

  const updateCustomTask = (index: number, field: string, value: any) => {
    const updatedTasks = [...editForm.customTasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setEditForm({ ...editForm, customTasks: updatedTasks });
  };

  const getDaysUntilStart = (planStartDate?: string) => {
    if (!planStartDate) return null;
    const startDate = new Date(planStartDate);
    const today = new Date();
    const diffTime = startDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getTaskCount = (clientId: string) => {
    return clientTasks[clientId]?.length || 0;
  };

  const getCompletedTaskCount = (clientId: string) => {
    return clientTasks[clientId]?.filter(task => task.status === 'completed').length || 0;
  };

  if (planConfirmadoClients.length === 0) {
    return (
      <Card className="service-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Clientes con Plan Confirmado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 border-2 border-dashed border-muted-foreground border-opacity-30 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-sm">No hay clientes con plan confirmado</p>
            <p className="text-muted-foreground/70 text-xs mt-1">Los clientes con planes confirmados aparecerán aquí</p>
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
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Clientes con Plan Confirmado ({planConfirmadoClients.length})
          </div>
          <Badge variant="outline" className="text-green-500 border-green-500">
            Listos para Iniciar
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {planConfirmadoClients.map((client) => {
            const isEditing = editingClient === client.id;
            const daysUntilStart = getDaysUntilStart(client.planStartDate);
            const taskCount = getTaskCount(client.id);
            const completedTasks = getCompletedTaskCount(client.id);
            const hasStarted = client.planStartDate && new Date(client.planStartDate) <= new Date();

            return (
              <div key={client.id} className="p-4 border border-border rounded-lg hover:border-green-500/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
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
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      {client.membership_plan}
                    </Badge>
                    {daysUntilStart !== null && (
                      <Badge variant={daysUntilStart <= 0 ? "default" : "outline"}>
                        {daysUntilStart <= 0 ? 'Iniciado' : `${daysUntilStart} días`}
                      </Badge>
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
                  {client.planStartDate && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-neon-purple" />
                      <span>Inicio: {new Date(client.planStartDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm">
                    <Target className="w-4 h-4 text-neon-purple" />
                    <span>Tareas: {completedTasks}/{taskCount}</span>
                  </div>
                </div>

                {client.notes && (
                  <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">{client.notes}</p>
                  </div>
                )}

                {taskCount > 0 && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">Progreso de Tareas</span>
                      <span className="text-sm text-green-600">{Math.round((completedTasks / taskCount) * 100)}%</span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(completedTasks / taskCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {isEditing ? (
                  <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`start-date-${client.id}`}>Fecha de Inicio del Plan</Label>
                        <Input
                          id={`start-date-${client.id}`}
                          type="date"
                          value={editForm.planStartDate}
                          onChange={(e) => setEditForm({...editForm, planStartDate: e.target.value})}
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <input
                          type="checkbox"
                          id={`create-tasks-${client.id}`}
                          checked={editForm.createTasks}
                          onChange={(e) => setEditForm({...editForm, createTasks: e.target.checked})}
                          className="rounded border-border"
                        />
                        <Label htmlFor={`create-tasks-${client.id}`}>Crear tareas automáticamente</Label>
                      </div>
                    </div>
                    
                    {editForm.createTasks && (
                      <div className="space-y-3">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="text-sm font-medium text-blue-800 mb-2">Tareas del Plan {client.membership_plan}</h4>
                          <div className="text-xs text-blue-600">
                            Se crearán {DEFAULT_TASKS_TEMPLATES[client.membership_plan as keyof typeof DEFAULT_TASKS_TEMPLATES]?.length || 0} tareas predefinidas
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Tareas Personalizadas</Label>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={addCustomTask}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Añadir
                            </Button>
                          </div>
                          {editForm.customTasks.map((task, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-end">
                              <div className="col-span-4">
                                <Input
                                  placeholder="Título de la tarea"
                                  value={task.title}
                                  onChange={(e) => updateCustomTask(index, 'title', e.target.value)}
                                />
                              </div>
                              <div className="col-span-3">
                                <Input
                                  placeholder="Descripción"
                                  value={task.description}
                                  onChange={(e) => updateCustomTask(index, 'description', e.target.value)}
                                />
                              </div>
                              <div className="col-span-2">
                                <select
                                  value={task.priority}
                                  onChange={(e) => updateCustomTask(index, 'priority', e.target.value)}
                                  className="w-full px-2 py-1 border border-border rounded text-sm bg-background"
                                >
                                  <option value="low">Baja</option>
                                  <option value="medium">Media</option>
                                  <option value="high">Alta</option>
                                </select>
                              </div>
                              <div className="col-span-2">
                                <Input
                                  type="number"
                                  placeholder="Días"
                                  min="1"
                                  value={task.daysFromStart}
                                  onChange={(e) => updateCustomTask(index, 'daysFromStart', parseInt(e.target.value))}
                                />
                              </div>
                              <div className="col-span-1">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeCustomTask(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor={`notes-${client.id}`}>Notas del Plan</Label>
                      <Textarea
                        id={`notes-${client.id}`}
                        value={editForm.notes}
                        onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                        placeholder="Detalles específicos del plan, objetivos, consideraciones especiales..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleCreateTasks(client)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Configurar Plan
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelPlanning}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {!client.planStartDate ? (
                      <Button
                        size="sm"
                        onClick={() => startPlanning(client)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Configurar Plan
                      </Button>
                    ) : hasStarted ? (
                      <Button
                        size="sm"
                        onClick={() => handleStartProject(client.id)}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar Proyecto
                      </Button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startPlanning(client)}
                          className="border-blue-500 text-blue-500 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Editar Plan
                        </Button>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          <Clock className="w-3 h-3 mr-1" />
                          Esperando inicio
                        </Badge>
                      </div>
                    )}
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

export default PlanConfirmadoManager;