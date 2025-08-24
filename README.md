# Skyflow Production

## Acerca del Proyecto

Sitio web oficial de **Skyflow Production**, estudio de producción musical y audiovisual de clase mundial especializado en crear experiencias sonoras y visuales que conectan con audiencias globales.

**Dominio**: [skyflowproduction.com](https://skyflowproduction.com)

## 🆕 Últimas Actualizaciones

### ✅ Página de Agradecimiento (Enero 2025)
- **Página Thank You**: Nueva página `/gracias` con diseño coherente al sitio
- **Redirección Automática**: Formulario de cotización redirige tras envío exitoso
- **Validación de Formulario**: Campos requeridos validados antes del envío
- **Información de Seguimiento**: Detalles sobre próximos pasos y tiempos de respuesta
- **Diseño Responsive**: Totalmente adaptado para móviles y tablets

### 🔧 Correcciones de Bugs Móviles
- **Fix Pantalla Negra**: Solucionado problema de pantalla negra en inputs móviles
- **Prevención de Zoom iOS**: Inputs con font-size 16px para evitar zoom automático
- **Viewport Estable**: Mejoras en `-webkit-overflow-scrolling: touch`
- **Select Components**: Fixes específicos para componentes Radix UI en móviles
- **Focus Handling**: Corrección de problemas de focus en dispositivos táctiles

### 📱 Responsive Design Optimizado
- **Header Móvil**: Menú hamburguesa completamente funcional
- **Footer Responsive**: Diseño centrado con máximo 90% de ancho
- **Formularios Móviles**: Optimización completa para dispositivos táctiles
- **Dashboard Adaptativo**: Panel de administración responsive con sidebar colapsable
- **Navegación Táctil**: Experiencia de usuario mejorada en móviles

### 🔐 Sistema de Autenticación con Supabase
- **Autenticación Real**: Integración completa con Supabase para manejo seguro de usuarios
- **Base de Datos en la Nube**: Almacenamiento persistente de usuarios, proyectos y clientes
- **Protección de Rutas**: ProtectedRoute component para seguridad de acceso
- **Gestión de Estado**: Hook personalizado useAuth para manejo de autenticación
- **Roles de Usuario**: Sistema diferenciado entre administradores y clientes
- **Persistencia de Sesión**: Mantenimiento de sesión en localStorage

### 🎯 Sistema de Servicios Avanzado
- **Selección en Dos Pasos**: Sistema intuitivo para fotografía con selección de plan y cantidad
- **Mensajes WhatsApp Dinámicos**: Cotizaciones automáticas con detalles específicos
- **Precios Dinámicos**: Actualización automática según plan y cantidad
- **Formato Profesional**: Mensajes estructurados con emojis y información detallada
- **Validación Inteligente**: Habilitación condicional según selecciones del usuario

### 🌐 Localización Completa
- **URLs en Español**: `/servicios`, `/portafolio`, `/cotizar`, `/gracias`
- **Navegación Localizada**: Experiencia completamente en español
- **Contenido Coherente**: Información de contacto consistente en todo el sitio

### 👥 Área de Miembros
- **Dashboard Personalizado**: Interfaz específica según el rol del usuario
- **Gestión de Proyectos**: Seguimiento de estado, presupuestos y fechas límite
- **Sistema de Clientes**: Administración completa de base de datos de clientes
- **Tareas y Seguimiento**: Sistema de gestión de tareas por proyecto

## Servicios

### 📸 Sesión de Fotos (Sistema Avanzado)
- **Planes Flexibles**: Básico, Intermedio y Premium con opciones personalizables
- **Cantidades Variables**: 5, 10 o 20 fotografías según necesidades
- **Precios Dinámicos**: Desde $30.000 hasta $400.000 según plan y cantidad
- **Impresiones Incluidas**: Formatos 20×30, 30×40 y 50×70 según plan
- **Descuentos Premium**: 20% de descuento en próxima sesión (Plan Premium)
- **Cotización Automática**: Mensajes de WhatsApp preformateados con detalles específicos

### 🎬 Producción Audiovisual
- **Videos Musicales**: Narrativa visual cinematográfica desde el concepto hasta la entrega final en 4K
- **Postproducción**: Edición avanzada, color grading y VFX
- **Planes Escalables**: Básico, Intermedio y Premium con servicios diferenciados

### 🎵 Producción Musical
- **Composición**: Arreglos y producción integral con estándares internacionales
- **Mezcla & Masterización**: Procesamiento de audio con tecnología de vanguardia
- **Diseño Sonoro**: Paisajes sonoros inmersivos y efectos especiales únicos
- **Grabación**: Estudios acústicamente tratados con equipos de gama alta

## Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Backend**: Supabase (Base de datos PostgreSQL + Autenticación)
- **Styling**: Tailwind CSS + shadcn/ui
- **Build Tool**: Vite
- **Routing**: React Router
- **State Management**: TanStack Query + Custom Hooks
- **Icons**: Lucide React
- **Animations**: CSS Animations + Tailwind
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth + Custom Auth System

## Instalación y Desarrollo

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta de Supabase (para base de datos y autenticación)

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# 2. Navegar al directorio del proyecto
cd skyflow

# 3. Instalar dependencias
npm install

# 4. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase

# 5. Configurar base de datos Supabase
# Ejecutar los scripts SQL en Supabase SQL Editor:
# - supabase-schema.sql
# - autenticacion-tradicional.sql
# - deshabilitar-rls-completamente.sql

# 6. Iniciar el servidor de desarrollo
npm run dev
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Construcción
npm run build        # Construye la aplicación para producción
npm run build:dev    # Construye en modo desarrollo

# Otros
npm run lint         # Ejecuta el linter
npm run preview      # Previsualiza la build de producción
```

## 🔐 Área de Miembros - Guía de Uso

### Acceso al Sistema

1. **Navegar a Login**: Ir a `/login` o hacer clic en "Acceder" en el header
2. **Credenciales de Prueba**:
   - **Admin**: `blaz@skyflowproduction.com` / `RiddimDance2025`
3. **Acceso al Dashboard**: Automático después del login exitoso

### Funcionalidades por Rol

#### Para Clientes
- **Mis Proyectos**: Visualización de proyectos activos y completados
- **Estado en Tiempo Real**: Seguimiento de progreso (pendiente, en progreso, completado)
- **Membresía Premium**: Información de plan activo y beneficios
- **Cotizaciones**: Historial de solicitudes de presupuesto
- **Archivos**: Acceso a entregables y recursos del proyecto

#### Para Administradores
- **Gestión de Proyectos**: CRUD completo de proyectos
- **Administración de Clientes**: Gestión de usuarios y membresías
- **Reportes**: Estadísticas de proyectos y ingresos
- **Configuración**: Ajustes del sistema y notificaciones

### Seguridad y Privacidad
- **Sesiones Seguras**: Tokens almacenados en localStorage
- **Protección de Rutas**: Redirección automática para usuarios no autenticados
- **Roles Estrictos**: Contenido específico según permisos de usuario
- **Logout Seguro**: Limpieza completa de datos al cerrar sesión

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI base (shadcn/ui)
│   ├── Header.tsx      # Navegación principal con menú responsive
│   ├── Hero.tsx        # Sección hero
│   ├── Services.tsx    # Servicios ofrecidos (público)
│   ├── Contact.tsx     # Formulario de contacto (público)
│   ├── Footer.tsx      # Pie de página con enlaces sociales
│   ├── TeamSection.tsx # Sección del equipo (público)
│   ├── Testimonials.tsx# Testimonios de clientes (público)
│   ├── ProtectedRoute.tsx # Componente para protección de rutas
│   ├── AutomationSystem.tsx # Sistema de automatización
│   ├── AddProjectModal.tsx # Modal para agregar proyectos
│   ├── AddClientModal.tsx # Modal para agregar clientes
│   └── ProjectFunding.tsx # Financiamiento de proyectos (público)
├── pages/              # Páginas de la aplicación
│   ├── Index.tsx       # Página principal (público)
│   ├── Services.tsx    # Página de servicios (público)
│   ├── PortfolioPage.tsx # Página de portafolio (público)
│   ├── Quote.tsx       # Formulario de cotización (público)
│   ├── Login.tsx       # Página de login (público)
│   ├── Dashboard.tsx   # Panel de control (privado - requiere auth)
│   └── NotFound.tsx    # Página 404 (público)
├── hooks/              # Custom hooks
│   ├── use-mobile.tsx  # Hook para detección móvil
│   ├── use-toast.ts    # Hook para notificaciones
│   ├── useAuth.ts      # Hook para manejo de autenticación
│   ├── useProjects.ts  # Hook para gestión de proyectos (Supabase)
│   └── useClients.ts   # Hook para gestión de clientes (Supabase)
├── lib/                # Utilidades y configuraciones
│   ├── utils.ts        # Funciones utilitarias
│   └── supabase.ts     # Configuración de cliente Supabase
├── assets/             # Imágenes y recursos estáticos
│   ├── hero-studio.jpg
│   ├── producer-working.jpg
│   └── video-production.jpg
└── App.tsx             # Configuración de rutas
```

### Área de Miembros - Funcionalidades

#### 🔓 Páginas Públicas (Sin autenticación)
- **Inicio** (`/`): Página principal con hero, servicios y testimonios
- **Servicios** (`/servicios`): Catálogo completo de servicios ofrecidos
- **Portafolio** (`/portafolio`): Galería de trabajos realizados
- **Cotización** (`/cotizar`): Formulario para solicitar presupuestos
- **Login** (`/login`): Página de acceso al área de miembros

#### 🔒 Páginas Privadas (Requieren autenticación)
- **Dashboard** (`/dashboard`): Panel de control personalizado según rol

#### Roles de Usuario

**👤 Cliente (client)**
- Visualización de proyectos personales
- Estado de proyectos en tiempo real
- Información de membresía premium
- Historial de cotizaciones
- Acceso a archivos de proyecto

**👨‍💼 Administrador (admin)**
- Gestión completa de proyectos
- Administración de clientes
- Control de membresías
- Estadísticas y reportes
- Configuración del sistema

#### Autenticación y Seguridad
- **LocalStorage**: Almacenamiento seguro de sesión
- **Protección de rutas**: Redirección automática si no está autenticado
- **Roles diferenciados**: Contenido específico según tipo de usuario
- **Logout seguro**: Limpieza completa de datos de sesión

## Características

### 🎨 Diseño y UX
- **Responsive Design**: Adaptable a todos los dispositivos
- **Navegación Intuitiva**: Menú hamburguesa en móviles
- **Tema Oscuro/Claro**: Alternancia automática según preferencias
- **Animaciones Suaves**: Transiciones CSS optimizadas
- **Tipografía Moderna**: Fuentes web optimizadas

### ⚡ Funcionalidades
- **Área de Miembros**: Dashboard privado con autenticación Supabase
- **Gestión de Proyectos**: CRUD completo con base de datos PostgreSQL
- **Gestión de Clientes**: Sistema completo de administración de clientes
- **Sistema de Autenticación**: Login seguro con sesiones persistentes
- **Rutas Protegidas**: Acceso controlado según roles de usuario
- **Formularios Dinámicos**: Validación en tiempo real
- **Galería Interactiva**: Portafolio con filtros y categorías
- **Cotizaciones Online**: Sistema de presupuestos automatizado

### 🔧 Técnico
- **TypeScript**: Tipado estático para mayor robustez
- **Supabase Integration**: Base de datos PostgreSQL en la nube
- **Custom Auth System**: Autenticación tradicional con hooks personalizados
- **Component Architecture**: Componentes reutilizables y modulares
- **Custom Hooks**: Lógica de estado encapsulada (useAuth, useProjects, useClients)
- **Protected Routes**: Sistema de protección de rutas con ProtectedRoute
- **Real-time Updates**: Sincronización en tiempo real con Supabase
- **Optimización**: Lazy loading y code splitting
- **SEO Friendly**: Meta tags y estructura semántica
- **Performance**: Optimizado para Core Web Vitals

## Contacto

- **Email**: info@skyflowproduction.com
- **Proyectos**: proyectos@skyflowproduction.com
- **Teléfono**: +57 301 456 7890
- **Ubicación**: Zona Rosa, Bogotá, Colombia

## Licencia

© 2024 Skyflow Production. Todos los derechos reservados.

---

**Desarrollado con ❤️ para la industria musical**
