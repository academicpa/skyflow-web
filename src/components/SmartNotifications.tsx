import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  Settings,
  Mail,
  MessageSquare,
  Smartphone,
  Calendar,
  Clock,
  Users,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Target,
  Filter,
  Send
} from 'lucide-react';

// Interfaces
interface NotificationRule {
  id: string;
  name: string;
  description: string;
  event: string;
  conditions: NotificationCondition[];
  actions: NotificationAction[];
  isActive: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdDate: string;
  lastTriggered: string;
  triggerCount: number;
}

interface NotificationCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
  type: 'text' | 'number' | 'date' | 'boolean';
}

interface NotificationAction {
  id: string;
  type: 'email' | 'sms' | 'push' | 'webhook' | 'slack';
  recipient: string;
  template: string;
  delay?: number;
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push';
  subject?: string;
  content: string;
  variables: string[];
}

interface NotificationHistory {
  id: string;
  ruleId: string;
  ruleName: string;
  event: string;
  recipient: string;
  type: string;
  status: 'sent' | 'failed' | 'pending';
  sentDate: string;
  error?: string;
}

const SmartNotifications = () => {
  const { toast } = useToast();
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [activeView, setActiveView] = useState<'rules' | 'templates' | 'history'>('rules');
  const [selectedRule, setSelectedRule] = useState<NotificationRule | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Estados para el formulario
  const [ruleName, setRuleName] = useState('');
  const [ruleDescription, setRuleDescription] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [rulePriority, setRulePriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [ruleConditions, setRuleConditions] = useState<NotificationCondition[]>([]);
  const [ruleActions, setRuleActions] = useState<NotificationAction[]>([]);

  useEffect(() => {
    loadRules();
    loadTemplates();
    loadHistory();
  }, []);

  const loadRules = () => {
    const mockRules: NotificationRule[] = [
      {
        id: '1',
        name: 'Pago Vencido',
        description: 'Notifica cuando un pago está vencido por más de 3 días',
        event: 'payment_overdue',
        conditions: [],
        actions: [],
        isActive: true,
        priority: 'high',
        createdDate: '2024-01-15',
        lastTriggered: '2024-01-20 14:30',
        triggerCount: 12
      },
      {
        id: '2',
        name: 'Nuevo Cliente VIP',
        description: 'Notifica al equipo cuando se registra un cliente con plan premium',
        event: 'client_registered',
        conditions: [],
        actions: [],
        isActive: true,
        priority: 'medium',
        createdDate: '2024-01-10',
        lastTriggered: '2024-01-19 16:45',
        triggerCount: 8
      },
      {
        id: '3',
        name: 'Proyecto Completado',
        description: 'Envía notificación de finalización al cliente y equipo',
        event: 'project_completed',
        conditions: [],
        actions: [],
        isActive: false,
        priority: 'low',
        createdDate: '2024-01-18',
        lastTriggered: 'Nunca',
        triggerCount: 0
      }
    ];
    setRules(mockRules);
  };

  const loadTemplates = () => {
    const mockTemplates: NotificationTemplate[] = [
      {
        id: '1',
        name: 'Recordatorio de Pago',
        type: 'email',
        subject: 'Recordatorio: Pago pendiente - {{client_name}}',
        content: 'Estimado {{client_name}}, le recordamos que tiene un pago pendiente por {{amount}} con vencimiento {{due_date}}.',
        variables: ['client_name', 'amount', 'due_date']
      },
      {
        id: '2',
        name: 'Bienvenida Cliente',
        type: 'email',
        subject: '¡Bienvenido a SkyFlow! - {{client_name}}',
        content: 'Hola {{client_name}}, gracias por unirte a SkyFlow. Tu plan {{plan_name}} está activo.',
        variables: ['client_name', 'plan_name']
      },
      {
        id: '3',
        name: 'Proyecto Finalizado',
        type: 'email',
        subject: 'Proyecto {{project_name}} completado',
        content: 'El proyecto {{project_name}} ha sido completado exitosamente. Puedes revisar los entregables en tu panel.',
        variables: ['project_name', 'client_name']
      }
    ];
    setTemplates(mockTemplates);
  };

  const loadHistory = () => {
    const mockHistory: NotificationHistory[] = [
      {
        id: '1',
        ruleId: '1',
        ruleName: 'Pago Vencido',
        event: 'payment_overdue',
        recipient: 'cliente@ejemplo.com',
        type: 'email',
        status: 'sent',
        sentDate: '2024-01-20 14:30'
      },
      {
        id: '2',
        ruleId: '2',
        ruleName: 'Nuevo Cliente VIP',
        event: 'client_registered',
        recipient: 'equipo@skyflow.com',
        type: 'slack',
        status: 'sent',
        sentDate: '2024-01-19 16:45'
      },
      {
        id: '3',
        ruleId: '1',
        ruleName: 'Pago Vencido',
        event: 'payment_overdue',
        recipient: '+1234567890',
        type: 'sms',
        status: 'failed',
        sentDate: '2024-01-18 10:15',
        error: 'Número de teléfono inválido'
      }
    ];
    setHistory(mockHistory);
  };

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev => prev.map(rule => {
      if (rule.id === ruleId) {
        const newStatus = !rule.isActive;
        toast({
          title: newStatus ? 'Regla Activada' : 'Regla Desactivada',
          description: `La regla "${rule.name}" ha sido ${newStatus ? 'activada' : 'desactivada'}.`
        });
        return { ...rule, isActive: newStatus };
      }
      return rule;
    }));
  };

  const deleteRule = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      setRules(prev => prev.filter(r => r.id !== ruleId));
      toast({
        title: 'Regla Eliminada',
        description: `La regla "${rule.name}" ha sido eliminada.`
      });
    }
  };

  const saveRule = () => {
    if (!ruleName.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre de la regla es requerido.',
        variant: 'destructive'
      });
      return;
    }

    const newRule: NotificationRule = {
      id: selectedRule?.id || Date.now().toString(),
      name: ruleName,
      description: ruleDescription,
      event: selectedEvent,
      conditions: ruleConditions,
      actions: ruleActions,
      isActive: true,
      priority: rulePriority,
      createdDate: selectedRule?.createdDate || new Date().toISOString().split('T')[0],
      lastTriggered: selectedRule?.lastTriggered || 'Nunca',
      triggerCount: selectedRule?.triggerCount || 0
    };

    if (selectedRule) {
      setRules(prev => prev.map(r => r.id === selectedRule.id ? newRule : r));
      toast({
        title: 'Regla Actualizada',
        description: `La regla "${ruleName}" ha sido actualizada.`
      });
    } else {
      setRules(prev => [newRule, ...prev]);
      toast({
        title: 'Regla Creada',
        description: `La regla "${ruleName}" ha sido creada.`
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setRuleName('');
    setRuleDescription('');
    setSelectedEvent('');
    setRulePriority('medium');
    setRuleConditions([]);
    setRuleActions([]);
    setSelectedRule(null);
    setIsEditing(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'push': return <Smartphone className="w-4 h-4" />;
      case 'slack': return <MessageSquare className="w-4 h-4" />;
      case 'webhook': return <Zap className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const renderRules = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reglas de Notificación</h3>
        <Button 
          size="sm" 
          className="btn-neon"
          onClick={() => {
            resetForm();
            setIsEditing(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Regla
        </Button>
      </div>
      
      {isEditing && (
        <Card className="service-card border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-base">
              {selectedRule ? 'Editar Regla' : 'Crear Nueva Regla'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Nombre de la Regla
                </label>
                <Input
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="Ej: Recordatorio de pago"
                  className="input-neon"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Prioridad
                </label>
                <Select value={rulePriority} onValueChange={(value: any) => setRulePriority(value)}>
                  <SelectTrigger className="input-neon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Descripción
              </label>
              <Textarea
                value={ruleDescription}
                onChange={(e) => setRuleDescription(e.target.value)}
                placeholder="Describe cuándo se debe activar esta notificación..."
                className="input-neon"
                rows={2}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Evento Disparador
              </label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="input-neon">
                  <SelectValue placeholder="Selecciona un evento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="payment_due">Pago próximo a vencer</SelectItem>
                  <SelectItem value="payment_overdue">Pago vencido</SelectItem>
                  <SelectItem value="client_registered">Cliente registrado</SelectItem>
                  <SelectItem value="project_created">Proyecto creado</SelectItem>
                  <SelectItem value="project_completed">Proyecto completado</SelectItem>
                  <SelectItem value="lead_captured">Lead capturado</SelectItem>
                  <SelectItem value="contract_signed">Contrato firmado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <Button 
                size="sm" 
                className="btn-neon"
                onClick={saveRule}
              >
                {selectedRule ? 'Actualizar' : 'Crear'} Regla
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={resetForm}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-4">
        {rules.map((rule) => (
          <Card key={rule.id} className="service-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getPriorityColor(rule.priority)}`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{rule.name}</h4>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getPriorityColor(rule.priority)}>
                    {rule.priority === 'urgent' ? 'Urgente' :
                     rule.priority === 'high' ? 'Alta' :
                     rule.priority === 'medium' ? 'Media' : 'Baja'}
                  </Badge>
                  <Switch
                    checked={rule.isActive}
                    onCheckedChange={() => toggleRuleStatus(rule.id)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Evento:</span>
                  <p className="font-semibold text-foreground">{rule.event}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Activaciones:</span>
                  <p className="font-semibold text-foreground">{rule.triggerCount}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Última activación:</span>
                  <p className="font-semibold text-foreground">{rule.lastTriggered}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Estado:</span>
                  <p className={`font-semibold ${rule.isActive ? 'text-green-400' : 'text-gray-400'}`}>
                    {rule.isActive ? 'Activa' : 'Inactiva'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedRule(rule);
                    setRuleName(rule.name);
                    setRuleDescription(rule.description);
                    setSelectedEvent(rule.event);
                    setRulePriority(rule.priority);
                    setRuleConditions(rule.conditions);
                    setRuleActions(rule.actions);
                    setIsEditing(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Probar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => deleteRule(rule.id)}
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
        <h3 className="text-lg font-semibold">Plantillas de Notificación</h3>
        <Button size="sm" className="btn-neon">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Plantilla
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="service-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                    {getTypeIcon(template.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{template.name}</h4>
                    <Badge variant="outline" className="text-xs capitalize">{template.type}</Badge>
                  </div>
                </div>
              </div>
              
              {template.subject && (
                <div className="mb-2">
                  <span className="text-xs text-muted-foreground">Asunto:</span>
                  <p className="text-sm text-foreground font-medium">{template.subject}</p>
                </div>
              )}
              
              <div className="mb-3">
                <span className="text-xs text-muted-foreground">Contenido:</span>
                <p className="text-sm text-foreground line-clamp-2">{template.content}</p>
              </div>
              
              <div className="mb-4">
                <span className="text-xs text-muted-foreground">Variables:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {template.variables.map((variable) => (
                    <Badge key={variable} variant="outline" className="text-xs">
                      {variable}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button size="sm" variant="outline">
                  <Send className="w-4 h-4 mr-2" />
                  Probar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Historial de Notificaciones</h3>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Configurar
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {history.map((item) => (
          <Card key={item.id} className="service-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{item.ruleName}</h4>
                    <p className="text-sm text-muted-foreground">{item.recipient}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status === 'sent' ? 'Enviado' :
                   item.status === 'failed' ? 'Fallido' : 'Pendiente'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Evento:</span>
                  <p className="font-semibold text-foreground">{item.event}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Tipo:</span>
                  <p className="font-semibold text-foreground capitalize">{item.type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Fecha:</span>
                  <p className="font-semibold text-foreground">{item.sentDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Estado:</span>
                  <p className={`font-semibold ${
                    item.status === 'sent' ? 'text-green-400' :
                    item.status === 'failed' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {item.status === 'sent' ? 'Enviado' :
                     item.status === 'failed' ? 'Fallido' : 'Pendiente'}
                  </p>
                </div>
              </div>
              
              {item.error && (
                <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded">
                  <p className="text-sm text-red-400">
                    <AlertTriangle className="w-4 h-4 inline mr-2" />
                    {item.error}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 border-b border-border pb-4">
        <Button
          variant={activeView === 'rules' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('rules')}
          className={activeView === 'rules' ? 'btn-neon' : ''}
        >
          <Target className="w-4 h-4 mr-2" />
          Reglas
        </Button>
        <Button
          variant={activeView === 'templates' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('templates')}
          className={activeView === 'templates' ? 'btn-neon' : ''}
        >
          <FileText className="w-4 h-4 mr-2" />
          Plantillas
        </Button>
        <Button
          variant={activeView === 'history' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('history')}
          className={activeView === 'history' ? 'btn-neon' : ''}
        >
          <Clock className="w-4 h-4 mr-2" />
          Historial
        </Button>
      </div>
      
      {activeView === 'rules' && renderRules()}
      {activeView === 'templates' && renderTemplates()}
      {activeView === 'history' && renderHistory()}
    </div>
  );
};

export default SmartNotifications;