import { useState, useEffect } from 'react';
import { getClients, createClientRecord, updateClient, deleteClient, getProjects, getPlanes } from '@/lib/supabase';
import { useBeautifulToast } from '@/hooks/use-beautiful-toast';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  client_status: 'por_visitar' | 'pendiente' | 'plan_confirmado' | 'en_proceso' | 'completado' | 'inactivo';
  membership_plan?: string;
  membershipStatus: 'sin_plan' | 'pending' | 'active' | 'expired';
  membershipExpiry?: string;
  joinDate?: string;
  lastPayment?: string;
  nextPaymentDue?: string;
  totalSpent?: number;
  firstContactDate?: string;
  planStartDate?: string;
  notes?: string;
  leadSource?: string;
  assignedTo?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientTask {
  id: string;
  clientId: string;
  taskName: string;
  taskDescription?: string;
  taskType: 'follow_up' | 'payment_reminder' | 'contract_send' | 'project_start' | 'delivery' | 'feedback';
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  updated_at: string;
}

export interface ClientStatusHistory {
  id: string;
  clientId: string;
  previousStatus?: string;
  newStatus: string;
  changedBy?: string;
  changeReason?: string;
  created_at: string;
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showError, showSuccess } = useBeautifulToast();

  // Función para calcular el valor total del cliente basado en el precio del plan × cantidad de proyectos
  const calculateClientTotalSpent = (client: any, projects: any[], plans: any[]) => {
    // Obtener el plan del cliente
    const clientPlan = plans.find(plan => plan.name === client.membership_plan);
    if (!clientPlan) {
      return 0; // Si no tiene plan o el plan no existe, retorna 0
    }
    
    // Contar proyectos del cliente
    const clientProjects = projects.filter(project => project.client_id === client.id);
    const projectCount = clientProjects.length;
    
    // Calcular: precio del plan × cantidad de proyectos
    return clientPlan.price * projectCount;
  };

  // Cargar clientes
  const loadClients = async () => {
    try {
      setLoading(true);
      const [clientsResult, projectsResult, planesResult] = await Promise.all([
        getClients(),
        getProjects(),
        getPlanes()
      ]);

      if (clientsResult.error) {
        throw new Error(clientsResult.error.message);
      }

      if (projectsResult.error) {
        throw new Error(projectsResult.error.message);
      }

      if (planesResult.error) {
        throw new Error(planesResult.error.message);
      }

      const projects = projectsResult.data || [];
      const plans = planesResult.data || [];

      // Transformar datos para compatibilidad con el Dashboard
      const transformedClients = (clientsResult.data || []).map((client: any) => {
        const totalSpent = calculateClientTotalSpent(client, projects, plans);
        const projectCount = projects.filter(p => p.client_id === client.id).length;
        
        return {
          ...client,
          projectCount,
          totalSpent: totalSpent > 0 ? `$${totalSpent.toLocaleString()}` : '$0',
          membershipPlan: client.membership_plan || 'Básico',
          membershipStatus: client.client_status || 'por_visitar' as const,
          membershipExpiry: client.membership_expiry || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          joinDate: client.join_date || client.created_at?.split('T')[0] || '',
          firstContactDate: client.first_contact_date || client.created_at?.split('T')[0] || '',
          lastPayment: client.last_payment || '',
          nextPaymentDue: client.next_payment_due || '',
          projectIds: projects.filter(p => p.client_id === client.id).map(p => p.id)
        };
      });

      setClients(transformedClients);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      showError({
        title: 'Error al cargar clientes',
        description: `No se pudieron cargar los clientes: ${errorMessage}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo cliente
  const addClient = async (clientData: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await createClientRecord({
        ...clientData,
        client_status: clientData.client_status || 'por_visitar',
        first_contact_date: clientData.first_contact_date || new Date().toISOString().split('T')[0]
      });

      if (error) {
        throw new Error(error.message);
      }

      // La notificación de éxito se maneja en el componente AddClientModal

      // Recargar clientes
      await loadClients();
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      // Los errores se manejan en el componente AddClientModal
      return { success: false, error: errorMessage };
    }
  };

  // Actualizar cliente
  const updateClientData = async (id: string, updates: Partial<Client>) => {
    try {
      const { data, error } = await updateClient(id, updates);

      if (error) {
        throw new Error(error.message);
      }

      showSuccess({
        title: 'Cliente actualizado',
        description: 'Los datos del cliente han sido actualizados correctamente'
      });

      // Recargar clientes
      await loadClients();
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      showError({
        title: 'Error al actualizar cliente',
        description: `No se pudo actualizar el cliente: ${errorMessage}`
      });
      return { success: false, error: errorMessage };
    }
  };

  // Eliminar cliente
  const removeClient = async (id: string) => {
    try {
      const { error } = await deleteClient(id);

      if (error) {
        throw new Error(error.message);
      }

      showSuccess({
        title: 'Cliente eliminado',
        description: 'El cliente ha sido eliminado correctamente'
      });

      // Recargar clientes
      await loadClients();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      showError({
        title: 'Error al eliminar cliente',
        description: `No se pudo eliminar el cliente: ${errorMessage}`
      });
      return { success: false, error: errorMessage };
    }
  };

  // Buscar cliente por ID
  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  // Buscar cliente por email
  const getClientByEmail = (email: string) => {
    return clients.find(client => client.email === email);
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadClients();
  }, []);

  // Las tareas de clientes ahora se manejan a través de la tabla 'tasks' vinculada a proyectos
  // Ver useTasks.ts para la gestión de tareas

  const updateClientStatus = async (clientId: string, newStatus: Client['client_status'], reason?: string) => {
    try {
      const { data, error } = await updateClient(clientId, { 
        client_status: newStatus
      });

      if (error) {
        throw new Error(error.message);
      }

      showSuccess({
        title: 'Estado actualizado',
        description: 'El estado del cliente ha sido actualizado correctamente'
      });

      // Recargar clientes para asegurar sincronización con la base de datos
      await loadClients();
      return { success: true, data };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      showError({
        title: 'Error al actualizar estado',
        description: `No se pudo actualizar el estado: ${errorMessage}`
      });
      return { success: false, error: errorMessage };
    }
  };





  return {
    clients,
    loading,
    error,
    loadClients,
    addClient,
    updateClient: updateClientData,
    removeClient,
    getClientById,
    getClientByEmail,
    updateClientStatus
  };
};