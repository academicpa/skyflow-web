-- =====================================================
-- SCRIPT PARA MIGRAR A AUTENTICACIÓN TRADICIONAL
-- =====================================================
-- Este script agrega una columna de contraseña a la tabla users
-- y configura el sistema para usar autenticación tradicional

-- 1. AGREGAR COLUMNA DE CONTRASEÑA A LA TABLA USERS
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- 2. CREAR FUNCIÓN PARA HASHEAR CONTRASEÑAS
CREATE OR REPLACE FUNCTION hash_password(password TEXT)
RETURNS TEXT AS $$
BEGIN
    -- Usar crypt para hashear la contraseña con bcrypt
    RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. CREAR FUNCIÓN PARA VERIFICAR CONTRASEÑAS
CREATE OR REPLACE FUNCTION verify_password(password TEXT, hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Verificar si la contraseña coincide con el hash
    RETURN crypt(password, hash) = hash;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. CREAR FUNCIÓN DE LOGIN TRADICIONAL
-- Eliminar función existente si existe
DROP FUNCTION IF EXISTS authenticate_user(TEXT, TEXT);

CREATE OR REPLACE FUNCTION authenticate_user(input_email TEXT, user_password TEXT)
RETURNS TABLE(
    success BOOLEAN,
    user_id UUID,
    user_role TEXT,
    user_email TEXT,
    message TEXT
) AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Buscar el usuario por email
    SELECT id, email, role, password_hash
    INTO user_record
    FROM public.users
    WHERE email = input_email;
    
    -- Si no se encuentra el usuario
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TEXT, NULL::TEXT, 'Usuario no encontrado'::TEXT;
        RETURN;
    END IF;
    
    -- Si no tiene contraseña configurada
    IF user_record.password_hash IS NULL THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TEXT, NULL::TEXT, 'Contraseña no configurada'::TEXT;
        RETURN;
    END IF;
    
    -- Verificar la contraseña
    IF verify_password(user_password, user_record.password_hash) THEN
        RETURN QUERY SELECT TRUE, user_record.id, user_record.role, user_record.email, 'Login exitoso'::TEXT;
    ELSE
        RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TEXT, NULL::TEXT, 'Contraseña incorrecta'::TEXT;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. MODIFICAR TABLA USERS PARA AUTENTICACIÓN TRADICIONAL
-- Eliminar la restricción de clave foránea con auth.users
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Cambiar la columna id para que no dependa de auth.users
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 6. ACTUALIZAR USUARIO ADMIN CON EMAIL Y CONTRASEÑA
-- Actualizar el usuario admin existente con nuevo email y contraseña
DO $$
BEGIN
    -- Actualizar el usuario admin existente (buscar por role = 'admin')
    UPDATE public.users 
    SET email = 'blaz@skyflowproduction.com',
        password_hash = hash_password('RiddimDance2025'),
        updated_at = NOW()
    WHERE role = 'admin';
    
    -- Si no se actualizó ningún registro (no existe admin), crear uno nuevo
    IF NOT FOUND THEN
        INSERT INTO public.users (id, email, role, password_hash, created_at, updated_at)
        VALUES (
            gen_random_uuid(),
            'blaz@skyflowproduction.com',
            'admin',
            hash_password('RiddimDance2025'),
            NOW(),
            NOW()
        );
        RAISE NOTICE 'Usuario admin creado con email y contraseña';
    ELSE
        RAISE NOTICE 'Usuario admin actualizado con nuevo email y contraseña';
    END IF;
END $$;

-- 7. CREAR POLÍTICAS RLS PARA AUTENTICACIÓN TRADICIONAL
-- Deshabilitar RLS temporalmente
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "Allow authenticated users to read all users" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow insert for new users" ON public.users;

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Crear política simple para lectura (sin autenticación de Supabase)
DO $$ BEGIN
    CREATE POLICY "Allow public read access" ON public.users
        FOR SELECT
        TO public
        USING (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Crear política para actualización
DO $$ BEGIN
    CREATE POLICY "Allow public update access" ON public.users
        FOR UPDATE
        TO public
        USING (true)
        WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Crear política para inserción
DO $$ BEGIN
    CREATE POLICY "Allow public insert access" ON public.users
        FOR INSERT
        TO public
        WITH CHECK (true);
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- 8. VERIFICAR LA CONFIGURACIÓN
SELECT 
    'Verificando configuración...' as paso,
    email,
    role,
    CASE 
        WHEN password_hash IS NOT NULL THEN 'Contraseña configurada ✅'
        ELSE 'Sin contraseña ❌'
    END as estado_password
FROM public.users
WHERE email = 'blaz@skyflowproduction.com';

-- 9. PROBAR LA FUNCIÓN DE AUTENTICACIÓN
SELECT 
    'Probando autenticación...' as paso,
    success,
    user_role,
    user_email,
    message
FROM authenticate_user('blaz@skyflowproduction.com', 'RiddimDance2025');

-- 10. MENSAJE FINAL
SELECT 
    '✅ MIGRACIÓN COMPLETADA' as resultado,
    'Columna password_hash agregada a users' as accion_1,
    'Funciones de autenticación creadas' as accion_2,
    'Usuario admin configurado con contraseña' as accion_3,
    'Políticas RLS actualizadas para acceso público' as accion_4;

-- =====================================================
-- INSTRUCCIONES DE USO:
-- 1. Ejecuta este script en Supabase SQL Editor
-- 2. Modifica el código de login para usar authenticate_user()
-- 3. Credenciales: blaz@skyflowproduction.com / RiddimDance2025
-- 4. Ya no necesitas Supabase Auth
-- =====================================================