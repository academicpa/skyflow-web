import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ContractGenerator from './ContractGenerator';
import WorkflowBuilder from './WorkflowBuilder';
import SmartNotifications from './SmartNotifications';
import LeadsTracker from './LeadsTracker';
import {
  Bell,
  Calendar,
  FileText,
  Workflow,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Mail,
  Phone,
  Download,
  Send,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search
} from 'lucide-react';

// Interfaces
interface PaymentReminder {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: string;
  dueDate: string;
  projectName: string;
  status: 'pending' | 'sent' | 'overdue';
  lastReminder?: string;
  reminderCount: number;
}

interface Contract {
  id: string;
  clientName: string;
  projectName: string;
  amount: string;
  status: 'draft' | 'sent' | 'signed' | 'expired';
  createdDate: string;
  expiryDate: string;
  templateType: 'photography' | 'audiovisual' | 'music';
}

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  assignedTo?: string;
  dueDate?: string;
  status: 'pending' | 'in-progress' | 'completed';
  dependencies: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  status: 'active' | 'paused' | 'completed';
  projectId?: string;
  createdDate: string;
}

interface Notification {
  id: string;
  type: 'payment' | 'project' | 'contract' | 'workflow' | 'lead';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read';
  createdAt: string;
  actionUrl?: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'website' | 'referral' | 'social' | 'direct';
  service: 'photography' | 'audiovisual' | 'music';
  budget: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  score: number;
  lastContact: string;
  notes: string;
  createdAt: string;
}

