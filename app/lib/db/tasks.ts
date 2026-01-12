import { createClient as createSupabaseClient } from '../supabase/server'
import type { Task, TaskWithClient, TaskStatus, TaskType } from '@/app/types/database'

export async function getTasksByAgent(agentId: string, status?: TaskStatus) {
  const supabase = await createSupabaseClient()
  
  let query = supabase
    .from('tasks')
    .select(`
      *,
      clients (*)
    `)
    .eq('agent_id', agentId)
    .order('due_date', { ascending: true })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) throw error
  return data as TaskWithClient[]
}

export async function getTaskById(taskId: string) {
  const supabase = await createSupabaseClient()
  
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      clients (*)
    `)
    .eq('id', taskId)
    .single()

  if (error) throw error
  return data as TaskWithClient
}

export async function completeTask(
  taskId: string,
  resultNote: string,
  nextFollowupDate: string
) {
  const supabase = await createSupabaseClient()
  
  // Update the current task
  const { data: updatedTask, error: updateError } = await supabase
    .from('tasks')
    .update({
      status: 'completed',
      completion_time: new Date().toISOString(),
      result_note: resultNote,
      next_followup_date: nextFollowupDate,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)
    .select()
    .single()

  if (updateError) throw updateError

  // Create a new task for the next follow-up
  const { data: newTask, error: createError } = await supabase
    .from('tasks')
    .insert({
      client_id: updatedTask.client_id,
      agent_id: updatedTask.agent_id,
      type: updatedTask.type, // You might want to make this configurable
      due_date: nextFollowupDate,
      status: 'pending'
    })
    .select()
    .single()

  if (createError) throw createError

  return { updatedTask, newTask }
}

export async function createTask(
  clientId: string,
  agentId: string,
  type: TaskType,
  dueDate: string
) {
  const supabase = await createSupabaseClient()
  
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      client_id: clientId,
      agent_id: agentId,
      type,
      due_date: dueDate,
      status: 'pending'
    })
    .select()
    .single()

  if (error) throw error
  return data as Task
}
