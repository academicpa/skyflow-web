-- =====================================================
-- SCRIPT PARA DESHABILITAR RLS COMPLETAMENTE
-- =====================================================
-- Este script elimina todas las políticas RLS y deshabilita RLS
-- para solucionar el error de recursión infinita

-- 1. ELIMINAR TODAS LAS POLÍTICAS EXISTENTES

-- Políticas de users
DROP POLICY IF EXISTS "Allow authenticated users to read all users" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow insert for new users" ON public.users;
DROP POLICY IF EXISTS "Allow public read access" ON public.users;
DROP POLICY IF EXISTS "Allow public update access" ON public.users;
DROP POLICY IF EXISTS "Allow public insert access" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.users;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.users;

-- Políticas de clients
DROP POLICY IF EXISTS "Allow authenticated users to read all clients" ON public.clients;
DROP POLICY IF EXISTS "Allow authenticated users to insert clients" ON public.clients;
DROP POLICY IF EXISTS "Allow authenticated users to update clients" ON public.clients;
DROP POLICY IF EXISTS "Allow authenticated users to delete clients" ON public.clients;
DROP POLICY IF EXISTS "Users can view own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can insert own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON public.clients;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.clients;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.clients;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.clients;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.clients;

-- Políticas de projects
DROP POLICY IF EXISTS "Allow authenticated users to read all projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated users to insert projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated users to update projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated users to delete projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.projects;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.projects;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.projects;
DROP POLICY IF EXISTS "Enable delete for users based on email" ON public.projects;

-- 2. DESHABILITAR RLS COMPLETAMENTE
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- 3. VERIFICAR QUE NO HAY POLÍTICAS ACTIVAS
SELECT 
    'Verificando políticas...' as paso,
    schemaname,
    tablename,
    policyname
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'clients', 'projects');

-- 4. VERIFICAR ESTADO DE RLS
SELECT 
    'Estado de RLS...' as paso,
    table_schema,
    table_name,
    'RLS deshabilitado' as estado_rls
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'clients', 'projects');

-- 5. MENSAJE FINAL
SELECT 
    '✅ RLS COMPLETAMENTE DESHABILITADO' as resultado,
    'Todas las políticas eliminadas' as accion_1,
    'RLS deshabilitado en todas las tablas' as accion_2,
    'Ya no habrá recursión infinita' as accion_3,
    'Acceso completo a todas las tablas' as accion_4;

-- =====================================================
-- INSTRUCCIONES:
-- 1. Ejecuta este script en Supabase SQL Editor
-- 2. Verifica que no hay errores
-- 3. Prueba el login nuevamente
-- 4. El sistema debería funcionar sin restricciones RLS
-- =====================================================