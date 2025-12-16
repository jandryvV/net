export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  bio?: string
  created_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  image_url?: string
  created_by: string
  created_at: string
  updated_at: string
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'En Progreso' | 'Completado' | 'Planificando' | 'En Pausa'
  tags: string[]
  team_members: string[]
  likes_count: number
  comments_count: number
  // Propiedades adicionales para la UI
  likes?: number
  creator?: User
  liked_by_user?: boolean
}

export interface Comment {
  id: string
  project_id: string
  user_id: string
  content: string
  created_at: string
  user?: User
}

export interface Like {
  id: string
  project_id: string
  user_id: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: 'like' | 'comment' | 'project_invite' | 'project_update' | 'invite_accepted' | 'invite_rejected'
  message: string
  read: boolean
  created_at: string
  project_id?: string
  from_user_id?: string
  from_user?: User
  project?: Project
  metadata?: {
    invite_id?: string
    project_title?: string
    from_user_name?: string
    [key: string]: any
  }
}

export interface Task {
  id: string
  project_id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done'
  priority: 'low' | 'medium' | 'high'
  assigned_to?: string
  due_date?: string
  created_at: string
  updated_at: string
  created_by: string
  assignee?: User
}
