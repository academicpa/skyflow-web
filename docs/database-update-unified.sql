-- =====================================================
-- SCRIPT UNIFICADO PARA CONFIGURACIÓN DE BASE DE DATOS SKYFLOW
-- =====================================================
-- Este script combina la creación de tablas, políticas RLS corregidas
-- y configuración completa de la base de datos
-- Ejecuta este script en tu panel de Supabase (SQL Editor)

-- =====================================================
-- 1. CREAR TABLA DE PLANES
-- =====================================================

-- Crear tabla de planes
CREATE TABLE IF NOT EXISTS public.planes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2),
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. ACTUALIZAR TABLA CLIENTS
-- =====================================================

-- Añadir columnas faltantes a la tabla clients
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS client_status TEXT DEFAULT 'por_visitar' CHECK (client_status IN ('por_visitar', 'pendiente', 'plan_confirmado', 'en_proceso', 'completado', 'inactivo'));
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS first_contact_date DATE;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS lead_source TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.users(id);

-- =====================================================
-- CORRECCIÓN: USAR CLIENT_STATUS PARA ESTADOS DEL FLUJO
-- =====================================================
-- client_status: Estados del flujo de ventas (por_visitar, pendiente, etc.)
-- membership_plan: Plan específico cuando está confirmado (Básico, Premium, etc.)

-- Primero eliminar constraints existentes si existen
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_membership_plan_check;
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_membership_status_check;
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_client_status_check;

-- Actualizar datos existentes antes de aplicar constraints
UPDATE public.clients 
SET client_status = COALESCE(client_status, 'por_visitar')
WHERE client_status IS NULL;

-- Constraint para client_status: Estados del flujo de ventas
ALTER TABLE public.clients ADD CONSTRAINT clients_client_status_check 
  CHECK (client_status IN ('por_visitar', 'pendiente', 'plan_confirmado', 'en_proceso', 'completado', 'inactivo'));

-- Constraint para membership_plan: Planes específicos disponibles
ALTER TABLE public.clients ADD CONSTRAINT clients_membership_plan_check 
  CHECK (membership_plan IN ('Básico', 'Premium', 'Profesional', 'Empresarial') OR membership_plan IS NULL);

-- Comentarios explicativos
COMMENT ON COLUMN public.clients.client_status IS 'Estado del cliente en el flujo de ventas (por_visitar, pendiente, plan_confirmado, en_proceso, completado, inactivo)';
COMMENT ON COLUMN public.clients.membership_plan IS 'Plan específico seleccionado cuando el estado es plan_confirmado o superior (Básico, Premium, Profesional, Empresarial)';

-- =====================================================
-- 3. INSERTAR PLANES POR DEFECTO
-- =====================================================

INSERT INTO public.planes (name, description, price, features) VALUES 
('Básico', 'Plan básico para pequeñas empresas', 99.99, '{"videos": 5, "storage": "10GB", "support": "Email"}'),
('Premium', 'Plan premium con más funcionalidades', 199.99, '{"videos": 15, "storage": "50GB", "support": "Email + Chat"}'),
('Profesional', 'Plan profesional para empresas medianas', 399.99, '{"videos": 30, "storage": "100GB", "support": "24/7"}'),
('Empresarial', 'Plan empresarial con recursos ilimitados', 799.99, '{"videos": "unlimited", "storage": "500GB", "support": "Dedicated Manager"}')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 4. CREAR TABLAS PARA GESTIÓN DE ESTADOS
-- =====================================================

-- Tabla para historial de estados del cliente
CREATE TABLE IF NOT EXISTS public.client_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  change_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. CREAR FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at automáticamente (si no existe)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para registrar cambios de estado del cliente
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

-- Crear triggers
DROP TRIGGER IF EXISTS update_planes_updated_at ON public.planes;
CREATE TRIGGER update_planes_updated_at BEFORE UPDATE ON public.planes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS client_status_change_trigger ON public.clients;
CREATE TRIGGER client_status_change_trigger
  AFTER UPDATE OF client_status ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION log_client_status_change();

-- =====================================================
-- 6. CONFIGURAR POLÍTICAS DE SEGURIDAD (RLS) - CORREGIDAS
-- =====================================================

-- Habilitar RLS en nuevas tablas
ALTER TABLE public.planes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_status_history ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS CORREGIDAS PARA PLANES (ACCESO PÚBLICO)
-- =====================================================
-- Eliminar políticas existentes que usaban auth.role()
DROP POLICY IF EXISTS "Allow authenticated users to read planes" ON public.planes;
DROP POLICY IF EXISTS "Allow authenticated users to manage planes" ON public.planes;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Allow public read access to planes" ON public.planes;
DROP POLICY IF EXISTS "Allow public insert access to planes" ON public.planes;
DROP POLICY IF EXISTS "Allow public update access to planes" ON public.planes;
DROP POLICY IF EXISTS "Allow public delete access to planes" ON public.planes;

