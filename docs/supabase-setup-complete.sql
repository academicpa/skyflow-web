-- Esquema completo de base de datos para Skyflow
-- Ejecuta este script en tu panel de Supabase (SQL Editor) para crear las tablas y datos de prueba

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de usuarios (extiende auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')) DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  company TEXT,
  address TEXT,
  total_spent DECIMAL(10,2) DEFAULT 0,
  membership_plan TEXT DEFAULT 'Básico' CHECK (membership_plan IN ('Básico', 'Premium', 'Enterprise')),
  membership_status TEXT DEFAULT 'active' CHECK (membership_status IN ('active', 'expired', 'pending')),
  membership_expiry DATE,
  join_date DATE DEFAULT CURRENT_DATE,
  last_payment DATE,
  next_payment_due DATE,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de proyectos
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')) DEFAULT 'pending',
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  budget DECIMAL(10,2),
  deadline DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de tareas (para los proyectos)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in-progress', 'completed')) DEFAULT 'pending',
  assigned_to TEXT,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clients_updated_at ON public.clients;
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON public.projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON public.tasks;
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para crear usuario en public.users cuando se registra en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'client');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear usuario automáticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Políticas de seguridad (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all clients" ON public.clients;
DROP POLICY IF EXISTS "Clients can view own data" ON public.clients;
DROP POLICY IF EXISTS "Admins can manage all projects" ON public.projects;
DROP POLICY IF EXISTS "Clients can view own projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can manage all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view project tasks" ON public.tasks;

-- Políticas para usuarios
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para clientes
CREATE POLICY "Admins can manage all clients" ON public.clients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clients can view own data" ON public.clients
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para proyectos
CREATE POLICY "Admins can manage all projects" ON public.projects
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Clients can view own projects" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE id = client_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Políticas para tareas
CREATE POLICY "Admins can manage all tasks" ON public.tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can view project tasks" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      JOIN public.clients c ON p.client_id = c.id
      WHERE p.id = project_id AND (c.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.users
          WHERE id = auth.uid() AND role = 'admin'
        )
      )
    )
  );

-- DATOS DE PRUEBA
-- Limpiar datos existentes
DELETE FROM public.tasks;
DELETE FROM public.projects;
DELETE FROM public.clients;

-- Insertar clientes de prueba
INSERT INTO public.clients (name, email, company, phone, address, total_spent, membership_plan, membership_status, membership_expiry, join_date, last_payment, next_payment_due) VALUES
  ('Juan Pérez', 'juan@empresa.com', 'Empresa ABC S.L.', '+34 600 123 456', 'Calle Mayor 123, Madrid', 15000.00, 'Premium', 'active', '2024-12-31', '2023-06-15', '2024-01-15', '2024-02-15'),
  ('María García', 'maria@startup.com', 'Startup XYZ', '+34 600 789 012', 'Av. Innovación 45, Barcelona', 8500.00, 'Básico', 'active', '2024-06-30', '2023-08-20', '2024-01-10', '2024-02-10'),
  ('Carlos López', 'carlos@freelance.com', 'Freelancer Creativo', '+34 600 345 678', 'Plaza Central 7, Valencia', 12000.00, 'Enterprise', 'active', '2025-03-31', '2023-04-10', '2024-01-20', '2024-02-20'),
  ('Ana Martínez', 'ana@tech.com', 'Tech Solutions', '+34 600 567 890', 'Calle Tecnología 89, Sevilla', 6500.00, 'Premium', 'active', '2024-09-30', '2023-09-05', '2024-01-05', '2024-02-05'),
  ('Luis Rodríguez', 'luis@marketing.com', 'Marketing Pro', '+34 600 234 567', 'Av. Publicidad 12, Bilbao', 4200.00, 'Básico', 'expired', '2024-01-31', '2023-07-12', '2023-12-12', '2024-01-12');

