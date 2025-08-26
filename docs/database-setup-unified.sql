-- =====================================================
-- SCRIPT UNIFICADO PARA CONFIGURACIÓN COMPLETA DE BASE DE DATOS
-- Skyflow CRM - Configuración completa con autenticación tradicional
-- =====================================================

-- Este script unifica todas las configuraciones necesarias:
-- 1. Migración a autenticación tradicional
-- 2. Creación y actualización de tablas
-- 3. Corrección de políticas RLS
-- 4. Funciones y triggers

-- =====================================================
-- PASO 1: MIGRACIÓN A AUTENTICACIÓN TRADICIONAL
-- =====================================================

-- Añadir columna password_hash a la tabla users si no existe
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Crear función para hashear contraseñas
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear función para verificar contraseñas
CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN crypt(password, hash) = hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear función de autenticación tradicional
CREATE OR REPLACE FUNCTION authenticate_user(user_email TEXT, user_password TEXT)
RETURNS TABLE(user_id UUID, email TEXT, full_name TEXT, role TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.email, u.full_name, u.role
    FROM public.users u
    WHERE u.email = user_email 
    AND verify_password(user_password, u.password_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Actualizar usuario admin con contraseña hasheada
UPDATE public.users 
SET password_hash = hash_password('admin123')
WHERE email = 'admin@skyflow.com';

-- =====================================================
-- PASO 2: CREACIÓN DE TABLA PLANES
-- =====================================================

-- Crear tabla planes si no existe
CREATE TABLE IF NOT EXISTS public.planes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    precio DECIMAL(10,2),
    duracion_meses INTEGER DEFAULT 12,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar planes por defecto si no existen
INSERT INTO public.planes (nombre, descripcion, precio, duracion_meses)
SELECT 'Básico', 'Plan básico de membresía', 99.99, 12
WHERE NOT EXISTS (SELECT 1 FROM public.planes WHERE nombre = 'Básico');

INSERT INTO public.planes (nombre, descripcion, precio, duracion_meses)
SELECT 'Premium', 'Plan premium con beneficios adicionales', 199.99, 12
WHERE NOT EXISTS (SELECT 1 FROM public.planes WHERE nombre = 'Premium');

INSERT INTO public.planes (nombre, descripcion, precio, duracion_meses)
SELECT 'VIP', 'Plan VIP con acceso completo', 299.99, 12
WHERE NOT EXISTS (SELECT 1 FROM public.planes WHERE nombre = 'VIP');

-- =====================================================
-- PASO 3: ACTUALIZACIÓN DE TABLA CLIENTS
-- =====================================================

-- Añadir nuevas columnas a clients si no existen
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS client_status VARCHAR(50) DEFAULT 'pendiente',
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS first_contact_date DATE,
ADD COLUMN IF NOT EXISTS lead_source VARCHAR(100),
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.users(id);

-- =====================================================
-- PASO 4: CREACIÓN DE TABLA CLIENT_STATUS_HISTORY
-- =====================================================

-- Crear tabla client_status_history si no existe
CREATE TABLE IF NOT EXISTS public.client_status_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES public.users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- =====================================================
-- PASO 5: FUNCIONES Y TRIGGERS
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar cambios de estado de cliente
CREATE OR REPLACE FUNCTION log_client_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.client_status IS DISTINCT FROM NEW.client_status THEN
        INSERT INTO public.client_status_history (client_id, old_status, new_status, changed_at)
        VALUES (NEW.id, OLD.client_status, NEW.client_status, NOW());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers si no existen
DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_planes_updated_at ON public.planes;
CREATE TRIGGER update_planes_updated_at
    BEFORE UPDATE ON public.planes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS client_status_change_trigger ON public.clients;
CREATE TRIGGER client_status_change_trigger
    AFTER UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION log_client_status_change();

-- =====================================================
-- PASO 6: CORRECCIÓN DE POLÍTICAS RLS
-- =====================================================

-- Eliminar todas las políticas RLS problemáticas que usan auth.uid()
-- Estas políticas fallan en autenticación tradicional porque auth.uid() es NULL

-- Políticas para users
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.users;

-- Políticas para clients
DROP POLICY IF EXISTS "Enable read access for all users" ON public.clients;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.clients;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.clients;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.clients;

-- Políticas para projects
DROP POLICY IF EXISTS "Enable read access for all users" ON public.projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.projects;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.projects;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.projects;

-- Políticas para tasks
DROP POLICY IF EXISTS "Enable read access for all users" ON public.tasks;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.tasks;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.tasks;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.tasks;

-- Deshabilitar RLS temporalmente para todas las tablas principales
-- Esto permite acceso completo mientras se implementa autenticación tradicional
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.tasks DISABLE ROW LEVEL SECURITY;

-- Configurar políticas RLS simples para nuevas tablas
ALTER TABLE public.planes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.planes FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.planes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.planes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.planes FOR DELETE USING (true);

ALTER TABLE public.client_status_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.client_status_history FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.client_status_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.client_status_history FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.client_status_history FOR DELETE USING (true);

-- =====================================================
-- PASO 7: VERIFICACIONES
-- =====================================================

-- Verificar que las tablas existen
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users' AND table_schema = 'public') 
         THEN 'users: ✓ Existe' 
         ELSE 'users: ✗ No existe' END as tabla_users,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clients' AND table_schema = 'public') 
         THEN 'clients: ✓ Existe' 
         ELSE 'clients: ✗ No existe' END as tabla_clients,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'projects' AND table_schema = 'public') 
         THEN 'projects: ✓ Existe' 
         ELSE 'projects: ✗ No existe' END as tabla_projects,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tasks' AND table_schema = 'public') 
         THEN 'tasks: ✓ Existe' 
         ELSE 'tasks: ✗ No existe' END as tabla_tasks,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'planes' AND table_schema = 'public') 
         THEN 'planes: ✓ Existe' 
         ELSE 'planes: ✗ No existe' END as tabla_planes,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'client_status_history' AND table_schema = 'public') 
         THEN 'client_status_history: ✓ Existe' 
         ELSE 'client_status_history: ✗ No existe' END as tabla_history;

