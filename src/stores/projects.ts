import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { Project, Task } from '@/types'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const currentProject = ref<Project | null>(null)

    // Fetch all projects
  const fetchProjects = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          creator:profiles!created_by (
            id,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      if (data) {
        // For each project, get real counts from database
        const projectsWithCounts = await Promise.all(
          data.map(async (project) => {
            // Get real likes count
            const { count: likesCount } = await supabase
              .from('likes')
              .select('*', { count: 'exact', head: true })
              .eq('project_id', project.id)

            // Get real comments count
            const { count: commentsCount } = await supabase
              .from('comments')
              .select('*', { count: 'exact', head: true })
              .eq('project_id', project.id)

            // Check if current user has liked it
            let likedByUser = false
            if (user) {
              const { data: likeData } = await supabase
                .from('likes')
                .select('id')
                .eq('project_id', project.id)
                .eq('user_id', user.id)
                .single()
              likedByUser = !!likeData
            }

            return {
              ...project,
              likes_count: likesCount || 0,
              comments_count: commentsCount || 0,
              liked_by_user: likedByUser
            }
          })
        )
        projects.value = projectsWithCounts
      } else {
        projects.value = []
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      loading.value = false
    }
  }

  // Fetch user's projects
  const fetchUserProjects = async (userId: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (data) {
        // For each project, get real counts from database
        const projectsWithCounts = await Promise.all(
          data.map(async (project) => {
            // Get real likes count
            const { count: likesCount } = await supabase
              .from('likes')
              .select('*', { count: 'exact', head: true })
              .eq('project_id', project.id)

            // Get real comments count
            const { count: commentsCount } = await supabase
              .from('comments')
              .select('*', { count: 'exact', head: true })
              .eq('project_id', project.id)

            return {
              ...project,
              likes_count: likesCount || 0,
              comments_count: commentsCount || 0
            }
          })
        )
        return projectsWithCounts
      }
      return []
    } catch (error) {
      console.error('Error fetching user projects:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  // Refresh a specific project from the database
  const refreshProject = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          creator:profiles!created_by (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('id', projectId)
        .single()

      if (error) throw error

      if (data) {
        // Get real likes count
        const { count: likesCount } = await supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', data.id)

        // Get real comments count
        const { count: commentsCount } = await supabase
          .from('comments')
          .select('*', { count: 'exact', head: true })
          .eq('project_id', data.id)

        // Get current user
        const { data: { user } } = await supabase.auth.getUser()

        // Check if current user has liked it
        let likedByUser = false
        if (user) {
          const { data: likeData } = await supabase
            .from('likes')
            .select('id')
            .eq('project_id', data.id)
            .eq('user_id', user.id)
            .single()
          likedByUser = !!likeData
        }

        const updatedProject = {
          ...data,
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0,
          liked_by_user: likedByUser
        }

        // Update in the projects array
        const index = projects.value.findIndex(p => p.id === projectId)
        if (index !== -1) {
          projects.value[index] = updatedProject
        }

        return updatedProject
      }

      return null
    } catch (error) {
      console.error('Error refreshing project:', error)
      return null
    }
  }

  // Create new project
  const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count'>) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single()

      if (error) throw error

      // Add counts (will be 0 for new project)
      const projectWithCounts = {
        ...data,
        likes_count: 0,
        comments_count: 0,
        liked_by_user: false
      }

      projects.value.unshift(projectWithCounts)
      return { data: projectWithCounts, error: null }
    } catch (error) {
      console.error('Error creating project:', error)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  // Update project
  const updateProject = async (id: string, updates: Partial<Project>) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = data
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error updating project:', error)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  // Delete project
  const deleteProject = async (id: string) => {
    loading.value = true
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      projects.value = projects.value.filter(p => p.id !== id)
      return { error: null }
    } catch (error) {
      console.error('Error deleting project:', error)
      return { error }
    } finally {
      loading.value = false
    }
  }

  // Like/unlike project
  const toggleLike = async (projectId: string, userId: string) => {
    try {
      // Check if already liked
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') throw checkError

      if (existingLike) {
        // Unlike - eliminar el like
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id)

        if (deleteError) throw deleteError
      } else {
        // Like - agregar el like
        const { error: insertError } = await supabase
          .from('likes')
          .insert([{ project_id: projectId, user_id: userId }])

        if (insertError) throw insertError
      }

      // Refrescar el proyecto desde la BD para obtener el contador real
      await refreshProject(projectId)
    } catch (error) {
      console.error('Error toggling like:', error)
      // En caso de error, refrescar para obtener el estado real
      await refreshProject(projectId)
    }
  }

  // Fetch comments for a project
  const fetchComments = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          user:profiles!user_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching comments:', error)
      return []
    }
  }

  // Add comment to project
  const addComment = async (projectId: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('comments')
        .insert([{
          project_id: projectId,
          user_id: user.id,
          content: content
        }])
        .select(`
          *,
          user:profiles!user_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .single()

      if (error) throw error

      // Refrescar el proyecto desde la BD para obtener el contador real
      await refreshProject(projectId)

      return data
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  // Update comment
  const updateComment = async (commentId: string, content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', commentId)
        .eq('user_id', user.id) // Solo el creador puede actualizar
        .select(`
          *,
          user:profiles!user_id (
            id,
            full_name,
            avatar_url
          )
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating comment:', error)
      throw error
    }
  }

  // Delete comment
  const deleteComment = async (commentId: string, projectId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', user.id) // Solo el creador puede eliminar

      if (error) throw error

      // Refrescar el proyecto desde la BD para obtener el contador real
      await refreshProject(projectId)
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  }

  // ================ TASK MANAGEMENT ================

  // Fetch tasks for a project
  const fetchTasks = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles!assigned_to (
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return []
    }
  }

  // Create task
  const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Limpiar datos: convertir strings vacíos a null
      const cleanedTask = {
        project_id: task.project_id,
        title: task.title,
        description: task.description || null,
        status: task.status,
        priority: task.priority,
        assigned_to: task.assigned_to || null,
        due_date: task.due_date || null,
        created_by: user.id
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert([cleanedTask])
        .select(`
          *,
          assignee:profiles!assigned_to (
            id,
            full_name,
            avatar_url
          )
        `)
        .single()

      if (error) {
        console.error('Supabase error creating task:', error)
        throw error
      }
      return data
    } catch (error: any) {
      console.error('Error creating task:', error)
      console.error('Error details:', error.message, error.code, error.details)
      throw error
    }
  }

  // Update task
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select(`
          *,
          assignee:profiles!assigned_to (
            id,
            full_name,
            avatar_url
          )
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  // Delete task
  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  return {
    projects,
    loading,
    currentProject,
    fetchProjects,
    fetchUserProjects,
    refreshProject,
    createProject,
    updateProject,
    deleteProject,
    toggleLike,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  }
})
