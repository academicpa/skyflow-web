import { useState, useEffect } from 'react';
import { getClients, createClientRecord, updateClient, deleteClient } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  created_at: string;
  updated_at: string;
  // Campos adicionales para compatibilidad con el Dashboard actual
  projectCount?: number;
  totalSpent?: string;
  membershipPlan?: string;
  membershipStatus?: 'active' | 'expired' | 'pending';
  membershipExpiry?: string;
  joinDate?: string;
  lastPayment?: string;
  nextPaymentDue?: string;
  projectIds?: string[];
}

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Cargar clientes
  const loadClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await getClients();

      if (error) {
        throw new Error(error.message);
      }

      // Transformar datos para compatibilidad con el Dashboard
      const transformedClients = (data || []).map((client: any) => ({
        ...client,
        projectCount: 0, // Se calculará después con los proyectos
        totalSpent: client.total_spent ? `$${client.total_spent}` : '$0',
        membershipPlan: client.membership_plan || 'Básico',
        membershipStatus: client.membership_status || 'active' as const,
        membershipExpiry: client.membership_expiry || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        joinDate: client.join_date || client.created_at?.split('T')[0] || '',
        lastPayment: client.last_payment || '',
        nextPaymentDue: client.next_payment_due || '',
        projectIds: []
      }));

      setClients(transformedClients);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: `No se pudieron cargar los clientes: ${errorMessage}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Crear nuevo cliente
  const addClient = async (clientData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    address?: string;
    membership_plan?: string;
  }) => {
    try {
      const { data, error } = await createClientRecord(clientData);

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: 'Éxito',
        description: 'Cliente creado correctamente'
      });

      // Recargar clientes
      await loadClients();
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: 'Error',
        description: `No se pudo crear el cliente: ${errorMessage}`,
        variant: 'destructive'
      });
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

      toast({
        title: 'Éxito',
        description: 'Cliente actualizado correctamente'
      });

      // Recargar clientes
      await loadClients();
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: 'Error',
        description: `No se pudo actualizar el cliente: ${errorMessage}`,
        variant: 'destructive'
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

      toast({
        title: 'Éxito',
        description: 'Cliente eliminado correctamente'
      });

      // Recargar clientes
      await loadClients();
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      toast({
        title: 'Error',
        description: `No se pudo eliminar el cliente: ${errorMessage}`,
        variant: 'destructive'
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

  return {
    clients,
    loading,
    error,
    loadClients,
    addClient,
    updateClient: updateClientData,
    removeClient,
    getClientById,
    getClientByEmail
  };
};