import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AutomationSystem from '@/components/AutomationSystem';
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
  client: string;
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
  address: string;
  company?: string;
  projectCount: number;
  totalSpent: string;
  membershipPlan: string;
  membershipStatus: 'active' | 'expired' | 'pending';
  membershipExpiry: string;
  joinDate: string;
  lastPayment: string;
  nextPaymentDue: string;
  projectIds: string[];
}

export const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<'admin' | 'client' | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [clientViewMode, setClientViewMode] = useState<'list' | 'grid'>('list');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    membershipPlan: 'Básico',
    assignToProject: ''
  });
  const [activeConfigSection, setActiveConfigSection] = useState('empresa');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    const role = localStorage.getItem('userRole') as 'admin' | 'client';
    const email = localStorage.getItem('userEmail') || '';
    const savedTheme = localStorage.getItem('theme');
    
    if (!role) {
      navigate('/login');
      return;
    }
    
    setUserRole(role);
    setUserEmail(email);
    
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
  }, [navigate]);

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
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  const updateTaskStatus = (projectId: string, taskId: string, completed: boolean) => {
    // In a real app, this would update the backend
    // For now, we'll just update the local state
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
  };

  const toggleClientViewMode = () => {
    setClientViewMode(clientViewMode === 'list' ? 'grid' : 'list');
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
      `🎯 *Proyectos activos:* ${client.projectCount}\n` +
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

  const handleCreateClient = () => {
    if (!newClientData.name || !newClientData.email || !newClientData.phone) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios (Nombre, Email y Teléfono).",
        variant: "destructive"
      });
      return;
    }

    try {
      // Generar ID único basado en timestamp y número aleatorio
      const uniqueId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const newClient: Client = {
        id: uniqueId,
        name: newClientData.name.trim(),
        email: newClientData.email.trim(),
        phone: newClientData.phone.trim(),
        address: newClientData.address.trim(),
        company: newClientData.company?.trim() || '',
        projectCount: 0,
        totalSpent: '$ 0 COP',
        membershipPlan: newClientData.membershipPlan,
        membershipStatus: 'active',
        membershipExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        joinDate: new Date().toISOString().split('T')[0],
        lastPayment: new Date().toISOString().split('T')[0],
        nextPaymentDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        projectIds: newClientData.assignToProject ? [newClientData.assignToProject] : []
      };
      
      // Agregar el cliente al estado
      setClients(prevClients => [...prevClients, newClient]);
      
      // Mostrar notificación de éxito
      toast({
        title: "¡Cliente creado exitosamente!",
        description: `${newClientData.name} ha sido agregado a la lista de clientes.`,
      });
      
      // Resetear formulario y cerrar modal
      setNewClientData({
        name: '',
        email: '',
        phone: '',
        address: '',
        company: '',
        membershipPlan: 'Básico',
        assignToProject: ''
      });
      setShowNewClientModal(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al crear el cliente. Por favor intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  const resetNewClientForm = () => {
    setNewClientData({
      name: '',
      email: '',
      phone: '',
      address: '',
      company: '',
      membershipPlan: 'Básico',
      assignToProject: ''
    });
    setShowNewClientModal(false);
  };

  const getClientProjects = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return [];
    return projects.filter(project => client.projectIds.includes(project.id));
  };

  // Obtener cliente actual basado en el email del usuario logueado
  const getCurrentClient = () => {
    if (userRole !== 'client') return null;
    return clients.find(client => client.email === userEmail);
  };

  // Filtrar proyectos para el cliente actual
  const getFilteredProjects = () => {
    if (userRole === 'admin') {
      return projects;
    }
    
    const currentClient = getCurrentClient();
    if (!currentClient) return [];
    
    return projects.filter(project => currentClient.projectIds.includes(project.id));
  };

  // Obtener estadísticas filtradas según el rol del usuario
  const getFilteredStats = () => {
    const filteredProjects = getFilteredProjects();
    
    return {
      activeProjects: filteredProjects.filter(p => p.status === 'in-progress').length,
      completedProjects: filteredProjects.filter(p => p.status === 'completed').length,
      pendingProjects: filteredProjects.filter(p => p.status === 'pending').length,
      totalClients: userRole === 'admin' ? clients.length : 1 // Para clientes, solo ellos mismos
    };
  };

  // Obtener actividades filtradas según el rol del usuario
  const getFilteredActivities = () => {
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
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
    navigate('/login');
  };

  // Mock data
  const [clients, setClients] = useState<Client[]>([
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '+1 (555) 123-4567',
      address: 'Calle Principal 123, Ciudad',
      company: 'Música JP',
      projectCount: 2,
      totalSpent: '$ 3.300.000 COP',
      membershipPlan: 'Premium',
      membershipStatus: 'active',
      membershipExpiry: '2024-12-31',
      joinDate: '2023-06-15',
      lastPayment: '2024-01-15',
      nextPaymentDue: '2024-07-15',
      projectIds: ['1', '4']
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria.garcia@email.com',
      phone: '+1 (555) 987-6543',
      address: 'Avenida Central 456, Ciudad',
      company: 'Sonidos MG',
      projectCount: 1,
      totalSpent: '$ 800.000 COP',
      membershipPlan: 'Básico',
      membershipStatus: 'active',
      membershipExpiry: '2024-08-30',
      joinDate: '2023-12-01',
      lastPayment: '2024-01-30',
      nextPaymentDue: '2024-02-28',
      projectIds: ['2']
    },
    {
      id: '3',
      name: 'Carlos López',
      email: 'carlos.lopez@empresa.com',
      phone: '+1 (555) 456-7890',
      address: 'Boulevard Empresarial 789, Ciudad',
      company: 'Empresa XYZ',
      projectCount: 1,
      totalSpent: '$ 1.200.000 COP',
      membershipPlan: 'Empresarial',
      membershipStatus: 'pending',
      membershipExpiry: '2024-03-15',
      joinDate: '2024-01-10',
      lastPayment: '2024-01-10',
      nextPaymentDue: '2024-03-10',
      projectIds: ['3']
    },
    {
      id: '4',
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@music.com',
      phone: '+1 (555) 321-0987',
      address: 'Calle Artística 321, Ciudad',
      company: 'Indie Music AR',
      projectCount: 0,
      totalSpent: '$0',
      membershipPlan: 'Básico',
      membershipStatus: 'expired',
      membershipExpiry: '2024-01-31',
      joinDate: '2023-08-20',
      lastPayment: '2023-12-31',
      nextPaymentDue: '2024-02-01',
      projectIds: []
    }
  ]);

  const projects: Project[] = [
    {
      id: '1',
      name: 'Video Musical - Artista Local',
      status: 'in-progress',
      client: 'Juan Pérez',
      budget: '$2,500',
      deadline: '2024-02-15',
      description: 'Producción completa de video musical con efectos visuales',
      tasks: [
        { id: '1-1', name: 'Preproducción y guión', completed: true },
        { id: '1-2', name: 'Grabación en estudio', completed: true },
        { id: '1-3', name: 'Edición de video', completed: false },
        { id: '1-4', name: 'Efectos visuales', completed: false },
        { id: '1-5', name: 'Color grading', completed: false },
        { id: '1-6', name: 'Entrega final', completed: false }
      ],
      progress: 33
    },
    {
      id: '2',
      name: 'Mezcla y Master - EP',
      status: 'completed',
      client: 'María García',
      budget: '$800',
      deadline: '2024-01-30',
      description: 'Mezcla y masterización de 5 tracks',
      tasks: [
        { id: '2-1', name: 'Análisis de tracks', completed: true },
        { id: '2-2', name: 'Mezcla track 1-3', completed: true },
        { id: '2-3', name: 'Mezcla track 4-5', completed: true },
        { id: '2-4', name: 'Masterización', completed: true },
        { id: '2-5', name: 'Entrega final', completed: true }
      ],
      progress: 100
    },
    {
      id: '3',
      name: 'Podcast Corporativo',
      status: 'pending',
      client: 'Empresa XYZ',
      budget: '$1,200',
      deadline: '2024-03-01',
      description: 'Serie de 10 episodios de podcast empresarial',
      tasks: [
        { id: '3-1', name: 'Reunión inicial', completed: false },
        { id: '3-2', name: 'Desarrollo de contenido', completed: false },
        { id: '3-3', name: 'Grabación episodios 1-5', completed: false },
        { id: '3-4', name: 'Grabación episodios 6-10', completed: false },
        { id: '3-5', name: 'Edición y postproducción', completed: false },
        { id: '3-6', name: 'Entrega final', completed: false }
      ],
      progress: 0
    },
    {
      id: '4',
      name: 'Grabación de Álbum',
      status: 'pending',
      client: 'Juan Pérez',
      budget: '$5,000',
      deadline: '2024-04-15',
      description: 'Grabación completa de álbum de 12 tracks',
      tasks: [
        { id: '4-1', name: 'Preproducción', completed: false },
        { id: '4-2', name: 'Grabación de instrumentos', completed: false },
        { id: '4-3', name: 'Grabación de voces', completed: false },
        { id: '4-4', name: 'Mezcla', completed: false },
        { id: '4-5', name: 'Masterización', completed: false },
        { id: '4-6', name: 'Entrega final', completed: false }
      ],
      progress: 0
    }
  ];

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

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return userRole === 'admin' ? 'Panel de Administración' : 'Mi Dashboard';
      case 'proyectos': return 'Proyectos';
      case 'clientes': return 'Gestión de Clientes';
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
                  </div>
                  {userRole === 'admin' ? (
                    <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <h3 className="font-semibold text-green-500 mb-2">Total Clientes</h3>
                      <p className="text-2xl font-bold text-foreground">{clients.length}</p>
                      <p className="text-xs text-muted-foreground mt-1">{clients.filter(c => c.membershipStatus === 'active').length} activos</p>
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
                  <div className="space-y-3">
                    {getFilteredActivities().map((activity, index) => (
                      <div key={index} className={`p-3 bg-${activity.color}-500/10 border border-${activity.color}-500/20 rounded-lg`}>
                        <p className={`text-sm text-${activity.color}-400`}>{activity.message}</p>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
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
                  <div className="space-y-3">
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-red-400">Entrega Video Musical</p>
                          <p className="text-xs text-muted-foreground">Cliente: Juan Díaz</p>
                        </div>
                        <Badge className="bg-red-500/20 text-red-400 text-xs">2 días</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-yellow-400">Cobro Podcast</p>
                          <p className="text-xs text-muted-foreground">Cliente: María García</p>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">5 días</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-orange-400">Reunión Preproducción</p>
                          <p className="text-xs text-muted-foreground">Cliente: Carlos López</p>
                        </div>
                        <Badge className="bg-orange-500/20 text-orange-400 text-xs">1 semana</Badge>
                      </div>
                    </div>
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
                  <span className="ml-1 capitalize">{selectedProject.status.replace('-', ' ')}</span>
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
                       <p className="text-foreground">{selectedProject.client}</p>
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
                    <h3 className="text-lg font-semibold mb-4">Tareas del Proyecto</h3>
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
                            <p className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                              {task.name}
                            </p>
                            {task.description && (
                              <p className="text-sm text-muted-foreground">{task.description}</p>
                            )}
                          </div>
                          {task.completed && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
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
                  <Button size="sm" className="btn-neon">
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
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
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
                              <span className="ml-1 capitalize text-xs">{project.status.replace('-', ' ')}</span>
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
                               Cliente: {project.client}
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
                            <div className="bg-neon-cyan/20 text-neon-cyan px-2 py-1 rounded text-xs flex items-center hover:bg-neon-cyan/30 transition-colors">
                              <Eye className="w-3 h-3 mr-1" />
                              Ver detalles
                            </div>
                          </div>
                       </>
                     ) : (
                        <>
                          <div className="absolute top-2 right-2">
                            <Badge className={getStatusColor(project.status)}>
                              {getStatusIcon(project.status)}
                              <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
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
                         
                         <div className="flex items-center justify-between text-sm">
                           <div className="flex items-center space-x-4">
                             {userRole === 'admin' && (
                               <span className="text-muted-foreground">
                                 Cliente: {project.client}
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
                           <div className="flex items-center text-neon-cyan opacity-70 group-hover:opacity-100 transition-opacity">
                             <Eye className="w-4 h-4 mr-1" />
                             <span className="text-sm">Ver detalles</span>
                           </div>
                         </div>
                       </>
                     )}
                   </CardContent>
                 </Card>
              ))}
            </div>
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
                                  <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
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
              <div className="flex items-center space-x-2">
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
            
            <Card className="service-card">
              <CardContent className="p-6">
                <div className={clientViewMode === 'grid' ? 
                  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : 
                  "space-y-4"
                }>
                  {clients.map((client) => (
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
                              <Badge className={getMembershipStatusColor(client.membershipStatus)}>
                                {client.membershipPlan}
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2 mt-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Proyectos:</span>
                              <span className="text-foreground">{client.projectCount}</span>
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
                                  // TODO: Implementar edición
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
                                  // TODO: Implementar eliminación
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
                               <Badge className={getMembershipStatusColor(client.membershipStatus)}>
                                 {client.membershipPlan}
                               </Badge>
                             </div>
                          </div>
                          <div className="flex items-center space-x-6 text-sm">
                            <div className="text-center">
                              <div className="text-foreground font-semibold">{client.projectCount}</div>
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
                                        // TODO: Implementar edición
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
                                        // TODO: Implementar eliminación
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
              </CardContent>
            </Card>
            
            {/* Modal de Nuevo Cliente */}
            {showNewClientModal && (
              <div 
                className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" 
                style={{zIndex: 9999}}
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setShowNewClientModal(false);
                  }
                }}
              >
                <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                  <h3 className="text-xl font-semibold mb-6 text-foreground">Crear Nuevo Cliente</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Nombre completo *</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                        placeholder="Ej: Juan Pérez"
                        value={newClientData.name}
                        onChange={(e) => setNewClientData({...newClientData, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Email *</label>
                      <input
                        type="email"
                        className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                        placeholder="Ej: juan@email.com"
                        value={newClientData.email}
                        onChange={(e) => setNewClientData({...newClientData, email: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Teléfono *</label>
                      <input
                        type="tel"
                        className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                        placeholder="Ej: +57 300 123 4567"
                        value={newClientData.phone}
                        onChange={(e) => setNewClientData({...newClientData, phone: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Empresa (opcional)</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                        placeholder="Ej: Música JP"
                        value={newClientData.company}
                        onChange={(e) => setNewClientData({...newClientData, company: e.target.value})}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2 text-foreground">Dirección</label>
                      <input
                        type="text"
                        className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                        placeholder="Ej: Calle Principal 123, Bogotá"
                        value={newClientData.address}
                        onChange={(e) => setNewClientData({...newClientData, address: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Plan de membresía</label>
                      <select
                        className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                        value={newClientData.membershipPlan}
                        onChange={(e) => setNewClientData({...newClientData, membershipPlan: e.target.value})}
                      >
                        <option value="Básico">Básico</option>
                        <option value="Premium">Premium</option>
                        <option value="Empresarial">Empresarial</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-foreground">Asignar a proyecto (opcional)</label>
                      <select
                        className="w-full p-3 border border-border rounded-lg bg-background text-foreground"
                        value={newClientData.assignToProject}
                        onChange={(e) => setNewClientData({...newClientData, assignToProject: e.target.value})}
                      >
                        <option value="">Sin asignar</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <Button variant="outline" onClick={resetNewClientForm}>
                      Cancelar
                    </Button>
                    <Button 
                      className="btn-neon" 
                      onClick={handleCreateClient}
                      disabled={!newClientData.name || !newClientData.email || !newClientData.phone}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Cliente
                    </Button>
                  </div>
                </div>
              </div>
            )}
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
                  onClick={() => handleTabChange('automatizacion')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'automatizacion' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  Automatización
                </button>
                <button 
                  onClick={() => handleTabChange('configuracion')}
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === 'configuracion' ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'
                  }`}
                >
                  Configuración
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
              <p className="text-sm font-medium text-foreground truncate">{userEmail}</p>
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
    </div>
  );
};

export default Dashboard;