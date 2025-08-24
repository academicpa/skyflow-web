import { useState, useEffect } from 'react';
import { getProjects, createProject, updateProject, deleteProject, getClients } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  name: string;
  completed: boolean;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  client_id: string;
  client?: {
    id: string;
    name: string;
    email: string;
    company?: string;
  };
  budget?: number;
  deadline?: string;
  description?: string;
  created_at: string;
  updated_at: string;
  // Campos adicionales para compatibilidad con el Dashboard actual
  client?: string; // nombre del cliente para mostrar
  tasks?: Task[];
  progress?: number;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Cargar proyectos y clientes
  const loadProjects = async () => {
    try {
      setLoading(true);
      const [projectsResult, clientsResult] = await Promise.all([
        getProjects(),
        getClients()
      ]);

      if (projectsResult.error) {
        throw new Error(projectsResult.error.message);
      }

      if (clientsResult.error) {
        throw new Error(clientsResult.error.message);
      }

      // Transformar datos para compatibilidad con el Dashboard
      const transformedProjects = (projectsResult.data || []).map((project: any) => {
        // Transformar tareas de Supabase al formato esperado por el Dashboard
        const transformedTasks = (project.tasks || []).map((task: any) => ({
          id: task.id,
          name: task.title, // Mapear title a name para compatibilidad
          completed: task.status === 'completed',
          description: task.description
        }));

        // Calcular progreso basado en tareas completadas
        const totalTasks = transformedTasks.length;
        const completedTasks = transformedTasks.filter(task => task.completed).length;
        const calculatedProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 
                                  project.status === 'completed' ? 100 : 
                                  project.status === 'in-progress' ? 50 : 0;

        return {
          ...project,
          client: project.clients?.name || 'Cliente no encontrado',
          budget: project.budget ? `$${project.budget.toLocaleString()}` : '$0',
          deadline: project.deadline || '',
          tasks: transformedTasks,
          progress: calculatedProgress
        };
      });

      setProjects(transformedProjects);
      setClients(clientsResult.data || []);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `No se pudieron cargar los proyectos: ${errorMessage}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo proyecto
  const addProject = async (projectData: {
    name: string;
    description?: string;
    client_id: string;
    budget?: number;
    deadline?: string;
    status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  }) => {
    try {
      const { data, error } = await createProject({
        ...projectData,
        status: projectData.status || 'pending'
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Éxito',
        description: 'Proyecto creado correctamente'
      });

      // Recargar proyectos
      await loadProjects();
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: 'Error',
        description: `No se pudo crear el proyecto: ${errorMessage}`,
        variant: 'destructive'
      });
      return { success: false, error: errorMessage };
    }
  };

  // Actualizar proyecto
  const updateProjectData = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await updateProject(id, updates);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Éxito',
        description: 'Proyecto actualizado correctamente'
      });

      // Recargar proyectos
      await loadProjects();
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: 'Error',
        description: `No se pudo actualizar el proyecto: ${errorMessage}`,
        variant: 'destructive'
      });
      return { success: false, error: errorMessage };
    }
  };

  // Eliminar proyecto
  const removeProject = async (id: string) => {
    try {
      const { error } = await deleteProject(id);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Éxito',
        description: 'Proyecto eliminado correctamente'
      });

      // Recargar proyectos
      await loadProjects();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: 'Error',
        description: `No se pudo eliminar el proyecto: ${errorMessage}`,
        variant: 'destructive'
      });
      return { success: false, error: errorMessage };
    }
  };

  // Obtener proyectos por cliente
  const getProjectsByClient = (clientId: string) => {
    return projects.filter(project => project.client_id === clientId);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadProjects();
  }, []);

  return {
    projects,
    clients,
    loading,
    error,
    loadProjects,
    addProject,
    updateProject: updateProjectData,
    removeProject,
    getProjectsByClient
  };
};