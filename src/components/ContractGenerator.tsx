import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  FileText,
  Download,
  Send,
  Edit,
  Copy,
  Plus,
  Settings,
  Eye,
  Trash2,
  Calendar,
  DollarSign,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Interfaces
interface ContractTemplate {
  id: string;
  name: string;
  type: 'photography' | 'audiovisual' | 'music' | 'general';
  description: string;
  content: string;
  variables: string[];
  createdDate: string;
  lastModified: string;
  isActive: boolean;
  usageCount: number;
}

interface ContractData {
  id: string;
  templateId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  projectName: string;
  projectDescription: string;
  amount: string;
  currency: string;
  startDate: string;
  endDate: string;
  deliveryDate: string;
  paymentTerms: string;
  additionalTerms: string;
  status: 'draft' | 'sent' | 'signed' | 'expired' | 'cancelled';
  createdDate: string;
  sentDate?: string;
  signedDate?: string;
  expiryDate: string;
}

interface InvoiceData {
  id: string;
  contractId?: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  paymentMethod?: string;
  notes?: string;
}

export const ContractGenerator = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('contracts');
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(null);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);
  const [showContractForm, setShowContractForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  // Estados de datos
  const [templates, setTemplates] = useState<ContractTemplate[]>([
    {
      id: '1',
      name: 'Contrato de Sesión Fotográfica',
      type: 'photography',
      description: 'Plantilla estándar para sesiones de fotografía',
      content: `CONTRATO DE SERVICIOS FOTOGRÁFICOS\n\nEntre {{CLIENT_NAME}} y Skyflow Production\n\nSERVICIOS: {{PROJECT_DESCRIPTION}}\nFECHA: {{START_DATE}}\nMONTO: {{AMOUNT}} {{CURRENCY}}\nTÉRMINOS DE PAGO: {{PAYMENT_TERMS}}\n\nTérminos adicionales:\n{{ADDITIONAL_TERMS}}`,
      variables: ['CLIENT_NAME', 'PROJECT_DESCRIPTION', 'START_DATE', 'AMOUNT', 'CURRENCY', 'PAYMENT_TERMS', 'ADDITIONAL_TERMS'],
      createdDate: '2024-01-15',
      lastModified: '2024-02-10',
      isActive: true,
      usageCount: 15
    },
    {
      id: '2',
      name: 'Contrato de Producción Audiovisual',
      type: 'audiovisual',
      description: 'Plantilla para proyectos de video y producción',
      content: `CONTRATO DE PRODUCCIÓN AUDIOVISUAL\n\nCliente: {{CLIENT_NAME}}\nProyecto: {{PROJECT_NAME}}\n\nDESCRIPCIÓN: {{PROJECT_DESCRIPTION}}\nFECHA INICIO: {{START_DATE}}\nFECHA ENTREGA: {{DELIVERY_DATE}}\nPRESUPUESTTO: {{AMOUNT}} {{CURRENCY}}`,
      variables: ['CLIENT_NAME', 'PROJECT_NAME', 'PROJECT_DESCRIPTION', 'START_DATE', 'DELIVERY_DATE', 'AMOUNT', 'CURRENCY'],
      createdDate: '2024-01-20',
      lastModified: '2024-02-08',
      isActive: true,
      usageCount: 8
    },
    {
      id: '3',
      name: 'Contrato de Producción Musical',
      type: 'music',
      description: 'Plantilla para servicios de producción musical',
      content: `CONTRATO DE PRODUCCIÓN MUSICAL\n\nArtista/Cliente: {{CLIENT_NAME}}\nProyecto Musical: {{PROJECT_NAME}}\n\nSERVICIOS INCLUIDOS: {{PROJECT_DESCRIPTION}}\nDURACIÓN DEL PROYECTO: {{START_DATE}} - {{END_DATE}}\nINVERSIÓN TOTAL: {{AMOUNT}} {{CURRENCY}}\nFORMA DE PAGO: {{PAYMENT_TERMS}}`,
      variables: ['CLIENT_NAME', 'PROJECT_NAME', 'PROJECT_DESCRIPTION', 'START_DATE', 'END_DATE', 'AMOUNT', 'CURRENCY', 'PAYMENT_TERMS'],
      createdDate: '2024-01-25',
      lastModified: '2024-02-05',
      isActive: true,
      usageCount: 12
    }
  ]);

  const [contracts, setContracts] = useState<ContractData[]>([
    {
      id: '1',
      templateId: '1',
      clientName: 'María González',
      clientEmail: 'maria@email.com',
      clientPhone: '+57 300 123 4567',
      clientAddress: 'Calle 123 #45-67, Bogotá',
      projectName: 'Sesión de Fotos Corporativa',
      projectDescription: 'Sesión de fotos profesional para perfil corporativo y redes sociales',
      amount: '1500000',
      currency: 'COP',
      startDate: '2024-02-20',
      endDate: '2024-02-20',
      deliveryDate: '2024-02-25',
      paymentTerms: '50% anticipo, 50% contra entrega',
      additionalTerms: 'Incluye 20 fotos editadas en alta resolución',
      status: 'draft',
      createdDate: '2024-02-13',
      expiryDate: '2024-03-15'
    },
    {
      id: '2',
      templateId: '2',
      clientName: 'Carlos Rodríguez',
      clientEmail: 'carlos@empresa.com',
      clientPhone: '+57 301 987 6543',
      clientAddress: 'Carrera 15 #30-45, Medellín',
      projectName: 'Video Promocional',
      projectDescription: 'Producción de video promocional para lanzamiento de producto',
      amount: '3500000',
      currency: 'COP',
      startDate: '2024-02-25',
      endDate: '2024-03-10',
      deliveryDate: '2024-03-15',
      paymentTerms: '40% anticipo, 30% inicio grabación, 30% entrega final',
      additionalTerms: 'Incluye guión, grabación, edición y música original',
      status: 'sent',
      createdDate: '2024-02-10',
      sentDate: '2024-02-11',
      expiryDate: '2024-03-11'
    }
  ]);

  const [invoices, setInvoices] = useState<InvoiceData[]>([
    {
      id: '1',
      contractId: '2',
      clientName: 'Carlos Rodríguez',
      clientEmail: 'carlos@empresa.com',
      clientAddress: 'Carrera 15 #30-45, Medellín',
      invoiceNumber: 'INV-2024-001',
      issueDate: '2024-02-11',
      dueDate: '2024-02-25',
      items: [
        {
          description: 'Anticipo Video Promocional (40%)',
          quantity: 1,
          unitPrice: 1400000,
          total: 1400000
        }
      ],
      subtotal: 1400000,
      tax: 266000,
      total: 1666000,
      status: 'sent',
      notes: 'Pago correspondiente al 40% de anticipo según contrato'
    }
  ]);

  // Funciones de utilidad
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400';
      case 'sent': return 'bg-blue-500/20 text-blue-400';
      case 'signed': case 'paid': return 'bg-green-500/20 text-green-400';
      case 'expired': case 'overdue': return 'bg-red-500/20 text-red-400';
      case 'cancelled': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'photography': return 'bg-neon-cyan/20 text-neon-cyan';
      case 'audiovisual': return 'bg-neon-purple/20 text-neon-purple';
      case 'music': return 'bg-neon-pink/20 text-neon-pink';
      case 'general': return 'bg-neon-yellow/20 text-neon-yellow';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const formatCurrency = (amount: string, currency: string) => {
    const num = parseInt(amount);
    if (currency === 'COP') {
      return `$${num.toLocaleString('es-CO')} COP`;
    }
    return `$${num.toLocaleString()} ${currency}`;
  };

  // Funciones de acción
  const generateContract = (contractId: string) => {
    setContracts(prev => prev.map(contract => 
      contract.id === contractId 
        ? { 
            ...contract, 
            status: 'sent' as const,
            sentDate: new Date().toISOString().split('T')[0]
          }
        : contract
    ));
    toast({
      title: "Contrato Generado",
      description: "El contrato ha sido generado y enviado al cliente."
    });
  };

  const generateInvoice = (contractId: string) => {
    const contract = contracts.find(c => c.id === contractId);
    if (!contract) return;

    const newInvoice: InvoiceData = {
      id: Date.now().toString(),
      contractId: contract.id,
      clientName: contract.clientName,
      clientEmail: contract.clientEmail,
      clientAddress: contract.clientAddress,
      invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [
        {
          description: contract.projectDescription,
          quantity: 1,
          unitPrice: parseInt(contract.amount),
          total: parseInt(contract.amount)
        }
      ],
      subtotal: parseInt(contract.amount),
      tax: parseInt(contract.amount) * 0.19,
      total: parseInt(contract.amount) * 1.19,
      status: 'draft'
    };

    setInvoices(prev => [...prev, newInvoice]);
    toast({
      title: "Factura Generada",
      description: "La factura ha sido creada exitosamente."
    });
  };

  const duplicateTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const newTemplate: ContractTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copia)`,
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      usageCount: 0
    };

    setTemplates(prev => [...prev, newTemplate]);
    toast({
      title: "Plantilla Duplicada",
      description: "La plantilla ha sido duplicada exitosamente."
    });
  };

  // Renderizado de secciones
  const renderTemplates = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Plantillas de Contratos</h3>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => setShowTemplateEditor(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Plantilla
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="service-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getTypeColor(template.type)}>
                    {template.type === 'photography' ? 'Fotografía' :
                     template.type === 'audiovisual' ? 'Audiovisual' :
                     template.type === 'music' ? 'Música' : 'General'}
                  </Badge>
                  <Badge className={template.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                    {template.isActive ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Usos:</span>
                  <p className="font-semibold text-foreground">{template.usageCount}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Variables:</span>
                  <p className="font-semibold text-foreground">{template.variables.length}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Creada:</span>
                  <p className="font-semibold text-foreground">{template.createdDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Modificada:</span>
                  <p className="font-semibold text-foreground">{template.lastModified}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm" onClick={() => setShowContractForm(true)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Usar Plantilla
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedTemplate(template)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Vista Previa
                </Button>
                <Button size="sm" variant="outline" onClick={() => duplicateTemplate(template.id)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicar
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContracts = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Contratos Generados</h3>
        <Button size="sm" className="btn-neon" onClick={() => setShowContractForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Contrato
        </Button>
      </div>
      
      <div className="grid gap-4">
        {contracts.map((contract) => (
          <Card key={contract.id} className="service-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{contract.clientName}</h4>
                  <p className="text-sm text-muted-foreground">{contract.projectName}</p>
                </div>
                <Badge className={getStatusColor(contract.status)}>
                  {contract.status === 'draft' ? 'Borrador' :
                   contract.status === 'sent' ? 'Enviado' :
                   contract.status === 'signed' ? 'Firmado' :
                   contract.status === 'expired' ? 'Expirado' : 'Cancelado'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Monto:</span>
                  <p className="font-semibold text-foreground">{formatCurrency(contract.amount, contract.currency)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Inicio:</span>
                  <p className="font-semibold text-foreground">{contract.startDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Entrega:</span>
                  <p className="font-semibold text-foreground">{contract.deliveryDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Expira:</span>
                  <p className="font-semibold text-foreground">{contract.expiryDate}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">{contract.projectDescription}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => generateContract(contract.id)}
                  disabled={contract.status !== 'draft'}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {contract.status === 'draft' ? 'Enviar' : 'Reenviar'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => generateInvoice(contract.id)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generar Factura
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedContract(contract)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Facturas</h3>
        <Button size="sm" className="btn-neon" onClick={() => setShowInvoiceForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Factura
        </Button>
      </div>
      
      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="service-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{invoice.invoiceNumber}</h4>
                  <p className="text-sm text-muted-foreground">{invoice.clientName}</p>
                </div>
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status === 'draft' ? 'Borrador' :
                   invoice.status === 'sent' ? 'Enviada' :
                   invoice.status === 'paid' ? 'Pagada' :
                   invoice.status === 'overdue' ? 'Vencida' : 'Cancelada'}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total:</span>
                  <p className="font-semibold text-foreground">${invoice.total.toLocaleString('es-CO')} COP</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Emisión:</span>
                  <p className="font-semibold text-foreground">{invoice.issueDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Vencimiento:</span>
                  <p className="font-semibold text-foreground">{invoice.dueDate}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Items:</span>
                  <p className="font-semibold text-foreground">{invoice.items.length}</p>
                </div>
              </div>
              
              <div className="mb-4">
                {invoice.items.map((item, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {item.description} - ${item.total.toLocaleString('es-CO')} COP
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button size="sm">
                  <Send className="w-4 h-4 mr-2" />
                  Enviar
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />
                  Ver Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'templates': return renderTemplates();
      case 'contracts': return renderContracts();
      case 'invoices': return renderInvoices();
      default: return renderContracts();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Generador de Contratos y Facturas</h2>
          <p className="text-muted-foreground">Automatiza la creación de documentos legales y facturación</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border">
        {[
          { id: 'contracts', label: 'Contratos', icon: FileText },
          { id: 'templates', label: 'Plantillas', icon: Settings },
          { id: 'invoices', label: 'Facturas', icon: DollarSign }
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

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{selectedTemplate.name}</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => setSelectedTemplate(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Variables disponibles:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map((variable) => (
                      <Badge key={variable} variant="outline">
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Contenido de la plantilla:</h4>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">{selectedTemplate.content}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContractGenerator;