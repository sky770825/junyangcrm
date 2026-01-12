import { createClient as createSupabaseClient } from '../supabase/server'
import type { ClientRequest, ClientRequestWithDetails } from '@/app/types/database'

export async function getClientRequests(agentId?: string, status?: string) {
  const supabase = await createSupabaseClient()
  
  let query = supabase
    .from('client_requests')
    .select(`
      *,
      clients (*),
      users (*)
    `)
    .order('created_at', { ascending: false })

  if (agentId) {
    query = query.eq('agent_id', agentId)
  }

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) throw error
  return data as ClientRequestWithDetails[]
}

export async function createClientRequest(request: {
  client_id: string
  agent_id: string
  request_note?: string
}) {
  const supabase = await createSupabaseClient()
  
  // Check if request already exists
  const { data: existing } = await supabase
    .from('client_requests')
    .select('*')
    .eq('client_id', request.client_id)
    .eq('agent_id', request.agent_id)
    .eq('status', 'pending')
    .single()

  if (existing) {
    throw new Error('您已經申請過此客戶')
  }

  const { data, error } = await supabase
    .from('client_requests')
    .insert({
      client_id: request.client_id,
      agent_id: request.agent_id,
      request_note: request.request_note || null,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return data as ClientRequest
}

export async function reviewClientRequest(
  requestId: string,
  status: 'approved' | 'rejected',
  responseNote?: string
) {
  const supabase = await createSupabaseClient()
  
  const { data: request, error: fetchError } = await supabase
    .from('client_requests')
    .select('*')
    .eq('id', requestId)
    .single()

  if (fetchError || !request) throw new Error('申請不存在')

  // Update request
  const { data: updated, error: updateError } = await supabase
    .from('client_requests')
    .update({
      status,
      response_note: responseNote || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single()

  if (updateError) throw updateError

  // If approved, assign client to agent
  if (status === 'approved') {
    await supabase
      .from('clients')
      .update({
        current_owner_id: request.agent_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', request.client_id)
  }

  return updated as ClientRequest
}
