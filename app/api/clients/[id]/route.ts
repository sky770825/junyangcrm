import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching client:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()

    const { data, error } = await supabase
      .from('clients')
      .update({
        name: body.name,
        phone: body.phone || null,
        tags: body.tags || [],
        notes: body.notes || null,
        status: body.status || 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '更新客戶失敗' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Check if client has tasks
    const { data: tasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('client_id', id)
      .limit(1)

    if (tasks && tasks.length > 0) {
      return NextResponse.json(
        { error: '無法刪除：此客戶有關聯的任務，請先刪除相關任務' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '刪除客戶失敗' },
      { status: 500 }
    )
  }
}