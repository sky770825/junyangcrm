import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // TODO: Get actual user ID from auth session
    // For now, return all tasks (this should be filtered by agent_id)
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        clients (*)
      `)
      .order('due_date', { ascending: true })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}
