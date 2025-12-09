import { ref } from 'vue'
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<SupabaseUser | null>(null)
  const profile = ref<User | null>(null)
  const loading = ref(false)

  // Initialize auth state
  const initAuth = async () => {
    if (loading.value) return // Avoid multiple simultaneous initializations

    loading.value = true
    try {
      console.log('🔄 Initializing auth...')
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        console.log('✅ Found existing session for:', session.user.email)
        user.value = session.user
        await fetchProfile(session.user.id)
      } else {
        console.log('ℹ️ No existing session found')
        user.value = null
        profile.value = null
      }
    } catch (error) {
      console.error('❌ Error initializing auth:', error)
      user.value = null
      profile.value = null
    } finally {
      loading.value = false
      console.log('✅ Auth initialization completed')
    }
  }

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      profile.value = data
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName: string) => {
    loading.value = true
    try {
      console.log('Starting sign up process...')
      console.log('Email:', email)
      console.log('Full name:', fullName)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })

      console.log('Auth signup result:', { data, error })

      if (error) {
        console.error('Auth signup error:', error)
        return { data: null, error }
      }

      if (data.user) {
        console.log('Creating profile for user:', data.user.id)

        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: data.user.email!,
              full_name: fullName,
            }
          ])

        console.log('Profile creation result:', { profileError })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Don't throw here, the user account was created successfully
          // The profile creation might fail due to triggers or RLS
        }
      }

      console.log('Sign up completed successfully')
      return { data, error: null }
    } catch (error: any) {
      console.error('Unexpected error signing up:', error)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      user.value = data.user
      if (data.user) {
        await fetchProfile(data.user.id)
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error signing in:', error)
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  // Sign out
  const signOut = async () => {
    loading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      user.value = null
      profile.value = null
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      loading.value = false
    }
  }

  // Update profile
  const updateProfile = async (updates: Partial<User>) => {
    if (!user.value) return

    loading.value = true
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.value.id)

      if (error) throw error

      profile.value = { ...profile.value!, ...updates }
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    loading.value = true
    try {
      // First verify current password by signing in
      if (!user.value) throw new Error('Usuario no autenticado')

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.value.email!,
        password: currentPassword
      })

      if (signInError) throw new Error('Contraseña actual incorrecta')

      // Update password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
    } catch (error: any) {
      console.error('Error changing password:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    loading.value = true
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error
      return { error: null }
    } catch (error: any) {
      console.error('Error sending password reset:', error)
      return { error }
    } finally {
      loading.value = false
    }
  }

  // Delete account
  const deleteAccount = async () => {
    if (!user.value) return

    loading.value = true
    try {
      // Delete profile first
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.value.id)

      if (profileError) throw profileError

      // Delete user account (requires admin privileges - this is a placeholder)
      // In real implementation, you would call an admin function
      await supabase.auth.signOut()

      user.value = null
      profile.value = null
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    profile,
    loading,
    initAuth,
    signUp,
    signIn,
    signOut,
    updateProfile,
    changePassword,
    resetPassword,
    deleteAccount
  }
})
