import { createClient as createSupabaseClient } from '../supabase/server'
import type { Client, ClientTag } from '@/app/types/database'

export async function getAllClients(status?: string, tag?: ClientTag, ownerId?: string) {
  const supabase = await createSupabaseClient()
  
  let query = supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  if (tag) {
    query = query.contains('tags', [tag])
  }

  if (ownerId) {
    query = query.eq('current_owner_id', ownerId)
  }

  const { data, error } = await query

  if (error) throw error
  return data as Client[]
}

export async function getClientById(clientId: string) {
  const supabase = await createSupabaseClient()
  
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single()

  if (error) throw error
  return data as Client
}

export async function createClient(client: {
  name: string
  phone?: string
  tags?: ClientTag[]
  notes?: string
}) {
  const supabase = await createSupabaseClient()
  
  const { data, error } = await supabase
    .from('clients')
    .insert({
      name: client.name,
      phone: client.phone || null,
      tags: client.tags || [],
      notes: client.notes || null,
      status: 'active'
    })
    .select()
    .single()

  if (error) throw error
  return data as Client
}

export async function updateClient(clientId: string, updates: {
  name?: string
  phone?: string
  tags?: ClientTag[]
  status?: 'active' | 'archived'
  current_owner_id?: string | null
  notes?: string
}) {
  const supabase = await createSupabaseClient()
  
  const { data, error } = await supabase
    .from('clients')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', clientId)
    .select()
    .single()

  if (error) throw error
  return data as Client
}

export async function assignClientToAgent(clientId: string, agentId: string) {
  const supabase = await createSupabaseClient()
  
  const { data, error } = await supabase
    .from('clients')
    .update({
      current_owner_id: agentId,
      updated_at: new Date().toISOString()
    })
    .eq('id', clientId)
    .select()
    .single()

  if (error) throw error
  return data as Client
}

export async function bulkCreateClients(clients: Array<{
  name: string
  phone?: string
  tags?: ClientTag[]
  notes?: string
}>) {
  const supabase = await createSupabaseClient()
  
  const { data, error } = await supabase
    .from('clients')
    .insert(
      clients.map(client => ({
        name: client.name,
        phone: client.phone || null,
        tags: client.tags || [],
        notes: client.notes || null,
        status: 'active'
      }))
    )
    .select()

  if (error) throw error
  return data as Client[]
}