-- Verificar estado de RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'clients', 'projects', 'tasks', 'planes', 'client_status_history')
ORDER BY tablename;

-- Verificar funciones de autenticación
SELECT 
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'authenticate_user' AND routine_schema = 'public') 
         THEN 'authenticate_user: ✓ Existe' 
         ELSE 'authenticate_user: ✗ No existe' END as funcion_auth,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'hash_password' AND routine_schema = 'public') 
         THEN 'hash_password: ✓ Existe' 
         ELSE 'hash_password: ✗ No existe' END as funcion_hash,
    CASE WHEN EXISTS (SELECT 1 FROM information_schema.routines WHERE routine_name = 'verify_password' AND routine_schema = 'public') 
         THEN 'verify_password: ✓ Existe' 
         ELSE 'verify_password: ✗ No existe' END as funcion_verify;

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================

/*
Este script unificado realiza las siguientes acciones:

1. MIGRACIÓN A AUTENTICACIÓN TRADICIONAL:
   - Añade password_hash a la tabla users
   - Crea funciones para hashear y verificar contraseñas
   - Crea función authenticate_user para login tradicional
   - Actualiza el usuario admin con contraseña hasheada

2. ACTUALIZACIÓN DE ESQUEMA:
   - Crea tabla planes con datos por defecto
   - Añade nuevas columnas a clients (client_status, notes, etc.)
   - Crea tabla client_status_history para auditoría

3. FUNCIONES Y TRIGGERS:
   - Función update_updated_at_column para timestamps automáticos
   - Función log_client_status_change para auditoría de cambios
   - Triggers para actualizar updated_at y registrar cambios de estado

4. CORRECCIÓN DE RLS:
   - Elimina todas las políticas RLS que usan auth.uid() (problemáticas en autenticación tradicional)
   - Deshabilita RLS para tablas principales (users, clients, projects, tasks)
   - Configura RLS simple para nuevas tablas (planes, client_status_history)

5. VERIFICACIONES:
   - Verifica existencia de tablas
   - Verifica estado de RLS
   - Verifica existencia de funciones de autenticación

Después de ejecutar este script:
- La aplicación funcionará con autenticación tradicional
- No habrá problemas de RLS con auth.uid() = NULL
- Todas las funcionalidades estarán disponibles
- Se mantendrá la auditoría de cambios de estado de clientes
*/

-- =====================================================
-- FIN DEL SCRIPT UNIFICADO
-- =====================================================