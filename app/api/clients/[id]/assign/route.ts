import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const { agentId } = await request.json()

    if (!agentId) {
      return NextResponse.json(
        { error: '請選擇業務員' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('clients')
      .update({
        current_owner_id: agentId,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error assigning client:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '分配客戶失敗' },
      { status: 500 }
    )
  }
}
