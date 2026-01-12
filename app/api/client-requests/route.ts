import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get('agentId')
    const status = searchParams.get('status')

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

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Check if request already exists
    const { data: existing } = await supabase
      .from('client_requests')
      .select('*')
      .eq('client_id', body.client_id)
      .eq('agent_id', body.agent_id)
      .eq('status', 'pending')
      .single()

    if (existing) {
      return NextResponse.json(
        { error: '您已經申請過此客戶' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('client_requests')
      .insert({
        client_id: body.client_id,
        agent_id: body.agent_id,
        request_note: body.request_note || null,
        status: 'pending'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating request:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '申請失敗' },
      { status: 500 }
    )
  }
}
