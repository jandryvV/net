import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { Notification } from '@/types'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<Notification[]>([])
  const loading = ref(false)

  const unreadCount = computed(() =>
    notifications.value.filter(n => !n.read).length
  )

  // Obtener notificaciones del usuario
  const fetchNotifications = async () => {
    loading.value = true
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('notifications')
        .select(`
          *,
          project:projects (
            id,
            title
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Obtener información de los usuarios que enviaron las notificaciones
      if (data && data.length > 0) {
        const fromUserIds = data
          .filter(n => n.from_user_id)
          .map(n => n.from_user_id)

        if (fromUserIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, email, full_name, avatar_url')
            .in('id', fromUserIds)

          // Mapear perfiles a las notificaciones
          notifications.value = data.map(notification => ({
            ...notification,
            from_user: profiles?.find(p => p.id === notification.from_user_id)
          }))
        } else {
          notifications.value = data
        }
      } else {
        notifications.value = []
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      loading.value = false
    }
  }

  // Marcar notificación como leída
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      if (error) throw error

      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index !== -1 && notifications.value[index]) {
        notifications.value[index].read = true
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false)

      if (error) throw error

      notifications.value = notifications.value.map(n => ({ ...n, read: true }))
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  // Eliminar notificación
  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error

      notifications.value = notifications.value.filter(n => n.id !== notificationId)
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Enviar invitación a proyecto
  const sendProjectInvite = async (toUserId: string, projectId: string, projectTitle: string, customMessage?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Verificar si ya hay una invitación pendiente
      const { data: existing } = await supabase
        .from('notifications')
        .select('id')
        .eq('user_id', toUserId)
        .eq('project_id', projectId)
        .eq('type', 'project_invite')
        .eq('read', false)
        .single()

      if (existing) {
        throw new Error('Ya existe una invitación pendiente para este usuario')
      }

      const message = customMessage || `Te ha invitado a colaborar en el proyecto "${projectTitle}"`

      const { data, error } = await supabase.rpc('create_notification', {
        p_user_id: toUserId,
        p_from_user_id: user.id,
        p_project_id: projectId,
        p_type: 'project_invite',
        p_message: message,
        p_metadata: {
          project_title: projectTitle,
          from_user_name: user.user_metadata?.full_name || user.email
        }
      })

      if (error) throw error

      // Refrescar notificaciones
      await fetchNotifications()

      return data
    } catch (error: any) {
      console.error('Error sending invite:', error)
      throw error
    }
  }

  // Aceptar invitación
  const acceptInvite = async (notificationId: string, projectId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      console.log('Accepting invite for project:', projectId, 'user:', user.id)

      // Agregar usuario al equipo usando RPC
      const { data: result, error: updateError } = await supabase.rpc('add_team_member', {
        p_project_id: projectId,
        p_user_id: user.id
      })

      if (updateError) {
        console.error('Error adding team member:', updateError)
        throw updateError
      }

      console.log('Team member added successfully:', result)

      // Marcar notificación como leída
      await markAsRead(notificationId)

      // Obtener datos de la notificación para enviar confirmación
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification?.from_user_id) {
        // Enviar notificación al que invitó usando RPC
        await supabase.rpc('create_notification', {
          p_user_id: notification.from_user_id,
          p_from_user_id: user.id,
          p_project_id: projectId,
          p_type: 'invite_accepted',
          p_message: `${user.user_metadata?.full_name || user.email} aceptó tu invitación al proyecto`,
          p_metadata: {
            project_title: notification.metadata?.project_title
          }
        })
      }

      return true
    } catch (error) {
      console.error('Error accepting invite:', error)
      throw error
    }
  }

  // Rechazar invitación
  const rejectInvite = async (notificationId: string, projectId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Marcar notificación como leída
      await markAsRead(notificationId)

      // Obtener datos de la notificación
      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification?.from_user_id) {
        // Enviar notificación al que invitó usando RPC
        await supabase.rpc('create_notification', {
          p_user_id: notification.from_user_id,
          p_from_user_id: user.id,
          p_project_id: projectId,
          p_type: 'invite_rejected',
          p_message: `${user.user_metadata?.full_name || user.email} rechazó tu invitación al proyecto`,
          p_metadata: {
            project_title: notification.metadata?.project_title
          }
        })
      }

      return true
    } catch (error) {
      console.error('Error rejecting invite:', error)
      throw error
    }
  }

  return {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    sendProjectInvite,
    acceptInvite,
    rejectInvite
  }
})
