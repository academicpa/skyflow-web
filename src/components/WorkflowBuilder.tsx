import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Play,
  Pause,
  Edit,
  Trash2,
  Copy,
  Settings,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Mail,
  MessageSquare,
  Calendar,
  DollarSign,
  FileText,
  Zap
} from 'lucide-react';

// Interfaces
interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'delay';
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'draft';
  trigger: string;
  steps: WorkflowStep[];
  createdDate: string;
  lastRun: string;
  executions: number;
  successRate: number;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: Omit<WorkflowStep, 'id'>[];
}

const WorkflowBuilder = () => {
  const { toast } = useToast();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'builder' | 'templates'>('list');

  // Estados para el constructor
  const [workflowName, setWorkflowName] = useState('');
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState('');
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);

  useEffect(() => {
    loadWorkflows();
    loadTemplates();
  }, []);

  const loadWorkflows = () => {
    // Simulación de datos
    const mockWorkflows: Workflow[] = [
      {
        id: '1',
        name: 'Seguimiento de Nuevos Clientes',
        description: 'Envía emails de bienvenida y programa seguimientos automáticos',
        status: 'active',
        trigger: 'Nuevo cliente registrado',
        steps: [],
        createdDate: '2024-01-15',
        lastRun: '2024-01-20 14:30',
        executions: 45,
        successRate: 98.5
      },
      {
        id: '2',
        name: 'Recordatorio de Pagos',
        description: 'Envía recordatorios automáticos antes del vencimiento',
        status: 'active',
        trigger: 'Pago próximo a vencer',
        steps: [],
        createdDate: '2024-01-10',
        lastRun: '2024-01-20 09:00',
        executions: 128,
        successRate: 95.2
      },
      {
        id: '3',
        name: 'Onboarding de Proyectos',
        description: 'Automatiza el proceso de inicio de nuevos proyectos',
        status: 'draft',
        trigger: 'Proyecto creado',
        steps: [],
        createdDate: '2024-01-18',
        lastRun: 'Nunca',
        executions: 0,
        successRate: 0
      }
    ];
    setWorkflows(mockWorkflows);
  };

  const loadTemplates = () => {
    const mockTemplates: WorkflowTemplate[] = [
      {
        id: '1',
        name: 'Bienvenida a Nuevos Clientes',
        description: 'Secuencia completa de bienvenida y onboarding',
        category: 'Clientes',
        steps: []
      },
      {
        id: '2',
        name: 'Seguimiento de Leads',
        description: 'Nurturing automático de leads potenciales',
        category: 'Ventas',
        steps: []
      },
      {
        id: '3',
        name: 'Gestión de Proyectos',
        description: 'Automatización del ciclo de vida de proyectos',
        category: 'Proyectos',
        steps: []
      }
    ];
    setTemplates(mockTemplates);
  };

  const toggleWorkflowStatus = (workflowId: string) => {
    setWorkflows(prev => prev.map(workflow => {
      if (workflow.id === workflowId) {
        const newStatus = workflow.status === 'active' ? 'inactive' : 'active';
        toast({
          title: newStatus === 'active' ? 'Flujo Activado' : 'Flujo Desactivado',
          description: `El flujo "${workflow.name}" ha sido ${newStatus === 'active' ? 'activado' : 'desactivado'}.`
        });
        return { ...workflow, status: newStatus };
      }
      return workflow;
    }));
  };

  const duplicateWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      const newWorkflow: Workflow = {
        ...workflow,
        id: Date.now().toString(),
        name: `${workflow.name} (Copia)`,
        status: 'draft',
        executions: 0,
        lastRun: 'Nunca',
        createdDate: new Date().toISOString().split('T')[0]
      };
      setWorkflows(prev => [newWorkflow, ...prev]);
      toast({
        title: 'Flujo Duplicado',
        description: `Se ha creado una copia del flujo "${workflow.name}".`
      });
    }
  };

  const deleteWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      setWorkflows(prev => prev.filter(w => w.id !== workflowId));
      toast({
        title: 'Flujo Eliminado',
        description: `El flujo "${workflow.name}" ha sido eliminado.`
      });
    }
  };

  const createFromTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      const newWorkflow: Workflow = {
        id: Date.now().toString(),
        name: template.name,
        description: template.description,
        status: 'draft',
        trigger: 'Manual',
        steps: template.steps.map((step, index) => ({
          ...step,
          id: `step_${index}_${Date.now()}`
        })),
        createdDate: new Date().toISOString().split('T')[0],
        lastRun: 'Nunca',
        executions: 0,
        successRate: 0
      };
      setWorkflows(prev => [newWorkflow, ...prev]);
      setSelectedWorkflow(newWorkflow);
      setActiveView('builder');
      toast({
        title: 'Flujo Creado',
        description: `Se ha creado un nuevo flujo basado en "${template.name}".`
      });
    }
  };

  const saveWorkflow = () => {
    if (!workflowName.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre del flujo es requerido.',
        variant: 'destructive'
      });
      return;
    }

    const newWorkflow: Workflow = {
      id: selectedWorkflow?.id || Date.now().toString(),
      name: workflowName,
      description: workflowDescription,
      status: 'draft',
      trigger: selectedTrigger,
      steps: workflowSteps,
      createdDate: selectedWorkflow?.createdDate || new Date().toISOString().split('T')[0],
      lastRun: selectedWorkflow?.lastRun || 'Nunca',
      executions: selectedWorkflow?.executions || 0,
      successRate: selectedWorkflow?.successRate || 0
    };

    if (selectedWorkflow) {
      setWorkflows(prev => prev.map(w => w.id === selectedWorkflow.id ? newWorkflow : w));
      toast({
        title: 'Flujo Actualizado',
        description: `El flujo "${workflowName}" ha sido actualizado.`
      });
    } else {
      setWorkflows(prev => [newWorkflow, ...prev]);
      toast({
        title: 'Flujo Creado',
        description: `El flujo "${workflowName}" ha sido creado.`
      });
    }

    resetBuilder();
    setActiveView('list');
  };

  const resetBuilder = () => {
    setWorkflowName('');
    setWorkflowDescription('');
    setSelectedTrigger('');
    setWorkflowSteps([]);
    setSelectedWorkflow(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Pause className="w-4 h-4" />;
      case 'draft': return <Edit className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const renderWorkflowList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Flujos de Trabajo</h3>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setActiveView('templates')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Plantillas
          </Button>
          <Button 
            size="sm" 
            className="btn-neon"
            onClick={() => {
              resetBuilder();
              setActiveView('builder');
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Flujo
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="service-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(workflow.status)}`}>
                    {getStatusIcon(workflow.status)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{workflow.name}</h4>
                    <p className="text-sm text-muted-foreground">{workflow.description}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(workflow.status)}>
                  {workflow.status === 'active' ? 'Activo' :
                   workflow.status === 'inactive' ? 'Inactivo' : 'Borrador'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Trigger:</span>
                  <p className="font-semibold text-foreground">{workflow.trigger}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ejecuciones:</span>
                  <p className="font-semibold text-foreground">{workflow.executions}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Éxito:</span>
                  <p className="font-semibold text-foreground">{workflow.successRate}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Última ejecución:</span>
                  <p className="font-semibold text-foreground">{workflow.lastRun}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => toggleWorkflowStatus(workflow.id)}
                  className={workflow.status === 'active' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'btn-neon'}
                >
                  {workflow.status === 'active' ? (
                    <><Pause className="w-4 h-4 mr-2" />Pausar</>
                  ) : (
                    <><Play className="w-4 h-4 mr-2" />Activar</>
                  )}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedWorkflow(workflow);
                    setWorkflowName(workflow.name);
                    setWorkflowDescription(workflow.description);
                    setSelectedTrigger(workflow.trigger);
                    setWorkflowSteps(workflow.steps);
                    setActiveView('builder');
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => duplicateWorkflow(workflow.id)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => deleteWorkflow(workflow.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Plantillas de Flujos</h3>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setActiveView('list')}
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          Volver a Flujos
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="service-card cursor-pointer hover:border-blue-500/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{template.name}</h4>
                  <Badge variant="outline" className="text-xs">{template.category}</Badge>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
              
              <Button 
                size="sm" 
                className="w-full btn-neon"
                onClick={() => createFromTemplate(template.id)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Usar Plantilla
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBuilder = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {selectedWorkflow ? 'Editar Flujo' : 'Crear Nuevo Flujo'}
        </h3>
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              resetBuilder();
              setActiveView('list');
            }}
          >
            Cancelar
          </Button>
          <Button 
            size="sm" 
            className="btn-neon"
            onClick={saveWorkflow}
          >
            {selectedWorkflow ? 'Actualizar' : 'Crear'} Flujo
          </Button>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="service-card">
            <CardHeader>
              <CardTitle className="text-base">Configuración Básica</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Nombre del Flujo
                </label>
                <Input
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  placeholder="Ej: Seguimiento de nuevos clientes"
                  className="input-neon"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Descripción
                </label>
                <Textarea
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  placeholder="Describe qué hace este flujo de trabajo..."
                  className="input-neon"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Trigger (Disparador)
                </label>
                <Select value={selectedTrigger} onValueChange={setSelectedTrigger}>
                  <SelectTrigger className="input-neon">
                    <SelectValue placeholder="Selecciona un disparador" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_client">Nuevo cliente registrado</SelectItem>
                    <SelectItem value="payment_due">Pago próximo a vencer</SelectItem>
                    <SelectItem value="project_created">Proyecto creado</SelectItem>
                    <SelectItem value="project_completed">Proyecto completado</SelectItem>
                    <SelectItem value="lead_captured">Lead capturado</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <Card className="service-card">
            <CardHeader>
              <CardTitle className="text-base">Constructor Visual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Constructor visual próximamente</p>
                <p className="text-sm text-muted-foreground">
                  Por ahora, los flujos se crean con configuración básica.
                  El constructor visual drag-and-drop estará disponible en la próxima versión.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {activeView === 'list' && renderWorkflowList()}
      {activeView === 'templates' && renderTemplates()}
      {activeView === 'builder' && renderBuilder()}
    </div>
  );
};

export default WorkflowBuilder;