import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, AlertCircle, XCircle, Info, Mail } from "lucide-react"

interface BeautifulToastOptions {
  title: string
  description: string
  duration?: number
}

export const useBeautifulToast = () => {
  const { toast } = useToast()

  const showSuccess = ({ title, description, duration = 4000 }: BeautifulToastOptions) => {
    toast({
      title,
      description,
      variant: "success" as any,
      duration,
    })
  }

  const showError = ({ title, description, duration = 5000 }: BeautifulToastOptions) => {
    toast({
      title,
      description,
      variant: "destructive",
      duration,
    })
  }

  const showWarning = ({ title, description, duration = 4000 }: BeautifulToastOptions) => {
    toast({
      title,
      description,
      variant: "warning" as any,
      duration,
    })
  }

  const showInfo = ({ title, description, duration = 4000 }: BeautifulToastOptions) => {
    toast({
      title,
      description,
      variant: "info" as any,
      duration,
    })
  }

  const showDuplicateEmailError = (email: string) => {
    toast({
      title: "📧 Correo electrónico ya registrado",
      description: `El correo ${email} ya está siendo utilizado por otro cliente. Por favor, utiliza un correo diferente.`,
      variant: "destructive",
      duration: 6000,
    })
  }

  const showClientCreatedSuccess = (clientName: string) => {
    toast({
      title: "✅ Cliente creado exitosamente",
      description: `${clientName} ha sido agregado a la base de datos.`,
      variant: "success" as any,
      duration: 4000,
    })
  }

  const showClientUpdatedSuccess = (clientName: string) => {
    toast({
      title: "✅ Cliente actualizado",
      description: `Los datos de ${clientName} han sido actualizados correctamente.`,
      variant: "success" as any,
      duration: 4000,
    })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showDuplicateEmailError,
    showClientCreatedSuccess,
    showClientUpdatedSuccess,
  }
}