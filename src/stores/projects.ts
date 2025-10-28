import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { Project } from '@/types'

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

      if (user && data) {
        // For each project, check if current user has liked it
        const projectsWithLikes = await Promise.all(
          data.map(async (project) => {
            const { data: likeData } = await supabase
              .from('likes')
              .select('id')
              .eq('project_id', project.id)
              .eq('user_id', user.id)
              .single()

            return {
              ...project,
              liked_by_user: !!likeData
            }
          })
        )
        projects.value = projectsWithLikes
      } else {
        projects.value = data || []
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
      return data || []
    } catch (error) {
      console.error('Error fetching user projects:', error)
      return []
    } finally {
      loading.value = false
    }
  }

  // Create new project
  const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count'>) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          ...project,
          likes_count: 0,
          comments_count: 0
        }])
        .select()
        .single()

      if (error) throw error

      projects.value.unshift(data)
      return { data, error: null }
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
      // Encontrar el proyecto en la lista local
      const projectIndex = projects.value.findIndex(p => p.id === projectId)
      const project = projects.value[projectIndex]

      if (!project) return

      // Check if already liked
      const { data: existingLike, error: checkError } = await supabase
        .from('likes')
        .select('id')
        .eq('project_id', projectId)
        .eq('user_id', userId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') throw checkError

      let newLikesCount: number

      if (existingLike) {
        // Unlike - Actualización optimista
        newLikesCount = Math.max((project.likes_count || 0) - 1, 0)
        projects.value[projectIndex] = {
          ...project,
          likes_count: newLikesCount,
          liked_by_user: false
        }

        // Realizar la operación en el servidor
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id)

        if (deleteError) throw deleteError

        const { error: updateError } = await supabase
          .from('projects')
          .update({ likes_count: newLikesCount })
          .eq('id', projectId)

        if (updateError) throw updateError
      } else {
        // Like - Actualización optimista
        newLikesCount = (project.likes_count || 0) + 1
        projects.value[projectIndex] = {
          ...project,
          likes_count: newLikesCount,
          liked_by_user: true
        }

        // Realizar la operación en el servidor
        const { error: insertError } = await supabase
          .from('likes')
          .insert([{ project_id: projectId, user_id: userId }])

        if (insertError) throw insertError

        const { error: updateError } = await supabase
          .from('projects')
          .update({ likes_count: newLikesCount })
          .eq('id', projectId)

        if (updateError) throw updateError
      }
    } catch (error) {
      console.error('Error toggling like:', error)
      // En caso de error, revertir al estado original refrescando
      await fetchProjects()
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

      // Encontrar el proyecto en la lista local y actualizar optimísticamente
      const projectIndex = projects.value.findIndex(p => p.id === projectId)

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

      // Actualizar el contador de comentarios localmente
      if (projectIndex !== -1) {
        const project = projects.value[projectIndex]
        if (project) {
          const newCount = (project.comments_count || 0) + 1
          projects.value[projectIndex] = {
            ...project,
            comments_count: newCount
          }

          // También actualizar en la base de datos
          const { error: updateError } = await supabase
            .from('projects')
            .update({ comments_count: newCount })
            .eq('id', projectId)

          if (updateError) throw updateError
        }
      }

      return data
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  return {
    projects,
    loading,
    currentProject,
    fetchProjects,
    fetchUserProjects,
    createProject,
    updateProject,
    deleteProject,
    toggleLike,
    fetchComments,
    addComment
  }
})
