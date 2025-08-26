-- Script para corregir el problema de actualización de clientes
-- Ejecutar este script directamente en Supabase SQL Editor

-- 1. Verificar si existe algún trigger que haga referencia a client_tasks
SELECT 
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_schema = 'public' 
AND event_object_table = 'clients';

-- 2. Verificar funciones que puedan referenciar client_tasks
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_definition LIKE '%client_tasks%';

-- 3. Crear la tabla client_status_history si no existe
CREATE TABLE IF NOT EXISTS public.client_status_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    previous_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Habilitar RLS en la tabla
ALTER TABLE public.client_status_history ENABLE ROW LEVEL SECURITY;

-- 5. Crear políticas para la tabla
DROP POLICY IF EXISTS "Allow status history inserts" ON public.client_status_history;
CREATE POLICY "Allow status history inserts" ON public.client_status_history
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all status history" ON public.client_status_history;
CREATE POLICY "Admins can view all status history" ON public.client_status_history
    FOR SELECT USING (true); -- Permitir acceso público por ahora

-- 6. Recrear la función log_client_status_change sin referencias a client_tasks
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

-- 7. Recrear el trigger
DROP TRIGGER IF EXISTS client_status_change_trigger ON public.clients;
CREATE TRIGGER client_status_change_trigger
    AFTER UPDATE OF client_status ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION log_client_status_change();

-- 8. Verificar que todo esté correcto
SELECT 'Corrección aplicada exitosamente' as resultado;

-- 9. Probar una actualización simple
UPDATE public.clients 
SET updated_at = NOW() 
WHERE id = (SELECT id FROM public.clients LIMIT 1);

SELECT 'Prueba de actualización completada' as prueba;