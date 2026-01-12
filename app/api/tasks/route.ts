import { NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { getCurrentUser } from '@/app/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    
    // 如果是 manager，可以看到所有任务；否则只看到自己的任务
    let query = supabase
      .from('tasks')
      .select(`
        *,
        clients (*)
      `)
      .order('due_date', { ascending: true })

    if (user.role !== 'manager') {
      query = query.eq('agent_id', user.id)
    }

    const { data, error } = await query

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
