import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { getCurrentUser } from '@/app/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    const { id } = await params
    const { resultNote, nextFollowupDate } = await request.json()

    // Validation
    if (!resultNote || resultNote.trim().length < 10) {
      return NextResponse.json(
        { error: '結果備註至少需要10個字符' },
        { status: 400 }
      )
    }

    if (!nextFollowupDate) {
      return NextResponse.json(
        { error: '請選擇下次跟進日期' },
        { status: 400 }
      )
    }

    // Get the current task
    const { data: currentTask, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !currentTask) {
      return NextResponse.json(
        { error: '任務不存在' },
        { status: 404 }
      )
    }

    // 验证权限：只有任务的所有者或 manager 可以完成任务
    if (user.role !== 'manager' && currentTask.agent_id !== user.id) {
      return NextResponse.json(
        { error: '您沒有權限完成此任務' },
        { status: 403 }
      )
    }

    // Update the current task
    const completionTime = new Date().toISOString()
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        status: 'completed',
        completion_time: completionTime,
        result_note: resultNote.trim(),
        next_followup_date: nextFollowupDate,
        updated_at: completionTime
      })
      .eq('id', id)

    if (updateError) throw updateError

    // Create a new task for the next follow-up
    const { error: createError } = await supabase
      .from('tasks')
      .insert({
        client_id: currentTask.client_id,
        agent_id: currentTask.agent_id,
        type: currentTask.type,
        due_date: nextFollowupDate,
        status: 'pending'
      })

    if (createError) throw createError

    // Update client's last_contact_date
    await supabase
      .from('clients')
      .update({
        last_contact_date: completionTime,
        updated_at: completionTime
      })
      .eq('id', currentTask.client_id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error completing task:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '完成任務失敗' },
      { status: 500 }
    )
  }
}
