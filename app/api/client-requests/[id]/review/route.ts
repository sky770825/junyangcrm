import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const { status, responseNote } = await request.json()

    if (status !== 'approved' && status !== 'rejected') {
      return NextResponse.json(
        { error: '無效的狀態' },
        { status: 400 }
      )
    }

    // Get client request
    const { data: clientRequest, error: fetchError } = await supabase
      .from('client_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !clientRequest) {
      return NextResponse.json(
        { error: '申請不存在' },
        { status: 404 }
      )
    }

    // Update request
    const { data: updated, error: updateError } = await supabase
      .from('client_requests')
      .update({
        status,
        response_note: responseNote || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    // If approved, assign client to agent
    if (status === 'approved') {
      await supabase
        .from('clients')
        .update({
          current_owner_id: clientRequest.agent_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', clientRequest.client_id)
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error reviewing request:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '審核失敗' },
      { status: 500 }
    )
  }
}
