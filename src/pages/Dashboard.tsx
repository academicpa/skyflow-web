import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AutomationSystem from '@/components/AutomationSystem';
import { useProjects, type Project as ProjectType } from '@/hooks/useProjects';
import { useClients } from '@/hooks/useClients';
import { useTasks } from '@/hooks/useTasks';
import { AddProjectModal } from '@/components/AddProjectModal';
import { EditProjectModal } from '@/components/EditProjectModal';
import { AddClientModal } from '@/components/AddClientModal';
import { EditClientModal } from '@/components/EditClientModal';
import { AddTaskModal } from '@/components/AddTaskModal';
import ClientStatusStats from '@/components/ClientStatusStats';
import ClientTaskManager from '@/components/ClientTaskManager';
import PlanesManagement from '@/components/PlanesManagement';

import { 
  User, 
  Users,
  LogOut, 
  FolderOpen, 
  Calendar, 
  Bell, 
  Settings,
  Plus,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Filter,
  Sun,
  Moon,
  Grid3X3,
  List,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Send,
  MoreVertical,
  MessageCircle,
  Edit,
  Trash2,
  Menu,
  X,
  Workflow
} from 'lucide-react';

interface Task {
  id: string;
  name: string;
  completed: boolean;
  description?: string;
}

interface Project {
  id: string;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  client: string; // Nombre del cliente para compatibilidad
  client_id: string; // ID del cliente en Supabase
  budget: string;
  deadline: string;
  description: string;
  tasks: Task[];
  progress: number;
}

interface Membership {
  plan: string;
  status: 'active' | 'expired' | 'pending';
  expiryDate: string;
  features: string[];
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  client_status: 'por_visitar' | 'pendiente' | 'plan_confirmado' | 'en_proceso' | 'completado' | 'inactivo';
  membership_plan?: string;
  membershipStatus: 'sin_plan' | 'pending' | 'active' | 'expired';
  membershipExpiry?: string;
  joinDate?: string;
  lastPayment?: string;
  nextPaymentDue?: string;
  totalSpent?: string;
  firstContactDate?: string;
  planStartDate?: string;
  notes?: string;
  leadSource?: string;
  assignedTo?: string;
}

