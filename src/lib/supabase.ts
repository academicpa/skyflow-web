import { createClient } from '@supabase/supabase-js'

// Estas variables se configurarán cuando el usuario proporcione las claves
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDA5OTUyMDAsImV4cCI6MTk1NjU3MTIwMH0.placeholder'

// Verificar que las credenciales estén configuradas
if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey.includes('placeholder')) {
  console.warn('⚠️ Supabase no está configurado correctamente. Por favor, configura las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la base de datos
export interface User {
  id: string
  email: string
  role: 'admin' | 'client'
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  client_id: string
  created_at: string
  updated_at: string
  budget?: number
  deadline?: string
}

export interface Client {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  address?: string
  membership_plan?: string
  client_status?: 'por_visitar' | 'pendiente' | 'plan_confirmado' | 'en_proceso' | 'completado' | 'inactivo'
  confirmed_plan?: string
  first_contact_date?: string
  notes?: string
  lead_source?: string
  assigned_to?: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  project_id: string
  title: string
  description?: string
  status: 'pending' | 'in-progress' | 'completed'
  assigned_to?: string
  due_date?: string
  created_at: string
  updated_at: string
}

export interface Plan {
  id: string
  name: string
  description: string
  price: number
  features?: any
  is_active?: boolean
  created_at: string
  updated_at: string
}

// Funciones de autenticación
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Funciones para proyectos
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      clients (
        id,
        name,
        email,
        company
      ),
      tasks (
        id,
        title,
        description,
        status,
        assigned_to,
        due_date,
        created_at,
        updated_at
      )
    `)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
  
  return { data, error }
}

export const updateProject = async (id: string, updates: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
  
  return { data, error }
}

export const deleteProject = async (id: string) => {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
  
  return { error }
}

// Funciones para clientes
export const getClients = async () => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const createClientRecord = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single()
  
  return { data, error }
}

export const updateClient = async (id: string, updates: Partial<Client>) => {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
  
  return { data, error }
}

export const deleteClient = async (id: string) => {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id)
  
  return { error }
}

// Funciones para gestionar tareas
export const getTasks = async () => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const getTasksByProject = async (projectId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single()
  
  return { data, error }
}

export const updateTask = async (id: string, updates: Partial<Task>) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  return { data, error }
}

export const deleteTask = async (id: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
  
  return { error }
}

// Funciones para planes
export const getPlanes = async () => {
  const { data, error } = await supabase
    .from('planes')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })
  
  return { data, error }
}

export const createPlan = async (plan: Omit<Plan, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabase
    .from('planes')
    .insert([plan])
    .select()
    .single()
  
  return { data, error }
}

export const updatePlan = async (id: string, updates: Partial<Plan>) => {
  const { data, error } = await supabase
    .from('planes')
    .update(updates)
    .eq('id', id)
    .select()
  
  return { data, error }
}

export const deletePlan = async (id: string) => {
  const { error } = await supabase
    .from('planes')
    .delete()
    .eq('id', id)
  
  return { error }
}