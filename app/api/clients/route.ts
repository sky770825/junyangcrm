import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const tag = searchParams.get('tag')
    const ownerId = searchParams.get('ownerId')

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

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await supabase
      .from('clients')
      .insert({
        name: body.name,
        phone: body.phone || null,
        tags: body.tags || [],
        notes: body.notes || null,
        status: 'active'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '創建客戶失敗' },
      { status: 500 }
    )
  }
}