export const Dashboard = () => {
  // Función para obtener el texto a mostrar en el badge del cliente
  const getClientDisplayText = (client: Client): string => {
    if (client.client_status === 'plan_confirmado' && client.membership_plan) {
      return client.membership_plan;
    }
    
    // Mapear estados a texto legible
    const statusLabels = {
      'por_visitar': 'Por Visitar',
      'pendiente': 'Pendiente',
      'plan_confirmado': 'Plan Confirmado',
      'en_proceso': 'En Proceso',
      'completado': 'Completado',
      'inactivo': 'Inactivo'
    };
    
    return statusLabels[client.client_status] || client.client_status;
  };

  // Función para obtener el color del badge según el estado
  const getClientStatusColor = (client: Client): string => {
    if (client.client_status === 'plan_confirmado' && client.membership_plan) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
    
    const statusColors = {
      'por_visitar': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'pendiente': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'plan_confirmado': 'bg-green-500/20 text-green-400 border-green-500/30',
      'en_proceso': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'completado': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'inactivo': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    
    return statusColors[client.client_status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<'admin' | 'client' | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>(() => {
    try {
      const saved = localStorage.getItem('projectViewMode');
      return (saved as 'list' | 'grid') || 'list';
    } catch {
      return 'list';
    }
  });
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  const [clientViewMode, setClientViewMode] = useState<'list' | 'grid'>(() => {
    try {
      const saved = localStorage.getItem('clientViewMode');
      return (saved as 'list' | 'grid') || 'list';
    } catch {
      return 'list';
    }
  });
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientStatusFilter, setClientStatusFilter] = useState<'todos' | 'por_visitar' | 'pendiente' | 'plan_confirmado' | 'en_proceso' | 'completado' | 'inactivo'>('todos');

  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [showEditClientModal, setShowEditClientModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const [activeConfigSection, setActiveConfigSection] = useState('empresa');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hooks de Supabase
  const { projects, loading: projectsLoading, error: projectsError, removeProject, addProject, updateProject, loadProjects } = useProjects();
  const { clients, loading: clientsLoading, error: clientsError, removeClient, addClient, updateClient, loadClients } = useClients();
  const { updateTask, deleteTask } = useTasks();

  // Cerrar sidebar al cambiar de pestaña en móvil
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  // Cerrar sidebar al hacer clic fuera en móvil
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const savedTheme = localStorage.getItem('theme');
    
    // Solo cargar datos del usuario si existen (ProtectedRoute ya maneja la autenticación)
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserRole(user.role as 'admin' | 'client');
        setUserEmail(user.email || '');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Cargar tema guardado o usar oscuro por defecto
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
    
    // Aplicar tema al documento
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openActionMenu) {
        setOpenActionMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openActionMenu]);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    
    if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  };

  const toggleViewMode = () => {
    const newMode = viewMode === 'list' ? 'grid' : 'list';
    setViewMode(newMode);
    localStorage.setItem('projectViewMode', newMode);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const updateTaskStatus = async (projectId: string, taskId: string, completed: boolean) => {
    try {
      const status = completed ? 'completed' : 'pending';
      await updateTask(taskId, { status });
      
      // Update local state
      const updatedProjects = projects.map(project => {
        if (project.id === projectId) {
          const updatedTasks = project.tasks.map(task => 
            task.id === taskId ? { ...task, completed } : task
          );
          const completedTasks = updatedTasks.filter(task => task.completed).length;
          const progress = Math.round((completedTasks / updatedTasks.length) * 100);
          return { ...project, tasks: updatedTasks, progress };
        }
        return project;
      });
      
      // Update selected project if it's the one being modified
      if (selectedProject && selectedProject.id === projectId) {
        const updatedProject = updatedProjects.find(p => p.id === projectId);
        if (updatedProject) {
          setSelectedProject(updatedProject);
        }
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (projectId: string, taskId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        await deleteTask(taskId);
        
        // Update local state
        const updatedProjects = projects.map(project => {
          if (project.id === projectId) {
            const updatedTasks = project.tasks.filter(task => task.id !== taskId);
            const completedTasks = updatedTasks.filter(task => task.completed).length;
            const progress = updatedTasks.length > 0 ? Math.round((completedTasks / updatedTasks.length) * 100) : 0;
            return { ...project, tasks: updatedTasks, progress };
          }
          return project;
        });
        
        // Update selected project if it's the one being modified
        if (selectedProject && selectedProject.id === projectId) {
          const updatedProject = updatedProjects.find(p => p.id === projectId);
          if (updatedProject) {
            setSelectedProject(updatedProject);
          }
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const [editingTask, setEditingTask] = useState<{id: string, name: string, description: string} | null>(null);
  const [openProjectMenu, setOpenProjectMenu] = useState<string | null>(null);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectType | null>(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenProjectMenu(null);
    };

    if (openProjectMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openProjectMenu]);

  const handleEditTask = async (taskId: string, newName: string, newDescription?: string) => {
    try {
      await updateTask(taskId, { title: newName, description: newDescription });
      
      // Update local state
      const updatedProjects = projects.map(project => ({
        ...project,
        tasks: project.tasks.map(task => 
          task.id === taskId ? { ...task, name: newName, description: newDescription } : task
        )
      }));
      
      // Update selected project if needed
      if (selectedProject) {
        const updatedProject = updatedProjects.find(p => p.id === selectedProject.id);
        if (updatedProject) {
          setSelectedProject(updatedProject);
        }
      }
      
      setEditingTask(null);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const toggleClientViewMode = () => {
    const newMode = clientViewMode === 'list' ? 'grid' : 'list';
    setClientViewMode(newMode);
    localStorage.setItem('clientViewMode', newMode);
  };

  // Función para filtrar clientes por estado
  const getFilteredClients = () => {
    if (clientStatusFilter === 'todos') {
      return clients;
    }
    return clients.filter(client => client.client_status === clientStatusFilter);
  };

  const handleClientClick = (client: Client) => {
    setSelectedClient(client);
  };

  const handleBackToClients = () => {
    setSelectedClient(null);
  };

  const handleSendWhatsApp = (client: Client) => {
    // Crear mensaje preconfigurado con variables del cliente
    const welcomeMessage = `¡Hola ${client.name}! 👋\n\n` +
      `Bienvenido/a a *SkyFlow Productions* 🎵\n` +
      `Estamos listos para tu proyecto musical.\n\n` +
      `📋 *Tu membresía:*\n` +
      `• Plan: ${client.membershipPlan}\n` +
      `• Estado: ${client.membershipStatus === 'active' ? 'Activo ✅' : client.membershipStatus === 'pending' ? 'Pendiente ⏳' : 'Expirado ❌'}\n` +
      `• Vence: ${client.membershipExpiry}\n\n` +
      `💰 *Pagos:*\n` +
      `• Último: ${client.lastPayment}\n` +
      `• Próximo: ${client.nextPaymentDue}\n\n` +
      `🎯 *Proyectos activos:* ${getClientProjectCount(client.id)}\n` +
      `💵 *Total invertido:* ${client.totalSpent}\n\n` +
      `¿Dudas? ¡Contáctanos! 🎶\n` +
      `Gracias por confiar en nosotros 🚀`;

    // Limpiar el número de teléfono (solo números)
    const cleanPhone = client.phone.replace(/[^0-9]/g, '');
    
    // Crear URL de WhatsApp Web con el mensaje preconfigurado
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(welcomeMessage)}`;
    
    // Abrir en nueva pestaña
    window.open(whatsappUrl, '_blank');
    
    // Mostrar notificación de éxito
    toast({
      title: "WhatsApp abierto",
      description: `Mensaje de bienvenida preparado para ${client.name}`,
    });
  };



  // Función para manejar la edición de clientes
  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowEditClientModal(true);
  };

  // Función para cerrar el modal de edición
  const handleCloseEditModal = () => {
    setShowEditClientModal(false);
    setEditingClient(null);
  };

  // Función para manejar la eliminación de clientes
  const handleDeleteClient = async (client: Client) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${client.name}? Esta acción no se puede deshacer.`)) {
      try {
        await removeClient(client.id);
        toast({
          title: "Cliente eliminado",
          description: `${client.name} ha sido eliminado exitosamente.`,
        });
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el cliente. Inténtalo de nuevo.",
          variant: "destructive"
        });
      }
    }
  };

  const getClientProjects = (clientId: string) => {
    // Filtrar proyectos que pertenecen al cliente específico
    return projects.filter(project => project.client_id === clientId);
  };

  // Obtener cliente actual basado en el email del usuario logueado
  const getCurrentClient = () => {
    if (userRole !== 'client') return null;
    return clients.find(client => client.email === userEmail);
  };

  // Función para manejar la creación de proyectos
  const handleCreateProject = () => {
    setShowNewProjectModal(true);
  };

  // Función para calcular el número de proyectos por cliente
  const getClientProjectCount = (clientId: string) => {
    return projects.filter(project => project.client_id === clientId).length;
  };

  // Función para obtener el nombre del cliente por ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente desconocido';
  };

  // Función para manejar la edición de proyectos
  const handleEditProject = (project: ProjectType) => {
    setEditingProject(project);
    setShowEditProjectModal(true);
  };

  // Función para manejar la eliminación de proyectos
  const handleDeleteProject = async (project: ProjectType) => {
    const confirmed = window.confirm(`¿Estás seguro de que deseas eliminar el proyecto "${project.name}"? Esta acción no se puede deshacer.`);
    
    if (confirmed) {
      const result = await removeProject(project.id);
      if (result.success) {
        // Si el proyecto eliminado era el seleccionado, volver a la lista
        if (selectedProject?.id === project.id) {
          setSelectedProject(null);
        }
      }
    }
  };

  // Filtrar proyectos para el cliente actual
  const getFilteredProjects = () => {
    if (userRole === 'admin') {
      return projects;
    }
    
    const currentClient = getCurrentClient();
    if (!currentClient) return [];
    
    // Filtrar proyectos por client_id en lugar de projectIds
    return projects.filter(project => project.client_id === currentClient.id);
  };

  // Obtener estadísticas filtradas según el rol del usuario
  const getFilteredStats = () => {
    const filteredProjects = getFilteredProjects();
    
    if (userRole === 'admin') {
      // Para admin: Pendientes = clientes sin plan asignado, Total Clientes = clientes con plan
      const clientsWithoutPlan = clients.filter(c => 
        c.client_status === 'por_visitar' || 
        c.client_status === 'pendiente' || 
        !c.membership_plan
      ).length;
      
      const clientsWithPlan = clients.filter(c => 
        c.membership_plan && 
        c.client_status !== 'por_visitar' && 
        c.client_status !== 'pendiente'
      ).length;
      
      return {
        activeProjects: filteredProjects.filter(p => p.status === 'in-progress').length,
        completedProjects: filteredProjects.filter(p => p.status === 'completed').length,
        pendingProjects: clientsWithoutPlan, // Clientes sin plan asignado
        totalClients: clientsWithPlan, // Clientes con plan asignado
        activeClients: clientsWithPlan // Para mostrar en el subtexto
      };
    } else {
      // Para clientes: mantener lógica original de proyectos
      return {
        activeProjects: filteredProjects.filter(p => p.status === 'in-progress').length,
        completedProjects: filteredProjects.filter(p => p.status === 'completed').length,
        pendingProjects: filteredProjects.filter(p => p.status === 'pending').length,
        totalClients: 1 // Para clientes, solo ellos mismos
      };
    }
  };

  // Obtener actividades filtradas según el rol del usuario
  const getFilteredActivities = () => {
    // Placeholder temporal - próximamente se implementará la lógica real de actividades
    return [];
    
    /* Código comentado temporalmente para mostrar placeholder
    const currentClient = getCurrentClient();
    
    if (userRole === 'admin') {
      return [
        { type: 'project', message: 'Nuevo proyecto creado: Video Musical', time: 'Hace 2 horas', color: 'blue' },
        { type: 'project', message: 'Proyecto completado: Mezcla y Master', time: 'Ayer', color: 'green' },
        { type: 'client', message: 'Cliente nuevo registrado: María García', time: 'Hace 3 días', color: 'orange' },
        { type: 'payment', message: 'Pago recibido de Carlos López', time: 'Hace 4 días', color: 'purple' },
        { type: 'project', message: 'Actualización de proyecto: Podcast Corporativo', time: 'Hace 5 días', color: 'cyan' }
      ];
    } else {
      // Para clientes, mostrar solo actividades relacionadas con sus proyectos
      const clientProjects = getFilteredProjects();
      return [
        { type: 'project', message: `Progreso actualizado en: ${clientProjects[0]?.name || 'Tu proyecto'}`, time: 'Hace 1 hora', color: 'blue' },
        { type: 'payment', message: 'Pago procesado exitosamente', time: 'Hace 2 días', color: 'green' },
        { type: 'membership', message: `Membresía ${currentClient?.membershipPlan} renovada`, time: 'Hace 1 semana', color: 'purple' },
        { type: 'project', message: 'Nueva tarea asignada a tu proyecto', time: 'Hace 1 semana', color: 'cyan' }
      ];
    }
    */
  };

  const getMembershipStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'expired': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const isPaymentDueSoon = (nextPaymentDue: string) => {
    const dueDate = new Date(nextPaymentDue);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
    navigate('/login');
  };

  // Los datos ahora vienen de los hooks de Supabase

  const membership: Membership | null = userRole === 'client' ? {
    plan: 'Premium',
    status: 'active',
    expiryDate: '2024-12-31',
    features: [
      'Acceso prioritario a servicios',
      'Descuentos en proyectos',
      'Soporte técnico 24/7',
      'Revisiones ilimitadas'
    ]
  } : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-3 h-3" />;
      case 'in-progress': return <Clock className="w-3 h-3" />;
      case 'pending': return <AlertCircle className="w-3 h-3" />;
      case 'cancelled': return <AlertCircle className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'in-progress': return 'En Progreso';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return userRole === 'admin' ? 'Panel de Administración' : 'Mi Dashboard';
      case 'proyectos': return 'Proyectos';
      case 'clientes': return 'Gestión de Clientes';
      case 'planes': return 'Gestión de Planes';
      case 'automatizacion': return 'Sistema de Automatización';
      case 'configuracion': return 'Configuración del Sistema';
      case 'membresia': return 'Mi Membresía';
      case 'notificaciones': return 'Notificaciones';
      default: return userRole === 'admin' ? 'Panel de Administración' : 'Mi Dashboard';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'automatizacion':
        return <AutomationSystem />;
        
      case 'dashboard':
        return (
          <div className="space-y-8">
            {/* Estadísticas Generales - 4 tarjetas en una fila */}
            <Card className="service-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FolderOpen className="w-5 h-5 mr-2 text-neon-cyan" />
                    {userRole === 'admin' ? 'Estadísticas Generales' : 'Mi Panel de Control'}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/20 rounded-lg">
                    <h3 className="font-semibold text-neon-cyan mb-2">{userRole === 'admin' ? 'Proyectos Activos' : 'Mis Proyectos Activos'}</h3>
                    <p className="text-2xl font-bold text-foreground">{getFilteredStats().activeProjects}</p>
                  </div>
                  <div className="p-4 bg-neon-purple/10 border border-neon-purple/20 rounded-lg">
                    <h3 className="font-semibold text-neon-purple mb-2">{userRole === 'admin' ? 'Completados' : 'Mis Completados'}</h3>
                    <p className="text-2xl font-bold text-foreground">{getFilteredStats().completedProjects}</p>
                  </div>
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <h3 className="font-semibold text-yellow-500 mb-2">{userRole === 'admin' ? 'Pendientes' : 'Mis Pendientes'}</h3>
                    <p className="text-2xl font-bold text-foreground">{getFilteredStats().pendingProjects}</p>
                    {userRole === 'admin' && (
                      <p className="text-xs text-muted-foreground mt-1">Clientes sin plan</p>
                    )}
                  </div>
                  {userRole === 'admin' ? (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <h3 className="font-semibold text-green-500 mb-2">Total Clientes</h3>
                      <p className="text-2xl font-bold text-foreground">{getFilteredStats().totalClients}</p>
                      <p className="text-xs text-muted-foreground mt-1">{getFilteredStats().activeClients || getFilteredStats().totalClients} activos</p>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <h3 className="font-semibold text-green-500 mb-2">Mi Membresía</h3>
                      <p className="text-2xl font-bold text-foreground">{getCurrentClient()?.membershipPlan || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getCurrentClient()?.membershipStatus === 'active' ? 'Activa' : 
                         getCurrentClient()?.membershipStatus === 'pending' ? 'Pendiente' : 'Expirada'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            

            
            {/* Sección inferior con dos tarjetas lado a lado */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
              <Card className="service-card lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-neon-purple" />
                    Actividad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {getFilteredActivities().length > 0 ? (
                    <div className="space-y-3">
                      {getFilteredActivities().map((activity, index) => (
                        <div key={index} className={`p-3 bg-${activity.color}-500/10 border border-${activity.color}-500/20 rounded-lg`}>
                          <p className={`text-sm text-${activity.color}-400`}>{activity.message}</p>
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 border-2 border-dashed border-muted-foreground border-opacity-30 rounded-lg flex items-center justify-center mb-4">
                        <Bell className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                      <p className="text-muted-foreground text-sm">No hay actividad reciente</p>
                      <p className="text-muted-foreground/70 text-xs mt-1">La actividad aparecerá aquí próximamente</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="service-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-neon-cyan" />
                    Próximos Vencimientos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Placeholder temporal - próximamente se implementará la lógica real */}
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 border-2 border-dashed border-muted-foreground border-opacity-30 rounded-lg flex items-center justify-center mb-4">
                      <Calendar className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-muted-foreground text-sm">No hay vencimientos próximos</p>
                    <p className="text-muted-foreground/70 text-xs mt-1">Los vencimientos aparecerán aquí próximamente</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      case 'proyectos':
        if (selectedProject) {
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={handleBackToProjects}>
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Volver a Proyectos
                </Button>
                <Badge className={getStatusColor(selectedProject.status)}>
                  {getStatusIcon(selectedProject.status)}
                  <span className="ml-1">{getStatusText(selectedProject.status)}</span>
                </Badge>
              </div>
              
              <Card className="service-card">
                 <CardHeader>
                   <CardTitle className="text-2xl">{selectedProject.name}</CardTitle>
                   <p className="text-muted-foreground">{selectedProject.description}</p>
                 </CardHeader>
                 <CardContent className="space-y-6">
                   <div>
                     <div className="flex items-center justify-between mb-4">
                       <h3 className="text-lg font-semibold">Progreso del Proyecto</h3>
                       <span className="text-sm text-muted-foreground">{selectedProject.progress}% completado</span>
                     </div>
                     <div className="w-full bg-muted rounded-full h-3 mb-6">
                       <div 
                         className="bg-gradient-to-r from-neon-cyan to-neon-purple h-3 rounded-full transition-all duration-300"
                         style={{ width: `${selectedProject.progress}%` }}
                       ></div>
                     </div>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/20 rounded-lg">
                       <h3 className="font-semibold text-neon-cyan mb-2">Cliente</h3>
                       <p className="text-foreground">{getClientName(selectedProject.client_id)}</p>
                     </div>
                     <div className="p-4 bg-neon-purple/10 border border-neon-purple/20 rounded-lg">
                       <h3 className="font-semibold text-neon-purple mb-2">Presupuesto</h3>
                       <p className="text-foreground">{selectedProject.budget}</p>
                     </div>
                     <div className="p-4 bg-gold/10 border border-gold/20 rounded-lg">
                       <h3 className="font-semibold text-gold mb-2">Fecha Límite</h3>
                       <p className="text-foreground">{selectedProject.deadline}</p>
                     </div>
                   </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Tareas del Proyecto</h3>
                      <AddTaskModal 
                        projectId={selectedProject.id}
                        projectName={selectedProject.name}
                        onTaskAdded={() => window.location.reload()}
                        trigger={
                          <Button 
                            size="sm" 
                            className="bg-neon-cyan hover:bg-neon-cyan/80 text-black"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Tarea
                          </Button>
                        }
                      />
                    </div>
                    <div className="space-y-3">
                      {selectedProject.tasks.map((task) => (
                        <div key={task.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:border-neon-cyan/50 transition-colors">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) => updateTaskStatus(selectedProject.id, task.id, e.target.checked)}
                            className="w-4 h-4 text-neon-cyan bg-background border-border rounded focus:ring-neon-cyan focus:ring-2"
                          />
                          <div className="flex-1">
                            {editingTask && editingTask.id === task.id ? (
                              <div className="space-y-2">
                                <input
                                  type="text"
                                  value={editingTask.name}
                                  onChange={(e) => setEditingTask({...editingTask, name: e.target.value})}
                                  className="w-full px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleEditTask(task.id, editingTask.name, editingTask.description);
                                    } else if (e.key === 'Escape') {
                                      setEditingTask(null);
                                    }
                                  }}
                                  autoFocus
                                />
                                <input
                                  type="text"
                                  value={editingTask.description || ''}
                                  onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                                  placeholder="Descripción (opcional)"
                                  className="w-full px-2 py-1 text-sm border border-border rounded bg-background text-muted-foreground"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleEditTask(task.id, editingTask.name, editingTask.description);
                                    } else if (e.key === 'Escape') {
                                      setEditingTask(null);
                                    }
                                  }}
                                />
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() => handleEditTask(task.id, editingTask.name, editingTask.description)}
                                    className="bg-neon-cyan hover:bg-neon-cyan/80 text-black"
                                  >
                                    Guardar
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingTask(null)}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                  {task.name}
                                </p>
                                {task.description && (
                                  <p className="text-sm text-muted-foreground">{task.description}</p>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {task.completed && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingTask({id: task.id, name: task.name, description: task.description})}
                              className="h-8 w-8 p-0 hover:bg-neon-cyan/20"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteTask(selectedProject.id, task.id)}
                              className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        }
        
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {userRole === 'admin' && (
                  <Button size="sm" className="btn-neon" onClick={handleCreateProject}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Proyecto
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleViewMode}
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
            
            {getFilteredProjects().length === 0 ? (
              <div className="flex items-center justify-center min-h-[400px] w-full">
                <div className="text-center p-8 border-2 border-dashed border-muted-foreground border-opacity-30 rounded-lg bg-muted bg-opacity-10 max-w-md mx-auto">
                  <FolderOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No hay proyectos</h3>
                  <p className="text-muted-foreground mb-4">
                    {userRole === 'admin' 
                      ? 'Aún no se han creado proyectos. Comienza creando tu primer proyecto.'
                      : 'No tienes proyectos asignados en este momento.'
                    }
                  </p>
                  {userRole === 'admin' && (
                    <Button onClick={handleCreateProject} className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-cyan/80 hover:to-neon-purple/80">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Primer Proyecto
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6' : 'space-y-4'}>
                {getFilteredProjects().map((project) => (
                  <Card 
                     key={project.id} 
                     className="service-card cursor-pointer hover:border-neon-cyan/50 transition-all duration-300 hover:shadow-lg hover:shadow-neon-cyan/20 group relative"
                     onClick={() => handleProjectClick(project)}
                   >
                   <CardContent className={viewMode === 'grid' ? 'p-4 relative' : 'p-4 relative'}>
                      {viewMode === 'grid' ? (
                        <>
                          <div className="absolute top-2 right-2">
                            <Badge className={getStatusColor(project.status)}>
                              {getStatusIcon(project.status)}
                              <span className="ml-1 text-xs">{getStatusText(project.status)}</span>
                            </Badge>
                          </div>
                          
                          <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-neon-cyan transition-colors pr-20">{project.name}</h3>
                         
                         <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>
                         
                         <div className="mb-3">
                           <div className="flex items-center justify-between mb-1">
                             <span className="text-xs font-medium text-foreground">Progreso</span>
                             <span className="text-xs text-muted-foreground">{project.progress}%</span>
                           </div>
                           <div className="w-full bg-muted rounded-full h-1.5">
                             <div 
                               className="bg-gradient-to-r from-neon-cyan to-neon-purple h-1.5 rounded-full transition-all duration-300"
                               style={{ width: `${project.progress}%` }}
                             ></div>
                           </div>
                         </div>
                         
                         <div className="space-y-1 text-xs">
                           {userRole === 'admin' && (
                             <div className="text-muted-foreground truncate">
                               Cliente: {getClientName(project.client_id)}
                             </div>
                           )}
                           <div className="text-muted-foreground">
                             Presupuesto: {project.budget}
                           </div>
                           <div className="text-muted-foreground flex items-center">
                             <Calendar className="w-3 h-3 mr-1" />
                             {project.deadline}
                           </div>
                         </div>
                         

                         
                         <div className="absolute bottom-2 right-2">
                            <div className="relative">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-neon-cyan/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenProjectMenu(openProjectMenu === project.id ? null : project.id);
                                }}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                              {openProjectMenu === project.id && (
                                <div className="absolute bottom-full right-0 mb-2 w-48 bg-background border border-border rounded-md shadow-lg z-50">
                                  <div className="py-1">
                                    <button
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleProjectClick(project);
                                        setOpenProjectMenu(null);
                                      }}
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      Ver detalles
                                    </button>
                                    <button
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center"
                                      onClick={(e) => {
                                         e.stopPropagation();
                                         setOpenProjectMenu(null);
                                         handleEditProject(project);
                                       }}
                                    >
                                      <Edit className="w-4 h-4 mr-2" />
                                      Editar proyecto
                                    </button>
                                    <button
                                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted text-red-500 flex items-center"
                                      onClick={(e) => {
                                         e.stopPropagation();
                                         setOpenProjectMenu(null);
                                         handleDeleteProject(project);
                                       }}
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Eliminar proyecto
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                       </>
                     ) : (
                        <>
                          <div className="absolute top-2 right-2">
                            <Badge className={getStatusColor(project.status)}>
                              {getStatusIcon(project.status)}
                              <span className="ml-1">{getStatusText(project.status)}</span>
                            </Badge>
                          </div>
                          
                          <h3 className="font-semibold text-foreground text-lg mb-2 group-hover:text-neon-cyan transition-colors pr-32">{project.name}</h3>
                         
                         <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                         
                         <div className="mb-3">
                           <div className="flex items-center justify-between mb-1">
                             <span className="text-sm font-medium text-foreground">Progreso</span>
                             <span className="text-sm text-muted-foreground">{project.progress}%</span>
                           </div>
                           <div className="w-full bg-muted rounded-full h-2">
                             <div 
                               className="bg-gradient-to-r from-neon-cyan to-neon-purple h-2 rounded-full transition-all duration-300"
                               style={{ width: `${project.progress}%` }}
                             ></div>
                           </div>
                         </div>
                         
                         <div className="flex items-center justify-between text-sm mb-3">
                           <div className="flex items-center space-x-4">
                             {userRole === 'admin' && (
                               <span className="text-muted-foreground">
                                 Cliente: {getClientName(project.client_id)}
                               </span>
                             )}
                             <span className="text-muted-foreground">
                               Presupuesto: {project.budget}
                             </span>
                             <span className="text-muted-foreground flex items-center">
                               <Calendar className="w-4 h-4 mr-1" />
                               {project.deadline}
                             </span>
                           </div>
                           <div className="relative">
                             <Button
                               variant="ghost"
                               size="sm"
                               className="h-8 w-8 p-0 hover:bg-neon-cyan/20"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 setOpenProjectMenu(openProjectMenu === project.id ? null : project.id);
                               }}
                             >
                               <MoreVertical className="h-4 w-4" />
                             </Button>
                             {openProjectMenu === project.id && (
                               <div className="absolute bottom-full right-0 mb-2 w-48 bg-background border border-border rounded-md shadow-lg z-50">
                                 <div className="py-1">
                                   <button
                                     className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center"
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       handleProjectClick(project);
                                       setOpenProjectMenu(null);
                                     }}
                                   >
                                     <Eye className="w-4 h-4 mr-2" />
                                     Ver detalles
                                   </button>
                                   <button
                                     className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center"
                                     onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenProjectMenu(null);
                                        handleEditProject(project);
                                      }}
                                   >
                                     <Edit className="w-4 h-4 mr-2" />
                                     Editar proyecto
                                   </button>
                                   <button
                                     className="w-full text-left px-3 py-2 text-sm hover:bg-muted text-red-500 flex items-center"
                                     onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenProjectMenu(null);
                                        handleDeleteProject(project);
                                      }}
                                   >
                                     <Trash2 className="w-4 h-4 mr-2" />
                                     Eliminar proyecto
                                   </button>
                                 </div>
                               </div>
                             )}
                           </div>
                         </div>
                         

                       </>
                     )}
                   </CardContent>
                 </Card>
              ))}
              </div>
            )}
          </div>
        );
      
      case 'clientes':
        if (selectedClient) {
          const clientProjects = getClientProjects(selectedClient.id);
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={handleBackToClients}>
                  <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
                  Volver a Clientes
                </Button>
                <div className="flex items-center space-x-2">
                  <Badge className={getMembershipStatusColor(selectedClient.membershipStatus)}>
                    {selectedClient.membershipStatus === 'active' ? 'Activo' : 
                     selectedClient.membershipStatus === 'pending' ? 'Pendiente' : 'Expirado'}
                  </Badge>
                  {isPaymentDueSoon(selectedClient.nextPaymentDue) && (
                    <Button 
                      size="sm" 
                      className="btn-neon"
                      onClick={() => handleSendWhatsApp(selectedClient)}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Recordatorio
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Información del Cliente */}
                <div className="lg:col-span-1 space-y-6">
                  <Card className="service-card">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full flex items-center justify-center">
                          <span className="text-xl font-bold text-white">{selectedClient.name.charAt(0)}</span>
                        </div>
                        <div>
                          <CardTitle className="text-xl">{selectedClient.name}</CardTitle>
                          <p className="text-muted-foreground">{selectedClient.company}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-neon-cyan" />
                          <span className="text-sm">{selectedClient.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-neon-cyan" />
                          <span className="text-sm">{selectedClient.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-4 h-4 text-neon-cyan" />
                          <span className="text-sm">{selectedClient.address}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Información de Membresía */}
                  <Card className="service-card">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CreditCard className="w-5 h-5 mr-2 text-neon-purple" />
                        Membresía
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Plan:</span>
                          <Badge className="bg-neon-purple/20 text-neon-purple">{selectedClient.membershipPlan}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Estado:</span>
                          <Badge className={getMembershipStatusColor(selectedClient.membershipStatus)}>
                            {selectedClient.membershipStatus === 'active' ? 'Activo' : 
                             selectedClient.membershipStatus === 'pending' ? 'Pendiente' : 'Expirado'}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Vence:</span>
                          <span className="text-sm">{selectedClient.membershipExpiry}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Próximo pago:</span>
                          <span className={`text-sm ${
                            isPaymentDueSoon(selectedClient.nextPaymentDue) ? 'text-yellow-400' : ''
                          }`}>{selectedClient.nextPaymentDue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total gastado:</span>
                          <span className="text-sm font-semibold">{selectedClient.totalSpent}</span>
                        </div>
                      </div>
                      {isPaymentDueSoon(selectedClient.nextPaymentDue) && (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <p className="text-sm text-yellow-400">⚠️ Pago próximo a vencer</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Proyectos del Cliente */}
                <div className="lg:col-span-2">
                  <Card className="service-card">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FolderOpen className="w-5 h-5 mr-2 text-neon-cyan" />
                        Proyectos ({clientProjects.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {clientProjects.length > 0 ? (
                        <div className="space-y-4">
                          {clientProjects.map((project) => (
                            <div 
                              key={project.id} 
                              className="p-4 border border-border rounded-lg hover:border-neon-cyan/50 transition-colors cursor-pointer"
                              onClick={() => {
                                setSelectedProject(project);
                                setActiveTab('proyectos');
                              }}>
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-foreground">{project.name}</h3>
                                <Badge className={getStatusColor(project.status)}>
                                  {getStatusIcon(project.status)}
                                  <span className="ml-1">{getStatusText(project.status)}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Progreso:</span>
                                  <span className="text-foreground">{project.progress}%</span>
                                </div>
                                <div className="w-full bg-muted rounded-full h-2">
                                  <div 
                                    className="bg-gradient-to-r from-neon-cyan to-neon-purple h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Presupuesto: {project.budget}</span>
                                  <span className="text-muted-foreground flex items-center">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {project.deadline}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No hay proyectos asignados a este cliente</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Gestión de Tareas del Cliente */}
              <ClientTaskManager clientId={selectedClient.id} />

            </div>
          );
        }
        
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  size="sm" 
                  className="btn-neon"
                  onClick={() => setShowNewClientModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Cliente
                </Button>
              </div>
              <div className="flex items-center space-x-3">
                {/* Filtro por estado */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={clientStatusFilter}
                    onChange={(e) => setClientStatusFilter(e.target.value as typeof clientStatusFilter)}
                    className="bg-background border border-border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                  >
                    <option value="todos">Todos los estados</option>
                    <option value="por_visitar">Por Visitar</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="plan_confirmado">Plan Confirmado</option>
                    <option value="en_proceso">En Proceso</option>
                    <option value="completado">Completado</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleClientViewMode}
                  className="flex items-center"
                >
                  {clientViewMode === 'list' ? (
                    <><Grid3X3 className="w-4 h-4 mr-2" /> Vista Cuadrícula</>
                  ) : (
                    <><List className="w-4 h-4 mr-2" /> Vista Lista</>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Estadísticas de Estados de Clientes */}
            <ClientStatusStats clients={clients} />
            
            <Card className="service-card">
              <CardContent className="p-6">
                {getFilteredClients().length > 0 ? (
                  <div className={clientViewMode === 'grid' ? 
                    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : 
                    "space-y-4"
                  }>
                    {getFilteredClients().map((client) => (
                    <div 
                      key={client.id} 
                      className={`p-4 border border-border rounded-lg hover:border-neon-cyan/50 transition-colors group ${
                        clientViewMode === 'list' ? 'flex items-center space-x-4' : ''
                      }`}
                    >
                      {clientViewMode === 'grid' ? (
                        <>
                          <div className="relative">
                            <div className="flex items-center space-x-3 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-white">{client.name.charAt(0)}</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-foreground group-hover:text-neon-cyan transition-colors">{client.name}</h3>
                                <p className="text-sm text-muted-foreground">{client.email}</p>
                                {client.company && (
                                  <p className="text-xs text-muted-foreground">{client.company}</p>
                                )}
                              </div>
                            </div>
                            <div className="absolute top-2 right-2">
                              <Badge className={getClientStatusColor(client)}>
                                {getClientDisplayText(client)}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2 mt-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Proyectos:</span>
                              <span className="text-foreground">{getClientProjectCount(client.id)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Total gastado:</span>
                              <span className="text-foreground font-semibold">{client.totalSpent}</span>
                            </div>
                            {isPaymentDueSoon(client.nextPaymentDue) && (
                              <div className="flex items-center text-xs text-yellow-400">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Pago próximo
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                            <div className="flex items-center space-x-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClientClick(client);
                                }}
                                className="p-1 h-7 w-7 text-blue-500 hover:text-blue-600"
                                title="Ver detalles"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSendWhatsApp(client);
                                }}
                                className="p-1 h-7 w-7 text-green-500 hover:text-green-600"
                                title="Enviar WhatsApp"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClient(client);
                                }}
                                className="p-1 h-7 w-7 text-blue-500 hover:text-blue-600"
                                title="Editar"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClient(client);
                                }}
                                className="p-1 h-7 w-7 text-red-500 hover:text-red-600"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-white">{client.name.charAt(0)}</span>
                          </div>
                          <div className="flex-1 min-w-0 grid grid-cols-[1fr_100px] gap-4 items-start">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-foreground group-hover:text-neon-cyan transition-colors truncate mb-1">{client.name}</h3>
                              <p className="text-sm text-muted-foreground truncate">{client.email}</p>
                              {client.company && (
                                <p className="text-xs text-muted-foreground truncate">{client.company}</p>
                              )}
                            </div>
                            <div className="flex justify-start pt-0">
                               <Badge className={getClientStatusColor(client)}>
                                 {getClientDisplayText(client)}
                               </Badge>
                             </div>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="text-center">
                              <div className="text-foreground font-semibold">{getClientProjectCount(client.id)}</div>
                              <div className="text-muted-foreground text-xs">Proyectos</div>
                            </div>
                            <div className="text-center">
                              <div className="text-foreground font-semibold">{client.totalSpent}</div>
                              <div className="text-muted-foreground text-xs">Total</div>
                            </div>
                            {isPaymentDueSoon(client.nextPaymentDue) && (
                              <div className="flex items-center text-yellow-400">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                <span className="text-xs">Pago próximo</span>
                              </div>
                            )}
                          </div>
                          <div className="relative">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenActionMenu(openActionMenu === client.id ? null : client.id);
                                }}
                                className="p-1 h-6 w-6"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                              {openActionMenu === client.id && (
                                <div className="absolute right-0 top-8 bg-card border border-border rounded-lg shadow-lg z-50 min-w-[160px]">
                                  <div className="py-1">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleClientClick(client);
                                        setOpenActionMenu(null);
                                      }}
                                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      Ver detalles
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSendWhatsApp(client);
                                        setOpenActionMenu(null);
                                      }}
                                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center"
                                    >
                                      <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
                                      Enviar WhatsApp
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenActionMenu(null);
                                        handleEditClient(client);
                                      }}
                                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center"
                                    >
                                      <Edit className="w-4 h-4 mr-2 text-blue-500" />
                                      Editar
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenActionMenu(null);
                                        handleDeleteClient(client);
                                      }}
                                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center text-red-500"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Eliminar
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                        </>
                      )}
                    </div>
                  ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 border-2 border-dashed border-muted-foreground border-opacity-30 rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-8 h-8 text-muted-foreground text-opacity-50" />
                    </div>
                    <p className="text-muted-foreground text-sm">No hay contactos registrados</p>
                    <p className="text-muted-foreground text-opacity-70 text-xs mt-1">Agrega tu primer cliente para comenzar</p>
                    <Button 
                      className="btn-neon mt-4" 
                      onClick={() => setShowNewClientModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Cliente
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            

          </div>
        );
      
      case 'configuracion':
        const renderConfigContent = () => {
          switch (activeConfigSection) {
            case 'empresa':
              return (
                <Card className="service-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-neon-pink" />
                      Información de la Empresa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nombre de la empresa</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                          placeholder="SkyFlow Productions"
                          defaultValue="SkyFlow Productions"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email de contacto</label>
                        <input
                          type="email"
                          className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                          placeholder="contacto@skyflow.com"
                          defaultValue="contacto@skyflow.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Teléfono</label>
                        <input
                          type="tel"
                          className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                          placeholder="+57 300 123 4567"
                          defaultValue="+57 300 123 4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Sitio web</label>
                        <input
                          type="url"
                          className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                          placeholder="https://skyflow.com"
                          defaultValue="https://skyflow.com"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">Dirección</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                          placeholder="Calle Principal 123, Bogotá, Colombia"
                          defaultValue="Calle Principal 123, Bogotá, Colombia"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="btn-neon">
                        Guardar Cambios
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            
            case 'notificaciones':
              return (
                <Card className="service-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="w-5 h-5 mr-2 text-neon-purple" />
                      Configuración de Notificaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Notificaciones por Email</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Nuevos clientes</span>
                            <Button variant="outline" size="sm" className="bg-green-500/20 text-green-400">Activado</Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Proyectos completados</span>
                            <Button variant="outline" size="sm" className="bg-green-500/20 text-green-400">Activado</Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Pagos recibidos</span>
                            <Button variant="outline" size="sm" className="bg-red-500/20 text-red-400">Desactivado</Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Recordatorios de vencimiento</span>
                            <Button variant="outline" size="sm" className="bg-green-500/20 text-green-400">Activado</Button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Notificaciones Push</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Mensajes de clientes</span>
                            <Button variant="outline" size="sm" className="bg-green-500/20 text-green-400">Activado</Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Actualizaciones de proyectos</span>
                            <Button variant="outline" size="sm" className="bg-green-500/20 text-green-400">Activado</Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Recordatorios diarios</span>
                            <Button variant="outline" size="sm" className="bg-red-500/20 text-red-400">Desactivado</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            
            case 'sistema':
              return (
                <Card className="service-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Grid3X3 className="w-5 h-5 mr-2 text-neon-cyan" />
                      Configuración del Sistema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Respaldos y Seguridad</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Backup automático</span>
                            <select className="px-3 py-1 border border-border rounded bg-background text-foreground">
                              <option value="daily">Diario</option>
                              <option value="weekly">Semanal</option>
                              <option value="monthly">Mensual</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Autenticación de dos factores</span>
                            <Button variant="outline" size="sm" className="bg-red-500/20 text-red-400">Desactivado</Button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Sesiones múltiples</span>
                            <Button variant="outline" size="sm" className="bg-green-500/20 text-green-400">Permitido</Button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-foreground">Preferencias de Interfaz</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Tema</span>
                            <select className="px-3 py-1 border border-border rounded bg-background text-foreground">
                              <option value="dark">Oscuro</option>
                              <option value="light">Claro</option>
                              <option value="auto">Automático</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Idioma</span>
                            <select className="px-3 py-1 border border-border rounded bg-background text-foreground">
                              <option value="es">Español</option>
                              <option value="en">English</option>
                              <option value="pt">Português</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-foreground">Zona horaria</span>
                            <select className="px-3 py-1 border border-border rounded bg-background text-foreground">
                              <option value="America/Bogota">Bogotá (GMT-5)</option>
                              <option value="America/Mexico_City">Ciudad de México (GMT-6)</option>
                              <option value="America/Argentina/Buenos_Aires">Buenos Aires (GMT-3)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            
            case 'facturacion':
              return (
                <Card className="service-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-neon-yellow" />
                      Configuración de Facturación
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Moneda predeterminada</label>
                        <select className="w-full p-3 border border-border rounded-lg bg-background text-foreground">
                          <option value="COP">Peso Colombiano (COP)</option>
                          <option value="USD">Dólar Estadounidense (USD)</option>
                          <option value="EUR">Euro (EUR)</option>
                          <option value="MXN">Peso Mexicano (MXN)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">IVA predeterminado (%)</label>
                        <input
                          type="number"
                          className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                          placeholder="19"
                          defaultValue="19"
                          min="0"
                          max="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Términos de pago (días)</label>
                        <select className="w-full p-3 border border-border rounded-lg bg-background text-foreground">
                          <option value="15">15 días</option>
                          <option value="30">30 días</option>
                          <option value="45">45 días</option>
                          <option value="60">60 días</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Numeración de facturas</label>
                        <input
                          type="text"
                          className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                          placeholder="SF-2024-"
                          defaultValue="SF-2024-"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button className="btn-neon">
                        Guardar Configuración
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            
            default:
              return null;
          }
        };

        return (
          <div className="flex gap-6">
            {/* Navegación lateral */}
            <div className="w-64 space-y-2">
              <h2 className="text-xl font-semibold mb-4 text-foreground">Configuración</h2>
              
              <Button
                variant={activeConfigSection === 'empresa' ? 'default' : 'ghost'}
                className={`w-full justify-start ${activeConfigSection === 'empresa' ? 'btn-neon' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveConfigSection('empresa')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Información de Empresa
              </Button>
              
              <Button
                variant={activeConfigSection === 'notificaciones' ? 'default' : 'ghost'}
                className={`w-full justify-start ${activeConfigSection === 'notificaciones' ? 'btn-neon' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveConfigSection('notificaciones')}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notificaciones
              </Button>
              
              <Button
                variant={activeConfigSection === 'sistema' ? 'default' : 'ghost'}
                className={`w-full justify-start ${activeConfigSection === 'sistema' ? 'btn-neon' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveConfigSection('sistema')}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Sistema
              </Button>
              
              <Button
                variant={activeConfigSection === 'facturacion' ? 'default' : 'ghost'}
                className={`w-full justify-start ${activeConfigSection === 'facturacion' ? 'btn-neon' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveConfigSection('facturacion')}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Facturación
              </Button>
            </div>
            
            {/* Contenido principal */}
            <div className="flex-1">
              {renderConfigContent()}
            </div>
          </div>
        );
      
      case 'membresia':
        return (
          <div className="space-y-6">
            {membership && (
              <Card className="service-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-neon-pink" />
                    Detalles de Membresía
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Plan:</span>
                        <Badge className="bg-neon-purple/20 text-neon-purple">{membership.plan}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Estado:</span>
                        <Badge className={membership.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                          {membership.status === 'active' ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Vence:</span>
                        <span className="text-sm text-foreground">{membership.expiryDate}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Beneficios incluidos:</h4>
                      <ul className="space-y-2">
                        {membership.features.map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      
      case 'notificaciones':
        return (
          <div className="space-y-6">
            <Card className="service-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-neon-purple" />
                  Todas las Notificaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'info', message: 'Tu proyecto "Video Musical" está en progreso', time: 'Hace 1 hora' },
                    { type: 'success', message: 'Pago procesado correctamente', time: 'Hace 3 horas' },
                    { type: 'warning', message: 'Tu membresía vence en 7 días', time: 'Hace 1 día' },
                    { type: 'info', message: 'Nuevo mensaje del equipo de producción', time: 'Hace 2 días' },
                  ].map((notification, index) => (
                    <div key={index} className={`p-4 rounded-lg border ${
                      notification.type === 'success' ? 'bg-green-500/10 border-green-500/20' :
                      notification.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                      'bg-blue-500/10 border-blue-500/20'
                    }`}>
                      <p className={`text-sm ${
                        notification.type === 'success' ? 'text-green-400' :
                        notification.type === 'warning' ? 'text-yellow-400' :
                        'text-blue-400'
                      }`}>{notification.message}</p>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      
      case 'planes':
        return <PlanesManagement />;
      
      default:
        return <div>Contenido no encontrado</div>;
    }
  };

  if (!userRole) return null;

  return (
    <div className="flex h-screen bg-background relative">
      {/* Overlay para móvil */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-4 lg:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <img src="/logo.png" alt="Skyflow Production" className="h-10 lg:h-12 w-auto" />
            <Button
              variant="ghost"
              size="sm"
              onClick={closeSidebar}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Principal</h3>
            <button 
              onClick={() => handleTabChange('dashboard')}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                activeTab === 'dashboard' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => handleTabChange('proyectos')}
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                activeTab === 'proyectos' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              Proyectos
            </button>
            {userRole === 'admin' && (
              <>
                <button 
                  onClick={() => handleTabChange('clientes')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'clientes' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  Clientes
                </button>
                <button 
                  onClick={() => handleTabChange('planes')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'planes' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  Planes
                </button>
                <button 
                  disabled
                  className="w-full text-left px-3 py-2 rounded-md transition-colors text-gray-400 cursor-not-allowed opacity-50"
                >
                  <div className="flex flex-col">
                    <span>Automatización</span>
                    <span className="text-xs" style={{fontSize: '10px'}}>Próximamente</span>
                  </div>
                </button>
                <button 
                  disabled
                  className="w-full text-left px-3 py-2 rounded-md transition-colors text-gray-400 cursor-not-allowed opacity-50"
                >
                  <div className="flex flex-col">
                    <span>Configuración</span>
                    <span className="text-xs" style={{fontSize: '10px'}}>Próximamente</span>
                  </div>
                </button>
              </>
            )}
            {userRole === 'client' && (
              <>
                <button 
                  onClick={() => handleTabChange('membresia')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'membresia' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  Mi Membresía
                </button>
                <button 
                  onClick={() => handleTabChange('notificaciones')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'notificaciones' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  Notificaciones
                </button>
              </>
            )}
          </div>
        </nav>
        
        {/* User Info */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {userEmail?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate" style={{fontSize: '12px'}}>{userEmail}</p>
              <Badge variant="outline" className="text-xs text-neon-cyan border-neon-cyan">
                {userRole === 'admin' ? 'Admin' : 'Cliente'}
              </Badge>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                {getTabTitle()}
              </h1>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="flex items-center space-x-2"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-4 h-4" />
                    <span className="hidden sm:inline">Modo Claro</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4" />
                    <span className="hidden sm:inline">Modo Oscuro</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-6">
           {renderTabContent()}
        </div>
      </div>
      
      {/* Modales */}
      <AddProjectModal 
        isOpen={showNewProjectModal} 
        onClose={() => setShowNewProjectModal(false)}
        onProjectAdded={loadProjects}
      />
      <EditProjectModal 
        isOpen={showEditProjectModal} 
        onClose={() => {
          setShowEditProjectModal(false);
          setEditingProject(null);
        }} 
        project={editingProject}
        onProjectUpdated={loadProjects}
      />
      <AddClientModal 
        isOpen={showNewClientModal} 
        onClose={() => setShowNewClientModal(false)}
        onClientAdded={loadClients}
      />
      <EditClientModal 
        isOpen={showEditClientModal} 
        onClose={handleCloseEditModal} 
        client={editingClient}
        onClientUpdated={loadClients}
      />
    </div>
  );
}

export default Dashboard;