-- Insertar proyectos de prueba
INSERT INTO public.projects (name, description, status, client_id, budget, deadline, progress) VALUES
  ('Sitio Web Corporativo', 'Desarrollo completo de sitio web corporativo con CMS y panel de administración', 'in-progress', 
   (SELECT id FROM public.clients WHERE email = 'juan@empresa.com'), 5000.00, '2024-03-15', 65),
  ('App Móvil E-commerce', 'Aplicación móvil para ventas online con pasarela de pago integrada', 'pending', 
   (SELECT id FROM public.clients WHERE email = 'maria@startup.com'), 8000.00, '2024-04-20', 0),
  ('Plataforma E-learning', 'Sistema de gestión de aprendizaje online con videoconferencias', 'completed', 
   (SELECT id FROM public.clients WHERE email = 'carlos@freelance.com'), 12000.00, '2024-02-10', 100),
  ('Sistema CRM', 'Customer Relationship Management personalizado para gestión de clientes', 'in-progress', 
   (SELECT id FROM public.clients WHERE email = 'ana@tech.com'), 6500.00, '2024-05-30', 40),
  ('Campaña Digital', 'Estrategia de marketing digital completa con automatización', 'cancelled', 
   (SELECT id FROM public.clients WHERE email = 'luis@marketing.com'), 3500.00, '2024-01-25', 25),
  ('Rediseño Web', 'Modernización completa del sitio web existente con nueva identidad visual', 'pending', 
   (SELECT id FROM public.clients WHERE email = 'juan@empresa.com'), 3500.00, '2024-06-15', 0),
  ('App de Productividad', 'Aplicación para gestión de tareas y productividad empresarial', 'in-progress', 
   (SELECT id FROM public.clients WHERE email = 'maria@startup.com'), 4500.00, '2024-07-10', 30);

-- Insertar tareas de prueba
INSERT INTO public.tasks (project_id, title, description, status, assigned_to, due_date) VALUES
  -- Tareas para Sitio Web Corporativo
  ((SELECT id FROM public.projects WHERE name = 'Sitio Web Corporativo'), 'Diseño de wireframes', 'Crear wireframes para todas las páginas principales', 'completed', 'Diseñador UX', '2024-02-01'),
  ((SELECT id FROM public.projects WHERE name = 'Sitio Web Corporativo'), 'Desarrollo frontend', 'Implementar diseño responsive con React', 'in-progress', 'Desarrollador Frontend', '2024-02-20'),
  ((SELECT id FROM public.projects WHERE name = 'Sitio Web Corporativo'), 'Integración CMS', 'Configurar sistema de gestión de contenidos', 'pending', 'Desarrollador Backend', '2024-03-01'),
  
  -- Tareas para App Móvil E-commerce
  ((SELECT id FROM public.projects WHERE name = 'App Móvil E-commerce'), 'Análisis de requisitos', 'Documentar funcionalidades y casos de uso', 'pending', 'Analista', '2024-02-15'),
  ((SELECT id FROM public.projects WHERE name = 'App Móvil E-commerce'), 'Diseño UI/UX', 'Crear prototipos interactivos de la aplicación', 'pending', 'Diseñador UI', '2024-03-01'),
  
  -- Tareas para Sistema CRM
  ((SELECT id FROM public.projects WHERE name = 'Sistema CRM'), 'Base de datos', 'Diseñar esquema de base de datos', 'completed', 'Arquitecto DB', '2024-01-30'),
  ((SELECT id FROM public.projects WHERE name = 'Sistema CRM'), 'API REST', 'Desarrollar endpoints de la API', 'in-progress', 'Desarrollador Backend', '2024-02-25'),
  ((SELECT id FROM public.projects WHERE name = 'Sistema CRM'), 'Dashboard admin', 'Crear panel de administración', 'pending', 'Desarrollador Frontend', '2024-03-15');

-- Mensaje final
SELECT 'Base de datos configurada correctamente con datos de prueba' as mensaje;
SELECT 'Clientes creados: ' || COUNT(*) as clientes FROM public.clients;
SELECT 'Proyectos creados: ' || COUNT(*) as proyectos FROM public.projects;
SELECT 'Tareas creadas: ' || COUNT(*) as tareas FROM public.tasks;