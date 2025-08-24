import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in-progress' | 'completed';
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Cargar todas las tareas
  const loadTasks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      setTasks(data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `No se pudieron cargar las tareas: ${errorMessage}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar tareas de un proyecto específico
  const loadTasksByProject = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: 'Error',
        description: `No se pudieron cargar las tareas del proyecto: ${errorMessage}`,
        variant: 'destructive'
      });
      return [];
    }
  };

  // Crear nueva tarea
  const addTask = async (taskData: {
    project_id: string;
    title: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    assigned_to?: string;
    due_date?: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          ...taskData,
          status: taskData.status || 'pending'
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setTasks(prev => [data, ...prev]);
      toast({
        title: 'Éxito',
        description: 'Tarea creada correctamente'
      });

      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: 'Error',
        description: `No se pudo crear la tarea: ${errorMessage}`,
        variant: 'destructive'
      });
      return { data: null, error: errorMessage };
    }
  };

  // Actualizar tarea
  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      setTasks(prev => prev.map(task => task.id === id ? data : task));
      toast({
        title: 'Éxito',
        description: 'Tarea actualizada correctamente'
      });

      return { data, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: 'Error',
        description: `No se pudo actualizar la tarea: ${errorMessage}`,
        variant: 'destructive'
      });
      return { data: null, error: errorMessage };
    }
  };

  // Eliminar tarea
  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: 'Éxito',
        description: 'Tarea eliminada correctamente'
      });

      return { error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: 'Error',
        description: `No se pudo eliminar la tarea: ${errorMessage}`,
        variant: 'destructive'
      });
      return { error: errorMessage };
    }
  };

  // Obtener tareas por proyecto
  const getTasksByProject = (projectId: string) => {
    return tasks.filter(task => task.project_id === projectId);
  };

  // Obtener estadísticas de tareas por proyecto
  const getTaskStats = (projectId: string) => {
    const projectTasks = getTasksByProject(projectId);
    const total = projectTasks.length;
    const completed = projectTasks.filter(task => task.status === 'completed').length;
    const inProgress = projectTasks.filter(task => task.status === 'in-progress').length;
    const pending = projectTasks.filter(task => task.status === 'pending').length;
    
    return {
      total,
      completed,
      inProgress,
      pending,
      completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    loadTasks,
    loadTasksByProject,
    addTask,
    updateTask,
    deleteTask,
    getTasksByProject,
    getTaskStats
  };
};