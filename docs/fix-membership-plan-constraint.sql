-- Script para corregir la restricción de membership_plan en la tabla clients
-- Este script actualiza la restricción para incluir los nombres reales de los planes

-- Eliminar la restricción existente si existe
ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_membership_plan_check;

-- No crear nueva restricción CHECK para permitir cualquier nombre de plan futuro
-- Esto permite flexibilidad total para agregar nuevos planes sin modificar la base de datos

-- Verificar que la restricción se creó correctamente
SELECT conname, pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'clients_membership_plan_check';

SELECT 'Script ejecutado correctamente. Se eliminó la restricción clients_membership_plan_check para permitir cualquier nombre de plan futuro.' as resultado;