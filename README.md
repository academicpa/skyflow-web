# Skyflow Production

## Acerca del Proyecto

Sitio web oficial de **Skyflow Production**, estudio de producción musical y audiovisual de clase mundial especializado en crear experiencias sonoras y visuales que conectan con audiencias globales.

**Dominio**: [skyflowproduction.com](https://skyflowproduction.com)

## 🆕 Nuevas Mejoras

### Navegación en Español
- URLs traducidas al español: `/servicios`, `/portafolio`, `/cotizar`
- Navegación completamente localizada
- Experiencia de usuario mejorada para audiencia hispanohablante

### Diseño Responsive Mejorado
- **Header responsive**: Menú hamburguesa para dispositivos móviles y tablets
- **Footer centrado**: Diseño equilibrado con ancho máximo del 90%
- **Enlaces sociales**: Apertura en nueva pestaña con enlaces reales
- **Navegación móvil**: Menú desplegable completamente funcional
- **Dashboard Responsive**: Panel de administración totalmente adaptativo con menú hamburguesa
- **Interfaz Móvil Optimizada**: Sidebar colapsable, grids responsivos y navegación táctil

### Área de Miembros
- **Sistema de autenticación**: Login diferenciado para administradores y clientes
- **Dashboard personalizado**: Interfaz específica según el rol del usuario
- **Gestión de proyectos**: Seguimiento de estado, presupuestos y fechas límite
- **Membresías premium**: Sistema de suscripciones con beneficios exclusivos

## Servicios

- **Producción Musical**: Composición, arreglos y producción integral con estándares internacionales
- **Videos Musicales**: Narrativa visual cinematográfica desde el concepto hasta la entrega final en 4K
- **Mezcla & Masterización**: Procesamiento de audio con tecnología de vanguardia
- **Diseño Sonoro**: Paisajes sonoros inmersivos y efectos especiales únicos
- **Grabación**: Estudios acústicamente tratados con equipos de gama alta
- **Postproducción**: Edición avanzada, color grading y VFX

## Tecnologías Utilizadas

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Build Tool**: Vite
- **Routing**: React Router
- **State Management**: TanStack Query
- **Icons**: Lucide React
- **Animations**: CSS Animations + Tailwind

## Instalación y Desarrollo

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de Instalación

```bash
# 1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

# 2. Navegar al directorio del proyecto
cd skyflow

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo
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
   - **Admin**: `admin@skyflow.com` / `admin123`
   - **Cliente**: `cliente@skyflow.com` / `cliente123`
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
│   ├── Portfolio.tsx   # Portafolio de trabajos (público)
│   ├── Contact.tsx     # Formulario de contacto (público)
│   ├── Footer.tsx      # Pie de página con enlaces sociales
│   ├── TeamSection.tsx # Sección del equipo (público)
│   ├── Testimonials.tsx# Testimonios de clientes (público)
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
│   └── use-toast.ts    # Hook para notificaciones
├── lib/                # Utilidades y configuraciones
│   └── utils.ts        # Funciones utilitarias
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

### Diseño y UX
- ✨ **Diseño Moderno**: Interfaz elegante con efectos visuales sutiles
- 📱 **Completamente Responsive**: Optimizado para móviles, tablets y desktop
- 🍔 **Menú Hamburguesa**: Navegación móvil intuitiva y funcional
- ⚡ **Performance**: Carga rápida y optimizada con Vite
- 🎨 **Animaciones**: Transiciones suaves y efectos visuales
- 🌐 **Localización**: URLs y contenido en español

### Funcionalidades
- 📧 **Sistema de Cotización**: Formulario avanzado para solicitar presupuestos
- 🔐 **Área de Miembros**: Sistema de autenticación con roles diferenciados
- 📊 **Dashboard Personalizado**: Panel de control según tipo de usuario
- 💼 **Gestión de Proyectos**: Seguimiento completo de estado y progreso
- 🏆 **Membresías Premium**: Sistema de suscripciones con beneficios
- 🔗 **Enlaces Sociales**: Integración con redes sociales (apertura en nueva pestaña)

### Técnicas
- 🎵 **Temática Musical**: Diseño especializado para la industria musical
- 🛡️ **Seguridad**: Protección de rutas y manejo seguro de sesiones
- 📱 **PWA Ready**: Preparado para Progressive Web App
- 🔄 **Hot Reload**: Desarrollo ágil con recarga en caliente

## Contacto

- **Email**: info@skyflowproduction.com
- **Proyectos**: proyectos@skyflowproduction.com
- **Teléfono**: +57 301 456 7890
- **Ubicación**: Zona Rosa, Bogotá, Colombia

## Licencia

© 2024 Skyflow Production. Todos los derechos reservados.

---

**Desarrollado con ❤️ para la industria musical**
