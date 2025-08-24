import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar, FileText, CheckCircle } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useToast } from '@/hooks/use-toast';

interface AddTaskModalProps {
  projectId: string;
  projectName: string;
  onTaskAdded?: () => void;
  trigger?: React.ReactNode;
}

export const AddTaskModal = ({ projectId, projectName, onTaskAdded, trigger }: AddTaskModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as 'pending' | 'in-progress' | 'completed',
    due_date: ''
  });
  
  const { addTask } = useTasks();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'El título de la tarea es obligatorio',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    try {
      const { error } = await addTask({
        project_id: projectId,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        due_date: formData.due_date || undefined
      });

      if (!error) {
        setFormData({
          title: '',
          description: '',
          status: 'pending',
          due_date: ''
        });
        setOpen(false);
        onTaskAdded?.();
        toast({
          title: 'Éxito',
          description: 'Tarea agregada correctamente al proyecto'
        });
      }
    } catch (error) {
      console.error('Error al agregar tarea:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <div className="h-4 w-4 rounded-full bg-yellow-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const defaultTrigger = (
    <Button size="sm" className="bg-neon-cyan hover:bg-neon-cyan/80 text-black">
      <Plus className="h-4 w-4 mr-2" />
      Agregar Tarea
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Plus className="h-5 w-5 text-neon-cyan" />
            Agregar Nueva Tarea
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Proyecto: <span className="font-medium text-foreground">{projectName}</span>
          </p>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Título de la Tarea *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ej: Diseñar interfaz de usuario"
              className="bg-background border-border text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descripción detallada de la tarea..."
              className="bg-background border-border text-foreground min-h-[80px]"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                {getStatusIcon(formData.status)}
                Estado
              </Label>
              <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
                <SelectTrigger className="bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-gray-400" />
                      Pendiente
                    </div>
                  </SelectItem>
                  <SelectItem value="in-progress">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-yellow-500" />
                      En Progreso
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      Completada
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date" className="text-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Fecha Límite
              </Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
                className="bg-background border-border text-foreground"
              />
            </div>
          </div>



          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="border-border text-foreground hover:bg-muted"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="bg-neon-cyan hover:bg-neon-cyan/80 text-black"
            >
              {loading ? 'Agregando...' : 'Agregar Tarea'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};