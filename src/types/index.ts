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
  type: 'like' | 'comment' | 'project_invite' | 'project_update'
  message: string
  read: boolean
  created_at: string
}