-- Crear nuevas políticas para acceso público (compatible con autenticación tradicional)
-- Política para lectura (SELECT)
CREATE POLICY "Allow public read access to planes" ON public.planes
    FOR SELECT
    TO public
    USING (true);

-- Política para inserción (INSERT)
CREATE POLICY "Allow public insert access to planes" ON public.planes
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Política para actualización (UPDATE)
CREATE POLICY "Allow public update access to planes" ON public.planes
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- Política para eliminación (DELETE)
CREATE POLICY "Allow public delete access to planes" ON public.planes
    FOR DELETE
    TO public
    USING (true);

-- =====================================================
-- POLÍTICAS PARA OTRAS TABLAS (MANTENER RESTRICCIONES)
-- =====================================================

-- Políticas para client_status_history
DROP POLICY IF EXISTS "Admins can view all status history" ON public.client_status_history;
CREATE POLICY "Admins can view all status history" ON public.client_status_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );





-- =====================================================
-- 8. ACTUALIZAR DATOS EXISTENTES
-- =====================================================

-- Actualizar clientes existentes para asegurar consistencia
UPDATE public.clients 
SET 
  client_status = COALESCE(client_status, 'por_visitar'),
  join_date = COALESCE(join_date, created_at::date),
  first_contact_date = COALESCE(first_contact_date, created_at::date)
WHERE client_status IS NULL OR join_date IS NULL OR first_contact_date IS NULL;

-- =====================================================
-- 9. VERIFICACIONES Y COMENTARIOS
-- =====================================================

-- Verificar que las políticas se crearon correctamente
SELECT 
    '✅ Verificando políticas de planes...' as paso,
    schemaname,
    tablename,
    policyname,
    cmd
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'planes'
ORDER BY policyname;

-- Verificar que los planes existen
SELECT 
    '✅ Verificando planes existentes...' as paso,
    COUNT(*) as total_planes
FROM public.planes;

-- Mostrar planes disponibles
SELECT 
    '✅ Planes disponibles:' as info,
    id,
    name,
    description,
    price,
    is_active
FROM public.planes
ORDER BY created_at;

-- Comentarios para documentación
COMMENT ON TABLE public.planes IS 'Tabla para almacenar los diferentes planes de servicio disponibles';
COMMENT ON COLUMN public.planes.name IS 'Nombre del plan (único)';
COMMENT ON COLUMN public.planes.description IS 'Descripción del plan';
COMMENT ON COLUMN public.planes.price IS 'Precio del plan en formato decimal';
COMMENT ON COLUMN public.planes.features IS 'Características del plan en formato JSON';
COMMENT ON COLUMN public.planes.is_active IS 'Indica si el plan está activo y disponible';

COMMENT ON COLUMN public.clients.client_status IS 'Estado actual del cliente en el flujo de ventas';
COMMENT ON COLUMN public.clients.notes IS 'Notas adicionales sobre el cliente';
COMMENT ON COLUMN public.clients.first_contact_date IS 'Fecha del primer contacto con el cliente';
COMMENT ON COLUMN public.clients.lead_source IS 'Fuente de donde provino el lead';
COMMENT ON COLUMN public.clients.assigned_to IS 'Usuario asignado para seguimiento del cliente';

COMMENT ON TABLE public.client_status_history IS 'Historial de cambios de estado de los clientes';

-- =====================================================
-- MENSAJE FINAL
-- =====================================================

SELECT 
    '🎉 CONFIGURACIÓN DE BASE DE DATOS COMPLETADA' as resultado,
    'Políticas RLS corregidas para autenticación tradicional' as accion_1,
    'Acceso público habilitado para planes' as accion_2,
    'Los planes ahora deberían mostrarse en la interfaz' as accion_3,
    'Funcionalidad CRUD completa habilitada' as accion_4;

SELECT 'Base de datos actualizada correctamente' as mensaje;
SELECT 'Planes disponibles: ' || COUNT(*) as planes FROM public.planes;


-- =====================================================
-- INSTRUCCIONES FINALES:
-- 1. Ejecuta este script en Supabase SQL Editor
-- 2. Verifica que no hay errores en la ejecución
-- 3. Recarga la aplicación para ver los planes
-- 4. Los planes deberían aparecer en PlanesManagement
-- 5. Elimina fix-planes-rls.sql ya que está integrado aquí
-- =====================================================