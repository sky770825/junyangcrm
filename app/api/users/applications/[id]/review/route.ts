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

    // Get application
    const { data: application, error: fetchError } = await supabase
      .from('user_applications')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !application) {
      return NextResponse.json(
        { error: '申請不存在' },
        { status: 404 }
      )
    }

    // Update application
    const { data: updated, error: updateError } = await supabase
      .from('user_applications')
      .update({
        status,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    // If approved, create user account
    if (status === 'approved') {
      const { error: createError } = await supabase
        .from('users')
        .insert({
          email: application.email,
          name: application.name,
          role: 'agent'
        })

      if (createError) {
        // User might already exist, that's ok
        console.warn('Error creating user (might already exist):', createError)
      }
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error reviewing application:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '審核失敗' },
      { status: 500 }
    )
  }
}
