import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  User, 
  Calendar,
  MessageCircle,
  CreditCard,
  FileText,
  Play,
  Send,
  Star
} from 'lucide-react';

interface ClientTask {
  id: string;
  project_id?: string;
  client_id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  due_date?: string;
  assigned_to?: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  client_status: 'por_visitar' | 'pendiente' | 'plan_confirmado' | 'en_proceso' | 'completado' | 'inactivo';
}

interface ClientTaskManagerProps {
  clientId?: string;
  onTaskComplete?: (taskId: string) => void;
  onStatusChange?: (clientId: string, newStatus: Client['client_status']) => void;
}

const ClientTaskManager: React.FC<ClientTaskManagerProps> = ({ 
  clientId, 
  onTaskComplete, 
  onStatusChange 
}) => {
  const [tasks, setTasks] = useState<ClientTask[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Simular carga de tareas (en producción esto vendría de Supabase)
  useEffect(() => {
    if (clientId) {
      loadClientTasks(clientId);
    }
  }, [clientId]);

  const loadClientTasks = async (id: string) => {
    setLoading(true);
    try {
      // Cargar tareas desde la tabla 'tasks' filtrando por client_id a través de projects
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('id')
        .eq('client_id', id);

      if (projectsError) throw projectsError;

      if (projects && projects.length > 0) {
        const projectIds = projects.map(p => p.id);
        
        const { data: tasksData, error: tasksError } = await supabase
          .from('tasks')
          .select('*')
          .in('project_id', projectIds)
          .order('created_at', { ascending: false });

        if (tasksError) throw tasksError;

        setTasks(tasksData || []);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las tareas del cliente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;
      
      // Actualizar estado local
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed', updated_at: new Date().toISOString() }
          : task
      ));
      
      onTaskComplete?.(taskId);
      
      toast({
        title: "Tarea completada",
        description: "La tarea ha sido marcada como completada.",
      });
    } catch (error) {
      console.error('Error completing task:', error);
      toast({
        title: "Error",
        description: "No se pudo completar la tarea.",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = (newStatus: Client['client_status']) => {
    if (clientId && onStatusChange) {
      onStatusChange(clientId, newStatus);
    }
  };

  const getTaskIcon = () => {
    return <Clock className="w-4 h-4" />;
  };

  const getStatusLabel = (status: ClientTask['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in-progress': return 'En Progreso';
      case 'completed': return 'Completada';
      default: return status;
    }
  };

  const getPriorityColor = (priority: ClientTask['priority']) => {
    switch (priority) {
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  const getPriorityLabel = (priority: ClientTask['priority']) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const pendingTasks = tasks.filter(task => task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="space-y-6">

      {/* Tareas Pendientes */}
      {pendingTasks.length > 0 && (
        <Card className="service-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-neon-purple" />
                Tareas Pendientes
              </div>
              <Badge variant="outline" className="text-neon-purple">
                {pendingTasks.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`p-4 border rounded-lg ${
                    isOverdue(task.due_date) 
                      ? 'border-red-500/20 bg-red-500/5' 
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getTaskIcon()}
                        <h4 className="font-medium">{task.title}</h4>
                        <Badge className={getPriorityColor(task.priority)}>
                          {getPriorityLabel(task.priority)}
                        </Badge>
                        {isOverdue(task.due_date) && (
                          <Badge className="bg-red-500/20 text-red-400 border-red-500/20">
                            Vencida
                          </Badge>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Sin fecha'}
                        </span>
                        <span>{getStatusLabel(task.status)}</span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCompleteTask(task.id)}
                      className="bg-neon-cyan hover:bg-neon-cyan/80 text-black"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Completar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tareas Completadas */}
      {completedTasks.length > 0 && (
        <Card className="service-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Tareas Completadas
              </div>
              <Badge variant="outline" className="text-green-400">
                {completedTasks.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <div key={task.id} className="p-4 border border-green-500/20 bg-green-500/5 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <h4 className="font-medium text-green-400">{task.title}</h4>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Completada: {task.updated_at ? new Date(task.updated_at).toLocaleDateString() : 'Hoy'}</span>
                    <span>{getStatusLabel(task.status)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado vacío */}
      {tasks.length === 0 && !loading && (
        <Card className="service-card">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 border-2 border-dashed border-muted-foreground border-opacity-30 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-sm">No hay tareas para este cliente</p>
            <p className="text-muted-foreground/70 text-xs mt-1">Las tareas aparecerán cuando se creen proyectos para este cliente</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientTaskManager;