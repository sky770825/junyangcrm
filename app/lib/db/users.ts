import { createClient as createSupabaseClient } from '../supabase/server'
import type { User, UserApplication } from '@/app/types/database'

export async function getAllUsers(role?: 'agent' | 'manager') {
  const supabase = await createSupabaseClient()
  
  let query = supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (role) {
    query = query.eq('role', role)
  }

  const { data, error } = await query

  if (error) throw error
  return data as User[]
}

export async function getUserById(userId: string) {
  const supabase = await createSupabaseClient()
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data as User
}

export async function createUser(user: {
  email: string
  name?: string
  role?: 'agent' | 'manager'
}) {
  const supabase = await createSupabaseClient()
  
  const { data, error } = await supabase
    .from('users')
    .insert({
      email: user.email,
      name: user.name || null,
      role: user.role || 'agent'
    })
    .select()
    .single()

  if (error) throw error
  return data as User
}

export async function getUserApplications(status?: string) {
  const supabase = await createSupabaseClient()
  
  let query = supabase
    .from('user_applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) throw error
  return data as UserApplication[]
}

export async function createUserApplication(application: {
  email: string
  name?: string
  phone?: string
  application_note?: string
}) {
  const supabase = await createSupabaseClient()
  
  const { data, error } = await supabase
    .from('user_applications')
    .insert({
      email: application.email,
      name: application.name || null,
      phone: application.phone || null,
      application_note: application.application_note || null,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return data as UserApplication
}

export async function reviewUserApplication(
  applicationId: string,
  status: 'approved' | 'rejected',
  reviewedBy: string,
  responseNote?: string
) {
  const supabase = await createSupabaseClient()
  
  const { data: application, error: fetchError } = await supabase
    .from('user_applications')
    .select('*')
    .eq('id', applicationId)
    .single()

  if (fetchError || !application) throw new Error('申請不存在')

  // Update application
  const { data: updated, error: updateError } = await supabase
    .from('user_applications')
    .update({
      status,
      reviewed_by: reviewedBy,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', applicationId)
    .select()
    .single()

  if (updateError) throw updateError

  // If approved, create user account
  if (status === 'approved') {
    await supabase
      .from('users')
      .insert({
        email: application.email,
        name: application.name,
        role: 'agent'
      })
      .select()
      .single()
  }

  return updated as UserApplication
}
