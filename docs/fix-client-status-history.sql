-- Script para corregir el problema con client_status_history

-- Verificar si la tabla client_status_history existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'client_status_history') THEN
        -- Crear la tabla client_status_history si no existe
        CREATE TABLE public.client_status_history (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
            previous_status TEXT,
            new_status TEXT NOT NULL,
            changed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
            change_reason TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Habilitar RLS
        ALTER TABLE public.client_status_history ENABLE ROW LEVEL SECURITY;
        
        -- Crear política para que los administradores puedan ver el historial
        CREATE POLICY "Admins can view all status history" ON public.client_status_history
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.users
                    WHERE id = auth.uid() AND role = 'admin'
                )
            );
        
        -- Crear política para insertar (necesaria para el trigger)
        CREATE POLICY "Allow status history inserts" ON public.client_status_history
            FOR INSERT WITH CHECK (true);
        
        RAISE NOTICE 'Tabla client_status_history creada exitosamente';
    ELSE
        RAISE NOTICE 'La tabla client_status_history ya existe';
    END IF;
END
$$;

-- Verificar si la función log_client_status_change existe y recrearla si es necesario
CREATE OR REPLACE FUNCTION log_client_status_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo procesar si realmente cambió el client_status
    IF OLD.client_status IS DISTINCT FROM NEW.client_status THEN
        -- Insertar en historial de estados
        INSERT INTO public.client_status_history (client_id, previous_status, new_status, changed_by)
        VALUES (NEW.id, OLD.client_status, NEW.client_status, auth.uid());
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar si el trigger existe y recrearlo si es necesario
DROP TRIGGER IF EXISTS client_status_change_trigger ON public.clients;
CREATE TRIGGER client_status_change_trigger
    AFTER UPDATE OF client_status ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION log_client_status_change();

SELECT 'Script de corrección ejecutado exitosamente' as resultado;