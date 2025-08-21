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
  Edit,
  Trash2,
  Eye,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';

// Interfaces
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  score: number;
  estimatedValue: number;
  probability: number;
  assignedTo: string;
  createdDate: string;
  lastContact: string;
  nextFollowUp?: string;
  notes: string;
  tags: string[];
}

interface LeadSource {
  id: string;
  name: string;
  type: 'website' | 'social' | 'referral' | 'advertising' | 'email' | 'event' | 'other';
  leads: number;
  conversions: number;
  conversionRate: number;
  cost: number;
  roi: number;
}

interface ConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
  conversionRate: number;
}

interface Analytics {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  conversions: number;
  conversionRate: number;
  averageDealSize: number;
  totalRevenue: number;
  averageTimeToClose: number;
}

const LeadsTracker = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [funnel, setFunnel] = useState<ConversionFunnel[]>([]);
  const [activeView, setActiveView] = useState<'leads' | 'sources' | 'analytics' | 'funnel'>('leads');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');

  // Estados para el formulario
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadCompany, setLeadCompany] = useState('');
  const [leadSource, setLeadSource] = useState('');
  const [leadStatus, setLeadStatus] = useState<Lead['status']>('new');
  const [leadScore, setLeadScore] = useState(0);
  const [leadValue, setLeadValue] = useState(0);
  const [leadProbability, setLeadProbability] = useState(0);
  const [leadAssignedTo, setLeadAssignedTo] = useState('');
  const [leadNotes, setLeadNotes] = useState('');

  useEffect(() => {
    loadLeads();
    loadSources();
    loadAnalytics();
    loadFunnel();
  }, []);

  const loadLeads = () => {
    const mockLeads: Lead[] = [
      {
        id: '1',
        name: 'María González',
        email: 'maria@empresa.com',
        phone: '+1234567890',
        company: 'Empresa ABC',
        source: 'Website',
        status: 'qualified',
        score: 85,
        estimatedValue: 15000,
        probability: 70,
        assignedTo: 'Juan Pérez',
        createdDate: '2024-01-15',
        lastContact: '2024-01-20',
        nextFollowUp: '2024-01-25',
        notes: 'Interesada en plan premium. Solicitar propuesta.',
        tags: ['premium', 'urgente']
      },
      {
        id: '2',
        name: 'Carlos Rodríguez',
        email: 'carlos@startup.com',
        phone: '+0987654321',
        company: 'Startup XYZ',
        source: 'LinkedIn',
        status: 'proposal',
        score: 92,
        estimatedValue: 25000,
        probability: 85,
        assignedTo: 'Ana López',
        createdDate: '2024-01-10',
        lastContact: '2024-01-19',
        nextFollowUp: '2024-01-22',
        notes: 'Propuesta enviada. Esperando respuesta.',
        tags: ['enterprise', 'hot']
      },
      {
        id: '3',
        name: 'Laura Martín',
        email: 'laura@consultora.com',
        phone: '+1122334455',
        company: 'Consultora 123',
        source: 'Referral',
        status: 'new',
        score: 45,
        estimatedValue: 8000,
        probability: 30,
        assignedTo: 'Pedro García',
        createdDate: '2024-01-18',
        lastContact: 'Nunca',
        notes: 'Lead recién capturado. Pendiente primer contacto.',
        tags: ['new']
      }
    ];
    setLeads(mockLeads);
  };

  const loadSources = () => {
    const mockSources: LeadSource[] = [
      {
        id: '1',
        name: 'Website',
        type: 'website',
        leads: 45,
        conversions: 12,
        conversionRate: 26.7,
        cost: 2500,
        roi: 340
      },
      {
        id: '2',
        name: 'LinkedIn',
        type: 'social',
        leads: 28,
        conversions: 8,
        conversionRate: 28.6,
        cost: 1800,
        roi: 280
      },
      {
        id: '3',
        name: 'Google Ads',
        type: 'advertising',
        leads: 62,
        conversions: 15,
        conversionRate: 24.2,
        cost: 4200,
        roi: 195
      },
      {
        id: '4',
        name: 'Referrals',
        type: 'referral',
        leads: 18,
        conversions: 9,
        conversionRate: 50.0,
        cost: 0,
        roi: 999
      }
    ];
    setSources(mockSources);
  };

  const loadAnalytics = () => {
    const mockAnalytics: Analytics = {
      totalLeads: 153,
      newLeads: 23,
      qualifiedLeads: 45,
      conversions: 44,
      conversionRate: 28.8,
      averageDealSize: 18500,
      totalRevenue: 814000,
      averageTimeToClose: 32
    };
    setAnalytics(mockAnalytics);
  };

  const loadFunnel = () => {
    const mockFunnel: ConversionFunnel[] = [
      { stage: 'Leads', count: 153, percentage: 100, conversionRate: 100 },
      { stage: 'Contactados', count: 128, percentage: 83.7, conversionRate: 83.7 },
      { stage: 'Calificados', count: 89, percentage: 58.2, conversionRate: 69.5 },
      { stage: 'Propuestas', count: 62, percentage: 40.5, conversionRate: 69.7 },
      { stage: 'Negociación', count: 51, percentage: 33.3, conversionRate: 82.3 },
      { stage: 'Ganados', count: 44, percentage: 28.8, conversionRate: 86.3 }
    ];
    setFunnel(mockFunnel);
  };

  const updateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        toast({
          title: 'Estado Actualizado',
          description: `El lead "${lead.name}" ha sido movido a "${newStatus}".`
        });
        return { ...lead, status: newStatus, lastContact: new Date().toISOString().split('T')[0] };
      }
      return lead;
    }));
  };

  const deleteLead = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      setLeads(prev => prev.filter(l => l.id !== leadId));
      toast({
        title: 'Lead Eliminado',
        description: `El lead "${lead.name}" ha sido eliminado.`
      });
    }
  };

  const saveLead = () => {
    if (!leadName.trim() || !leadEmail.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre y email son requeridos.',
        variant: 'destructive'
      });
      return;
    }

    const newLead: Lead = {
      id: selectedLead?.id || Date.now().toString(),
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      company: leadCompany,
      source: leadSource,
      status: leadStatus,
      score: leadScore,
      estimatedValue: leadValue,
      probability: leadProbability,
      assignedTo: leadAssignedTo,
      createdDate: selectedLead?.createdDate || new Date().toISOString().split('T')[0],
      lastContact: selectedLead?.lastContact || 'Nunca',
      notes: leadNotes,
      tags: []
    };

    if (selectedLead) {
      setLeads(prev => prev.map(l => l.id === selectedLead.id ? newLead : l));
      toast({
        title: 'Lead Actualizado',
        description: `El lead "${leadName}" ha sido actualizado.`
      });
    } else {
      setLeads(prev => [newLead, ...prev]);
      toast({
        title: 'Lead Creado',
        description: `El lead "${leadName}" ha sido creado.`
      });
    }

    resetForm();
  };

  const resetForm = () => {
    setLeadName('');
    setLeadEmail('');
    setLeadPhone('');
    setLeadCompany('');
    setLeadSource('');
    setLeadStatus('new');
    setLeadScore(0);
    setLeadValue(0);
    setLeadProbability(0);
    setLeadAssignedTo('');
    setLeadNotes('');
    setSelectedLead(null);
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'contacted': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'qualified': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'proposal': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'negotiation': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'won': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'lost': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'website': return <Target className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      case 'advertising': return <TrendingUp className="w-4 h-4" />;
      case 'referral': return <Star className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'event': return <Calendar className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const filteredLeads = leads.filter(lead => {
    const statusMatch = filterStatus === 'all' || lead.status === filterStatus;
    const sourceMatch = filterSource === 'all' || lead.source === filterSource;
    return statusMatch && sourceMatch;
  });

  const renderLeads = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Gestión de Leads</h3>
        <Button 
          size="sm" 
          className="btn-neon"
          onClick={() => {
            resetForm();
            setIsEditing(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Lead
        </Button>
      </div>
      
      <div className="flex items-center space-x-4 mb-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48 input-neon">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="new">Nuevo</SelectItem>
            <SelectItem value="contacted">Contactado</SelectItem>
            <SelectItem value="qualified">Calificado</SelectItem>
            <SelectItem value="proposal">Propuesta</SelectItem>
            <SelectItem value="negotiation">Negociación</SelectItem>
            <SelectItem value="won">Ganado</SelectItem>
            <SelectItem value="lost">Perdido</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterSource} onValueChange={setFilterSource}>
          <SelectTrigger className="w-48 input-neon">
            <SelectValue placeholder="Filtrar por fuente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las fuentes</SelectItem>
            <SelectItem value="Website">Website</SelectItem>
            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
            <SelectItem value="Google Ads">Google Ads</SelectItem>
            <SelectItem value="Referral">Referral</SelectItem>
          </SelectContent>
        </Select>
        
        <Button size="sm" variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
      </div>
      
      {isEditing && (
        <Card className="service-card border-blue-500/30">
          <CardHeader>
            <CardTitle className="text-base">
              {selectedLead ? 'Editar Lead' : 'Crear Nuevo Lead'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Nombre *
                </label>
                <Input
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Nombre completo"
                  className="input-neon"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Email *
                </label>
                <Input
                  type="email"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="email@ejemplo.com"
                  className="input-neon"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Teléfono
                </label>
                <Input
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="input-neon"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Empresa
                </label>
                <Input
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  placeholder="Nombre de la empresa"
                  className="input-neon"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Fuente
                </label>
                <Select value={leadSource} onValueChange={setLeadSource}>
                  <SelectTrigger className="input-neon">
                    <SelectValue placeholder="Selecciona la fuente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Google Ads">Google Ads</SelectItem>
                    <SelectItem value="Referral">Referral</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Event">Evento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Estado
                </label>
                <Select value={leadStatus} onValueChange={(value: any) => setLeadStatus(value)}>
                  <SelectTrigger className="input-neon">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nuevo</SelectItem>
                    <SelectItem value="contacted">Contactado</SelectItem>
                    <SelectItem value="qualified">Calificado</SelectItem>
                    <SelectItem value="proposal">Propuesta</SelectItem>
                    <SelectItem value="negotiation">Negociación</SelectItem>
                    <SelectItem value="won">Ganado</SelectItem>
                    <SelectItem value="lost">Perdido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Score (0-100)
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={leadScore}
                  onChange={(e) => setLeadScore(Number(e.target.value))}
                  className="input-neon"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Valor Estimado ($)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={leadValue}
                  onChange={(e) => setLeadValue(Number(e.target.value))}
                  className="input-neon"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Notas
              </label>
              <Textarea
                value={leadNotes}
                onChange={(e) => setLeadNotes(e.target.value)}
                placeholder="Notas adicionales sobre el lead..."
                className="input-neon"
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <Button 
                size="sm" 
                className="btn-neon"
                onClick={saveLead}
              >
                {selectedLead ? 'Actualizar' : 'Crear'} Lead
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
        {filteredLeads.map((lead) => (
          <Card key={lead.id} className="service-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(lead.status)}`}>
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{lead.name}</h4>
                    <p className="text-sm text-muted-foreground">{lead.company || lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(lead.status)}>
                    {lead.status === 'new' ? 'Nuevo' :
                     lead.status === 'contacted' ? 'Contactado' :
                     lead.status === 'qualified' ? 'Calificado' :
                     lead.status === 'proposal' ? 'Propuesta' :
                     lead.status === 'negotiation' ? 'Negociación' :
                     lead.status === 'won' ? 'Ganado' : 'Perdido'}
                  </Badge>
                  <div className={`text-sm font-semibold ${getScoreColor(lead.score)}`}>
                    {lead.score}/100
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Fuente:</span>
                  <p className="font-semibold text-foreground">{lead.source}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor:</span>
                  <p className="font-semibold text-foreground">${lead.estimatedValue.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Probabilidad:</span>
                  <p className="font-semibold text-foreground">{lead.probability}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Asignado:</span>
                  <p className="font-semibold text-foreground">{lead.assignedTo}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Último contacto:</span>
                  <p className="font-semibold text-foreground">{lead.lastContact}</p>
                </div>
              </div>
              
              {lead.notes && (
                <div className="mb-4 p-2 bg-gray-500/10 rounded border border-gray-500/20">
                  <p className="text-sm text-muted-foreground">{lead.notes}</p>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Select 
                  value={lead.status} 
                  onValueChange={(value: any) => updateLeadStatus(lead.id, value)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">Nuevo</SelectItem>
                    <SelectItem value="contacted">Contactado</SelectItem>
                    <SelectItem value="qualified">Calificado</SelectItem>
                    <SelectItem value="proposal">Propuesta</SelectItem>
                    <SelectItem value="negotiation">Negociación</SelectItem>
                    <SelectItem value="won">Ganado</SelectItem>
                    <SelectItem value="lost">Perdido</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4 mr-2" />
                  Llamar
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setSelectedLead(lead);
                    setLeadName(lead.name);
                    setLeadEmail(lead.email);
                    setLeadPhone(lead.phone);
                    setLeadCompany(lead.company || '');
                    setLeadSource(lead.source);
                    setLeadStatus(lead.status);
                    setLeadScore(lead.score);
                    setLeadValue(lead.estimatedValue);
                    setLeadProbability(lead.probability);
                    setLeadAssignedTo(lead.assignedTo);
                    setLeadNotes(lead.notes);
                    setIsEditing(true);
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => deleteLead(lead.id)}
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

  const renderSources = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Fuentes de Leads</h3>
        <Button size="sm" className="btn-neon">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Fuente
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {sources.map((source) => (
          <Card key={source.id} className="service-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  {getSourceIcon(source.type)}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{source.name}</h4>
                  <Badge variant="outline" className="text-xs capitalize">{source.type}</Badge>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Leads:</span>
                  <span className="font-semibold text-foreground">{source.leads}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conversiones:</span>
                  <span className="font-semibold text-foreground">{source.conversions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tasa:</span>
                  <span className="font-semibold text-green-400">{source.conversionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ROI:</span>
                  <span className={`font-semibold ${source.roi > 200 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {source.roi}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Analytics y Métricas</h3>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>
      
      {analytics && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="service-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.totalLeads}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="service-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-green-500/20 text-green-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tasa Conversión</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.conversionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="service-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Valor Promedio</p>
                  <p className="text-2xl font-bold text-foreground">${analytics.averageDealSize.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="service-card">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tiempo Cierre</p>
                  <p className="text-2xl font-bold text-foreground">{analytics.averageTimeToClose}d</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="service-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Leads por Fuente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sources.map((source) => (
                <div key={source.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getSourceIcon(source.type)}
                    <span className="text-sm text-foreground">{source.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(source.leads / 62) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-foreground w-8">{source.leads}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="service-card">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Distribución por Estado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { status: 'new', count: 23, color: 'bg-blue-500' },
                { status: 'qualified', count: 45, color: 'bg-yellow-500' },
                { status: 'proposal', count: 32, color: 'bg-orange-500' },
                { status: 'won', count: 44, color: 'bg-green-500' },
                { status: 'lost', count: 9, color: 'bg-red-500' }
              ].map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-foreground capitalize">
                      {item.status === 'new' ? 'Nuevo' :
                       item.status === 'qualified' ? 'Calificado' :
                       item.status === 'proposal' ? 'Propuesta' :
                       item.status === 'won' ? 'Ganado' : 'Perdido'}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderFunnel = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Embudo de Conversión</h3>
        <Button size="sm" variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Configurar
        </Button>
      </div>
      
      <Card className="service-card">
        <CardContent className="p-6">
          <div className="space-y-4">
            {funnel.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{stage.stage}</h4>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-muted-foreground">{stage.count} leads</span>
                    <span className="font-semibold text-foreground">{stage.percentage}%</span>
                    {index > 0 && (
                      <span className={`font-semibold ${
                        stage.conversionRate > 70 ? 'text-green-400' :
                        stage.conversionRate > 50 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {stage.conversionRate}% conversión
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-gray-700 rounded-full h-8">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                      style={{ width: `${stage.percentage}%` }}
                    >
                      {stage.count}
                    </div>
                  </div>
                </div>
                
                {index < funnel.length - 1 && (
                  <div className="flex justify-center mt-2">
                    <TrendingDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 border-b border-border pb-4">
        <Button
          variant={activeView === 'leads' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('leads')}
          className={activeView === 'leads' ? 'btn-neon' : ''}
        >
          <Users className="w-4 h-4 mr-2" />
          Leads
        </Button>
        <Button
          variant={activeView === 'sources' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('sources')}
          className={activeView === 'sources' ? 'btn-neon' : ''}
        >
          <Target className="w-4 h-4 mr-2" />
          Fuentes
        </Button>
        <Button
          variant={activeView === 'analytics' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('analytics')}
          className={activeView === 'analytics' ? 'btn-neon' : ''}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </Button>
        <Button
          variant={activeView === 'funnel' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('funnel')}
          className={activeView === 'funnel' ? 'btn-neon' : ''}
        >
          <TrendingDown className="w-4 h-4 mr-2" />
          Embudo
        </Button>
      </div>
      
      {activeView === 'leads' && renderLeads()}
      {activeView === 'sources' && renderSources()}
      {activeView === 'analytics' && renderAnalytics()}
      {activeView === 'funnel' && renderFunnel()}
    </div>
  );
};

export default LeadsTracker;