export const AutomationSystem = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('reminders');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Estados para cada sección
  const [paymentReminders, setPaymentReminders] = useState<PaymentReminder[]>([
    {
      id: '1',
      clientName: 'Juan Pérez',
      clientEmail: 'juan@email.com',
      amount: '$2,500',
      dueDate: '2024-02-15',
      projectName: 'Video Musical',
      status: 'overdue',
      lastReminder: '2024-02-10',
      reminderCount: 2
    },
    {
      id: '2',
      clientName: 'María García',
      clientEmail: 'maria@email.com',
      amount: '$1,800',
      dueDate: '2024-02-20',
      projectName: 'Sesión de Fotos',
      status: 'pending',
      reminderCount: 0
    },
    {
      id: '3',
      clientName: 'Carlos López',
      clientEmail: 'carlos@email.com',
      amount: '$3,200',
      dueDate: '2024-02-25',
      projectName: 'Producción Podcast',
      status: 'sent',
      lastReminder: '2024-02-12',
      reminderCount: 1
    }
  ]);

  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: '1',
      clientName: 'Ana Rodríguez',
      projectName: 'Álbum Musical',
      amount: '$5,000',
      status: 'draft',
      createdDate: '2024-02-10',
      expiryDate: '2024-03-10',
      templateType: 'music'
    },
    {
      id: '2',
      clientName: 'Pedro Martín',
      projectName: 'Video Corporativo',
      amount: '$3,500',
      status: 'sent',
      createdDate: '2024-02-08',
      expiryDate: '2024-03-08',
      templateType: 'audiovisual'
    }
  ]);

  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'Proceso de Onboarding Cliente',
      description: 'Flujo completo para nuevos clientes',
      status: 'active',
      createdDate: '2024-02-01',
      steps: [
        {
          id: '1-1',
          name: 'Reunión inicial',
          description: 'Primera reunión con el cliente',
          status: 'completed',
          dependencies: []
        },
        {
          id: '1-2',
          name: 'Envío de propuesta',
          description: 'Crear y enviar propuesta comercial',
          status: 'in-progress',
          dependencies: ['1-1']
        },
        {
          id: '1-3',
          name: 'Firma de contrato',
          description: 'Gestionar firma del contrato',
          status: 'pending',
          dependencies: ['1-2']
        }
      ]
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'payment',
      title: 'Pago Vencido',
      message: 'El pago de Juan Pérez está vencido desde hace 3 días',
      priority: 'urgent',
      status: 'unread',
      createdAt: '2024-02-13T10:30:00Z'
    },
    {
      id: '2',
      type: 'project',
      title: 'Proyecto Completado',
      message: 'El proyecto "Sesión de Fotos" ha sido completado',
      priority: 'medium',
      status: 'unread',
      createdAt: '2024-02-13T09:15:00Z'
    },
    {
      id: '3',
      type: 'lead',
      title: 'Nuevo Lead Calificado',
      message: 'Nuevo lead con alto potencial de conversión',
      priority: 'high',
      status: 'read',
      createdAt: '2024-02-12T16:45:00Z'
    }
  ]);

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Sofia Hernández',
      email: 'sofia@email.com',
      phone: '+57 300 123 4567',
      source: 'website',
      service: 'photography',
      budget: '$2,000 - $3,000',
      status: 'qualified',
      score: 85,
      lastContact: '2024-02-12',
      notes: 'Interesada en sesión de fotos para marca personal',
      createdAt: '2024-02-10'
    },
    {
      id: '2',
      name: 'Roberto Silva',
      email: 'roberto@empresa.com',
      phone: '+57 301 987 6543',
      source: 'referral',
      service: 'audiovisual',
      budget: '$5,000+',
      status: 'proposal',
      score: 92,
      lastContact: '2024-02-11',
      notes: 'Empresa necesita video corporativo urgente',
      createdAt: '2024-02-08'
    }
  ]);

  // Funciones de utilidad
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': case 'urgent': return 'bg-red-500/20 text-red-400';
      case 'pending': case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'sent': case 'high': return 'bg-blue-500/20 text-blue-400';
      case 'completed': case 'signed': case 'low': return 'bg-green-500/20 text-green-400';
      case 'active': case 'qualified': return 'bg-neon-cyan/20 text-neon-cyan';
      case 'draft': case 'new': return 'bg-gray-500/20 text-gray-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'medium': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'low': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Funciones de acción
  const sendPaymentReminder = (reminderId: string) => {
    setPaymentReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { 
            ...reminder, 
            status: 'sent' as const, 
            lastReminder: new Date().toISOString().split('T')[0],
            reminderCount: reminder.reminderCount + 1
          }
        : reminder
    ));
    toast({
      title: "Recordatorio Enviado",
      description: "El recordatorio de pago ha sido enviado al cliente."
    });
  };

  const generateContract = (contractId: string) => {
    setContracts(prev => prev.map(contract => 
      contract.id === contractId 
        ? { ...contract, status: 'sent' as const }
        : contract
    ));
    toast({
      title: "Contrato Generado",
      description: "El contrato ha sido generado y enviado al cliente."
    });
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId 
        ? { ...notification, status: 'read' as const }
        : notification
    ));
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, status: newStatus, lastContact: new Date().toISOString().split('T')[0] }
        : lead
    ));
    toast({
      title: "Lead Actualizado",
      description: `El estado del lead ha sido actualizado a ${newStatus}.`
    });
  };

  // Renderizado de secciones
  const renderPaymentReminders = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Recordatorios de Pago</h3>
        <Button size="sm" className="btn-neon">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Recordatorio
        </Button>
      </div>
      
      <div className="grid gap-4">
        {paymentReminders.map((reminder) => (
          <Card key={reminder.id} className="service-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{reminder.clientName}</h4>
                  <p className="text-sm text-muted-foreground">{reminder.projectName}</p>
                </div>
                <Badge className={getStatusColor(reminder.status)}>
                  {reminder.status === 'overdue' ? 'Vencido' : 
                   reminder.status === 'sent' ? 'Enviado' : 'Pendiente'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Monto:</span>
                  <p className="font-semibold text-foreground">{reminder.amount}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Vencimiento:</span>
                  <p className="font-semibold text-foreground">{reminder.dueDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Recordatorios:</span>
                  <p className="font-semibold text-foreground">{reminder.reminderCount}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Último envío:</span>
                  <p className="font-semibold text-foreground">{reminder.lastReminder || 'Nunca'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => sendPaymentReminder(reminder.id)}
                  disabled={reminder.status === 'sent'}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Recordatorio
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContracts = () => (
    <ContractGenerator />
  );

  const renderWorkflows = () => (
    <WorkflowBuilder />
  );

  const renderNotifications = () => (
    <SmartNotifications />
  );

  const renderLeads = () => (
    <LeadsTracker />
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'reminders': return renderPaymentReminders();
      case 'contracts': return renderContracts();
      case 'workflows': return renderWorkflows();
      case 'notifications': return renderNotifications();
      case 'leads': return renderLeads();
      default: return renderPaymentReminders();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Sistema de Automatización</h2>
          <p className="text-muted-foreground">Gestiona procesos automáticos y optimiza tu flujo de trabajo</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border">
        {[
          { id: 'reminders', label: 'Recordatorios', icon: Bell },
          { id: 'contracts', label: 'Contratos', icon: FileText },
          { id: 'workflows', label: 'Flujos', icon: Workflow },
          { id: 'notifications', label: 'Notificaciones', icon: AlertTriangle },
          { id: 'leads', label: 'Leads', icon: TrendingUp }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-t-lg transition-colors ${
                activeSection === tab.id
                  ? 'bg-primary/10 text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default AutomationSystem;