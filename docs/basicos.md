# 📚 Guía Básica de Supabase - SkyFlow

## 🔍 Consultas Directas en Supabase

### Acceso al Dashboard
1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto: `xouinmnjsqdypsydvxoi`
3. Ve a la sección **SQL Editor** en el menú lateral

### Consultas Básicas

#### Ver todos los clientes
```sql
SELECT * FROM public.clients ORDER BY created_at DESC;
```

#### Ver todos los planes disponibles
```sql
SELECT * FROM public.planes ORDER BY name;
```

#### Buscar cliente por email
```sql
SELECT * FROM public.clients WHERE email = 'ejemplo@correo.com';
```

#### Ver clientes por estado
```sql
SELECT * FROM public.clients WHERE client_status = 'plan_confirmado';
```

## ✏️ Modificaciones Directas

### Actualizar información de cliente
```sql
UPDATE public.clients 
SET 
    phone = '+57 300 123 4567',
    membership_plan = 'Enterprise'
WHERE email = 'cliente@ejemplo.com';
```

### Cambiar estado de cliente
```sql
UPDATE public.clients 
SET client_status = 'completado'
WHERE id = 'uuid-del-cliente';
```

### Eliminar cliente (usar con precaución)
```sql
DELETE FROM public.clients WHERE email = 'cliente@eliminar.com';
```

## 🛠️ Gestión de Planes

### Crear nuevo plan
```sql
INSERT INTO public.planes (name, description, price, features, is_active)
VALUES (
    'Plan Premium Plus',
    'Plan premium con características avanzadas',
    2500000,
    '{"videos": 10, "revision": 3, "duracion": "30 días"}',
    true
);
```

### Desactivar plan
```sql
UPDATE public.planes 
SET is_active = false 
WHERE name = 'Plan Antiguo';
```

## 🔧 Mantenimiento de Base de Datos

### Ver restricciones de tabla
```sql
SELECT conname, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.clients'::regclass;
```

### Eliminar restricción (si es necesario)
```sql
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS nombre_restriccion;
```

### Ver estructura de tabla
```sql
\d public.clients
```

## 📊 Consultas de Análisis

### Contar clientes por estado
```sql
SELECT client_status, COUNT(*) as total
FROM public.clients 
GROUP BY client_status
ORDER BY total DESC;
```

### Clientes por plan
```sql
SELECT membership_plan, COUNT(*) as total
FROM public.clients 
WHERE membership_plan IS NOT NULL
GROUP BY membership_plan
ORDER BY total DESC;
```

### Ingresos por plan
```sql
SELECT 
    p.name as plan_name,
    p.price,
    COUNT(c.id) as clientes,
    (p.price * COUNT(c.id)) as ingresos_totales
FROM public.planes p
LEFT JOIN public.clients c ON c.membership_plan = p.name
WHERE p.is_active = true
GROUP BY p.name, p.price
ORDER BY ingresos_totales DESC;
```

## ⚠️ Precauciones Importantes

1. **Siempre hacer backup** antes de modificaciones importantes
2. **Usar transacciones** para cambios múltiples:
   ```sql
   BEGIN;
   -- tus consultas aquí
   COMMIT; -- o ROLLBACK; si algo sale mal
   ```
3. **Verificar antes de eliminar** datos importantes
4. **Usar WHERE** siempre en UPDATE y DELETE
5. **Probar en desarrollo** antes de aplicar en producción

## 🔑 Credenciales del Proyecto

- **URL**: `https://xouinmnjsqdypsydvxoi.supabase.co`
- **Anon Key**: Ver archivo `.env` en la raíz del proyecto
- **Dashboard**: [Proyecto SkyFlow](https://supabase.com/dashboard/project/xouinmnjsqdypsydvxoi)

## 📞 Soporte

Para dudas específicas sobre la base de datos o consultas complejas, consulta la [documentación oficial de Supabase](https://supabase.com/docs) o contacta al equipo de desarrollo.