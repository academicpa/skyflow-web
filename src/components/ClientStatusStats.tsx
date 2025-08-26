import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  UserX, 
  CheckCircle,
  Clock,
  Eye
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  client_status: 'por_visitar' | 'pendiente' | 'plan_confirmado' | 'en_proceso' | 'completado' | 'inactivo';
  membership_plan?: string;
  membershipStatus: 'por_visitar' | 'pendiente' | 'plan_confirmado' | 'en_proceso' | 'completado' | 'inactivo';
  membershipExpiry?: string;
  joinDate?: string;
  lastPayment?: string;
  nextPaymentDue?: string;
  totalSpent?: number | string;
  firstContactDate?: string;
  planStartDate?: string;
  notes?: string;
  leadSource?: string;
  assignedTo?: string;
  created_at: string;
  updated_at: string;
}

interface ClientStatusStatsProps {
  clients: Client[];
}

const ClientStatusStats: React.FC<ClientStatusStatsProps> = ({ clients }) => {
  // Estadísticas por estado del cliente
  const clientsByStatus = {
    por_visitar: clients.filter(client => client.membershipStatus === 'por_visitar' || client.client_status === 'por_visitar').length,
    pendiente: clients.filter(client => client.membershipStatus === 'pendiente' || client.client_status === 'pendiente').length,
    plan_confirmado: clients.filter(client => client.membershipStatus === 'plan_confirmado' || client.client_status === 'plan_confirmado').length,
    en_proceso: clients.filter(client => client.membershipStatus === 'en_proceso' || client.client_status === 'en_proceso').length,
    completado: clients.filter(client => client.membershipStatus === 'completado' || client.client_status === 'completado').length,
    inactivo: clients.filter(client => client.membershipStatus === 'inactivo' || client.client_status === 'inactivo').length
  };



  const getStatusColor = (status: string) => {
    switch (status) {
      case 'por_visitar': return 'bg-blue-500/20 text-blue-400 border-blue-500/20';
      case 'pendiente': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20';
      case 'plan_confirmado': return 'bg-green-500/20 text-green-400 border-green-500/20';
      case 'en_proceso': return 'bg-purple-500/20 text-purple-400 border-purple-500/20';
      case 'completado': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20';
      case 'inactivo': return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'por_visitar': return <Eye className="w-4 h-4" />;
      case 'pendiente': return <Clock className="w-4 h-4" />;
      case 'plan_confirmado': return <CheckCircle className="w-4 h-4" />;
      case 'en_proceso': return <UserCheck className="w-4 h-4" />;
      case 'completado': return <CheckCircle className="w-4 h-4" />;
      case 'inactivo': return <UserX className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'por_visitar': return 'Por Visitar';
      case 'pendiente': return 'Pendiente';
      case 'plan_confirmado': return 'Plan Confirmado';
      case 'en_proceso': return 'En Proceso';
      case 'completado': return 'Completado';
      case 'inactivo': return 'Inactivo';
      default: return status;
    }
  };



  return (
    <Card className="service-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="w-5 h-5 mr-2 text-neon-cyan" />
          Estados de Clientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(clientsByStatus).map(([status, count]) => (
            <div key={status} className={`p-4 rounded-lg border ${getStatusColor(status)}`}>
              <div className="flex items-center justify-between mb-2">
                {getStatusIcon(status)}
                <span className="text-2xl font-bold">{count}</span>
              </div>
              <p className="text-sm font-medium">{getStatusLabel(status)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientStatusStats;